// ================= LOAD AVAILABLE BOOTHS =================
function loadAvailableBooths() {
  const boothGrid = document.getElementById("boothGrid");
  if (!boothGrid) return;

  boothGrid.innerHTML = "<p>Loading booths...</p>";

  fetch("http://127.0.0.1:5000/api/booths")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load booths");
      return res.json();
    })
    .then(booths => {
      boothGrid.innerHTML = "";

      if (booths.length === 0) {
        boothGrid.innerHTML =
          "<p style='color:#fff'>No booths available at the moment.</p>";
        return;
      }

      booths.forEach(b => {
        const card = document.createElement("div");
        card.className = "card available-glow";

        card.innerHTML = `
          <span class="price-tag">K${b.price}</span>
          <h3>Booth ${b.booth_number}</h3>
          <p><strong>Size:</strong> ${b.size}</p>
          <p><strong>Location:</strong> ${b.location || "Not specified"}</p>
          <button class="btn" onclick="applyBooth('${b.booth_number}')">
            Apply
          </button>
        `;

        boothGrid.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      boothGrid.innerHTML =
        "<p style='color:red'>Error loading booths. Try again later.</p>";
    });
}

// ================= SELECT BOOTH =================
function applyBooth(boothNumber) {
  sessionStorage.setItem("selectedBooth", boothNumber);
  window.location.href = "booth-application.html";
}

// ================= APPLY BUTTON CHECK =================
function validateApply() {
  const booth = sessionStorage.getItem("selectedBooth");
  if (!booth) {
    alert("Please select an available booth first before applying.");
    document.getElementById("booths").scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.location.href = "booth-application.html";
}

// ================= FAQ ACCORDION =================
const faqQuestions = document.querySelectorAll("#faq .faq-question");
faqQuestions.forEach(q => {
  q.addEventListener("click", function () {
    const parent = this.parentElement;
    const answer = parent.querySelector(".faq-answer");
    const icon = this.querySelector("i");

    const isOpen = parent.classList.contains("active");

    document.querySelectorAll(".faq-card").forEach(card => {
      card.classList.remove("active");
      card.querySelector(".faq-answer").style.display = "none";
      card.querySelector("i").style.transform = "rotate(0deg)";
    });

    if (!isOpen) {
      parent.classList.add("active");
      answer.style.display = "block";
      icon.style.transform = "rotate(180deg)";
    }
  });
});

// ================= INIT =================
document.addEventListener("DOMContentLoaded", loadAvailableBooths);
