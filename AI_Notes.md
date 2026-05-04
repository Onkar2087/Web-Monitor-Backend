# 🤖 AI_NOTES.md

## 📌 Overview

This project was developed with the assistance of AI tools to accelerate development, clarify concepts, and improve code quality.

All AI-generated suggestions were **reviewed, tested, and validated manually** before being included in the final implementation.

---

## 🧠 Where AI Was Used

### 1. Architecture & Planning

* Suggestions for separating frontend and backend repositories
* API design patterns

---

### 2. Backend Development

* Diff logic using `diffLines`
* Snapshot storage design
* LLM integration

---

### 3. Frontend Development

* Diff visualization improvements

---

### 4. Debugging & Issue Resolution

* Fixing API mismatches
* Handling async issues
* Handling backend connectivity failures gracefully

---

### 5. Documentation & Deployment

* README structure
* Deployment guidance (Render + Vercel)
* Environment variable handling best practices

---

## 🔍 What Was Verified Manually

The following aspects were **not blindly accepted from AI** and were carefully validated:

### ✔ Backend Logic

* API endpoints tested via frontend and manual requests
* Diff generation correctness verified with real websites
* Evidence extraction confirmed to match diff output

---

### ✔ Frontend Behavior

* UI responsiveness tested across screen sizes
* State updates verified (add, delete, check)
* Error handling tested (backend down, invalid URLs)
* Navigation flow validated

---

### ✔ Integration

* End-to-end flow tested:
* Add link → Check → Diff → Summary → Evidence
* Backend and frontend communication verified
* Environment variables tested locally and in deployment scenarios

---

### ✔ Edge Cases Tested

* First-time snapshot (no previous data)
* No-change scenarios
* Large webpage handling (content truncation)
* API failure (LLM unavailable / backend down)
* Invalid URL input

---

## ⚠️ What Was NOT Fully Automated

* UI design decisions (manually adjusted for clarity)
* Final logic refinements (e.g., evidence handling, diff filtering)
* Deployment configuration (manually verified)

---

## 🎯 Key Engineering Decisions

* **Content truncation** to improve performance and reduce API cost
* **Evidence layer** added to improve explainability of changes
* **Graceful degradation** when LLM is unavailable
* **SQLite usage** for simplicity

---

## 🧠 Reflection

AI significantly accelerated development, but the final implementation reflects:

* Manual debugging
* Iterative refinement
* Practical decision-making

The goal was not just to generate code, but to **understand and validate the system end-to-end**.

---

## 👨‍💻 Author

Onkar Dhingra
