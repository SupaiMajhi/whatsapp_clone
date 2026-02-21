import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";

//components imports
import HomePage from './pages/HomePage.jsx';
import WelcomeBanner from "./components/WelcomeBanner.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Signup from './components/Signup.jsx';
import ChatPage from "./pages/ChatPage.jsx";
import StatusPage from "./pages/StatusPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Login from "./components/Login.jsx";
//store imports
import useGlobalStore from "./store/globalStore.js";
import useAuthStore from "./store/auth/authStore.js";
import VerifyScreen from "./components/VerifyScreen.jsx";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const otp_token = useAuthStore((state) => state.otp_token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const redirectURL = useGlobalStore((state) => state.redirectURL);
  const handleCheckAuth = useAuthStore((state) => state.handleCheckAuth);
  const setRedirectURL = useGlobalStore((state) => state.setRedirectURL);
  const handleCheckVT = useAuthStore((state) => state.handleCheckVT);


  const navigate = useNavigate();

  console.log("otp_token", otp_token)
  console.log(isAuthenticated)


  useEffect(() => {
    if(redirectURL){
      navigate(redirectURL);
      // setRedirectURL(null);
    }
  }, []);

  useEffect(() => {
    async function doSomething(){
      await handleCheckAuth();
      await handleCheckVT();
    }
    doSomething();
  }, [isAuthenticated, otp_token])

  return (
    <div className="w-screen h-screen">
      {/** yet implement loading page */}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to='/auth' />
          }
        >
          <Route index element={
              isAuthenticated ? <ChatPage /> : <Navigate to='/auth' />
            } 
          />

          <Route
            path="status" element={
              isAuthenticated ? <StatusPage /> : <Navigate to='/auth' />
            }
          />

          <Route
            path="settings"
            element={
              isAuthenticated ? <SettingsPage /> : <Navigate to='/auth' />
            }
          />

          <Route
            path="profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to='/auth' />
            }
          />
        </Route>



        <Route path="/auth" element={<AuthPage />}>
          <Route 
            index 
            element={
              !isAuthenticated ? <WelcomeBanner /> : <Navigate to='/' />
          } />

          <Route
            path="get_otp"
            element={
              !otp_token && !isAuthenticated ? (
                <Login />
              ) : !isAuthenticated && otp_token ? (
                <Navigate to="/auth/verify" />
              ) : isAuthenticated && !otp_token ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="verify"
            element={
             !isAuthenticated && otp_token ? (
              <VerifyScreen />
             ) : isAuthenticated && !otp_token ? (
              <Navigate to='/' />
             ) : !isAuthenticated && !otp_token ? (
              <Navigate to='/auth/get_otp' />
             ) : (
              <Navigate to='/' />
             )
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
