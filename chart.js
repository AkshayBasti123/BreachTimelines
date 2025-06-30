let showingCompanyChart = true;

async function toggleGraph() {
  const canvas = document.getElementById("breachChart");
  const res = await fetch("data.json");
  const data = await res.json();
  const ctx = canvas.getContext("2d");

  canvas.classList.remove("hidden");

  const config = showingCompanyChart
    ? buildCompanyChart(data, ctx)
    : buildYearChart(data, ctx);

  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(ctx, config);

  showingCompanyChart = !showingCompanyChart;
}

function buildCompanyChart(data, ctx) {
  const labels = Object.keys(data);
  const counts = labels.map(company => data[company].length);

  return {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Total Breaches",
        data: counts,
        backgroundColor: "#ab47bc"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  };
}

function buildYearChart(data, ctx) {
  const yearCounts = {};

  for (const company in data) {
    data[company].forEach(entry => {
      yearCounts[entry.year] = (yearCounts[entry.year] || 0) + 1;
    });
  }

  const years = Object.keys(yearCounts).sort();
  const counts = years.map(year => yearCounts[year]);

  return {
    type: "line",
    data: {
      labels: years,
      datasets: [{
        label: "Breaches Per Year",
        data: counts,
        borderColor: "#bb86fc",
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  };
}
