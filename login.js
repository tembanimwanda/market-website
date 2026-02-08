function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.style.color = "red";
  errorMsg.innerHTML = "";

  if (!username || !password) {
    errorMsg.innerHTML = "Please enter both username and password.";
    return;
  }

  fetch("http://127.0.0.1:5000/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      errorMsg.innerHTML = data.error;
      return;
    }

    // Minimal session flag (temporary)
    sessionStorage.setItem("userRole", "Admin");
    window.location.href = "admin.html";
  })
  .catch(() => {
    errorMsg.innerHTML = "Server error. Please try again.";
  });
}

// Logout
function logout(){
  sessionStorage.clear();
  window.location.href = "login.html";
}
