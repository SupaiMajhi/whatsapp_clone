import useGlobalStore from "../store/globalStore.js";
import SearchIcon from "../assets/SearchIcon";
import CircularLoader from "./CircularLoader.jsx";

const Input = ({ className = "", placeholder, value, handleOnChange, handleOnClick, isLoading }) => {

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
        value={value}
        onChange={(e) => handleOnChange(e)}
        name="search"
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full h-full focus:outline-3 focus:outline-green-600 text-sm font-normal px-14 rounded-inherit ${theme === "dark" ? "bg-primaryBg placeholder:text-(--primary-inputTxt) text-white" : "bg-secondaryBg placeholder:text-(--secondary-inputTxt)"} ${className}`}
      />
      <button
        onClick={handleOnClick} 
        disabled={isLoading}
        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-14 py-2 rounded-2xl flex justify-center items-center"
      >
        {value?.length >= 10 && !isLoading ? (
          <SearchIcon className="w-14 mr-1 rounded-2xl bg-green-400" />
        ) : value?.length >= 10 && isLoading ? (
          <CircularLoader size="15px" />
        ) : null}
      </button>
    </div>
  );
};

export default Input;
