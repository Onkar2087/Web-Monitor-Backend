# 🧠 PROMPTS_USED.md

## 📌 Overview

This document records key prompts used during the development of the Web Monitor project.
Prompts are grouped by development stage and reflect how AI was used to assist in building, debugging, and refining the system.

---

## 🏗️ 1. Project Setup & Architecture

* "How to store snapshots of a webpage in a database?"

---

## 🌐 2. Web Scraping & Content Extraction

* "How to fetch and parse HTML using axios and cheerio?"
* "How to extract only visible text from a webpage?"
* "How to remove script and style tags using cheerio?"
* "How to clean and normalize scraped text?"

---

## 🔍 3. Diff Detection Logic

* "How to compare two versions of text in Node.js?"
* "How to use diffLines to detect changes?"
* "How to filter only added and removed lines from diff output?"
* "How to structure diff data for frontend display?"

---

## 🧠 4. Evidence Extraction

* "How to extract meaningful lines from diff results?"
* "How to limit diff output to only important changes?"
* "How to store extracted evidence in database?"
* "How to display evidence clearly in UI?"

---

## 🤖 5. LLM Integration (Gemini)

* "How to use Google Gemini API in Node.js?"
* "How to generate a summary from diff text?"
* "How to design prompts for concise summaries?"
* "How to handle LLM errors gracefully?"

---

## 🌍 6. Deployment Preparation

* "What changes are needed before deployment?"

---

## 📝 Notes

* Prompts evolved iteratively during development
* AI suggestions were not directly copied — they were tested and refined
* Final implementation includes manual debugging and validation

---

## 🎯 Summary

AI was used as a **development assistant**, not a replacement for understanding.
Each feature was validated through testing and iteration before being finalized.

---

## 👨‍💻 Author

Onkar Dhingra
