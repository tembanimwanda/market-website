// ================= ELEMENTS =================
const boothNoInput = document.getElementById("boothNo");
const sizeInput = document.getElementById("size");
const priceInput = document.getElementById("price");
const statusInput = document.getElementById("status");
const locationInput = document.getElementById("location");
const boothTable = document.getElementById("boothTable");

let editBoothNumber = null; // Keep track of booth being edited

const API_URL = "http://127.0.0.1:5000/api/booths";

// ================= LOAD BOOTHS =================
async function loadBooths() {
  try {
    boothTable.innerHTML = "<tr><td colspan='5'>Loading booths...</td></tr>";
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch booths");
    const booths = await res.json();

    renderBooths(booths);
  } catch (err) {
    console.error(err);
    boothTable.innerHTML = "<tr><td colspan='5' style='color:red'>Error loading booths</td></tr>";
  }
}

// ================= RENDER BOOTHS =================
function renderBooths(booths) {
  boothTable.innerHTML = "";

  if (!booths.length) {
    boothTable.innerHTML = "<tr><td colspan='5'>No booths available</td></tr>";
    return;
  }

  booths.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.booth_number}</td>
      <td>${b.size}</td>
      <td>K${b.price}</td>
      <td>${b.location}</td>
      <td>
        <button class="action edit" onclick="editBooth('${b.booth_number}')"><i class="fas fa-edit"></i> Edit</button>
        <button class="action delete" onclick="deleteBooth('${b.booth_number}')"><i class="fas fa-trash"></i> Delete</button>
      </td>
    `;
    boothTable.appendChild(tr);
  });
}

// ================= SAVE / CREATE BOOTH ================= 
function saveBoothBackend() {
  console.log("Save button clicked");
  const boothNo = boothNoInput.value.trim();
  const size = sizeInput.value;
  const price = Number(priceInput.value.trim());
  const status = statusInput.value;
  const location = locationInput.value.trim();

  console.log({ boothNo, size, price, status, location });

  if (!boothNo || !size || !price || !location) {
    alert("Please fill all fields!");
    return;
  }

  // rest of your code...
}

  const payload = { booth_number, size, price: Number(price), status, location };

  try {
    let res;
    if (editBoothNumber) {
      // UPDATE existing booth
      res = await fetch(`${API_URL}/${editBoothNumber}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      // CREATE new booth
      res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Error saving booth");
      return;
    }

    alert(data.message);
    clearForm();
    loadBooths();
  } catch (err) {
    console.error(err);
    alert("Server error. Try again later.");
  }


// ================= EDIT BOOTH =================
async function editBooth(booth_number) {
  try {
    const res = await fetch(`${API_URL}/${booth_number}`);
    if (!res.ok) throw new Error("Booth not found");
    const b = await res.json();

    boothNoInput.value = b.booth_number;
    sizeInput.value = b.size;
    priceInput.value = b.price;
    statusInput.value = b.status;
    locationInput.value = b.location;

    editBoothNumber = booth_number;
  } catch (err) {
    console.error(err);
    alert("Failed to load booth data");
  }
}

// ================= DELETE BOOTH =================
async function deleteBooth(booth_number) {
  if (!confirm(`Are you sure you want to delete booth ${booth_number}?`)) return;

  try {
    const res = await fetch(`${API_URL}/${booth_number}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete booth");
      return;
    }

    alert(data.message);
    loadBooths();
  } catch (err) {
    console.error(err);
    alert("Server error. Try again later.");
  }
}

// ================= CLEAR FORM =================
function clearForm() {
  boothNoInput.value = "";
  sizeInput.value = "";
  priceInput.value = "";
  statusInput.value = "Available";
  locationInput.value = "";
  editBoothNumber = null;
}

// ================= LOGOUT =================
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// ================= INITIALIZE =================
document.addEventListener("DOMContentLoaded", loadBooths);
