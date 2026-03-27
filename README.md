# 📦 Inventory & Sales Management System

> A full-stack web application for small to medium-sized businesses to efficiently manage products, suppliers, sales, and operational performance.

---

## 🖼️ Preview

| Landing Page | Login Page | Dashboard |
|---|---|---|
## Landing Page
<img width="1920" height="962" alt="landing" src="https://github.com/user-attachments/assets/c7d281e7-160b-4ba7-b8ff-837ade845feb" />
## SignUp Page
<img width="1920" height="911" alt="sign up" src="https://github.com/user-attachments/assets/decef50a-fc8a-43e2-811a-11900fa22030" />
## Dashboard
<img width="1920" height="974" alt="dashboard" src="https://github.com/user-attachments/assets/1a63e061-115c-43ca-9efb-59b288ea8b39" />

---

## 🌐 Project Overview

The system is built as a modern, scalable web application combining a robust backend API with a clean, professional dashboard interface for real-time business insights.

**Primary goals:**

- Manage products and inventory
- Track sales transactions
- Monitor stock levels in real time
- Analyze business performance and revenue
- Provide a clean, professional dashboard for decision-making

The system consists of:

- A **public landing page** (product overview & access point)
- A **secure dashboard** for managing business operations
- A **RESTful API backend** powering all business logic

---

## 🧱 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React | UI framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Redux Toolkit | State management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | Server & API |
| MySQL | Relational data (business logic) |
| MongoDB | Authentication & user management |
| JWT | Secure authentication |

### Cloud & Hosting
| Service | Purpose |
|---|---|
| Railway | Backend & MySQL hosting |
| AWS S3 *(optional)* | File storage |

---

## 🗂️ Core Features

### 📦 Inventory Management
- Add, update, and delete products
- Track stock quantities
- Prevent sales when stock is insufficient
- Automatic stock reduction after sales

### 🏢 Supplier Management
- Manage supplier records
- Link suppliers to products (one-to-many relationship)
- Prevent duplicate supplier entries

### 💰 Sales Management
- Record sales transactions
- Handle multiple products per sale
- Automatically calculate total sales amount
- Maintain transactional integrity

### 👥 Organizational Structure
- Manage employees
- Assign employees to departments
- Track performance per department

### 📊 Reports & Analytics
- Total revenue calculation
- Sales by product
- Sales by date
- Department-level performance insights

---

## 🧠 Database Design

The system uses **MySQL** (relational) with structured relationships:

```
suppliers  ──< products       (one-to-many)
sales      ──< sale_items     (one-to-many)
products   ──< sale_items     (many-to-many via junction table)
departments ──< employees     (one-to-many)
```

**Key concepts implemented:**
- Primary & Foreign Keys
- JOIN Queries
- Aggregate Functions (`SUM`, `COUNT`)
- **Database Triggers** for:
  - Stock validation
  - Auto stock reduction
  - Auto sales total calculation

---

## 🔐 Authentication

- JWT-based authentication
- Secure login system powered by MongoDB
- Protected API routes
- Middleware-based access control

---

## 🔗 API Endpoints

### Suppliers
```
GET    /suppliers
GET    /suppliers/:supplier_id
POST   /suppliers
PUT    /suppliers/:supplier_id
DELETE /suppliers/:supplier_id
```

### Products
```
GET    /products
GET    /products/:product_id
POST   /products
PUT    /products/:product_id
DELETE /products/:product_id
```

### Sales
```
GET    /sales
GET    /sales/:sale_id
POST   /sales
DELETE /sales/:sale_id
```

### Reports
```
GET    /reports/sales-by-date
GET    /reports/sales-by-product
GET    /reports/total-revenue
```

---

## 📁 Environment Variables

Create a `.env` file in your backend root:

```env
PORT=5000

# MySQL (Local)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_db

# Railway (Production)
DATABASE_URL=your_railway_mysql_url

# MongoDB (Auth)
MONGO_URI=your_mongodb_connection

# JWT
JWT_SECRET=your_secret
```

---

## ▶️ Running the Project Locally

### Backend

```bash
npm install
npm run dev
```

### Database Setup

1. Create a MySQL database
2. Run your schema:

```sql
CREATE TABLE suppliers (...);
CREATE TABLE products (...);
CREATE TABLE sales (...);
CREATE TABLE sale_items (...);
```

3. Ensure triggers are added for:
   - Stock validation
   - Auto stock updates
   - Sales calculations

---

## ☁️ Deployment

- **Backend** deployed on [Railway](https://railway.app)
- **MySQL** hosted on Railway
- Environment variables configured via the Railway dashboard

---

## 🛠️ Maintenance Notes

- Modular **MVC architecture** (models, controllers, routes)
- Easy to extend with new features
- Scalable database structure
- Clean separation of concerns

---

## 📈 Future Improvements

- [ ] Role-based access control (Admin / Staff)
- [ ] Advanced analytics dashboard (charts)
- [ ] Notifications & alerts (low stock)
- [ ] Export reports (PDF / Excel)
- [ ] Real-time updates (WebSockets)

---

## 📄 License

This project is for **educational and portfolio purposes**.  
Feel free to use it as a reference or extend it for your own applications.
