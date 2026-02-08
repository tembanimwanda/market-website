// ===== STORAGE =====
let contracts = JSON.parse(localStorage.getItem("contracts") || "[]");
let editIndex = null;

// ===== GET APPROVED VENDORS =====
function getApprovedVendors() {
  const applications = JSON.parse(localStorage.getItem("applications") || "[]");
  return applications.filter(app => app.status && app.status.toLowerCase() === "approved")
                     .map(app => ({ name: app.vendor_name, booth: app.booth_number }));
}

// ===== POPULATE DROPDOWN =====
function populateVendorsDropdown() {
  const select = document.getElementById('vendorName');
  select.innerHTML = '<option value="">Select Vendor</option>';

  const approvedVendors = getApprovedVendors();
  if(approvedVendors.length === 0){
    const option = document.createElement('option');
    option.value = "";
    option.textContent = "No approved vendors";
    select.appendChild(option);
    return;
  }

  approvedVendors.forEach(vendor => {
    const option = document.createElement('option');
    option.value = vendor.name;
    option.textContent = vendor.name;
    select.appendChild(option);
  });
}

// ===== AUTO-FILL BOOTH NUMBER =====
document.getElementById('vendorName').addEventListener('change', function() {
  const selectedVendor = this.value;
  const vendor = getApprovedVendors().find(v => v.name === selectedVendor);
  document.getElementById('boothNo').value = vendor ? vendor.booth : "";
});

// ===== SAVE CONTRACT =====
function saveContract() {
  const contract = {
    vendor: document.getElementById('vendorName').value,
    booth: document.getElementById('boothNo').value,
    start: document.getElementById('startDate').value,
    end: document.getElementById('endDate').value,
    amount: Number(document.getElementById('amount').value),
    status: document.getElementById('paymentStatus').value
  };

  if(!contract.vendor || !contract.booth || !contract.start || !contract.end || !contract.amount){
    alert("Please fill all fields");
    return;
  }

  if(editIndex !== null){
    contracts[editIndex] = contract;
    editIndex = null;
  } else {
    contracts.push(contract);
  }

  localStorage.setItem("contracts", JSON.stringify(contracts));
  clearForm();
  renderContracts();
}

// ===== RENDER CONTRACT TABLE =====
function renderContracts() {
  const table = document.getElementById("contractTable");
  table.innerHTML = "";

  contracts.forEach((c,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.vendor}</td>
      <td>${c.booth}</td>
      <td>${c.start}</td>
      <td>${c.end}</td>
      <td>K${c.amount}</td>
      <td class="${c.status.toLowerCase()}">${c.status}</td>
      <td>
        <button class="action edit" onclick="editContract(${i})">Edit</button>
        <button class="action delete" onclick="removeContract(${i})">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

// ===== EDIT CONTRACT =====
function editContract(i){
  const c = contracts[i];
  document.getElementById('vendorName').value = c.vendor;
  document.getElementById('boothNo').value = c.booth;
  document.getElementById('startDate').value = c.start;
  document.getElementById('endDate').value = c.end;
  document.getElementById('amount').value = c.amount;
  document.getElementById('paymentStatus').value = c.status;
  editIndex = i;
}

// ===== DELETE CONTRACT =====
function removeContract(i){
  if(confirm("Delete this contract?")){
    contracts.splice(i,1);
    localStorage.setItem("contracts", JSON.stringify(contracts));
    renderContracts();
  }
}

// ===== CLEAR FORM =====
function clearForm(){
  document.getElementById('vendorName').value = "";
  document.getElementById('boothNo').value = "";
  document.getElementById('startDate').value = "";
  document.getElementById('endDate').value = "";
  document.getElementById('amount').value = "";
  document.getElementById('paymentStatus').value = "Pending";
  editIndex = null;
}

// ===== LOGOUT =====
function logout(){
  sessionStorage.clear();
  window.location.href="admin.html";
}

// ===== INITIAL LOAD =====
document.addEventListener("DOMContentLoaded",()=>{
  populateVendorsDropdown();
  renderContracts();
});
