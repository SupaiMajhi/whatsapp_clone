import useSocketStore from "../store/socketStore.js";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const timeOptions = {
  calendar: "gregory",
  timeZone: "+05:30",
  hour12: true,
  hour: "2-digit",
  minute: "2-digit",
};

const dateOptions = {
  calendar: "gregory",
  timeZone: "+05:30",
  year: "numeric",
  month: "2-digit",
  day: "numeric",
};

export const onSeen = (messagesIds) => {
  const socket = useSocketStore.getState()?.socket;
  if (socket?.readyState === WebSocket.OPEN) {
    socket?.send(
      JSON.stringify({
        type: "markAsSeen",
        content: {
          data: messagesIds,
        },
      }),
    );
  }
};

export const sendMessageViaSocket = (msgType, content) => {
  const socket = useSocketStore.getState()?.socket;
  if (socket?.readyState === WebSocket.OPEN) {
    console.log("sent");
    socket?.send(
      JSON.stringify({
        type: msgType,
        content,
      }),
    );
  }
};

export const formatChatTime = (time) => {
  if (time) {
    const now = new Date();
    const chatTime = new Date(time);

    // calculating hours from milliseconds
    const hours = Math.floor((now.getTime() - chatTime.getTime()) / 3600000);
    if (hours <= 24) {
      return new Intl.DateTimeFormat("en-IN", timeOptions).format(chatTime);
    } else if (hours > 24 && hours <= 48) {
      return "Yesterday";
    } else if (hours > 48 && hours <= 168) {
      const dayVal = chatTime.getDay();
      return dayNames[dayVal];
    } else {
      return new Intl.DateTimeFormat("en-IN", dateOptions).format(chatTime);
    }
  }
};

export const formatMessageTime = (time) => {
  if (time) {
    const msgTime = new Date(time);
    const dtf = new Intl.DateTimeFormat(
      ["en-IN", "en-GB", "en-US"],
      timeOptions,
    );

    return dtf.format(msgTime);
  }
};
