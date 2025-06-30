AOS.init();

async function searchCompany() {
  const input = document.getElementById("searchInput").value.trim().toLowerCase();
  const timeline = document.getElementById("timeline");
  const chart = document.getElementById("breachChart");
  chart.classList.add("hidden");

  if (!input) {
    timeline.innerHTML = "<p>Please enter a company name.</p>";
    return;
  }

  const res = await fetch("data.json");
  const data = await res.json();

  if (!data[input]) {
    timeline.innerHTML = "<p>🚫 No breach history found for this company.</p>";
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
