# 🔍 Web Monitor Backend

Backend service for the Web Monitor application.
It tracks website changes, detects differences, and generates summaries using an LLM.

---

## 🚀 Features

* Monitor website content changes
* Store snapshots in SQLite
* Generate diffs between versions
* Extract **evidence => key changed lines**
* Generate summaries using Gemini API
* REST API for frontend integration
* Health check endpoint

---

## 🛠 Tech Stack

* Node.js
* Express.js
* SQLite
* Cheerio
* Axios
* Diff
* Google Gemini API

---

## 📂 Project Structure

```
backend/
│── controllers/
│── db/
│── routes/
│── services/
│── index.js
│── package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone repo

```
git clone <backend-repo-url>
cd backend
```

### 2. Install dependencies

```
npm install
```

### 3. Create `.env`

```
PORT=5000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_api_key_here
```

### 4. Run server

```
npm run dev
```

---

## 🌐 API Endpoints

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| POST   | `/api/add`        | Add new URL       |
| POST   | `/api/check/:id`  | Check for changes |
| GET    | `/api/status/:id` | Get latest status |
| GET    | `/api/links`      | Get all links     |
| DELETE | `/api/delete/:id` | Delete link       |
| GET    | `/api/health`     | System health     |

---

## 🧠 How it Works

1. Fetch website HTML
2. Extract visible text using Cheerio
3. Compare with previous snapshot using diff
4. Detect changes
5. Extract **evidence lines**
6. Generate summary via LLM (if needed)
7. Store everything in database

---

## ⚠️ Notes

* LLM summary depends on API availability
* Large pages are truncated for performance

---

## 📌 Future Improvements

* Use PostgreSQL instead of SQLite
* Add authentication
* UI for historical comparison

---

## 👨‍💻 Author

Onkar Dhingra
