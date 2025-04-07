import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

const ReceivePointsScreen = ({ route }) => {
  const userId = route?.params?.userId || 'N/A';
  const qrValue = `receive:${userId}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan this QR to Receive Points</Text>
      <QRCode
        value={qrValue}
        size={200}
      />
      <Text style={styles.userId}>User ID: {userId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 18, marginBottom: 20,
  },
  userId: {
    marginTop: 20, fontSize: 16,
  },
});

export default ReceivePointsScreen;
