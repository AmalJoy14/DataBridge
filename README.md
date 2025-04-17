# 📦 DataBridge - Bidirectional ClickHouse & Flat File Data Ingestion Tool

DataBridge is a web-based integration tool that enables **bidirectional data transfer** between a ClickHouse database and a flat file (CSV) system. It supports secure authentication, dynamic schema discovery, column selection, efficient ingestion, and detailed reporting.

---

## 🚀 Features

- 🔁 **Bidirectional ingestion** (ClickHouse ↔ CSV)
- 🔐 **JWT-based authentication** for ClickHouse
- 🧠 **Dynamic schema discovery**
- ✅ **Column selection** with real-time updates
- 📊 **Record count reporting**
- ⚙️ Built with **Node.js**, **Express.js**, and **React**

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite  
- **Backend**: Node.js + Express  
- **Database**: ClickHouse  
- **Auth**: JWT (JSON Web Tokens)

---

## 📁 Project Structure

```
DataBridge/
├── backend/
│   ├── Routes/
│   ├── Controllers/
│   ├── utils/
│   ├── .env
│   └── index.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Access to a **ClickHouse** database instance

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/DataBridge.git
cd DataBridge
```

---

### 2️⃣ Configure Environment Variables

Create a `.env` file in the `/backend` directory:

> 🔐 Make sure to keep your `.env` file secure and **never commit it** to version control.

---

### 3️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

### 4️⃣ Run the Application

#### Start Backend Server

```bash
cd backend
npm start
```

#### Start Frontend (Dev Mode)

```bash
cd frontend
npm run dev
```

> 🌐 Navigate to `http://localhost:5173` to access the application.

---

## 🔄 Data Ingestion Flows

### 📤 Flat File → ClickHouse

1. Upload CSV file.
2. Select columns.
3. Choose or create a target ClickHouse table.
4. Ingest and view record count.

### 📥 ClickHouse → Flat File

1. Authenticate via JWT.
2. Select database, table, and columns.
3. Export data to downloadable CSV.

---

## 🧪 Testing

Functional tests were performed using sample datasets (`uk_price_paid`, `ontime`) to validate:

- Authentication
- Schema parsing
- Record counts
- Error handling

---


## 📬 Feedback or Issues?

Feel free to open an issue or drop a PR! Contributions are welcome 🙌

---

## 📄 License

MIT License © 2025
