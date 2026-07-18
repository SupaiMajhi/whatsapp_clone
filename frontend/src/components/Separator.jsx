import useGlobalStore from "../store/globalStore.js";

function Separator(){
    const theme = useGlobalStore((state) => state.theme);
    
    return(
      <div
        className={`w-0.5 h-full ${theme === "light" ? "bg-[#DEDCDA]" : "bg-hoverDarkBg"}`}
      ></div>
    );
}

export default Separator;