# CSE471_Project  
## ISP Management System  

**Course:** CSE471 – System Analysis and Design  
**Semester:** Spring 2025  
**Project Type:** Full-Stack Web Application  

---

## 📌 Project Overview

The **ISP Management System** is a full-stack web application developed as part of the **CSE471** course.  
The system manages the complete workflow of an Internet Service Provider, including users, subscriptions, payments, support services, technician assignments, reviews, and service feedback.

This project focuses on applying **system analysis concepts**, real-world workflows, and proper functional requirement implementation.

---

## 🧑‍🤝‍🧑 User Roles

### 👤 User
- Register and log in
- Purchase internet packages
- Make payments
- View active subscriptions
- Submit support/service requests
- Track technician assignment and service status
- Leave **package reviews** with star ratings
- Provide **service feedback** after service completion

### 🛠️ Admin
- Manage users
- Manage packages
- Approve or reject payments
- Handle support and service requests
- Assign technicians
- Update service status (pending → in-progress → solved)
- Complete installation/service tasks
- View all user service feedback
- Live update system data without page refresh

---

## ⚙️ Core Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (User / Admin)

### 📦 Package & Subscription Management
- Multiple internet packages
- One active subscription per user
- Automatic plan activation after payment

### 💳 Payment System
- bKash demo payment support
- Cash payment approval by admin
- Payment status tracking

### 🧰 Support & Service Management
- User support requests
- Technician assignment for installation and service
- Service lifecycle tracking
- Automatic technician release after task completion

### ⭐ Reviews & Feedback
- **Plan Reviews**
  - 1–5 star rating
  - Anonymous or username-based
- **Service Feedback**
  - Satisfaction level (Satisfied / Neutral / Not Satisfied)
  - Optional feedback message
  - One feedback per completed service
  - Admin feedback dashboard with color indicators

### 🔄 Live Updates
- Admin actions update UI instantly
- No manual page refresh required

---

## 🛠️ Technology Stack

### Frontend
- React (Vite)
- React Router
- Tailwind CSS + DaisyUI
- SweetAlert2
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- JWT Authentication

### Tools
- Git & GitHub
- Postman
- MongoDB Compass
- Vercel (deployment ready)

---

## 📁 Project Structure

```text
CSE471_Project/
│
├── client/              # Frontend (React)
│   ├── src/
│   │   ├── Admin/
│   │   ├── Pages/
│   │   ├── Routes/
│   │   ├── context/
│   │   └── services/
│
├── server/              # Backend (Express)
│   ├── index.js
│
└── README.md


2️⃣ Run Backend
- cd server
- npm install
- npm run dev

  
3️⃣ Run Frontend
- cd client
- npm install
- npm run dev

  
🔑 Environment Variables (Server)

Create a .env file in the server folder:

DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
JWT_SECRET=your_secret_key
PORT=5000
