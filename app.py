from flask import Flask, render_template, request, jsonify
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)

# ==========================
# KONEKSI GOOGLE SHEETS
# ==========================
scope = [
    "https://spreadsheets.google.com/feeds",
    "https://www.googleapis.com/auth/drive"
]

creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
client = gspread.authorize(creds)

sheet = client.open("Dataset Keystroke").worksheet("Data Pengujian")


# ==========================
# RULE-BASED CLASSIFICATION
# ==========================
def klasifikasi_emosi(speed, error, dwell, flight):

    # RULE 1 → MARAH
    if speed > 36 and error > 3:
        return "Marah"

    # RULE 2 → STRES
    elif speed < 34 and error <= 2 and flight < 300:
        return "Stres"

    # RULE 3 → NETRAL
    elif dwell > 15 and flight > 350:
        return "Netral"

    # DEFAULT
    else:
        return "Tidak Terklasifikasi"


# ==========================
# ROUTE HALAMAN UTAMA
# ==========================
@app.route('/')
def index():
    return render_template('index.html')


# ==========================
# ROUTE SUBMIT DATA
# ==========================
@app.route('/submit', methods=['POST'])
def submit():
    data = request.json

    # ambil data dari frontend
    dwell = float(data.get('dwell', 0))
    flight = float(data.get('flight', 0))
    error = int(data.get('error', 0))
    speed = int(data.get('speed', 0))

    # 🔥 klasifikasi otomatis
    hasil_emosi = klasifikasi_emosi(speed, error, dwell, flight)

    # simpan ke Google Sheets
    sheet.append_row([
        dwell,
        flight,
        error,
        speed,
        hasil_emosi
    ])

    return jsonify({
        "status": "success",
        "prediksi": hasil_emosi
    })


# ==========================
# RUN APP
# ==========================
if __name__ == '__main__':
    app.run(debug=True)