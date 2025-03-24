import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

const ScanQR = ({ navigation }) => {
    const [scannedData, setScannedData] = useState(null);

    const handleBarCodeRead = ({ data }) => {
        if (!scannedData) {
            setScannedData(data);
            Alert.alert("QR Code Scanned", `Data: ${data}`, [
                { text: "OK", onPress: () => navigation.navigate('NextScreen', { qrData: data }) }
            ]);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Scan QR Code</Text>
            <RNCamera
                style={styles.camera}
                onBarCodeRead={handleBarCodeRead}
                captureAudio={false}
            />
        </View>
    );
};

export default ScanQR;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
});
