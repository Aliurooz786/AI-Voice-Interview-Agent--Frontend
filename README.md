# Voxy - An AI Voice Interview Agent (Frontend)

This is the frontend application for **Voxy**, a full-stack project designed to conduct dynamic, conversational voice interviews. It is built with **React**, **Vite**, and **Tailwind CSS**.

This application connects to a secure Spring Boot backend (running separately) to:
* Authenticate users (Recruiters/Candidates) via JWT & Google OAuth2.
* Allow recruiters to create interviews by providing a job description and duration.
* Fetch AI-generated "topics" (the interview agenda) from the backend's Gemini API.
* Conduct real-time, voice-based interviews using the **Vapi.ai** agent, which follows the generated topic-based agenda.

### Backend Repository
**Note:** This is a frontend-only repository. To run this project, you **must** have the corresponding backend server running locally.
* **Backend Link:** [AI-Voice-Interview-Agent--Backend](https://github.com/Aliurooz786/AI-Voice-Interview-Agent--Backend)

---

## 🚀 Tech Stack

* **Framework:** React 19 (with Vite)
* **Styling:** Tailwind CSS
* **Routing:** React Router v7
* **API Client:** Axios (with Interceptors)
* **Icons:** Heroicons
* **Voice AI:** Vapi.ai Web SDK
* **Deployment:** Vercel (planned)

---

## ✨ Features

* **Full Authentication:** Secure Login & Registration (JWT-based).
* **Google OAuth2:** Seamless sign-in with Google.
* **Dynamic Dashboard:** Fetches and displays a list of recently created interviews.
* **Interview Creation:** A clean form to create new interviews (Job Position, Description, Duration).
* **Topic-Based Interviews:** Connects to a backend that generates dynamic "topics" (not static questions) for a real, conversational flow.
* **Real-Time AI Session:** A full-screen "meeting" UI where the Vapi.ai agent ("Voxy") conducts the interview based on the generated topics.

---

## 🛠️ Getting Started (Installation & Setup)

Follow these steps to get the project running locally.

### 1. Prerequisites

* [Node.js](https://nodejs.org/) (v18 or newer)
* [Git](https://git-scm.com/)
* The **Backend Server** (from the link above) must be running on `http://localhost:8080`.

### 2. Clone & Install

```bash
# 1. Clone the repository
git clone [https://github.com/Aliurooz786/AI-Voice-Interview-Agent--Frontend.git](https://github.com/Aliurooz786/AI-Voice-Interview-Agent--Frontend.git)

# 2. Navigate into the project directory
cd AI-Voice-Interview-Agent--Frontend

# 3. Install all necessary dependencies
npm install