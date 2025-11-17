🍬 Sweet Shop – MERN Stack Application

A simple, clean, and fully functional Sweet Inventory & Management App built using the MERN stack with Test-Driven Development (TDD).

This project manages sweets, their stock, purchases, user authentication, and admin controls — all wrapped inside a responsive, modern UI.

⭐ Overview

Sweet Shop is a full-stack web application where:

Users can browse sweets, search them, and purchase items.

Admins can add, edit, delete, and restock sweets.

Everything uses JWT-based authentication.

The full application (frontend + backend) is built using TDD (Red → Green → Refactor).

✨ Features
👤 Authentication

Signup and Login

JWT token stored securely

Auto-login using saved token

AuthGuard for protecting pages

Role-based authorization (Admin / User)

🍭 Sweet Management (Admin Only)

Add a new sweet

Edit details

Delete sweet

Restock quantity

Real-time updates on dashboard

🛒 Inventory System

“Purchase” button decreases quantity

Disabled automatically when quantity reaches zero

Out-of-stock indicator

Fully tested with TDD

🔍 Search & Filters

You can search sweets by:

name

category

price range

Instant updates, no page reload.

📊 Dashboard

Displays all sweets in a clean list

Shows price, category, available quantity

Buttons for purchase, delete, restock

Admin-only functions are hidden for normal users

🧪 Test-Driven Development (TDD)

This project was built strictly using TDD:

🔴 RED

Write failing tests for:

Dashboard

Purchase

Search

Delete

Restock

Add/Edit sweet

AuthContext

AuthGuard

Login/Register

🟢 GREEN

Implement the smallest code to pass the tests:

UI components

API requests

Context logic

Buttons & state updates

🔵 REFACTOR

Clean all code:

Extract AuthGuard

Remove unnecessary checks

Improve readability

Clean dashboard logic

Stable test mocks

All tests pass successfully.
This means the system is stable, predictable, and well-architected.

🛠️ Tech Stack
Frontend

React (Vite)

TailwindCSS

Context API

Axios

React Router

Vitest + React Testing Library

Backend

Node.js + Express

MongoDB + Mongoose

JWT Auth

Bcrypt

🔌 API Endpoints
Auth

POST /api/auth/register

POST /api/auth/login

Sweets

GET /api/sweets

POST /api/sweets (Admin)

PUT /api/sweets/:id (Admin)

DELETE /api/sweets/:id (Admin)

Inventory

POST /api/sweets/:id/purchase

POST /api/sweets/:id/restock (Admin)

Search

GET /api/sweets/search?name=...&category=...&minPrice=...&maxPrice=...

📁 Project Structure (Simple View)
frontend/
 ├── src/
 │   ├── pages/
 │   ├── components/
 │   ├── context/
 │   ├── guards/
 │   ├── services/
 │   └── _tests_/

backend/
 ├── controllers/
 ├── routes/
 ├── models/
 ├── middleware/
 ├── config/
 └── server.js

▶️ How to Run the Project
1️⃣ Clone the repo
git clone <your-repo-url>

2️⃣ Install backend dependencies
cd backend
npm install
npm run dev

3️⃣ Install frontend dependencies
cd frontend
npm install
npm run dev

4️⃣ Run tests
npm test

🎨 UI & UX Highlights

Clean and simple dashboard

Fully responsive

Highlighted out-of-stock items

Easy interactions

Minimalistic design

📌 Future Improvements (Optional)

Pagination on dashboard

Image upload for sweets

Dark mode

Admin analytics dashboard

👦 Author

Ayush Dubey
MCA Student @ MANIT Bhopal