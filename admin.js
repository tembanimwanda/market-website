if (sessionStorage.getItem("userRole") !== "Admin") {
  window.location.href = "login.html";
}
function goBack() {
  sessionStorage.clear();   // logout admin
  window.location.href = "login.html";
}
