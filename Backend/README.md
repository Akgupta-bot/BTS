# 🏦 BTS - Banking Transaction System

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express.js](https://img.shields.io/badge/Express.js-Framework-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-red)
![License](https://img.shields.io/badge/License-MIT-yellow)

A secure banking transaction backend built using **Node.js**, **Express.js**, and **MongoDB**, implementing **Double-Entry Bookkeeping**, **Idempotent Transactions**, **JWT Authentication**, and **Email Notifications**.

---

# 📖 Overview

BTS (Banking Transaction System) was built to simulate a real-world banking system using double-entry bookkeeping and secure transaction processing.

The project demonstrates backend engineering concepts commonly used in financial systems:

* Secure Authentication
* Double Entry Ledger
* Transaction Processing
* Account Management
* Idempotent APIs
* Email Notifications
* Role-Based Authorization
* Token Blacklisting

---

# 🏗 System Architecture

```text
                     ┌───────────────────┐
                     │   React Frontend  │
                     └─────────┬─────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Express API      │
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
 ┌─────────────┐     ┌──────────────┐     ┌────────────────┐
 │ JWT Auth    │     │ Transactions │     │ Email Service  │
 └─────────────┘     └──────┬───────┘     └────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Ledger System│
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ MongoDB      │
                    └──────────────┘
```

---

# 🚀 Features

## Authentication

* User Registration
* User Login
* User Logout
* JWT Authentication
* Cookie-Based Authentication
* Token Blacklisting
* Role-Based Authorization
* System User Support

---

## Account Management

* Create Account
* View Accounts
* Check Account Balance
* Account Status Tracking

Account statuses:

* ACTIVE
* FROZEN
* CLOSED

---

## Transaction Processing

* Money Transfer
* Initial Fund Transfer
* Idempotency Support
* Transaction Status Tracking

Transaction statuses:

* PENDING
* COMPLETED
* FAILED
* REVERSED

---

## Ledger Management

* Double Entry Bookkeeping
* Immutable Ledger Entries
* Credit/Debit Tracking
* Real-Time Balance Calculation

Ledger Types:

* CREDIT
* DEBIT

---

## Notifications

* Registration Email
* Successful Transaction Email
* Failed Transaction Email

---

# 🔒 Security Features

## JWT Authentication

Secure access tokens are generated during login.

---

## Password Hashing

Passwords are encrypted using:

```text
bcrypt
```

---

## Token Blacklisting

Logged-out tokens are stored in a blacklist collection.

Prevents reuse of invalidated JWTs.

---

## System User Authorization

Certain endpoints can only be accessed by:

```text
systemUser = true
```

Examples:

```http
POST /api/transaction/system/initial-funds
```

---

# 💳 Double Entry Bookkeeping

Every transaction generates:

## Debit Entry

```text
Sender Account
      |
      ▼
   DEBIT
```

## Credit Entry

```text
Receiver Account
      |
      ▼
   CREDIT
```

Example:

```text
A transfers ₹1000 to B

A → DEBIT ₹1000
B → CREDIT ₹1000
```

Balance is calculated from ledger entries instead of storing balance directly.

---

# 🗄 Database Design

## User

```javascript
{
  _id,
  name,
  email,
  password,
  systemUser
}
```

---

## Account

```javascript
{
  _id,
  userId,
  status,
  currency
}
```

---

## Transaction

```javascript
{
  _id,
  fromAccount,
  toAccount,
  amount,
  idempotencyKey,
  status
}
```

---

## Ledger

```javascript
{
  _id,
  account,
  amount,
  transaction,
  type
}
```

---

## Token Blacklist

```javascript
{
  _id,
  token
}
```

---

# 📂 Folder Structure

```text
BTS
│
├── src
│   ├── config
│   │   └── db.js
│   │
│   ├── controller
│   │   ├── auth.controller.js
│   │   ├── account.controller.js
│   │   └── transaction.controller.js
│   │
│   ├── middleware
│   │   └── auth.middleware.js
│   │
│   ├── models
│   │   ├── user.model.js
│   │   ├── account.model.js
│   │   ├── transaction.model.js
│   │   ├── ledger.model.js
│   │   └── blacklist.model.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   │
│   └── services
│       └── email.services.js
│
├── server.js
├── package.json
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Akgupta-bot/BTS.git
```

```bash
cd BTS
```

---

## Install Dependencies

```bash
npm install
```

---

## Create Environment Variables

Create:

```text
.env
```

Add:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

CLIENT_ID=your_google_client_id

CLIENT_SECRET=your_google_client_secret

REFRESH_TOKEN=your_google_refresh_token
```

---

## Start Development Server

```bash
npm run dev
```

---

## Start Production Server

```bash
npm start
```

---

# 🌐 API Documentation

Base URL:

```text
http://localhost:3000/api
```

---

# Authentication APIs

## Register User

```http
POST /auth/register
```

### Request

```json
{
  "email":"user@gmail.com",
  "name":"John Doe",
  "password":"password123"
}
```

---

## Login

```http
POST /auth/login
```

### Request

```json
{
  "email":"user@gmail.com",
  "password":"password123"
}
```

---

## Logout

```http
POST /auth/logout
```

---

# Account APIs

## Create Account

```http
POST /account
```

Authentication Required

---

## Get User Accounts

```http
GET /account
```

Authentication Required

---

## Get Balance

```http
GET /account/balance/:accountId
```

Authentication Required

---

# Transaction APIs

## Transfer Money

```http
POST /transaction
```

### Request

```json
{
  "fromAccount":"ACCOUNT_ID",
  "toAccount":"ACCOUNT_ID",
  "amount":2000,
  "idempotencyKey":"unique-uuid"
}
```

---

## Initial Funds Transfer

```http
POST /transaction/system/initial-funds
```

System User Only

### Request

```json
{
  "toAccount":"ACCOUNT_ID",
  "amount":10000,
  "idempotencyKey":"unique-uuid"
}
```

---

# 🔄 Transaction Lifecycle

```text
Request Received
       │
       ▼
Validate Accounts
       │
       ▼
Validate Balance
       │
       ▼
Check Idempotency
       │
       ▼
Create Transaction (PENDING)
       │
       ▼
Create Debit Ledger
       │
       ▼
Create Credit Ledger
       │
       ▼
Update Transaction (COMPLETED)
       │
       ▼
Send Email Notification
```

---

# 📬 Postman Collections

Import the provided collections:

* Authentication Collection
* Accounts Collection
* Transaction Collection

Steps:

```text
Postman
  → Import
  → Upload Collection JSON
  → Run Requests
```

---

# 🧪 Testing

Recommended Flow:

```text
Register User
     ↓
Login User
     ↓
Create Account
     ↓
Initial Fund Transfer
     ↓
Check Balance
     ↓
Transfer Money
     ↓
Verify Balance
```

---

# 🚧 Future Roadmap

* Transaction History API
* Admin Dashboard
* OTP Verification
* Password Reset
* UPI Integration
* Razorpay Integration
* Analytics Dashboard
* Mobile Application
* Scheduled Payments
* Fraud Detection Module
* Multi-Currency Support
* Beneficiary Management

---

# 👨‍💻 Author

### Anurag Kumar Gupta

GitHub:

https://github.com/Akgupta-bot

---

# 🎯 Purpose

This project was built as a Resume Project to demonstrate:

* Backend Development
* REST API Design
* Authentication & Authorization
* MongoDB Modeling
* Double Entry Bookkeeping
* Financial Transaction Processing
* Secure System Design

---

# ⭐ Support

If you found this project useful:

* Star the repository
* Fork the repository
* Contribute improvements

---

# 📄 License

This project is licensed under the MIT License.
