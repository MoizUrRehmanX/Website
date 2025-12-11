window.Data = window.Data || JSON.parse(localStorage.getItem("users")) || [];

window.userloggedin = JSON.parse(localStorage.getItem("userloggedin")) || false;

const signupForm = document.getElementById("signupform");
const loginForm = document.getElementById("loginform");

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById("usernames").value.trim();
    const password = document.getElementById("passwords").value.trim();

    const existingUser = window.Data.find(u => u.username === username);
    if (existingUser) {
      alert("Username already exists — choose another.");
      signupForm.reset();
      return;
    }

    const NewUser = {
      username,
      password,
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: username 
    };

    window.Data.push(NewUser);
    localStorage.setItem("users", JSON.stringify(window.Data));

    alert("Signed up successfully — please log in.");
    signupForm.reset();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById("usernamel").value.trim();
    const password = document.getElementById("passwordl").value.trim();

    const existingUser = window.Data.find(u => u.username === username && u.password === password);

    if (existingUser) {
      alert("Logged in!");
      loginForm.reset();

      localStorage.setItem("currentUser", JSON.stringify(existingUser));
      localStorage.setItem("userloggedin", JSON.stringify(true));
      window.location = "dashboard.html";
    } else {
      alert("Incorrect username or password!");
      loginForm.reset();
    }
  });
}


