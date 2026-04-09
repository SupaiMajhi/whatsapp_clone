
import { create } from "zustand";
import axios from "axios";

import countries from "../../../country.js";

import useGlobalStore from "../globalStore.js";
import useAppStore from "../appStore.js"


const useAuthStore = create((set) => ({

  isAuthenticated: false,
  alpha2: countries[0].alpha2,
  isLoading: true,
  otp_token: null,

  setAlpha2: (value) => {
    set({ alpha2: value });
  },

  handleLogin: async (data) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/otp`,
        {
          content: { phone: data.phone },
        },
        { withCredentials: true },
      );
      useGlobalStore.setState({ message: response.data.message });
      useGlobalStore.setState({
        otp_token: response.data.data.verification_token
      });
      useGlobalStore.setState({ redirectURL: response.data.data.redirect_url });
    } catch (error) {
      console.log(error.response);
      console.log("handleLogin", error.response.data);
      useGlobalStore.setState({
        otp_token: error.response.data.error.data.verification_token,
      });
      useGlobalStore.setState({
        redirectURL: error.response.data.error.data.redirect_url,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  handleVerify: async (data) => {
    try {
      set({ isLoading: true });
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/auth/otp/verify`, {
        content: { otp:data }
      }, {
        withCredentials: true
      });
      if(response?.data?.data?.redirect_url){
        useGlobalStore.setState({ redirectURL: response?.data?.data?.redirect_url });
      }
      if(response.data?.data?.user){
        useAppStore.setState({ userInfo: response?.data?.data?.user });
      }
      set({ isAuthenticated: response.data?.data?.isVerified });
    } catch (error) {
      // If status === 429
      if(error.response.status === 429){
        console.log(error.response.data);
      }
      
      useGlobalStore.setState({ message: error.response.data.error.message });
      if(error.response.data.error.data.redirect_url){
        useGlobalStore.setState({ redirectURL: error.response.data.error.data.redirect_url })
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
      useAppStore.setState({ userInfo: response.data?.data?.user });
      set({ isAuthenticated: response.data.data.user.isVerified });
    } catch (error) {
      set({ userInfo: null });
      set({ isAuthenticated: false });
      console.log('handleCheckAuth', error.response.data);
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
      set({
        otp_token: response.data.data.verification_token,
      });
      useGlobalStore.setState({ redirectURL: response.data?.data?.redirectURL});
    } catch (error) {
      set({ otp_token: null });
      useGlobalStore.setState({ message: error.response.data.error.message });
      // If redirectURL === true
      if(error.response.data.error?.data?.redirect_url){
        useGlobalStore.setState({
          redirectURL: error.response.data.error.data.redirect_url
        }); 
      }
      console.log("handleCheckVT", error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
