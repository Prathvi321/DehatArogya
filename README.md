# 🐄 DehatArogya (देहात आरोग्य)

**Efficient Systems for Early Detection, Prevention, and Management of Livestock Diseases and Animal Health Issues.**  
*Smart India Hackathon (SIH 2024) Full-Stack Prototype*

DehatArogya is a decentralized, authentication-free livestock health tracking and AI triage platform built for Indian rural veterinary healthcare. Animals are identified purely through physical digital ear tags (`TAG-XXXXXX`). The platform features a **three-port decoupled architecture** powered by **Google Gemini 2.5 Flash**, SQLite, and FastAPI.

---

## 🌐 System Architecture & Port Mapping

```
                                  [ 🏛️ Gateway Hub :3000 ]
                                (SIH Judge Presentation Desk)
                                         /            \
                                        /              \
                                       ▼                ▼
       [ 🚜 Farmer / Field App :5173 ]            [ 🩺 Veterinary Doctor Portal :5174 ]
      (Mobile QR Scan & Speech Triage)           (Jurisdiction Map & Treatment Desk)
                                       \                /
                                        \              /
                                         ▼            ▼
                                 [ ⚙️ FastAPI Backend :8000 ]
                                 (SQLite DB + Gemini 2.5 Flash)
```

| Service | Port | Audience | Key Functions | Local URL |
|---|---|---|---|---|
| 🏛️ **Showcase Gateway Hub** | **`3000`** | **Judges & Evaluators** | Presentation landing page offering decoupled launch buttons for Farmer and Doctor portals. | `http://localhost:3000/` |
| 🚜 **Farmer & Field Portal** | **`5173`** | **Farmers & Field Workers** | Animal registration, printable QR ear-tag cards, phone camera scan (`/scan?tag_id=...`), Hindi/English voice input, Gemini AI triage, and mobile GPS capture. | `http://localhost:5173/` |
| 🩺 **Veterinary Doctor Portal** | **`5174`** | **Veterinary Officers** | Assigned jurisdiction sector selector (Rampur, Gokul, etc.), real-time case alerts, **direct Google Maps GPS navigation routing**, and field treatment & prescription logs. | `http://localhost:5174/` |
| ⚙️ **Shared FastAPI Backend** | **`8000`** | **Core API Engine** | Centralized SQLite database (`dehat_arogya.db`), Gemini 2.5 Flash structured AI outputs, and Vet API. | `http://localhost:8000/docs` |

---

## 🚀 Key Features

1. **No-Login Physical Identity**: Livestock identity is permanently bound to a unique physical QR ear tag (`TAG-XXXXXX`). No password or authentication needed.
2. **Local Wi-Fi Network Exposure**: Runs 100% locally on your laptop yet is directly accessible by any smartphone or tablet on the same Wi-Fi LAN.
3. **Printable Digital Ear Tag**: Generates realistic ear-tag cards with QR codes and a one-click **Print / Save Tag** button.
4. **Mobile GPS Location Tracking**: Automatically captures latitude & longitude via the mobile device's Geolocation API when reporting an issue and stores them with the incident.
5. **Veterinary Doctor Jurisdiction Portal**: Dedicated dashboard where a government/private vet doctor can:
   - Select their assigned posting jurisdiction/village (e.g. Rampur, Gokul, All Sectors)
   - View active cases, critical urgency alerts, and owner contacts with one-tap calling
   - Navigate straight to the farm via a direct **"Navigate via Google Maps"** link button
   - Record field visits, prescribe routines, and update case status (`TREATED`, `IN_TREATMENT`)
6. **Google Gemini 2.5 Flash AI Triage**: Uses structured JSON outputs (`response_schema`) returning:
   - Condition / Disease Name
   - Clinical Symptoms Identified
   - Color-Coded Risk Rating (**LOW** / **MEDIUM** / **HIGH**)
   - Specialist vs. Home Care Requirement
   - Dual-Language Care Protocol (**English** and **हिन्दी**)
   - Accessible Village Remedies & Herbal/Veterinary Supplements
7. **Speech-to-Text Voice Input**: Web Speech API integration supporting Hindi (`hi-IN`) and English voice input.
8. **Incident Lifecycle Tracking**: Incidents can be flagged as `PENDING`, `ACTION_REQUIRED`, `IN_TREATMENT`, `TREATED`, or `SATISFIED`.
9. **Offline Resilience**: Includes a built-in veterinary decision matrix fallback so the prototype continues working smoothly even if the internet drops during a presentation.

---

## 🛠 Tech Stack

- **Backend**: FastAPI (Python 3.12), Uvicorn
- **Database**: SQLite with SQLAlchemy ORM (`backend/dehat_arogya.db`)
- **AI Engine**: Google Gemini API via `google-genai` SDK (`gemini-2.5-flash`)
- **QR Generation**: `qrcode[pil]` with dynamic LAN IP URL encoding
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Canvas Confetti
- **Voice Recognition**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Geolocation**: HTML5 Geolocation API (`navigator.geolocation`) + Google Maps routing

---

## 📋 Prerequisites

- **Python 3.12** (or 3.11+)
- **Node.js 18+** and **npm**
- Laptop and mobile phone connected to the **same Wi-Fi network**

---

## ⚙️ Step-by-Step Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Prathvi321/DehatArogya.git
cd DehatArogya
```

### 2. Find Your Laptop's LAN IP

On Windows (PowerShell):
```powershell
ipconfig
```
Find the **IPv4 Address** under your active Wi-Fi adapter (e.g., `10.21.29.4` or `192.168.1.42`).

### 3. Configure Backend Environment

Copy `.env.example` to `.env` in the `backend/` directory:
```powershell
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```env
# Google Gemini API key
GOOGLE_API_KEY=your_gemini_api_key_here

# Local Network Configuration (Your Laptop's Wi-Fi IP)
LOCAL_IP=10.21.29.4

# Server Ports
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

---

## 🏃 Running the Servers

Open separate terminal tabs for each service:

### Terminal 1: Start Backend API (Port 8000)
```powershell
cd backend
py -3.12 -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2: Start Farmer & Field Portal (Port 5173)
```powershell
cd frontend
npm install
npm run dev -- --host
```

### Terminal 3: Start Veterinary Doctor Portal (Port 5174)
```powershell
cd frontend
npm run dev:vet
```

### Terminal 4: Start Showcase Gateway Hub (Port 3000)
```powershell
py -3.12 -m http.server 3000 --directory gateway --bind 0.0.0.0
```

---

## 📖 How to Use This Project

### Phase 1: Showcase Gateway Hub (`:3000`)
1. Open **`http://localhost:3000/`** on your laptop (or `http://<LOCAL_IP>:3000/` on mobile).
2. The landing hub displays the project mission, live LAN beacon, and two distinct launch cards:
   - Click **"Open Farmer Portal (Port 5173)"** to demonstrate the field app.
   - Click **"Open Doctor Portal (Port 5174)"** to demonstrate the veterinary desk.

---

### Phase 2: Farmer & Livestock Flow (`:5173`)
1. **Animal Registration**:
   - Go to `http://localhost:5173/`.
   - Fill in: Species (Cow/Buffalo/Goat/Sheep), Name (e.g. *Gauri*), Age, Village (e.g. *Rampur*), and Owner Phone.
   - Click **"Register & Generate Digital Ear Tag"**.
2. **Printable Ear Tag Card**:
   - View the generated ear-tag card with its unique Tag ID (e.g. `TAG-A9B3C1`) and QR code.
   - Click **"Print / Save Tag"** to print or preview print styling.
3. **Scan Tag & Confirm**:
   - Open camera on your mobile phone and point it at the QR code on your laptop screen.
   - Tap the link: `http://<LOCAL_IP>:5173/scan?tag_id=TAG-XXXXXX`.
   - View confirmation card: *"Is this Gauri (Cow, 3.5 years)?"*.
   - Tap **"Yes, Report Health Issue"**.
4. **Voice / Text Symptom Input**:
   - Tap common symptom chips (e.g. *+ High Fever*, *+ Blisters / Drooling*).
   - Or tap the **Microphone** icon to speak in **Hindi** (*"गाय को 2 दिन से तेज बुखार है और मुंह में छाले हैं"*) or **English**.
   - Notice the green **GPS Tagged** indicator automatically capturing device coordinates.
5. **AI Triage & Guidance**:
   - Tap **"Analyze & Generate Triage Advice"**.
   - Gemini 2.5 Flash generates:
     - Disease classification (e.g. *Foot and Mouth Disease*)
     - Color-coded risk badge (🔴 HIGH / 🟡 MEDIUM / 🟢 LOW)
     - Specialist vs. Home Care banner
     - Language tab toggle (**English** / **हिन्दी**) for daily care routine
     - Rural supplements & remedies list (potassium permanganate wash, turmeric paste, electrolytes)
6. **Incident Resolution**:
   - Tap **"Satisfied (Follow Home Care)"** to mark as resolved with celebratory confetti, or tap **"Action Required"** to flag for vet escalation.

---

### Phase 3: Veterinary Doctor Desk (`:5174`)
1. Open **`http://localhost:5174/`**.
2. **Select Jurisdiction**:
   - Use the **Assigned Posting Area** dropdown to select your sector (e.g. *Rampur Sector* or *All Jurisdictions*).
   - The dashboard filters cases specifically in that area.
3. **Triage Active Cases**:
   - View risk badges, reported signs, and animal profile.
   - Note the **📍 GPS Coordinates** recorded during symptom submission.
4. **Field Navigation via Google Maps**:
   - Click **"Navigate via Google Maps"** to open direct driving/walking directions straight to the animal's coordinates in rural fields.
5. **Direct Owner Contact**:
   - Click the owner's phone number (`tel:`) to initiate a direct phone call.
6. **Record Clinical Treatment**:
   - Click **"Record Field Treatment"**.
   - Update status to `✓ Treated / Resolved` or `🔄 In Treatment`.
   - Add clinical notes / prescriptions (e.g. *"Administered 15ml Meloxicam and prescribed oral electrolytes"*).
   - Save to permanently update the animal's medical record.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/animals/register` | Registers animal, generates `tag_id` & QR code Data URL |
| `GET` | `/api/animals/{tag_id}` | Returns animal profile and full medical history |
| `GET` | `/api/animals` | Lists all registered herd animals in the database |
| `POST` | `/api/animals/diagnose` | Runs Gemini 2.5 Flash triage & saves GPS coordinates |
| `POST` | `/api/animals/resolve` | Updates incident status (`SATISFIED` / `ACTION_REQUIRED`) |
| `GET` | `/api/vet/areas` | Returns list of distinct villages/areas |
| `GET` | `/api/vet/incidents` | Returns incidents filtered by jurisdiction, risk, and status |
| `POST` | `/api/vet/action` | Records vet clinical visit notes and updates treatment status |
| `GET` | `/api/network-info` | Returns host LAN IP and frontend base URL |

---

## 🏆 Presentation Tips for Hackathon Judges

1. Open **`http://localhost:3000/`** on your primary display.
2. Highlight the problem statement: early detection of livestock diseases in rural India without requiring account logins.
3. Show that identity is decentralized: physical QR ear tags on animals.
4. Open the **Farmer Portal (`:5173`)** to demonstrate farmer voice input in Hindi and Gemini structured AI output.
5. Open the **Doctor Portal (`:5174`)** on a second window/tablet to demonstrate how government veterinary officers can track cases in their assigned village, view exact GPS coordinates on Google Maps, and log treatment records.

---

## 📄 License

This prototype was developed for the **Smart India Hackathon (SIH 2024)**. Open source under the MIT License.
