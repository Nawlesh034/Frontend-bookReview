// main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import App from './App.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/Home.jsx';
import AddBook from './components/AddBook.jsx';
import BookDetail from './components/BookDetail.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // 🧩 layout component with <Navbar /> and <Outlet />
    children: [
      {
        index: true,
        element: <Home />, // ✅ Home page content
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Signup />,
      },
      {
        path: "add-book",
        element: (
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        ),
      },
      {
        path: "book/:id",
        element: <BookDetail />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
