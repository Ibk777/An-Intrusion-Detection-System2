let traffic = 0;
let threats = 0;
let alerts = 0;

/* SIGNATURE RULES */
const signatures = [
    { pattern: /SELECT \* FROM/i, type: "SQL Injection" },
    { pattern: /<script>/i, type: "XSS Attack" },
    { pattern: /DROP TABLE/i, type: "Database Attack" },
    { pattern: /UNION SELECT/i, type: "SQL Injection" },
    { pattern: /(\.\.\/)+/i, type: "Directory Traversal" }
];

/* NAVIGATION */
function showSection(id) {
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(id).classList.add('active');
}

/* REAL-TIME SIMULATION */
setInterval(() => {
    traffic += Math.floor(Math.random() * 10);

    if (Math.random() > 0.7) {
        let attack = signatures[Math.floor(Math.random() * signatures.length)];
        addThreat(attack.type);
    }

    updateStats();
    updateChart();

}, 3000);

/* UPDATE UI */
function updateStats() {
    document.getElementById("traffic").innerText = traffic;
    document.getElementById("threats").innerText = threats;
    document.getElementById("alerts").innerText = alerts;
}

/* THREAT HANDLER */
function addThreat(type) {
    threats++;
    alerts++;

    let status = document.getElementById("status");
    status.innerText = "UNDER ATTACK";
    status.style.color = "red";

    let li = document.createElement("li");
    li.innerText = `${type} detected! (Severity: ${getSeverity(type)})`;

    document.getElementById("logList").prepend(li);

    showAlert(type + " detected!");
}

/* SEVERITY */
function getSeverity(type) {
    if (type.includes("SQL")) return "HIGH";
    if (type.includes("XSS")) return "MEDIUM";
    return "LOW";
}

/* ALERT UI */
function showAlert(msg) {
    let div = document.createElement("div");
    div.className = "alert";
    div.innerText = msg;

    document.body.appendChild(div);

    setTimeout(() => div.remove(), 3000);
}

/* LOG SCANNER */
function scanLogs() {
    let logs = document.getElementById("logInput").value;

    signatures.forEach(sig => {
        if (sig.pattern.test(logs)) {
            addThreat(sig.type);
        }
    });
}

/* EXPORT REPORT */
function exportReport() {
    let logs = document.getElementById("logList").innerText;

    let blob = new Blob([logs], { type: "text/plain" });
    let a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "JRUT_Report.txt";
    a.click();
}

/* CHART */
let ctx = document.getElementById("chart").getContext("2d");

let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["1", "2", "3", "4", "5"],
        datasets: [{
            label: "Threats",
            data: [2, 4, 3, 6, 5]
        }]
    }
});

function updateChart() {
    chart.data.datasets[0].data.push(threats);
    chart.data.datasets[0].data.shift();
    chart.update();
}