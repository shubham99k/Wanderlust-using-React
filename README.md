# 🌍 Wanderlust

A full-stack travel accommodation listing platform where users can discover, share, and review unique stays around the world — built with **Express**, **MongoDB**, and **React**.

![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Seeding](#database-seeding)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Browse Listings** — Explore travel accommodations with real-time search by title, location, or country
- **CRUD Operations** — Create, read, update, and delete listings with image uploads
- **Image Uploads** — Cloudinary-powered image storage with drag-and-drop support
- **User Authentication** — Secure signup/login with Passport.js local strategy and session management
- **Reviews & Ratings** — Leave star ratings (1–5) and comments on listings; interactive hover-based star picker
- **User Profiles** — Personal dashboard showing your listings, reviews, and activity stats
- **Authorization** — Only listing owners can edit/delete their listings; only review authors can delete their reviews
- **Responsive Design** — Mobile-first UI with collapsible navbar, lazy-loaded images, and smooth animations
- **Flash Notifications** — Toast-style feedback for all user actions
- **Form Validation** — Server-side Joi validation and client-side input checks

---

## Tech Stack

### Backend

| Technology               | Purpose                         |
| ------------------------ | ------------------------------- |
| **Node.js + Express 5**  | REST API server                 |
| **MongoDB + Mongoose 8** | Database & ODM                  |
| **Passport.js**          | Authentication (local strategy) |
| **Cloudinary + Multer**  | Image upload & storage          |
| **Joi**                  | Request body validation         |
| **express-session**      | Session management              |
| **connect-mongo**        | MongoDB session store           |

### Frontend

| Technology             | Purpose                  |
| ---------------------- | ------------------------ |
| **React 19**           | UI library               |
| **Vite 7**             | Build tool & dev server  |
| **React Router DOM 7** | Client-side routing      |
| **Context API**        | Global state management  |
| **CSS Modules**        | Component-scoped styling |

---

## Project Structure

```
wanderlust/
├── backend/                  # Express API server
│   ├── app.js                # Entry point — server config, middleware, routes
│   ├── cloudConfig.js        # Cloudinary + Multer storage setup
│   ├── middleware.js          # Auth, ownership, validation middleware
│   ├── schema.js             # Joi validation schemas
│   ├── package.json          # Backend dependencies
│   ├── controllers/          # Route handler logic
│   │   ├── listings.js       # Listing CRUD controllers
│   │   ├── reviews.js        # Review create/delete controllers
│   │   └── users.js          # Auth & profile controllers
│   ├── models/               # Mongoose schemas
│   │   ├── listing.js        # Listing model
│   │   ├── review.js         # Review model
│   │   └── user.js           # User model (passport-local-mongoose)
│   ├── routes/               # Express route definitions
│   │   ├── listing.js        # /listings routes
│   │   ├── review.js         # /listings/:id/reviews routes
│   │   └── user.js           # /signup, /login, /logout, /users/me
│   ├── utils/                # Helper utilities
│   │   ├── ExpressError.js   # Custom error class
│   │   └── wrapAsync.js      # Async error wrapper
│   ├── init/                 # Database seeding
│   │   ├── data.js           # Sample listing data (25 entries)
│   │   └── index.js          # Seed script
│   ├── views/                # EJS templates (legacy)
│   └── public/               # Static assets (legacy)
│
├── frontend/                 # React SPA (Vite)
│   ├── index.html            # HTML entry point
│   ├── vite.config.js        # Vite config with API proxy
│   ├── package.json          # Frontend dependencies
│   └── src/
│       ├── App.jsx           # Root component with client-side routing
│       ├── main.jsx          # React DOM entry
│       ├── context/
│       │   └── AppContext.jsx # Global state (auth, flash messages)
│       ├── pages/
│       │   ├── listings/     # Listing pages (Index, Show, New, Edit)
│       │   ├── users/        # Auth pages (Login, Signup, Profile)
│       │   └── StaticPages.jsx # Error, Privacy, Terms pages
│       ├── components/
│       │   ├── includes/     # Navbar, Footer, ListingCard, Flash, ConfirmDialog
│       │   └── layouts/      # Boilerplate layout wrapper
│       └── utils/
│           └── api.js        # API client (fetch wrapper)
│
├── package.json              # Root scripts for managing both apps
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18 (recommended: 22.x)
- **MongoDB** — local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- **Cloudinary** account — [sign up free](https://cloudinary.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/wanderlust.git
cd wanderlust

# Install all dependencies (backend + frontend)
npm run install:all
```

Or install individually:

```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/wanderlust
SECRET=your_session_secret_here
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

> **Note:** For local development, you can use `mongodb://127.0.0.1:27017/wanderlust` as the `ATLASDB_URL`.

### Database Seeding

Populate the database with 25 sample listings:

```bash
npm run seed
```

### Running the App

Start both servers in separate terminals:

```bash
# Terminal 1 — Backend (port 8080)
npm run dev:backend

# Terminal 2 — Frontend (port 5173)
npm run dev:frontend
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> The Vite dev server proxies API requests to the Express backend automatically.

---

## API Reference

### Authentication

| Method | Endpoint    | Description              | Auth |
| ------ | ----------- | ------------------------ | ---- |
| POST   | `/signup`   | Register a new user      | No   |
| POST   | `/login`    | Log in                   | No   |
| GET    | `/logout`   | Log out                  | No   |
| GET    | `/me`       | Get current session user | No   |
| GET    | `/users/me` | Get user profile & stats | Yes  |

### Listings

| Method | Endpoint        | Description          | Auth  |
| ------ | --------------- | -------------------- | ----- |
| GET    | `/listings`     | Get all listings     | No    |
| GET    | `/listings/:id` | Get a single listing | No    |
| POST   | `/listings`     | Create a new listing | Yes   |
| PUT    | `/listings/:id` | Update a listing     | Owner |
| DELETE | `/listings/:id` | Delete a listing     | Owner |

### Reviews

| Method | Endpoint                          | Description     | Auth   |
| ------ | --------------------------------- | --------------- | ------ |
| POST   | `/listings/:id/reviews`           | Add a review    | Yes    |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete a review | Author |

---

## Screenshots
<img width="1920" height="1080" alt="Screenshot (818)" src="https://github.com/user-attachments/assets/5d73bfd8-d58c-4b5f-9a6a-6cb6fb205d9e" />
<br/>
<img width="1920" height="1080" alt="Screenshot (819)" src="https://github.com/user-attachments/assets/95d86b8c-5625-4ca6-a493-dc58f41b9bea" />
<img width="1920" height="1080" alt="Screenshot (820)" src="https://github.com/user-attachments/assets/9a1805bb-f6da-422a-9ef1-0c95bc0e8dcd" />
<img width="1920" height="1080" alt="Screenshot (821)" src="https://github.com/user-attachments/assets/11dbed51-bd24-4d89-9da3-8130b425bbf1" />
<img width="1920" height="1080" alt="Screenshot (822)" src="https://github.com/user-attachments/assets/77fdec63-a089-4b49-8af8-5a216b809573" />
<img width="1920" height="1080" alt="Screenshot (823)" src="https://github.com/user-attachments/assets/7b721648-dc0c-4d87-b42f-522365632548" />
<img width="1920" height="1080" alt="Screenshot (824)" src="https://github.com/user-attachments/assets/7a681e5a-c7a0-4380-a24b-3d7c0d5afa8d" />






---

## Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---


<p align="center">
  Built with ❤️ by <strong>Shubham</strong>
</p>
