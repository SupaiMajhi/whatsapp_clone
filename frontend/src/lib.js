export const formatMessageTime = (time) => {
    const msgTime = new Date(time);
    const now = new Date();

    if(msgTime.toDateString() === now.toDateString()){
        return msgTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if(yesterday.toDateString() === msgTime.toDateString()){
        return 'Yesterday';
    }

    return 'NaN';
}