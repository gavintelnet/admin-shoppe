export const unreadNotificationFunc = (notifications: any) => {
    if (!Array.isArray(notifications)) {
        // console.log("notifications is not an array");
        return [];
    }
    // console.log("notifications:", notifications);
    const unread = notifications.filter((n: any) => n?.isRead === false);
    // console.log("unread notifications:", unread);
    return unread;
}