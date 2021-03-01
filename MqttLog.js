import React, { useEffect, useState } from 'react';
import init from 'react_native_mqtt';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

init({
  size: 10000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true,
  sync: {},
});

export default function MqttLog(props) {
  const { style } = props;
  const clientID = Math.floor(Math.random() * 10000) + 1;
  const [text, setText] = useState('');

  const [clientInfo] = useState({
    BROKER: '192.168.0.165',
    PORT: '1883',
    TOPIC: 'testTopic',
  });

  // eslint-disable-next-line no-undef
  const client = new Paho.MQTT.Client(
    clientInfo.BROKER,
    Number(clientInfo.PORT),
    `clientId-${clientID}`,
  );

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

  function pushText(entry) {
    setText(entry);
    console.log(entry);
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
      <Text style={{ fontSize: 20, marginBottom: 10 }}>System Log</Text>
      <Text style={{ fontSize: 18, alignContent: 'center' }}>
        {' '}
        {text}
        {' '}
        &deg;C
      </Text>
    </View>
  );
}
