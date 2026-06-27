# OpenChat — Product Requirements Document (PRD)

> Real-time public chat rooms with message persistence, Firebase authentication, and cloud deployment.

## 1. Project Overview

| Field | Description |
| --- | --- |
| Project Name | OpenChat – Real-Time Public Chat Rooms |
| Project Type | Mini Project / Proof of Concept (POC) |
| Objective | Build a real-time public group chat application using Node.js, Express.js, Socket.IO, MongoDB, and Vanilla JavaScript. |
| Expected Outcome | A fully working chat app, GitHub repository, live deployment, and practical backend development experience. |

### Expected Student Outcomes

- Fully working real-time chat application
- Public GitHub repository
- Live deployed application
- Hands-on experience with backend concepts

---

## 2. Scope

### In Scope

- Public chat rooms
- Real-time messaging
- Message persistence
- Online user presence
- Join / leave notifications
- Firebase authentication
- Cloud deployment

### Out of Scope

- Private messaging
- Voice/video calling
- File sharing
- Message encryption
- Admin panel

---

## 3. Learning Objectives

Students will gain practical experience with:

- HTML5, CSS3, Bootstrap / Tailwind CSS, Vanilla JavaScript
- Express.js, REST APIs, Socket.IO
- MongoDB, Mongoose
- Firebase Authentication and Firebase Hosting
- Render deployment
- Git, GitHub, and environment variables
- Real-time communication and cloud deployment

---

## 4. Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | HTML5, CSS3, Bootstrap or Tailwind CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB Atlas, Mongoose |
| Authentication | Firebase Authentication (Email & Password Sign Up, Login, Logout) |
| Hosting | Firebase Hosting (frontend), Render (backend) |
| Version Control | Git, GitHub |

---

## 5. Core Functionalities

### Guest Mode

- Join any public room
- Enter a display name
- Start chatting instantly

### Authenticated Mode

- Sign up
- Login
- Logout
- Display authenticated user information

### Chat Features

- Create / join room
- Real-time messaging
- Message history loading
- Online users list
- Join notification
- Leave notification

### Stretch Features

- Typing indicator
- Emoji support
- Dark mode
- Responsive design

---

## 6. Database Design

| Collection | Fields | Notes |
| --- | --- | --- |
| `rooms` | `_id`, `roomName`, `createdAt` | Stores room metadata and creation timestamp |
| `messages` | `_id`, `roomId`, `username`, `firebaseUid` (optional), `message`, `createdAt` | Stores chat history per room |

---

## 7. API Summary

### REST APIs

| Endpoint | Purpose |
| --- | --- |
| Create Room | Create a new chat room |
| Join Room | Add a user to a room |
| Get Message History | Load room messages |

### Socket.IO Events

| Event | Purpose |
| --- | --- |
| `join-room` | User joins a room |
| `send-message` | User sends a chat message |
| `receive-message` | Broadcast message to room members |
| `user-joined` | Notify when a user enters |
| `user-left` | Notify when a user leaves |
| `typing` | Indicate a user is typing |
| `stop-typing` | Indicate typing has stopped |

---

## 8. Project Milestones

| Milestone | Goal | Deliverables | Outcome |
| --- | --- | --- | --- |
| 1 — Foundation | Set up project structure and UI | Git repository, Express server, HTML UI, join room screen, folder structure | Users can open the app and access join room page |
| 2 — Database Integration | Connect MongoDB and store chat data | MongoDB Atlas connection, room management, store messages, load previous messages | Users can join a room and view stored history |
| 3 — Real-Time Chat | Implement live communication | Socket.IO server/client, live messaging, join/leave notifications, online users | Multiple users can chat in real time |
| 4 — Authentication & Deployment | Secure app and deploy to cloud | Firebase Authentication, sign up/login/logout, Firebase Hosting, Render backend deployment | Users can authenticate and use deployed app |

### Milestone Concepts

- Milestone 1: Express.js, static files, Bootstrap / Tailwind, Git, GitHub
- Milestone 2: MongoDB, Mongoose, CRUD operations, REST APIs
- Milestone 3: WebSockets, event-driven programming, real-time communication
- Milestone 4: Firebase Authentication, user identity, environment variables, cloud deployment, production configuration

---

## 9. Final Deliverables

Students should submit:

- GitHub repository
- Live project URL
- Source code
- README
- Project screenshots
- Short demo video (optional)

---

## 10. Project Architecture

```text
HTML + Bootstrap / Tailwind
            │
            ▼
    Vanilla JavaScript
            │
 REST APIs + Socket.IO
            │
            ▼
   Node.js + Express.js
            │
     ┌──────┴─────────┐
     │                │
     ▼                ▼
MongoDB Atlas   Firebase Authentication
            │
            ▼
Frontend → Firebase Hosting
Backend  → Render
```

---

## 11. Learning Outcomes

By the end of this project, students will understand:

- How to plan a software project
- How frontend and backend communicate
- How REST APIs and WebSockets work together
- How MongoDB stores application data
- How Firebase Authentication secures applications
- How to deploy a full-stack application
- How to use Git and GitHub in a real project
- How to present a portfolio-ready project during interviews