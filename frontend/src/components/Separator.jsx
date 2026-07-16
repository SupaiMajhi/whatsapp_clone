import useGlobalStore from "../store/globalStore.js";

function Separator({ className }){
    const theme = useGlobalStore((state) => state.theme);
    
    return(
      <div
        className={`className ${theme === "light" ? "bg-[#DEDCDA]" : "bg-hoverDarkBg"}`}
      ></div>
    );
}

export default Separator;