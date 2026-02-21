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
import CircularLoader from "./components/CircularLoader.jsx";
//store imports
import useGlobalStore from "./store/globalStore.js";
import useAuthStore from "./store/auth/authStore.js";
import VerifyScreen from "./components/VerifyScreen.jsx";

function App() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const otp_token = useAuthStore((state) => state.otp_token);
  const userInfo = useAuthStore((state) => state.userInfo);
  const handleCheckAuth = useAuthStore((state) => state.handleCheckAuth);
  const redirectURL = useGlobalStore((state) => state.redirectURL);
  const handleCheckVT = useAuthStore((state) => state.handleCheckVT);
  const setRedirectURL = useGlobalStore((state) => state.setRedirectURL);
  const theme = useGlobalStore((state) => state.theme);


  const navigate = useNavigate();


  useEffect(() => {
    if(redirectURL){
      navigate(redirectURL);
      setRedirectURL(null);
    }
  }, [redirectURL])


  useEffect(() => {
    async function doSomething(){
      await handleCheckAuth();
      if(!isAuthenticated){
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
