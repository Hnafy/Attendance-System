
# 📘 Attendance System (MERN Stack)

<div align="center">

  <a href="https://github.com/Hnafy/Attendance-System/blob/main/images/image1.png?raw=true">
    <img src="https://github.com/Hnafy/Attendance-System/blob/main/images/image1.png?raw=true" width="400" alt="Dashboard Screenshot">
  </a>

  <br><br>

  <a href="https://github.com/Hnafy/Attendance-System/blob/main/images/image2.png?raw=true">
    <img src="https://github.com/Hnafy/Attendance-System/blob/main/images/image2.png?raw=true" width="400" alt="Attendance Page">
  </a>

</div>




  <h3 align="center">Smart Attendance Management System</h3>

  <p align="center">
    A complete MERN-based system to manage attendance efficiently for lectures and students.
    <br />
    <a href="https://nusc-attendance.netlify.app/"><strong>View Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Hnafy/Attendance-System/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/Hnafy/Attendance-System/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

---

## 🧭 Table of Contents

1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Built With](#built-with)
4. [Getting Started](#getting-started)

   * [Installation](#installation)
   * [Environment Variables](#environment-variables)
5. [Usage](#usage)
6. [Future Enhancements](#future-enhancements)
7. [Contact](#contact)

---

## 🧩 About the Project

The **Attendance System** is a full-featured web application built using the **MERN stack (MongoDB, Express, React, Node.js)**.
It allows administrators and instructors to manage lectures, track attendance, and monitor student statuses — all through an intuitive and responsive interface.

Students can be marked with different attendance **statuses** such as:

* ✅ **Present**
* ❌ **Absent**
* ⚠️ **Suspicious**
* 🚪 **Outside**

Admins can easily **open/close attendance sessions**, **add/update/delete lectures**, and **print attendance reports** for each class.
The system supports **searching and filtering** by categories, classes, and attendance status.

---

## 🚀 Features

* 🔐 **Admin Authentication** (via JWT and Cookies)
* 🧾 **Add, Update, and Delete Lectures**
* 🕒 **Open and Close Attendance Sessions**
* 👨‍🎓 **Track Students’ Attendance Status**
* 🔍 **Search and Filter by Class or Status**
* 🖨️ **Print Attendance Reports**
* 📱 **Responsive UI** built with React and TailwindCSS
* 🌐 **RESTful API** using Express and MongoDB

---

## 🛠️ Built With

* [![React][React.js]][React-url]
* [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
* [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
* [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
* [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)

---

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### 🧩 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hnafy/Attendance-System.git
   ```

2. **Go to frontend folder**

   ```bash
   cd front_end
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create a `.env` file in `/front_end` and add:**

   ```bash
   VITE_BASE_URL = https://your-backend-url.com
   ```

5. **Run the frontend**

   ```bash
   npm run dev
   ```

6. **Go to backend folder**

   ```bash
   cd ../back_end
   ```

7. **Install backend dependencies**

   ```bash
   npm install
   ```

### 🔑 Environment Variables

Create a `.env` file in the `/back_end` directory with the following keys:

```bash
MONGO_URI=your_mongo_connection_string
SECRET_KEY=your_secret_key
PORT=5000
```

8. **Run the backend server**

   ```bash
   nodemon index.js
   ```

---

## 💡 Usage

Once both servers are running:

* Admin logs in to the dashboard.
* Admin can:

  * Add new lectures.
  * Start or close attendance sessions for specific classes.
  * View, search, and filter students by attendance status.
  * Mark attendance manually if needed.
  * Print the attendance sheet directly from the web app.

---

## 🛣️ Future Enhancements

* 📍 **GPS-based Attendance Verification**
* 📊 **Analytics Dashboard for Attendance Trends**
* 📧 **Email Notifications for Absentees**
* 📱 **Mobile App Version**

---

## 📞 Contact

**Ahmed Naser**
[GitHub](https://github.com/Hnafy) • [X](https://x.com/a7med7530)

---

<p align="right">(<a href="#readme-top">Back to top</a>)</p>

---

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/
