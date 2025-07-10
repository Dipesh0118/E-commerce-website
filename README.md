# 🛒 ElectroCart – E-commerce Platform for Electronics
## Overview

In an overcrowded online marketplace, it’s often difficult to find reliable electronics. **ElectroCart** bridges that gap. It’s a one-stop shop for curated gadgets and consumer electronics. With detailed specs, a clean UI, and easy navigation, users can add items to their cart and checkout with just a few clicks — no confusion, no clutter.

The site features a **fully functional frontend** built with **React + DaisyUI**, and a **robust backend** using **Node.js, Express, and MongoDB**. It includes secure user authentication and an intuitive **admin panel** to manage inventory, update orders, and view sales insights.

---

## 🚀 Features

### 🧑‍💻 For Shoppers
- Browse curated electronics with detailed specs
- Add to cart, manage quantity, and checkout
- View past orders and order details
- User authentication and profile management

### 🛠️ For Admins
- Login-secured admin panel
- Add, edit, and remove products
- View and update order status
- Sales and product analytics dashboard

---
## 🖼️ Project Screenshots

### 1. Homepage
<img src="./homepage.png" alt="Homepage" width="100%"/>

---
### 2. Checkout Page
<img src="./Screenshot 2025-04-30 at 15.42.54.png" alt="Checkout Page" width="100%"/>

---
### 3. Admin Dashboard Overview
<img src="./Screenshot 2025-05-02 at 01.31.32.png" alt="Admin Dashboard" width="100%"/>

---
### 4. Admin Product Management
<img src="./Screenshot 2025-05-02 at 01.59.01.png" alt="Admin Product Management" width="100%"/>

---

## 🧰 Tech Stack

| Tech       | Description                            |
|------------|----------------------------------------|
| React      | Frontend framework                     |
| DaisyUI    | UI components and styling              |
| Node.js    | Server-side runtime                    |
| Express.js | Web framework for backend APIs         |
| MongoDB    | NoSQL database for products/orders     |
| JWT        | Authentication and route protection    |
| Chart.js / Recharts | Data visualization in admin panel |

---

## 🛠️ Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/ElectroCart.git
cd ElectroCart

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp .env.example .env
# Add your MongoDB URI, JWT_SECRET, etc.

# Run the project
npm run dev # From backend folder (runs both frontend and backend concurrently)
