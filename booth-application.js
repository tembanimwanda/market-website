// ================= ELEMENTS =================
const boothNumber = document.getElementById("boothNumber");
const boothLocation = document.getElementById("boothLocation");
const boothSize = document.getElementById("boothSize");
const boothPrice = document.getElementById("boothPrice");
const paymentAmount = document.getElementById("paymentAmount");

const vendorName = document.getElementById("vendorName");
const businessName = document.getElementById("businessName");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const nrc = document.getElementById("nrc");
const paymentMode = document.getElementById("paymentMode");
const mobileNetwork = document.getElementById("mobileNetwork");
const paymentRef = document.getElementById("paymentRef");

const referenceBox = document.getElementById("referenceBox");
const networkBox = document.getElementById("networkBox");
const paymentOverlay = document.getElementById("paymentOverlay");
const successNotification = document.getElementById("successNotification");

const API_BOOTH_URL = "http://127.0.0.1:5000/api/booths";
const API_APPLICATION_URL = "http://127.0.0.1:5000/api/applications";

// ================= LOAD SELECTED BOOTH =================
const selectedBooth = sessionStorage.getItem("selectedBooth");

if (!selectedBooth) {
  alert("No booth selected");
  location.href = "index.html";
}

async function loadSelectedBooth() {
  try {
    const res = await fetch(`${API_BOOTH_URL}/${selectedBooth}`);
    if (!res.ok) throw new Error("Booth not available");

    const booth = await res.json();

    boothNumber.value = booth.booth_number;
    boothLocation.value = booth.location || "Not specified";
    boothSize.value = booth.size;
    boothPrice.value = booth.price;
    paymentAmount.value = booth.price;
  } catch (err) {
    console.error(err);
    alert("Booth not available");
    location.href = "index.html";
  }
}

// ================= PAYMENT MODE =================
function togglePaymentFields() {
  const mode = paymentMode.value;
  referenceBox.style.display =
    mode === "Mobile Money" || mode === "Bank Transfer" ? "block" : "none";
  networkBox.style.display = mode === "Mobile Money" ? "block" : "none";
  mobileNetwork.value = "";
}

// ================= AUTO DETECT MOBILE NETWORK =================
phone.addEventListener("input", () => {
  if (paymentMode.value !== "Mobile Money") return;

  const prefix = phone.value.replace(/\s+/g, "").substring(0, 3);
  if (prefix === "096" || prefix === "076") mobileNetwork.value = "MTN Mobile Money";
  else if (prefix === "097" || prefix === "077") mobileNetwork.value = "Airtel Money";
  else if (prefix === "095" || prefix === "075") mobileNetwork.value = "Zamtel Kwacha";
  else mobileNetwork.value = "Unknown Network";
});

// ================= VALIDATION =================
function validateForm() {
  if (
    !vendorName.value.trim() ||
    !businessName.value.trim() ||
    !phone.value.trim() ||
    !email.value.trim() ||
    !nrc.value.trim() ||
    !paymentMode.value ||
    !paymentAmount.value
  ) {
    alert("Fill in all necessary fields.");
    return false;
  }

  if (paymentMode.value === "Mobile Money") {
    if (!mobileNetwork.value || mobileNetwork.value === "Unknown Network") {
      alert("Invalid or missing mobile money network.");
      return false;
    }
    if (!paymentRef.value.trim()) {
      alert("Please provide Mobile Money transaction reference.");
      return false;
    }
  }

  if (paymentMode.value === "Bank Transfer" && !paymentRef.value.trim()) {
    alert("Please provide Bank Transfer transaction reference.");
    return false;
  }

  return true;
}

// ================= SUBMIT APPLICATION =================
async function submitApplication() {
  if (!validateForm()) return;

  paymentOverlay.classList.add("active");

  try {
    const res = await fetch(API_APPLICATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booth_number: boothNumber.value,
        vendor_name: vendorName.value,
        business_name: businessName.value,
        phone: phone.value,
        email: email.value,
        nrc: nrc.value,
        payment_amount: Number(paymentAmount.value),
        payment_mode: paymentMode.value,
        mobile_network: mobileNetwork.value || "N/A",
        payment_reference: paymentRef.value || "N/A"
      })
    });

    const data = await res.json();
    paymentOverlay.classList.remove("active");

    if (!res.ok) {
      alert(data.error || "Failed to submit application");
      return;
    }

    successNotification.style.display = "block";
    setTimeout(() => {
      sessionStorage.removeItem("selectedBooth");
      location.href = "index.html";
    }, 3000);
  } catch (err) {
    console.error(err);
    paymentOverlay.classList.remove("active");
    alert("Server error. Please try again.");
  }
}

// ================= INITIALIZE =================
document.addEventListener("DOMContentLoaded", loadSelectedBooth);
