import NoChatLogo from "../assets/NoChatLogo";
import PrimaryButton from "../components/PrimaryButton.jsx";

// Store imports
import useGlobalStore from "../store/globalStore.js";

const Advertise = () => {

  const theme = useGlobalStore((state) => state.theme);

  return (
    <div className={`custom-container flex-col ${theme === "light" ? "bg-lightNav text-txtDark" : "bg-dark text-txtLight"}`}>
      <div className="flex-center flex-col">
        <div className="w-[230px] mb-5">
          <NoChatLogo />
        </div>
        <div className="flex-column mb-7">
          <h1 className={`flex-center flex-col text-3xl ${theme === "light" ? "text-black" : "text-white"}`}>Download WhatsApp fow Windows</h1>
          <p className="text-base">
            Make calls, share your screen and get a faster experience when you
            download the Windows app.
          </p>
        </div>
        <PrimaryButton className="text-base font-bold px-4 py-2 rounded-3xl text-[#D9FDD3] bg-[#103529]">Download</PrimaryButton>        
      </div>
      <div className="mt-20 text">
        <p>Your personal messages are end-to-end ecrypted</p>
      </div>
    </div>
  );
};

export default Advertise;
