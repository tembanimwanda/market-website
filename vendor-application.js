document.addEventListener("DOMContentLoaded", loadVendors);

async function loadVendors() {
    const table = document.getElementById("vendorTable");
    const error = document.getElementById("error");

    try {
        const res = await fetch("http://127.0.0.1:5000/api/vendors");

        if (!res.ok) {
            throw new Error("Failed to fetch vendors");
        }

        const vendors = await res.json();
        table.innerHTML = "";

        if (vendors.length === 0) {
            table.innerHTML =
                "<tr><td colspan='5'>No vendor applications found</td></tr>";
            return;
        }

        vendors.forEach(v => {
            table.innerHTML += `
                <tr>
                    <td>${v.full_name}</td>
                    <td>${v.business_name}</td>
                    <td>${v.phone}</td>
                    <td>${v.email}</td>
                    <td>${v.nrc}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.error(err);
        table.innerHTML = "";
        error.textContent = "Error loading vendor applications. Try again later.";
    }
}
