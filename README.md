# User Management Dashboard

A modern and responsive User Management Dashboard built with React and Vite that supports complete CRUD operations using the JSONPlaceholder REST API.

## Live Demo

Live Application:
https://user-management-dashboard-mmxias24z.vercel.app

GitHub Repository:
https://github.com/varshitha246/user-management-dashboard

---

## Features

* View users in a structured table
* Real-time search functionality
* Dynamic filtering
* Sorting by multiple fields
* Pagination support
* Add new users
* Edit existing users
* Delete users with confirmation
* Form validation
* Error handling
* Responsive design
* Dark mode support
* CSV Import functionality
* CSV Export functionality
* Local storage persistence

---

## Tech Stack

* React.js
* Vite
* JavaScript (ES6+)
* Axios
* CSS Modules
* React Hooks

---

## API Used

JSONPlaceholder Users API:

https://jsonplaceholder.typicode.com/users

---

## Installation

Clone the repository:

```bash
git clone https://github.com/varshitha246/user-management-dashboard.git
```

Navigate to project directory:

```bash
cd user-management-dashboard
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Project Structure

```text
src/
│
├── api/
│   └── userService.js
│
├── components/
│   ├── Header.jsx
│   ├── SearchBar.jsx
│   ├── FilterPopup.jsx
│   ├── UserTable.jsx
│   ├── UserRow.jsx
│   ├── UserForm.jsx
│   ├── Pagination.jsx
│   └── ConfirmDelete.jsx
│
├── hooks/
│   └── useUsers.js
│
├── utils/
│   ├── validators.js
│   ├── helpers.js
│   ├── constants.js
│   └── pagination.js
│
├── styles/
│
├── App.jsx
└── main.jsx
```

---

## Engineering Assumptions

* The JSONPlaceholder API provides a single `name` field. It is split into `firstName` and `lastName` during initialization.
* The API does not provide department information, so departments are assigned dynamically.
* JSONPlaceholder is a mock API and does not persist create, update, or delete operations.
* Local state management and localStorage are used to simulate persistent CRUD behavior.

---

## Challenges Faced

* Handling non-persistent API responses from JSONPlaceholder.
* Maintaining consistency between search, filtering, sorting, and pagination.
* Mapping API data to the required assignment schema.
* Ensuring responsive layouts across different screen sizes.
* Managing local persistence while synchronizing with API data.

---

## Future Improvements

If given more time, the following improvements could be implemented:

* Backend database integration for persistent CRUD operations.
* User authentication and authorization.
* Server-side pagination and sorting.
* Bulk actions for multiple users.
* Advanced filtering options.
* Unit and integration testing.
* Audit logs and activity history.
* Real-time synchronization using WebSockets.

---

## Assignment Requirements Covered

* Fetch users from API
* Display users in a table
* Search users
* Filter users
* Sort users
* Pagination
* Add user
* Edit user
* Delete user
* Validation
* Error handling
* Responsive UI
* API integration

---

## Author

**Varshitha Kagithala**

B.Tech Computer Science (Cyber Security)

Princeton Institute of Engineering and Technology for Women
