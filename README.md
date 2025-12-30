# Smart Issue Board

A production-ready Issue Tracking Application built with React, Vite, and Firebase. This application allows teams to track bugs, feature requests, and tasks with a clean, modern interface.

## 🚀 Tech Stack

- **Frontend Framework**: [React.js](https://react.dev/) (v19)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Authentication**: [Firebase Authentication](https://firebase.google.com/products/auth) (Email/Password)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore) (NoSQL)
- **Routing**: [React Router DOM](https://reactrouter.com/) (v7)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

## ✅ What Has Been Implemented

### 1. Authentication System
- **Secure Login/Signup**: Implemented using Firebase Authentication.
- **Route Protection**: Unauthenticated users are redirected to the login page. Protected routes (`/dashboard`, `/create-issue`) are guarded by a `PrivateRoute` component.
- **Context API**: Global `AuthContext` to manage user state across the application.

### 2. Dashboard
- **Issue Overview**: Displays a card-based grid of all issues.
- **Filtering**: Users can filter issues by **Status** (Open, In Progress, Done) and **Priority** (Low, Medium, High).
- **Responsive Design**: Adapts beautifully to mobile, tablet, and desktop screens.

### 3. Issue Management
- **Create Issue**: A detailed form to report new issues with fields for Title, Description, Priority, and Assignee.
- **Smart Duplicate Detection**: Before saving, the app searches Firestore for similar existing issues and warns the user to prevent duplicates.
- **Edit Issue**: Allows users to update issue details.
- **Status Workflow Rules**: Enforced logic that prevents moving issues directly from "Open" to "Done" without passing through "In Progress".

### 4. Architecture & Best Practices
- **Service Layer**: All Firebase logic is isolated in `src/services/db.js` for clean separation of concerns.
- **Component-Based**: Reusable components like `IssueCard`, `Spinner`, and `Navbar`.
- **Environment Variables**: Sensitive Firebase configuration is loaded via `.env` files.

## 🔄 Working Process

The application follows a standard secure workflow:

1.  **Initialization**: On startup, the app initializes Firebase and checks for a valid user session.
2.  **Access Control**:
    *   If no user is found, the app redirects to `/login`.
    *   If a user is authenticated, they are granted access to the Dashboard.
3.  **Data Flow**:
    *   **Reads**: The Dashboard queries the `issues` collection in Firestore, ordered by creation time.
    *   **Writes**: Creating an issue sends a `POST` request to Firestore. The "Smart Detection" runs a pre-query to check for title similarities.
4.  **State Management**: Complex UI state (like filters and form data) is managed locally with React Hooks (`useState`, `useEffect`), while Auth state is global.

## 🛠️ Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd smart_issue
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Firebase**
    *   Create a `.env` file in the root directory.
    *   Add your Firebase keys (see `.env.example`):
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    ...
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

## 🧠 Project Decisions & Reflections

### 1. Why this Frontend Stack?
- **React.js + Vite**: Chosen for the perfect balance of performance and developer experience. Vite provides instant HMR (Hot Module Replacement), significantly speeding up development compared to Create React App. React's component-based architecture ensures the UI is modular and maintainable.
- **Tailwind CSS (v4)**: Selected for distinct reasons:
    - **Speed**: Utility-first classes allow for rapid prototyping.
    - **Consistency**: Ensures spacing, colors, and typography remain consistent throughout the app.
    - **Modernity**: v4 offers better performance and native CSS variable integration.
- **Firebase**: Acts as a complete backend-as-a-service. It allows us to ship a full-stack capable app without managing server infrastructure, specifically providing secure Authentication and low-latency Database operations out of the box.

### 2. Firestore Data Structure
The database consists of a single collection named `issues`. Each document represents one issue with the following schema:

```json
{
  "id": "auto-generated-id",
  "title": "Fix login bug",          // String
  "description": "...",              // String
  "status": "Open",                  // Enum: "Open" | "In Progress" | "Done"
  "priority": "High",                // Enum: "Low" | "Medium" | "High"
  "assignedTo": "dev@example.com",   // String (Email)
  "createdBy": "admin@example.com",  // String (Email)
  "createdAt": "Timestamp"           // Firestore Timestamp
}
```

### 3. How Similar Issues are Handled
Since Firestore does not support native full-text fuzzy search, I implemented a "Smart Check" on the client side:
1.  When a user types a title in the "Create Issue" form, the app performs a lightweight query to fetch recent issues.
2.  It compares the input title against existing titles using a case-insensitive inclusion check.
3.  If a potential duplicate is found, a **Warning Modal** appears, showing the existing issue's status and title.
4.  The user can then choose to **Cancel** (if it's a duplicate) or **Create Anyway** (if it's distinct).

### 4. Challenges Faced
- **Tailwind v4 Migration**: The ecosystem is currently transitioning to Tailwind v4. Setting up the correct PostCSS configuration and `index.css` theme variables required careful adjustment compared to the older `tailwind.config.js` method.
- **Firestore Search Limitations**: Implementing "Similar Issue Detection" purely backend-side is hard with Firestore's basic query capabilities. I had to balance performance by fetching data and filtering it in the application layer.

### 5. Future Improvements
- **Kanban Board View**: Visualize issues in columns (To Do, Doing, Done) with drag-and-drop functionality.
- **Comments System**: Allow team members to discuss specific issues.
- **Advanced Search**: Integrate Algolia/Meilisearch for true full-text fuzzy search.
- **Email Notifications**: Trigger emails via Cloud Functions when an issue is assigned to a user.
