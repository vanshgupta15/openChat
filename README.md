# OpenChat — Milestone 1: Foundation & UI

> Real-time public chat rooms frontend prototype with responsive design, room-switching capabilities, and sessionStorage mock state management.

## 1. Project Overview

| Field | Description |
| --- | --- |
| Project Name | OpenChat – Real-Time Public Chat Rooms |
| Milestone Stage | Milestone 1 — Foundation & UI Design |
| Objective | Build the static responsive frontend UI, establish project folder architecture, and implement client-side local session storage routing. |
| Expected Outcome | A fully functional and responsive visual prototype, enabling guest joins, local chat simulation, and sidebar navigation. |

### Expected Milestone 1 Outcomes

- Visual design implementation of all client-side pages.
- Client-side data storage and authentication flow simulator using browser `sessionStorage`.
- Fully responsive sidebar layout supporting desktop, tablet, and mobile views.
- Well-organized folder structure separating the frontend files from future backend assets.

---

## 2. Scope (Milestone 1)

### In Scope

- Guest Mode login card with form inputs.
- Responsive, collapsible chat room sidebar.
- Dynamic color-assigned initials avatar generation.
- Dynamic UI room-switching (updating active room header and highlighters).
- Message posting interface with interactive emoji/attachment actions.
- Client-side validation and toast notification popup indicators.
- Local mock messages and join/leave action simulation.

### Out of Scope (For Future Milestones)

- MongoDB Atlas data persistence.
- Live WebSockets (Socket.IO) message broadcasting.
- Production-grade User Authentication (Firebase Auth).
- Live cloud deployment.

---

## 3. Learning Objectives (Milestone 1)

Students will gain practical experience with:

- Writing structured HTML5 semantic markup.
- Implementing custom CSS3 styling layouts including gradients, active state filters, and typography.
- Designing responsive screens using CSS flexbox, grids, and media query breakpoints.
- Managing client state and page-to-page session routing utilizing `sessionStorage` in Vanilla JS.

---

## 4. Technology Stack (Milestone 1)

| Layer | Technologies | Purpose |
| --- | --- | --- |
| Frontend | HTML5, CSS3, Vanilla JavaScript | Client layout, structural styling, dynamic updates |
| Fonts & Assets | Montserrat, Inter Google Fonts, custom vector SVGs | Premium dark theme typography and UI icon visuals |
| Storage & State | HTML5 Local `sessionStorage` API | User configuration and active room persistence |
| Version Control | Git, GitHub | Version tracking under the `milestone-1` branch |

---

## 5. Core Functionalities (Milestone 1)

### Guest Mode (Completed)
- Input field validation for user display name (3-20 characters).
- Preset room selections (General, JavaScript, Movies, Sports).
- Option to specify and dynamically add custom room names.
- Auto-saving details into the `openchat_user` session variable before redirecting.

### Chat Features (Completed)
- Header displaying current room name with active user count badges.
- Sidebar highlighting the currently active room.
- Dynamic room navigation: Clicking a room updates user context, reloads page, and resets mock chat state.
- Interactive message logs: Submitting messages appends them immediately to the chat viewport.
- Collapsible side navigation for small/mobile viewports.

---

## 6. Database Design (Planned for Milestone 2)

| Collection | Fields | Notes |
| --- | --- | --- |
| `rooms` | `_id`, `roomName`, `createdAt` | Will store room metadata and creation timestamp |
| `messages` | `_id`, `roomId`, `username`, `firebaseUid` (optional), `message`, `createdAt` | Will store chat history per room |

---

## 7. API Summary (Planned for Milestone 3)

### REST APIs (Planned)

| Endpoint | Purpose |
| --- | --- |
| Create Room | Create a new chat room |
| Join Room | Add a user to a room |
| Get Message History | Load room messages |

### Socket.IO Events (Planned)

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

| Milestone | Goal | Deliverables | Status |
| --- | --- | --- | --- |
| **1 — Foundation** | **Set up project structure and UI** | **Git repository, HTML/CSS UI, join room screen, client routing, folder structure** | **[COMPLETED]** |
| 2 — Database Integration | Connect MongoDB and store chat data | MongoDB Atlas connection, room database, save/retrieve message history | [PENDING] |
| 3 — Real-Time Chat | Implement live communication | Socket.IO server setup, live broadcasting, notifications, typing indicators | [PENDING] |
| 4 — Auth & Deployment | Secure app and deploy to cloud | Firebase Authentication, login controls, Render backend, Firebase Hosting | [PENDING] |

---

## 9. Deliverables (Milestone 1)

The following files constitute the Milestone 1 codebase structure:

```text
openChat/
├── backend/
│   └── package.json (Dependency initial layout)
├── frontend/
│   ├── css/
│   │   ├── chat.css (Styles for chat dashboard, message feed, and text inputs)
│   │   ├── common.css (Custom color palette, global scrollbars, button variants, toasts)
│   │   └── join-room.css (Glow backgrounds and join card stylings)
│   ├── images/
│   │   └── logo.png (OpenChat brand mark)
│   ├── js/
│   │   ├── chat.js (UI profile population, sidebar switches, and mock message event logs)
│   │   ├── common.js (Avatar initials parser, toast popups, local storage APIs)
│   │   └── join-room.js (Input validations, custom room creation, guest login form submit)
│   ├── mockups/
│   │   └── join-n-chat-room.png (Visual target mockups)
│   ├── chat.html (Chat interface dashboard markup)
│   └── index.html (Initial entry page markup)
├── .gitattributes
├── .gitignore
└── README.md (This file)
```

---

## 10. How to Run Locally

Since this milestone is a static frontend prototype, no backend server execution is required yet:

1. Clone the repository and checkout the `milestone-1` branch:
   ```bash
   git checkout milestone-1
   ```
2. Open `frontend/index.html` directly in your web browser, or serve it using an editor static server extension (e.g. VS Code's Live Server).
3. Test guest profile login, room navigation via the sidebar, and mock chat messages by typing inside the chat bar.