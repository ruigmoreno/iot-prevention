import React, {
  useCallback, useEffect, useLayoutEffect, useState
} from 'react';
import init from 'react_native_mqtt';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import PushNotification from 'react-native-push-notification';
import { showNotification } from './LocalPushController';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export default function MqttLog(props) {
  const [temp, setTemp] = useState(0);
  const { style } = props;
  const clientID = Math.floor(Math.random() * 10000) + 1;
  let flag = true;

  const [clientInfo] = useState({
    BROKER: '192.168.0.156',
    PORT: '8080',
    TOPIC: 'testTopic',
  });

  // eslint-disable-next-line no-undef
  const client = new Paho.MQTT.Client(
    clientInfo.BROKER,
    Number(clientInfo.PORT),
    `clientId-${clientID}`,
  );

  useLayoutEffect(useCallback(() => {
    // showNotification('My Fist Notification', 'Hello World!!');
  }));

  useEffect(() => {
    try {
      client.connect({
        onSuccess: onConnect, useSSL: false, userName: 'pi', password: 'password'
      });
    } catch (err) {
      console.log(`Can not connect. Error: ${err.message}.`);
    }
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    return () => client.disconnect();
  }, []);

  const fireNotification = () => {
    showNotification('ALERTA!', 'Temperatura ultrapassou o limite!');
    console.log('Fire notification');
  };

  function pushText(entry) {
    const temperature = Number(parseFloat(entry).toFixed(2));
    if (temperature > 60 && flag === true) {
      flag = false;
      fireNotification();
    }
    // if (temperature <= 35.0) flag = true;
    setTemp(parseFloat(entry).toFixed(2));
  }

  function onConnect() {
    try {
      console.log('Connected!');
      client.subscribe(clientInfo.TOPIC);
      console.log(`Client subscribed in Topic ${clientInfo.TOPIC}!`);
    } catch (err) {
      console.log(`Client can not subscribed! Error: ${err.message}.`);
    }
  }

  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log(`connection lost: ${responseObject.errorMessage}`);
    }
  }

  function onMessageArrived(message) {
    pushText(`${message.payloadString}`);
  }

  return (
    <View style={style}>
      <Text style={{ fontSize: 24, alignContent: 'center' }}>
        {' '}
        {`${temp}`}
        {' '}
        &deg;C
      </Text>
    </View>
  );
}
