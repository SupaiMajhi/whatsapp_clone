import { create } from "zustand";
import axios from "axios";
import useGlobalStore from "../globalStore.js";

const useAuthStore = create((set) => ({
  userInfo: null,
  isAuthenticated: false,
  country: null,
  isLoading: false,
  otp_token: null,

  setCountry: (value) => {
    set({ country: value });
  },

  handleLogin: async (data) => {
    const setError = useGlobalStore.getState().setError;
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/otp/get-otp`,
        {
          content: { ...data },
        },
        { withCredentials: true },
      );
      useGlobalStore.setState({ message: response.data.message });
      useGlobalStore.setState({
        otp_token: response.data.data.verification_token,
      });
      if(response.data?.data?.redirectURL){
        useGlobalStore.setState({ redirectURL: response.data.data.redirectURL });
      }
    } catch (error) {
      console.log("handleLogin", error.response.data.message);
      setError(error);
      useGlobalStore.setState({
        otp_token: error.response.data.data.verification_token,
      });
      useGlobalStore.setState({
        redirectURL: error.response.data.data.redirectURL,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  handleVerify: async (data) => {
    console.log('data', data)
    try {
      set({ isLoading: true });
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/otp/verify`, {
        content: {...data}
      }, {
        withCredentials: true
      });
      if(response.data?.data?.redirectURL){
        useGlobalStore.setState({ redirectURL: response.data.data.redirectURL });
      }
      if(response.data?.data?.user){
        set({ userInfo: response.data.data.user });
      }
      set({ isAuthenticated: response.data?.data?.isVerified });
    } catch (error) {
      // If status === 429
      if(error.response.status === 429){
        console.log(error.response.data);
      }
      
      //If redirectURL === true
      if(error.response.data?.data?.redirectURL){
        useGlobalStore.setState({ redirectURL: error.response.data.data.redirectURL})
      }
      console.log("handleVerify", error.response.data.message);
      set({ isAuthenticated: false });
      set({ userInfo: null });
    } finally {
      set({ isLoading: false });
    }
  },

  handleCheckAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/check-auth`,
        {
          withCredentials: true,
        },
      );
      set({ userInfo: response.data?.data?.user });
      set({ isAuthenticated: response.data.data.user.isVerified });
    } catch (error) {
      console.log(error);
      set({ userInfo: null });
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  handleCheckVT: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/check-vt`,
        { withCredentials: true },
      );
      useGlobalStore.setState({
        otp_token: response.data.data.verification_token,
      });
      useGlobalStore.setState({ redirectURL: response.data?.data?.redirectURL});
    } catch (error) {
      console.log("handleCheckVT", error.response.data.message);
      useGlobalStore.setState({ otp_token: null });

      // If redirectURL === true
      if(error.response.data?.data?.redirectURL){
       useGlobalStore.setState({
          redirectURL: error.response.data.data.redirectURL,
        }); 
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
