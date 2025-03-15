import { useAuth } from "react-oidc-context";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Settings from "./pages/Settings";


function App() {
  const auth = useAuth();

  const handleLogout = async () => {
    // Remove the user from local session
    await auth.removeUser();
    
    // Then redirect to Cognito’s logout endpoint
    const clientId = "78e46q6f25uu1gahoqbjilqt9c";
    const logoutUri = "https://main.d1sdgkd4wd9p19.amplifyapp.com/";
    const cognitoDomain = "https://us-east-1zakuadvhr.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar handleLogout={handleLogout} />
      <div style={{ flex: 1 }}>
        {auth.isLoading ? (
          <div>Loading authentication...</div>
        ) : (
          <Router>
            <Routes>
              <Route
                path="/"
                element={<Landing isAuth={auth.isAuthenticated} handleSignIn={auth.signinRedirect} />}
              />
              <Route
                path="/home"
                element={auth.isAuthenticated ? <Home /> : <Navigate to="/" />}
              />
              <Route path="/about" element={<About />} />
              <Route
                path="/settings"
                element={auth.isAuthenticated ? <Settings /> : <Navigate to="/" />}
              />
            </Routes>
          </Router>
        )}
      </div>
    </div>
  );
  
}

export default App;