let keyDownTime = {};
let dwellTimes = [];
let flightTimes = [];

let lastKeyUp = 0;
let errorCount = 0;

const textInput = document.getElementById("textInput");

// KEY DOWN
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

// KEY UP
textInput.addEventListener("keyup", function(e) {
    let time = Date.now();

    if (keyDownTime[e.key]) {
        let dwell = time - keyDownTime[e.key];
        dwellTimes.push(dwell);
    }

    lastKeyUp = time;
});

// HITUNG RATA-RATA
function average(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// SUBMIT DATA
function submitData() {
    let dwell = average(dwellTimes);
    let flight = average(flightTimes);
    let error = errorCount;
    let speed = textInput.value.length;

    let emotion = document.getElementById("emotion").value;

    fetch("/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            dwell: dwell,
            flight: flight,
            error: error,
            speed: speed,
            emotion: emotion
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Data berhasil dikirim!");
        location.reload();
    });
}