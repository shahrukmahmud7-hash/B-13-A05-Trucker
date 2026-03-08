console.log("jhghgjg") 

document.getElementById("login-btn").addEventListener("click", function() {
  const userInput = document.getElementById("input-user");
  const contactUser = userInput.value;
//  console.log(contactUser);
 const passwordInput = document.getElementById("input-password");
 const password = passwordInput.value;
//  console.log(password);
if(contactUser === "admin" && password ==="admin123"){

    alert("Login Successful");
  window.location.replace("home.html")
} else {
    alert("Login Failed");
    return ;
}

});  