import { useState } from "react";
import { AnimatePresence } from "motion/react";

//store imports
import useAppStore from "../../store/appStore.js";
import useGlobalStore from "../../store/globalStore.js";

//components imports
import Avatar from "../Avatar.jsx";
import Input from "../Input.jsx";
import ProfileCard from "../ProfileCard.jsx";
import Logout from "../Logout.jsx";
import EditProfile from "../EditProfile.jsx";

const LeftContainer = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const theme = useGlobalStore((state) => state.theme);

  const [showEditProfile, setShowEditProfile] = useState(false);

  const profileData = [
    {
      id: 0,
      handleOnClick: setShowEditProfile,
      icon: "profile",
      heading: "Profile",
      para: "Name, profile picture",
    },
    {
      id: 1,
      icon: "key",
      heading: "Account",
      para: "Security notifications, account info",
    },
    {
      id: 2,
      icon: "lock",
      heading: "Privacy",
      para: "Blocked contacts, disappearing messages",
    },
    {
      id: 3,
      icon: "chat",
      heading: "Chats",
      para: "Theme, wallpaper, chat settings",
    },
    {
      id: 4,
      icon: "bell",
      heading: "Notifications",
      para: "Messages, groups, sounds",
    },
  ];

  return (
    <div className="relative basis-[30vw] h-full">
      {/** ----conditional components---- */}
      <AnimatePresence>
        {showEditProfile ? <EditProfile /> : null}
      </AnimatePresence>

      <div
        className={`relative left-container select-none ${theme === "dark" ? "bg-(--secondary-black)" : "bg-white"}`}
      >
        <div className="w-full">
          <h4 className="heading4 text-white">{userInfo?.username}</h4>

          <div className="my-5 w-full">
            <Input placeholder={"Search"} />
          </div>
        </div>

        <div className="overflow-y-auto w-full h-full pl-2 flex flex-col justify-start items-center">
          {/** todo: avatar should be conditionally rendered */}
          <Avatar url={userInfo.profilePic} className="w-32 h-32 mt-28 mb-20" />
          {profileData.map((d, i) => (
            <ProfileCard
              key={i}
              handleOnClick={d.handleOnClick}
              icon={d.icon}
              heading={d.heading}
              para={d.para}
            />
          ))}
          <Logout />

          {/**-------HORIZONTAL LINE------ */}
          <div
            className={`w-full h-px ${theme === "light" ? "bg-[#DEDCDA]" : "bg-hoverDarkBg"}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LeftContainer;
