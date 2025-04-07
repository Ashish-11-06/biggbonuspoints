import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerPoints } from '../Redux/slices/pointsSlice';

const PointsScreen = () => {
    const [pin, setPin] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { customerPoints, status, error } = useSelector(state => state.customerPoints);

    // Fetch user ID from AsyncStorage on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setLoggedInUserId(parsedUser.customer_id);
                    console.log("Parsed user data:", parsedUser);
                } else {
                    Alert.alert('Error', 'User not found');
                }
            } catch (err) {
                Alert.alert('Error', 'Failed to get user data');
            }
        };

        fetchUserId();
    }, []);

    const handlePress = (value) => {
        if (pin.length < 4) {
            setPin(pin + value);
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleSubmit = async () => {
        if (pin.length === 4 && loggedInUserId) {
            const requestData = {
                customer_id: loggedInUserId,
                pin: pin
            };

            try {
                const response = await dispatch(fetchCustomerPoints(requestData)).unwrap();
                navigation.navigate('ShowPoints', {
                    points: response.merchant_points,
                });
                console.log("Fetched points:", response.merchant_points);
            } catch (err) {
                Alert.alert('Error', err.message || 'Failed to fetch points');
            }
        } else {
            Alert.alert('Error', 'Enter all 4 PIN values');
        }
    };

    useEffect(() => {
        if (status === 'failed' && error) {
            Alert.alert('Error', error);
        }
    }, [status, error]);

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
                    <TouchableOpacity
                        key={index}
                        style={styles.key}
                        onPress={() => handlePress((index + 1).toString())}
                    >
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
