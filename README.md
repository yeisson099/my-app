# Advisor Dashboard

This project implements an Admin dashboard to manage company advisors. The application allows users to search for advisors based on income, view a list of filtered advisors, see detailed information for each advisor, and perform CRUD (Create, Read, Update, Delete) operations on advisor records through a modal interface.

## Features

- **Income-Based Search:** Search advisors within a specific income range (`income ± 10,000`).
- **Advisor List View:** Display search results in a paginated table (10 advisors per page).
- **Dynamic Filtering:** Filter advisors by name or other text fields on the client-side.
- **Sorting:** Sort advisors by name and income (ascending/descending).
- **Advisor Details:** View comprehensive information for a selected advisor.
- **CRUD Operations:**
  - **Create:** Add new advisors via a modal form.
  - **Edit:** Update existing advisor information via a modal form.
  - **Delete:** Remove advisors from the system.
- **Responsive Design:** Optimized for both mobile and desktop devices.
- **Shareable URLs:** Current state (income search, pagination, sorting) is reflected in the URL, allowing sharing.
- **Error Handling:** Robust error boundaries and a global alert system for user feedback.
- **Loading States:** Utilizes React Suspense with fallbacks for data fetching components.
- **Declarative Schema Validation:** Client-side form validation without external libraries.
- **TypeScript:** Strong typing for improved code quality and maintainability.

## Architecture

The project follows a **Screaming Architecture** approach, organizing code by domain features rather than technical layers.

- **`src/app/`**: Next.js App Router for defining routes, layouts, and pages.
- **`src/components/`**: Reusable React components. Divided into `common` (generic UI elements), `layout` (structure-specific components), and `advisors` (domain-specific components).
- **`src/context/`**: React Context API for global state management (e.g., alerts).
- **`src/hooks/`**: Custom React Hooks for encapsulating reusable logic (e.g., URL query params, form validation, debouncing).
- **`src/lib/`**: Utility functions, API service calls, and validation logic.
- **`src/styles/`**: Global CSS styles and variables using pure CSS. Component-specific styles use CSS Modules.
- **`src/types/`**: TypeScript type definitions.
- **`src/tests/`**: Unit and integration tests.

## How to Run the Project

Follow these steps to get the project up and running locally:

### 1. Start the Backend API

First, ensure you have the `technical-server` running. Navigate to the `technical-server` directory (assuming it's a sibling directory or provided separately) and run:

```bash
cd path/to/your/technical-server
npm install
npm run start
```

### 2. Start the Frontend

```bash
cd path/to/your/my-app
npm install
npm run dev
```
