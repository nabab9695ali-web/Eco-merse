# 🌿 EcoMerse — Full-Stack MERN E-Commerce Platform

> **Author**: Nabab Ali ([@nabab9695ali-web](https://github.com/nabab9695ali-web))  
> **Contact**: nabab9695ali@gmail.com  
> **Tech Stack**: MongoDB Atlas, Express.js, React (Vite), Node.js, REST API, JWT, Vanilla CSS Design System

---

## 🌟 Key Features

1. **User Authentication & Profiles**:
   - JWT Auth with bcrypt password hashing.
   - Profile management with editable addresses and order history.
   - Demo 1-click accounts for instant review.

2. **Catalog & Store Discovery**:
   - Multi-facet filters (Category, Price Slider, In-Stock, Eco-Choice, Ratings).
   - Real-time search with live suggestions dropdown.
   - Quick View Modal & Dedicated Product detail page with multi-image gallery.
   - Customer ratings & review submission system.

3. **Shopping Bag & Checkout Flow**:
   - LocalStorage + DB-synced cart.
   - Coupon Engine (`ECO20` - 20% off, `NABAB50` - 50% off, `WELCOME10` - 10% off).
   - Multi-step checkout (Address -> Payment method selection [UPI, Card, COD] -> Summary).
   - Confetti celebration animation upon placing order.

4. **Order Tracking**:
   - Real-time tracking timeline (Order Placed $\to$ Processing $\to$ Shipped $\to$ Delivered).

5. **Admin Portal**:
   - Revenue, Orders, Products, and User analytics dashboard.
   - Product Catalog CRUD (Add product, edit prices/stock, delete).
   - Order fulfillment & status updates.
   - Discount Promo Code manager.

6. **Design & Aesthetics**:
   - Seamless Dark / Light Mode with CSS custom properties.
   - Glassmorphism, micro-animations, mobile responsive drawers.

---

## 🚀 Demo Credentials

- **Admin Account**:
  - **Email**: `nabab9695ali@gmail.com`
  - **Password**: `project1234`
- **Customer Demo**:
  - **Email**: `priya@example.com`
  - **Password**: `password123`

---

## 🛠️ Local Development

### 1. Clone the repository
```bash
git clone https://github.com/nabab9695ali-web/Eco-merse.git
cd Eco-merse
```

### 2. Install dependencies & Seed MongoDB Atlas
```bash
npm install --prefix server
npm install --prefix client
node server/seeder.js
```

### 3. Start Development Servers
```bash
# In one terminal (Backend):
cd server && npm run dev

# In second terminal (Frontend):
cd client && npm run dev
```

Frontend runs on: `http://localhost:3000`  
Backend API runs on: `http://localhost:5000`

---

## ☁️ Deploy to Render in 3 Steps

1. **Push to your GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: complete EcoMerse MERN platform"
   git remote add origin https://github.com/nabab9695ali-web/Eco-merse.git
   git branch -M main
   git push -u origin main
   ```

2. **Create Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com/) $\to$ **New Web Service**.
   - Connect your `Eco-merse` repository.
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

3. **Add Environment Variables on Render**:
   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | `mongodb+srv://Nabab:project1234@cluster0.gytxecs.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0` |
   | `JWT_SECRET` | *(any random 32-character secret)* |
   | `ADMIN_EMAIL` | `nabab9695ali@gmail.com` |

---

## 📜 License
MIT License. Created with ❤️ by Nabab Ali.
