# RiskWatch RTM - Real-Time Transaction Monitoring Dashboard

RiskWatch RTM is a production-quality, feature-rich web application designed to simulate a real-world tool for monitoring financial transactions in real-time. It provides a comprehensive suite of features for risk analysts and administrators to detect, investigate, and manage potentially fraudulent activities as they happen.

This project serves as a complete, interactive frontend demonstration. It is built with a modern tech stack and showcases best practices in UI/UX design, state management, and component architecture for complex data-driven applications.

---

## ✨ Core Features

*   **Real-Time Dashboard:** A high-level overview of key performance indicators (KPIs) like transaction volume, open alerts, high-risk transaction counts, and average risk scores, all updating in real-time.
*   **Live Transaction Feed:** A continuously updating stream of incoming transactions, providing immediate visibility into financial flows.
*   **Advanced Filtering & Search:** A powerful and intuitive filtering sidebar on the Transactions page to drill down into specific data segments based on time range, risk level, amount, country, and more.
*   **Detailed Transaction Analysis:** Click on any transaction to open a detailed drawer view, showing a complete summary, merchant/customer information, and a full risk analysis, including triggered rules.
*   **Alerts & Case Management:** A dedicated queue for all flagged transactions, allowing analysts to manage and prioritize investigations.
*   **Rules & Watchlists Engine:** A complete interface to view and manage the risk rules that power the system and monitor watchlisted entities.
*   **Advanced Analytics & Reporting:** A page with sophisticated data visualizations, including risk score trends, geographic heatmaps, and categorical analysis to uncover deeper insights.
*   **User & System Administration:** A settings page for managing users, roles, and system-wide configurations.
*   **Responsive Design:** A clean, modern UI built with Tailwind CSS that is fully responsive and accessible on various screen sizes.
*   **Simulated Real-Time Backend:** The application uses a simulated WebSocket context to generate a continuous stream of transactions and alerts, creating a realistic user experience without needing a live backend.

---

## 🚀 Tech Stack

*   **Framework:** [React](https://reactjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Routing:** [React Router](https://reactrouter.com/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **State Management:** React Context API
*   **Data Visualization:** [Recharts](https://recharts.org/)
*   **Icons:** [Lucide React](https://lucide.dev/)

---

## 🔧 How It Works: Architecture Overview

This application is designed as a standalone frontend that can be easily connected to any backend service.

### Frontend (This Application)

The React application you see is responsible for all UI rendering, user interaction, and state management. It's a complete presentation layer.

### Backend Simulation

To provide a realistic "live" experience, the application includes a simulated backend stream.

*   **File:** `context/SocketContext.tsx`
*   **Mechanism:** This context uses a `setInterval` function to generate new mock transactions and alerts every few seconds.
*   **Event Emitter:** It mimics a WebSocket client by using a simple event emitter (`on`, `off`, `emit`) to push this new data to the rest of the application. The `AppContext` then subscribes to these events and updates the global state.

This approach allows the entire application to be fully interactive and demonstrate its real-time capabilities without requiring any external dependencies.

---

## 🔌 How to Connect to a Real Backend

To adapt this project for your own use, you would replace the backend simulation with real API and WebSocket connections.

1.  **WebSocket Connection:**
    *   **Modify `context/SocketContext.tsx`:** Remove the `setInterval` simulation logic.
    *   **Implement a real client:** Use a library like `socket.io-client` or the native browser `WebSocket` API to connect to your backend's WebSocket server.
    *   **Listen for events:** Your backend should emit events like `new_transaction` and `new_alert`. Your client will listen for these and use the `emit` function to pass the data to the app.

2.  **API Endpoints:**
    *   **Modify `context/AppContext.tsx`:** Replace the mock logic in functions like `login`, `createManualAlert`, etc., with `fetch` or `axios` calls to your REST API endpoints.
    *   **Initial Data Fetching:** Implement logic to fetch initial datasets (e.g., historical transactions, existing alerts) from your API when the application loads.

---

## 👨‍💻 Getting Started & Login

This is a fully self-contained demo. No installation or setup is required to run it.

To explore the application, use one of the following pre-configured user accounts:

*   **Role: Analyst**
    *   **Email:** `analyst@riskwatch.com`
    *   **Password:** (any password will work)

*   **Role: Admin**
    *   **Email:** `admin@riskwatch.com`
    *   **Password:** (any password will work)

The application will automatically log you in and direct you to the dashboard.

---

## 📂 Project Structure

The codebase is organized into a logical and scalable structure:

/
├── components/ # Reusable UI components (e.g., Button, Card, DataTable)
│ ├── auth/
│ ├── charts/
│ ├── filters/
│ ├── layout/
│ └── ui/
├── constants.tsx # App-wide constants (nav items, styles, etc.)
├── context/ # Global state management (AppContext, SocketContext)
├── hooks/ # Custom React hooks (e.g., useAppContext)
├── lib/ # Utility functions (cn, formatting, etc.)
├── pages/ # Top-level page components for each route
├── types.ts # All TypeScript type definitions and interfaces
├── App.tsx # Main application component with routing
└── index.tsx # Entry point of the React application
