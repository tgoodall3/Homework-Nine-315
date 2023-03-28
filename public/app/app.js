var usersExist = false;
var userFullName = "";

function barlistener(){
    $(".bars").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
    })  
}

function changeRoute(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
    // console.log(hashTag + " " + pageID);

    if(pageID !== "") {

        $.get(`pages/${pageID}/${pageID}.html`, function(data){
            // console.log("data " + data);
            $("#app").html(data); 
        })

    } else {
        $.get(`pages/home/home.html`, function(data){
            console.log("data " + data);
            $("#app").html(data); 
        })
    }
}

function initURLlisteners(){
    $(window).on("hashchange", changeRoute); 
    changeRoute();
}


function initFirebase(){
  firebase.auth().onAuthStateChanged((user)=> {
    if(user){
      console.log("auth changed logged in");

      if (user.displayName){
        $(".name").html(user.displayName);
      }
      usersExist = true;
    } else{
      console.log("auth changed logged out");
      $(".name").html("");

      // $("a").prop("disabled", true);
      usersExist = false;
      userFullName = "";
    }
  })
}

function signOut(){
  firebase
  .auth()
  .signOut()
  .then(() => {
    console.log("signed out");
    alert ("You are signed out");

  })
  .catch ((error) => {
    console.log("error signing out");
  })
}


function signIn() {
  firebase.auth().signInAnonymously()
  .then(() => {
    console.log("signed in");
    alert ("You are signed in");

  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("error signing in " + errorMessage);
    // ...
  });
}

function createAccount() {
  let FName = $("#FName").val();
  let LName = $("#LName").val();
  let Email = $("#Email").val();
  let Password = $("#Password").val();
  let fullname = FName + ' ' + LName;

  console.log("create " + FName + ' ' + LName + ' ' + Email + ' ' + Password + ' ');

  firebase.auth().createUserWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    // ...

    console.log("created");
    alert ("You have created your account!");

    firebase.auth().currentUser.updateProfile({
      displayName: fullname
    })
    userFullName = fullname;
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ..
    console.log("create error " + errorMessage);

  });

}

function login(){
  let Email = $("#Email").val();
  let Password = $("#Password").val();

  firebase.auth().signInWithEmailAndPassword(Email, Password)
  .then((userCredential) => {
    // Signed in
    var user = userCredential.user;
    // ...

    console.log("Logged In");
    alert ("You are Logged in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Log in Error" + error);
    alert ("You are Logged Out");

  });
}

$(document).ready(function(){
  try{
    let app = firebase.app();
    initFirebase();
    // signInAnon();
  } catch(error){
    console.log("error", error)
  }

  initURLlisteners();
  barlistener();
});
