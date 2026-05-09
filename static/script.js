let keyDownTime = {};
let dwellTimes = [];
let flightTimes = [];

let lastKeyUp = 0;
let errorCount = 0;

const textInput = document.getElementById("textInput");

// ==========================
// KEY DOWN
// ==========================
textInput.addEventListener("keydown", function(e) {
    let time = Date.now();
    keyDownTime[e.key] = time;

    if (lastKeyUp !== 0) {
        flightTimes.push(time - lastKeyUp);
    }

    if (e.key === "Backspace") {
        errorCount++;
    }
});

// ==========================
// KEY UP
// ==========================
textInput.addEventListener("keyup", function(e) {
    let time = Date.now();

    if (keyDownTime[e.key]) {
        let dwell = time - keyDownTime[e.key];
        dwellTimes.push(dwell);
    }

    lastKeyUp = time;
});

// ==========================
// HITUNG RATA-RATA
// ==========================
function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ==========================
// RESET DATA (BIAR GA NUMPUK)
// ==========================
function resetData() {
    keyDownTime = {};
    dwellTimes = [];
    flightTimes = [];
    lastKeyUp = 0;
    errorCount = 0;
}

// ==========================
// SUBMIT DATA
// ==========================
function submitData() {
    let loading = document.getElementById("loading");
    let hasilBox = document.getElementById("hasilBox");
    let hasil = document.getElementById("hasil");

    // tampilkan loading
    loading.style.display = "block";
    hasilBox.style.display = "none";

    let dwell = average(dwellTimes);
    let flight = average(flightTimes);
    let error = errorCount;
    let speed = textInput.value.length;

    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            dwell: dwell,
            flight: flight,
            error: error,
            speed: speed
        })
    })
    .then(res => res.json())
    .then(data => {

        // sembunyikan loading
        loading.style.display = "none";

        // tampilkan hasil
        hasilBox.style.display = "block";
        hasil.innerText = data.prediksi;

        // warna + efek
        if (data.prediksi === "Marah") {
            hasil.style.color = "red";
            document.body.style.background = "#ffe5e5";
        } else if (data.prediksi === "Stres") {
            hasil.style.color = "orange";
            document.body.style.background = "#fff4e5";
        } else {
            hasil.style.color = "green";
            document.body.style.background = "#e5ffe5";
        }

        // reset data setelah submit
        resetData();
    })
    .catch(err => {
        loading.style.display = "none";
        alert("Terjadi error!");
        console.log(err);
    });
}