import PushNotification from 'react-native-push-notification';

const showNotification = (title, message) => {
  PushNotification.localNotification({
    channelId: 'default-channel-id',
    title,
    message,
    soundName: 'default'
  });
};

const handleScheduleNotification = (title, message) => {
  PushNotification.scheduleLocalNotification({
    channelId: 'default-channel-id',
    title,
    message,
    date: new Date(Date.now() + 5 * 1000)
  });
};

export { showNotification, handleScheduleNotification };
