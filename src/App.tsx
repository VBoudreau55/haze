import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Settings from "./pages/Settings";

const client = generateClient<Schema>();

function App() {
  const auth = useAuth();
  auth.isAuthenticated = true; // For testing purposes TODO: Remove this line
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />
        <Route path="/home" element={auth.isAuthenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={auth.isAuthenticated ? <Settings /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;