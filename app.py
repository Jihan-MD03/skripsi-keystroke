from flask import Flask, render_template, request, jsonify
import gspread
from oauth2client.service_account import ServiceAccountCredentials

app = Flask(__name__)

# ===== KONEKSI GOOGLE SHEETS =====
scope = ["https://spreadsheets.google.com/feeds",
         "https://www.googleapis.com/auth/drive"]

creds = ServiceAccountCredentials.from_json_keyfile_name("creds.json", scope)
client = gspread.authorize(creds)

sheet = client.open("Dataset Keystroke").sheet1


# ===== ROUTE =====
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/submit', methods=['POST'])
def submit():
    data = request.json

    dwell = data.get('dwell')
    flight = data.get('flight')
    error = data.get('error')
    speed = data.get('speed')
    emotion = data.get('emotion')

    # simpan ke Google Sheets
    sheet.append_row([dwell, flight, error, speed, emotion])

    return jsonify({"status": "success"})


if __name__ == '__main__':
    app.run(debug=True)