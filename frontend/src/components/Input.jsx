import SearchIcon from "../assets/SearchIcon";
import useGlobalStore from "../store/globalStore.js";

const Input = ({ className = "", placeholder }) => {

  const theme = useGlobalStore((state) => state.theme);

  return (
    <div
      className={`relative w-full h-10 flex justify-center items-center rounded-4xl`}
    >
      <SearchIcon
        className={`w-5 absolute top-1/2 left-4 transform -translate-y-1/2 ${theme === "dark" ? "text-(--primary-inputTxt)" : "text-txtDark"}`}
      />
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full h-full focus:outline-3 focus:outline-green-600 text-base font-normal px-14 rounded-inherit ${theme === "dark" ? "bg-primaryBg placeholder:text-(--primary-inputTxt) text-white" : "bg-secondaryBg placeholder:text-(--secondary-inputTxt)"} ${className}`}
      />
    </div>
  );
};

export default Input;