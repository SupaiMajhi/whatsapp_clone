import { Routes, Route, Navigate, useNavigate, redirect } from "react-router-dom";
import { useEffect, useState } from "react";

//components imports
import HomePage from './pages/HomePage.jsx';
import AuthPage from "./pages/AuthPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import StatusPage from "./pages/StatusPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import CircularLoader from "./components/CircularLoader.jsx";
//store imports
import useGlobalStore from "./store/globalStore.js";
import useAuthStore from "./store/authStore.js";
import VerifyScreen from "./components/VerifyScreen.jsx";
import useAppStore from "./store/appStore.js";

function App() {

  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const otp_token = useAuthStore((state) => state.otp_token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const handleCheckAuth = useAuthStore((state) => state.handleCheckAuth);
  const handleCheckVT = useAuthStore((state) => state.handleCheckVT);
  const isProfileComplete = useAppStore((state) => state.isProfileComplete);
  const redirectURL = useGlobalStore((state) => state.redirectURL);
  const setRedirectURL = useGlobalStore((state) => state.setRedirectURL);
  const theme = useGlobalStore((state) => state.theme);

  const navigate = useNavigate();
  console.log("isAuthenticated", isAuthenticated, "isProfileComplete", isProfileComplete);

  useEffect(() => {
    if(redirectURL){
      navigate(redirectURL);
    }
  }, [redirectURL]);


  useEffect(() => {
    async function  doSomething() {
      await handleCheckAuth();
      if(isAuthenticated === false){
        await handleCheckVT();
      }
    }
    doSomething();
  }, [isAuthenticated, otp_token])

  if(isLoading){
    return <CircularLoader className={`w-screen h-screen ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`} />
  }

  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && !isProfileComplete ? (
              <Signup />
            ) : isAuthenticated && isProfileComplete ? (
              <HomePage />
            ) : (
              <Navigate to='/auth' />
            )}
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
            path="profile"
            element={
              isAuthenticated ? <ProfilePage /> : <Navigate to='/auth' />
            }
          />
        </Route>



        <Route path="/auth" element={<AuthPage />}>
            {/**check verification_token */}
          <Route
            index
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
              ) : !isAuthenticated && !otp_token ? (
                <Navigate to="/auth" />
              ) : isAuthenticated && !otp_token ? (
                <Navigate to="/" />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          <Route
            path="/auth/user/create"
            element={
              isAuthenticated && !isProfileComplete ? (
                <Signup />
              ) : isAuthenticated && isProfileComplete ? (
                <Navigate to="/" />
              ) : !isAuthenticated && !isProfileComplete ? (
                <Navigate to="/auth" />
              ) : (
                <Navigate to="/profile" />
              )}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
