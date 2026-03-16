import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

// store imports
import useAuthStore from "../store/auth/authStore.js";
import useGlobalStore from "../store/globalStore.js";

import { phoneSchema } from "../schema/validationSchema.js";
import PrimaryButton from "./PrimaryButton.jsx";
import CountrySelect from "./CountrySelect.jsx";
import countries from "../../country.js";

const Login = () => {
  const country = useAuthStore((state) => state.country);
  const handleLogin = useAuthStore((state) => state.handleLogin);
  const isLoading = useAuthStore((state) => state.isLoading);
  const theme = useGlobalStore((state) => state.theme);


  return (
    <form >
      
    </form>
  );
};

export default Login;
