import { components } from "../data.js";

//store import
import useGlobalStore from "../store/globalStore.js";

const ProfileCard = ({ handleOnClick, icon, heading, para }) => {
  const theme = useGlobalStore((state) => state.theme);
  const Component = components[icon];
  return (
    <button
      onClick={() => handleOnClick(true)}
      className={`w-full h-18 px-5 py-2 rounded-xl flex justify-start items-center space-x-5 ${theme === "dark" ? "hover:bg-darkNav text-white" : "hover:bg-lightNav text-black"}`}
    >
      <div className="w-max">
        <Component className={`size-6 ${theme === "dark" ? "text-neutral-400" : "text-neutral-600/90"}`} />
      </div>

      <div className="flex flex-col justify-center text-left">
        <h3 className="text-base font-normal">{heading}</h3>
        <p className={`text-sm font-normal ${theme === "dark" ? "text-txtLight" : "text-txtDark"}`}>{para}</p>
      </div>
    </button>
  );
};

export default ProfileCard;
