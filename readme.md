# 🏷️ Tag My Idea

**Tag My Idea** is a community-driven platform where users can **share**, **upvote**, and **browse** creative ideas — whether they’re for products, startups, or side projects. The platform emphasizes *interest-based discovery* over simple recency, helping the most exciting ideas surface naturally.

🔗 **Live Demo**: [tagmyidea.vercel.app](https://tagmyidea.vercel.app)  
📦 **Backend Repo**: [GitHub – tagMyIdea---backend](https://github.com/Shashank12-03/tagMyIdea---backend)

---

## 🚀 What’s Inside

This project was built with a backend-first mindset but delivered as a full-stack product. It features:

### 🧠 Features

- 🗳️ **Upvote system** – Rank ideas based on popularity.
- 📝 **Idea posting** – Share your product/startup thoughts.
- 🎯 **Personalized feed** – Smart ranking via scheduled jobs.
- 👤 **User authentication** – JWT-based login & signup.
- 🔄 **Background tasks** – Scheduled with Agenda.js (Mongo-based).
- 📬 **Message queues** – Efficient batched feed updates.
- ⚙️ **Frontend built with Bolt AI + manual logic** – Context API, interaction handling, conditional rendering.

---

## 🛠️ Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| **Frontend** | React (with Bolt AI), Context API  |
| **Backend**  | Node.js, Express.js                |
| **Database** | MongoDB                            |
| **Queue**    | Custom queue-based system (Mongo)  |
| **Jobs**     | Agenda.js                          |
| **Auth**     | JWT-based authentication           |
| **Hosting**  | Vercel (Frontend), GCP (Backend)   |
| **Monitoring** | Structured logging, GCP Metrics  |

---

## 📌 Project Highlights

- ✅ Clean and **scalable backend architecture** (modular routes, services, DB layers)
- ⚡ **Efficient bulk write operations** using message queues
- ⏰ **Scheduled feed updates** for better user experience using Agenda.js
- 🧩 Built end-to-end as a solo project – showing **full-stack versatility**
- 📈 Carefully **balanced performance and modularity** to match real-world product behavior

---

## 🧪 Local Setup

Clone the repos and follow the steps below:

### Backend

```bash
git clone https://github.com/Shashank12-03/tagMyIdea---backend
cd tagMyIdea---backend
npm install
npm run dev
