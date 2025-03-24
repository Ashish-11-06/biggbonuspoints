import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PointsScreen = () => {
    const [pin, setPin] = useState('');
    const navigation = useNavigation();

    const handlePress = (value) => {
        if (pin.length < 4) {
            setPin(pin + value);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleSubmit = () => {
        if (pin.length === 4) {
            navigation.navigate('ShowPoints'); // Navigate to Show Balance screen
        } else {
            Alert.alert('Error', 'Enter all 4 PIN values'); // Show alert if PIN is incomplete
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.merchantId}>Merchant ID: XXXX2345</Text>
            <Text style={styles.title}>ENTER 4-DIGIT UPI PIN</Text>
            <View style={styles.pinContainer}>
                {[...Array(4)].map((_, index) => (
                    <Text key={index} style={styles.pinText}>
                        {pin.length > index ? '●' : '_'}
                    </Text>
                ))}
            </View>
            <Text style={styles.infoText}>
                UPI PIN will keep your account secure from unauthorized access. Do not share this PIN with anyone.
            </Text>
            <View style={styles.keypad}>
                {[...Array(9)].map((_, index) => (
                    <TouchableOpacity key={index} style={styles.key} onPress={() => handlePress((index + 1).toString())}>
                        <Text style={styles.keyText}>{index + 1}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.key} onPress={handleDelete}>
                    <Text style={styles.keyText}>⌫</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.key} onPress={() => handlePress('0')}>
                    <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tickKey} onPress={handleSubmit}>
                    <Text style={styles.tickText}>✔</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    merchantId: {
        position: 'absolute',
        top: 40,
        left: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pinText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },
    infoText: {
        textAlign: 'center',
        fontSize: 14,
        color: 'gray',
        marginBottom: 30,
    },
    keypad: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    key: {
        width: 80,
        height: 80,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: '#ddd',
    },
    keyText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    tickKey: {
        width: 80,
        height: 80,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        backgroundColor: '#6A1B9A',
    },
    tickText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PointsScreen;
