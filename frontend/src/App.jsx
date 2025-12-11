import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import StatusPage from "./pages/StatusPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

//store imports
import useAuthStore from "./store/authStore.js";
import useUserStore from "./store/userStore.js";

function App() {

  const user = useAuthStore((state) => state.user);
  const handleCheckAuth = useAuthStore((state) => state.handleCheckAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const getPrevChatList = useUserStore((state) => state.getPrevChatList);

  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChatSelected, setIsChatSelected] = useState(false);
  

  useEffect(() => {
    if(user){
      setIsAuthenticated(true);
    }else{
      setIsAuthenticated(false);
    }
  }, [user]);

  
  useEffect(() => {
    handleCheckAuth();
    getPrevChatList();
  }, [isAuthenticated])

  return (
    <div className="w-screen h-screen">
    {/** yet implement loading page */}
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to='/login' />} >
          <Route index element={<ChatPage isChatSelected={isChatSelected} setIsChatSelected={setIsChatSelected} />} />
          <Route path="status" element={<StatusPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="/login" element={!user ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to='/' />} />
      </Routes>
    </div>
  )
}

export default App
