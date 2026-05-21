import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//store imports
import useGlobalStore from "../store/globalStore.js";
import useAuthStore from "../store/authStore.js";

import { profileSetupSchema } from "../utils/validators/yupValidator.js";
import PlusIcon from "../assets/PlusIcon.jsx";
import Logo from "../assets/Logo.jsx";
import TextLogo from "../assets/TextLogo.jsx";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { types } from "../utils/validators/yupValidator.js";

const Signup = () => {

  const [previewImage, setPreviewImage] = useState(null);

  const fileRef = useRef(null);
  const theme = useGlobalStore((state) => state.theme);
  const handleProfileUpdate = useAuthStore((state) => state.handleProfileUpdate);
  const isLoading = useAuthStore((state) => state.isLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(profileSetupSchema),
  });

  const fileRegister = register("profilePic");

  const handleOnSubmit = async (data) => {
    await handleProfileUpdate(data);
  };

  const handleOnChange = (e) => {
    fileRegister.onChange(e);

    const file = e.target.files[0];
    if(file && types.includes(file.type)){
      let url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  }

  useEffect(() => {
    return () => {
      if(previewImage){
        URL.revokeObjectURL(previewImage);
      }
    }
  }, [ previewImage ]);

  return (
    <div
      className={`w-screen h-screen overflow-hidden py-5 px-10 select-none ${theme === "dark" ? "bg-dark text-txtLight" : "bg-light text-txtDark"}`}
    >
      <div className="w-full text-green-500 flex justify-start items-center space-x-1">
        <Logo className="size-7" />
        <TextLogo />
      </div>

      <div className="w-full h-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          encType="multipart/form-data"
          className="flex flex-col items-center justify-center space-y-5"
        >
          <h3
            className={`tracking-wide ${theme === "dark" ? "text-white" : "text-black"} text-3xl font-medium tracking-wide`}
          >
            Profile info
          </h3>

          <p className="text-xl mb-5 tracking-wide">
            Please provide your name and an optional profile photo
          </p>

          <div
            onClick={() => fileRef.current?.click()}
            className="flex justify-center items-center"
          >
            <div className="relative flex justify-center items-center overflow-hidden">
              { previewImage ? (
                <img src={previewImage} alt="preview" className="w-50 h-50 rounded-full object-cover" />
              ) : (
                <DefaultAvatar theme={theme} />
              )}
            </div>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              {...fileRegister}
              ref={(e) => {
                fileRegister.ref(e);
                fileRef.current = e;
              }}
              onChange={handleOnChange}
              className="hidden"
            />
          </div>
          {errors?.profilePic && (
            <p className="mt-2 text-red-300 text-base tracking-widest">
              {errors?.profilePic?.message}
            </p>
          )}

          <div className="w-full">
            <input
              type="text"
              {...register("username", { required: true, minLength: 5 })}
              autoComplete="off"
              className="w-full py-1 border-b-2 border-green-700 outline-none text-xl"
              placeholder="Type your name here"
            />
            {errors?.username && (
              <p className="mt-2 text-red-300 text-base tracking-widest">
                {errors?.username?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-2xs mt-10 py-2 text-xl text-center text-white font-medium rounded-xl bg-green-600 cursor-pointer"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              "Next"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

const DefaultAvatar = ({ theme }) => {
  return (
    <>
      <AccountCircleIcon
        className={`text-[200px]! ${theme === "light" ? "text-txtDark" : "text-txtLight"}`}
      />
      <div className="w-10 h-10 flex justify-center items-center absolute right-5 bottom-5 z-10 bg-green-400 rounded-full">
        <PlusIcon className="text-white size-8" />
      </div>
    </>
  )
};