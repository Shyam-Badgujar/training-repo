import {  Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import Login from "./components/Login.jsx";
import Profile from "./components/profile.jsx";

const App = () => {
  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  return (
    <div className="app-container">
   
        <Routes>
          {/* Login Page */}
          <Route path="/" element={<Login />} />

          {/* Protected Profile Page */}
          <Route
            path="/profile"
            element={
              isAuthenticated ?<Profile/>: <Navigate to="/" />
            }
          />
        </Routes>
   
    </div>
  );
};

export default App;
