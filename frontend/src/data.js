import ProfileIcon from "./assets/ProfileIcon.jsx";
import KeyIcon from "./assets/KeyIcon.jsx";
import LockIcon from "./assets/LockIcon.jsx";
import MessageIcon from "./assets/MessageIcon.jsx";
import BellIcon from "./assets/BellIcon.jsx";
import ActiveStatusIcon from "./assets/ActiveStatusIcon.jsx";
import StatusIcon from "./assets/StatusIcon.jsx";
import ActiveChatIcon from "./assets/ActiveChatIcon.jsx";
import ChatIcon from "./assets/ChatIcon.jsx";


export const components = {
  profile: ProfileIcon,
  key: KeyIcon,
  lock: LockIcon,
  chat: MessageIcon,
  bell: BellIcon,
}

export const navData = [
  {
    title: "status",
    to: "/status",
    value: "status",
    active: ActiveStatusIcon,
    normal: StatusIcon,
  },
  {
    title: "chat",
    to: "/",
    value: "chat",
    active: ActiveChatIcon,
    normal: ChatIcon,
  },
]