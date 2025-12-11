export const validateTime = (time) => {
    const newTime = new Date(time);
    return newTime.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });
}