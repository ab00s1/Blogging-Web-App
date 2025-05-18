# Project Setup Guide

Follow these steps to set up and run the Blogging Web App:

## 1. Clone the Repository
Clone the project using the following command:
```bash
git clone https://github.com/ab00s1/Blogging-Web-App.git
```

## 2. Set Up the Backend
1. Change directory to the backend folder:
   ```bash
   cd blog-editor-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```

## 3. Set Up the Frontend
1. Open a new terminal and change directory to the frontend folder:
   ```bash
   cd blog-editor-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the frontend:
   ```bash
   npm run build
   ```
4. Preview the frontend:
   ```bash
   npm run preview
   ```

---

After completing these steps, both the backend and frontend servers will be running. You can now use the Blogging Web App locally.

# Tech Stack Used

The Blogging Web App is built using the following technologies:

### Frontend
- **React**: JavaScript library for building user interfaces
- **Vite**: Fast frontend build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: Reusable UI components built with Radix UI and Tailwind CSS

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing blog and user data
- **JWT (JSON Web Token)**: For secure authentication and authorization
- **bcrypt**: Library for hashing passwords securely


# Points of Improvement

- **Desktop-Only Design:** The website is currently optimized for desktop screens. Responsive design for mobile and tablet devices can be implemented for a better user experience across all platforms.
- **Theme Support:** Currently, only a single theme is available. Adding a light/dark theme toggle would enhance user customization.
- **User Profile Integration:** The app does not yet support user profile details. Integrating user profiles (with avatars, bios, etc.) can improve personalization.
- **Notifications:** There is no notification system for user interactions (such as comments or likes on blogs). Implementing notifications would keep users informed about activity on their blogs.

Feel free to contribute or suggest more improvements!