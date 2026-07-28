import Advertise from "../../pages/Advertise.jsx";

import useGlobalStore from "../../store/globalStore.js";

const RightContainer = () => {
  const theme = useGlobalStore((state) => state.theme);

  return (
    <div
      className={`right-container ${theme === "dark" ? "bg-darkNav" : "bg-lightNav"}`}
    >
      <Advertise />
    </div>
  );
};

export default RightContainer;
