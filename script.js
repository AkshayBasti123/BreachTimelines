AOS.init();
let staticData = {};
let localData = JSON.parse(localStorage.getItem("breaches")) || {};
let currentCompany = "";

async function loadData() {
  const res = await fetch("data.json");
  staticData = await res.json();
}

function getCombinedData() {
  return { ...staticData, ...localData };
}

function searchCompany() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const timeline = document.getElementById("timeline");
  const chart = document.getElementById("breachChart");
  chart.classList.add("hidden");

  if (!input) {
    timeline.innerHTML = "<p>Please enter a company name.</p>";
    return;
  }

  const data = getCombinedData();

  if (!data[input]) {
    showAddModal(input);
    timeline.innerHTML = "<p>🚫 No breaches found. You can add one below.</p>";
    return;
  }

  const entries = data[input]
    .sort((a, b) => b.year - a.year)
    .map(entry => `
      <div class="timeline-entry" data-aos="fade-up">
        <h3>${entry.year}</h3>
        <p><strong>Records:</strong> ${entry.records}</p>
        <p><strong>Data:</strong> ${entry.data}</p>
        <p><strong>About:</strong> ${entry.description}</p>
      </div>
    `).join("");

  timeline.innerHTML = entries;
  AOS.refresh();
}

function showAddModal(company) {
  currentCompany = company;
  document.getElementById("modalCompanyName").innerText = company;
  document.getElementById("addModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("addModal").classList.add("hidden");
  document.getElementById("modalYear").value = "";
  document.getElementById("modalRecords").value = "";
  document.getElementById("modalData").value = "";
  document.getElementById("modalDescription").value = "";
}

function submitNewBreach() {
  const year = document.getElementById("modalYear").value.trim();
  const records = document.getElementById("modalRecords").value.trim();
  const data = document.getElementById("modalData").value.trim();
  const description = document.getElementById("modalDescription").value.trim();

  if (!year || !records || !data || !description) {
    alert("Please fill in all fields.");
    return;
  }

  const newBreach = { year, records, data, description };

  if (!localData[currentCompany]) {
    localData[currentCompany] = [];
  }

  localData[currentCompany].push(newBreach);
  localStorage.setItem("breaches", JSON.stringify(localData));

  closeModal();
  searchCompany();
}

loadData();
