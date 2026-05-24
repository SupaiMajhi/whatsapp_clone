import { NavLink } from "react-router-dom";
import { components } from "../data.js";

//store import
import useGlobalStore from "../store/globalStore.js";

const SmallCard = ({ to, icon, heading, para, classNames }) => {

  const theme = useGlobalStore((state) => state.theme);

  const Component = components[icon];
    return (
      <NavLink to={to} className={`w-full h-18 px-5 py-2 rounded-xl flex justify-start items-center space-x-5 text-white ${theme === "dark" ? `${classNames.hover ? `${classNames.hover}` : "hover:bg-primaryBg"}` : `${classNames.hover ? `${classNames.hover}` : "hover:bg-secondaryBg"}`}`}>
         <div className="w-max">
          <Component className={`size-7 ${classNames.h}`} /> 
         </div>

        <div className="flex flex-col justify-center text-left">
          <h3 className={`text-base font-medium ${classNames.h}`}>{heading}</h3>  
          {para && (<p className={`text-sm font-normal`}>{para}</p>)}
        </div>
      </NavLink>
    );
}

export default SmallCard;
