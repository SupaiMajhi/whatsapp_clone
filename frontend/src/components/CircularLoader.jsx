import CircularProgress from "@mui/material/CircularProgress";
import useGlobalStore from "../store/globalStore.js";

const CircularLoader = ({ className = "", size = "20px" }) => {

  const theme = useGlobalStore((state) => state.theme);

  return (
    <div className={`${className} flex justify-center items-center`}>
      <CircularProgress enableTrackSlot size={size} aria-label="Loading" className={`${theme === "dark" ? "text-white!" : "text-black!"}`} />
    </div>
  );
};

export default CircularLoader;
