const facilityTable = document.getElementById("facilityTable");
const form = document.getElementById("inspectionForm");

let facilities = JSON.parse(localStorage.getItem("facilities")) || [];
let snapshots = JSON.parse(localStorage.getItem("dailySnapshots")) || [];

function renderClock(){
  const clock = document.getElementById("clock");
  const now = new Date();
  clock.innerText = now.toLocaleString("vi-VN");
}

function saveData(){
  localStorage.setItem("facilities", JSON.stringify(facilities));
}

function renderDashboard(){
  const total = facilities.length;
  const checked = facilities.filter(f => f.status === "checked").length;
  const unchecked = facilities.filter(f => f.status === "unchecked").length;
  const highRisk = facilities.filter(f => f.risk === "high").length;

  document.getElementById("totalFacilities").innerText = total;
  document.getElementById("checkedFacilities").innerText = checked;
  document.getElementById("uncheckedFacilities").innerText = unchecked;
  document.getElementById("highRiskFacilities").innerText = highRisk;
}

function renderTable(){
  facilityTable.innerHTML = "";

  facilities.forEach(f => {
    facilityTable.innerHTML += `
      <tr>
        <td>${f.name}</td>
        <td>${f.type}</td>
        <td>${f.risk}</td>
        <td>${f.status}</td>
      </tr>
    `;
  });
}

function renderHistory(){
  const history = document.getElementById("historyContainer");
  history.innerHTML = "";

  snapshots.reverse().forEach(s => {
    history.innerHTML += `
      <div class="history-card">
        <strong>${s.date}</strong><br>
        Tổng: ${s.total} |
        Đã kiểm tra: ${s.checked} |
        Chưa kiểm tra: ${s.unchecked} |
        Nguy cơ cao: ${s.highRisk}
      </div>
    `;
  });
}

form.addEventListener("submit", (e)=>{
  e.preventDefault();

  const facility = {
    name: document.getElementById("facilityName").value,
    type: document.getElementById("facilityType").value,
    risk: document.getElementById("riskLevel").value,
    status: document.getElementById("inspectionStatus").value
  };

  facilities.push(facility);

  saveData();
  renderDashboard();
  renderTable();

  form.reset();
});

document.getElementById("resetBtn").addEventListener("click", ()=>{
  const snapshot = {
    date: new Date().toLocaleDateString("vi-VN"),
    total: facilities.length,
    checked: facilities.filter(f => f.status === "checked").length,
    unchecked: facilities.filter(f => f.status === "unchecked").length,
    highRisk: facilities.filter(f => f.risk === "high").length
  };

  snapshots.push(snapshot);

  localStorage.setItem("dailySnapshots", JSON.stringify(snapshots));

  facilities = [];
  saveData();

  renderDashboard();
  renderTable();
  renderHistory();
});

function refreshRealtime(){
  renderClock();
  renderDashboard();
  renderTable();
  renderHistory();
}

refreshRealtime();

setInterval(()=>{
  refreshRealtime();
}, 60000);
