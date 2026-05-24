import useAppStore from "../../store/appStore.js";
import useGlobalStore from "../../store/globalStore.js";

import Avatar from "../Avatar.jsx";
import Input from "../Input.jsx";
import SmallCard from "../SmallCard.jsx";

const LeftContainer = () => {
  const userInfo = useAppStore((state) => state.userInfo);
  const theme = useGlobalStore((state) => state.theme);

  return (
    <div
      className={`left-container select-none ${theme === "dark" ? "bg-(--secondary-black)" : "bg-white"}`}
    >
      <div className="w-full">
        <div className="w-full">
          <h4 className="heading4 text-white">{userInfo?.username}</h4>
        </div>

        <div className="my-5 w-full">
          <Input placeholder={"Search"} />
        </div>
      </div>

      <div className="overflow-y-auto w-full h-full flex flex-col justify-start items-center">
        {/** todo: avatar should be conditionally rendered */}
        <Avatar url={userInfo.profilePic} className="w-32 h-32 mt-28 mb-20" />
        {data.map((d, i) => (
          <SmallCard
            classNames = {i === 5 ? ({h: "text-rose-500", hover: "hover:bg-rose-900/30"}) : ""}
            key={d.id}
            to={d.to}
            icon={d.icon}
            heading={d.heading}
            para={d.para}
          />
        ))}
      </div>
    </div>
  );
};

export default LeftContainer;

const data = [
  {
    id: 0,
    to: "",
    icon: "profile",
    heading: "Profile",
    para: "Name, profile photo",
  },
  {
    id: 1,
    to: "",
    icon: "key",
    heading: "Account",
    para: "Security notifications, account info",
  },
  {
    id: 2,
    to: "",
    icon: "lock",
    heading: "Privacy",
    para: "Blocked contacts, disappearing messages",
  },
  {
    id: 3,
    to: "",
    icon: "chat",
    heading: "Chats",
    para: "Theme, wallpaper, chat settings",
  },
  {
    id: 4,
    to: "",
    icon: "bell",
    heading: "Notifications",
    para: "Messages, groups, sounds",
  },
  {
    id: 5,
    to: "",
    icon: "exit",
    heading: "Log out",
  },
];
