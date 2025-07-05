# 🚀 Twibue Backend 🎥🐦

Twibue is a modern backend API that fuses the best of YouTube and Twitter — empowering users to post short messages and share video content. Built for scalability and modularity, Twibue is the perfect foundation for your next full-stack social media project.

> ⚠️ **Note:** This is a backend-only project for learning and portfolio purposes. It demonstrates clean API structure, file handling, and essential social media features.

---

## ✨ Features

- 📝 **Tweet-like posts:** Create and retrieve short text updates
- 🎬 **Video sharing:** Upload, stream, and fetch videos
- 💬 **Comment system:** Engage with videos and tweets
- 👍 **Like/unlike:** Express appreciation for content
- 📁 **File uploads:** Robust handling with Multer
- 👤 **User authentication:** Secure registration & login
- 📺 **Dashboard:** Channel/user stats and uploads
- 🎵 **Playlists:** Create and manage video playlists
- 🔄 **Subscriptions:** Follow your favorite channels
- 🗃️ **MongoDB/Mongoose:** Powerful data modeling
- 📄 **RESTful API:** Clean, modular Express.js structure

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js** — Fast, scalable server
- **MongoDB** & **Mongoose** — Flexible NoSQL database
- **Multer** — File upload middleware
- **Dotenv** — Environment variable management
- **Cors** — Cross-origin resource sharing
- **Nodemon** — Live development

---

## 🗂️ API Modules & Routers

| Route                | Description                                 |
|----------------------|---------------------------------------------|
| `/api/user`          | User registration, login, profile           |
| `/api/tweet`         | Tweet CRUD                                  |
| `/api/video`         | Video CRUD & streaming                      |
| `/api/comment`       | Comment on videos/tweets                    |
| `/api/subscription`  | Subscribe/unsubscribe to channels           |
| `/api/like`          | Like/unlike videos and tweets               |
| `/api/dashboard`     | Channel/user dashboard (stats, uploads)     |
| `/api/playlist`      | Playlist creation, update, delete, fetch    |

---

## 📦 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/Mohammed-Ghayaz/twibue-backend.git
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` and fill in your variables
4. **Run the server:**
   ```bash
   npm run dev
   ```

---

# 🙋‍♂️ Author
Developed by **Z Mohammed Ghayaz**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-blue?logo=linkedin)](https://www.linkedin.com/in/mohammed-ghayaz/) [![GitHub](https://img.shields.io/badge/GitHub-black?logo=github)](https://github.com/Mohammed-Ghayaz)
