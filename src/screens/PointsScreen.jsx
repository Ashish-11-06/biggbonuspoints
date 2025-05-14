import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustGlobalPoints, fetchCustomerPoints, fetchMerchantPoints, fetchTerminalPoints } from '../Redux/slices/pointsSlice';

const PointsScreen = ({ route }) => {
    const [pin, setPin] = useState('');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { status, error } = useSelector(state => state.customerPoints);
    const { merchantId, merchantName, fromChooseMerchant, userName, userMobile, userShop, fromRedeem, onPinEntered, fromHomeScreen,fromGPoints,chooseGlobalMerchant} = route.params;
    const userId = route.params.userId; // Extract userId from route params
    const [userCategory, setUserCategory] = useState(null);
    const [terminalMerchant,setTerminalMerchant] = useState('');
    const [loggedPin,setLoggedPin] = useState('');
    console.log(merchantName, merchantId, fromChooseMerchant);
console.log('from  G Points',fromGPoints);
console.log('merchant id',merchantId);

    // console.log(userName, userId); // Correctly log userName and userId
    // Fetch user ID from AsyncStorage on component mount
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    console.log("User data from AsyncStorage:", parsedUser);
                    setLoggedPin(parsedUser?.pin);
                    setUserCategory(parsedUser.user_category);
                    if(parsedUser?.user_category === 'customer') {
                        setLoggedInUserId(parsedUser.customer_id);
                    } else if(parsedUser?.user_category === 'merchant') {
                        setLoggedInUserId(parsedUser.merchant_id);
                    } else if(parsedUser?.user_category === 'terminal') {
                        setLoggedInUserId(parsedUser.terminal_id);
                        setTerminalMerchant(parsedUser?.merchant_id)
                    }
                    // setLoggedInUserId(parsedUser.user_category === 'merchant' ? parsedUser.merchant_id : parsedUser.customer_id);
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
console.log('merchant iddddd',loggedInUserId);

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const handleSubmit = async () => {

        console.log('Entered PIN:', pin, typeof pin);
console.log('Logged PIN:', loggedPin, typeof loggedPin);
        console.log('clicked ',pin);
        console.log('logged pin',loggedPin);
        
        if (pin !== String(loggedPin)) {
            Alert.alert('Incorrect PIN', 'Please try again!', [
              {
                text: 'OK',
                onPress: () => {}, // stays on same screen
              },
            ]);
            setPin('');
            return;
          }
          
        if (pin.length === 4) {
            if (fromRedeem && onPinEntered) {
                onPinEntered(pin); // Pass the entered PIN back to TransferPoints
                navigation.goBack(); // Navigate back to TransferPoints
            } else if(userCategory === 'customer' && !fromGPoints){ 
                // Existing behavior for non-redeem flow
                const requestData = {
                    customer_id: loggedInUserId,
                    pin: pin,
                };

                try {
                    const response = await dispatch(fetchCustomerPoints(requestData)).unwrap();
                    if (fromChooseMerchant) {
                        navigation.navigate('TransferPoints', {
                            merchantId: userId, // Pass userId as merchantId
                            merchantName: userName, // Pass userName as merchantName
                        });
                    } else {
                        navigation.navigate('ShowPoints', {
                            points: response.merchant_points,
                            merchantId: null,
                            merchantName: null,
                        });
                    }

                    console.log("Fetched points:", response.merchant_points);
                } catch (err) {
                    Alert.alert(err || 'Failed to fetch points');
                }
            } 
            else if(userCategory === 'customer' && fromGPoints){ 
                // Existing behavior for non-redeem flow
                const requestData = {
                    customer_id: loggedInUserId,
                    pin: Number(pin),
                };

                try {
                    const response = await dispatch(fetchCustGlobalPoints(requestData)).unwrap();
                   console.log('user id',userId);
                   
                    if (chooseGlobalMerchant) {
                        navigation.navigate('TransferPoints', {
                            merchantId: userId, // Pass userId as merchantId
                            merchantName: userName, // Pass userName as merchantName
                            chooseGlobalMerchant: chooseGlobalMerchant,
                        });
                    } else {
                        navigation.navigate('ShowPoints', {
                            points: response.points,
                            merchantId: null,
                            merchantName: null,
                            fromGPoints:true
                        });
                    }
                    console.log('response G points',response);
                    
                    console.log("Fetched points:", response.points);
                } catch (err) {
                    Alert.alert(err || 'Failed to fetch points');
                }
            } 
            else if(userCategory === 'merchant'){
                // const requestData = {
                //     merchant_id: loggedInUserId,
                //     pin: pin,
                // };
                let merchantId;
                if(userCategory === 'merchant') {
                    merchantId=loggedInUserId;
                }
                // } else {
                //     merchantId = terminalMerchant;
                // }
                try {
                    const response = await dispatch(fetchMerchantPoints(merchantId)).unwrap();
                    console.log(response);
                    if (fromChooseMerchant && userCategory === 'merchant') {
                        navigation.navigate('TransferPoints', {
                            merchantId: userId, // Pass userId as merchantId
                            merchantName: userName, // Pass userName as merchantName
                        });
                    }
                    // } else if(fromChooseMerchant && userCategory === 'terminal') {
                    //     console.log('user iddd',userId);
                    //     console.log('merchant name',loggedInUserId);
                    //     navigation.navigate('TransferPoints', {
                    //         merchantId: userId, // Pass userId as merchantId
                    //         merchantName: userName, // Pass userName as merchantName
                    //     });
                    // }
                     else {
                        console.log('pointsssss',response.points_data);
                        
                        navigation.navigate('ShowPoints', {
                            points: response.points_data,
                            merchantId: null,
                            merchantName: null,
                        });
                    }
                    console.log("Fetched points:", response.merchant_points);
                } catch (err) {
                    console.log('rrrrrrrrrrrr');
                    
                    Alert.alert('errrrrrr',err);
                }
            
            } else if(userCategory === 'terminal'){
                // const requestData = {
                //     terminal_id: loggedInUserId,
                //     tid_pin: pin,
                //     merchant_id:terminalMerchant
                // };
                const  terminalId= loggedInUserId;
            console.log('request data',terminalId);
            
                try {
                    const response = await dispatch(fetchTerminalPoints(terminalId)).unwrap();
                    console.log(response);
                    if (fromChooseMerchant && userCategory === 'terminal') {
                        navigation.navigate('TransferPoints', {
                            merchantId: userId, // Pass userId as merchantId
                            merchantName: userName, // Pass userName as merchantName
                        });
                    }
                    // } else if(fromChooseMerchant && userCategory === 'terminal') {
                    //     console.log('user iddd',userId);
                    //     console.log('merchant name',loggedInUserId);
                    //     navigation.navigate('TransferPoints', {
                    //         merchantId: userId, // Pass userId as merchantId
                    //         merchantName: userName, // Pass userName as merchantName
                    //     });
                    // }
                     else {
                        console.log('pointsssss',response.total_points);
                        
                        navigation.navigate('ShowPoints', {
                            points: response.total_points,
                            merchantId: null,
                            merchantName: null,
                            fromTerminal:true,
                            userCategory :userCategory
                        });
                    }
                    console.log("Fetched points:", response.merchant_points);
                } catch (err) {
                    console.log('rrrrrrrrrrrr');
                    
                    Alert.alert('errrrrrr',err);
                }
            }
        } else {
            Alert.alert('Error', 'Enter all 4 PIN values');
        }
    };

    useEffect(() => {
        if (status === 'failed' && error) {
            // Alert.alert('Error', error);
        }
    }, [status, error]);

    return (
        <View style={styles.container}>
{!fromHomeScreen && (
  <Text style={styles.merchantId}>
    {userCategory === 'customer' ? 'Merchant ID' : 'Customer ID'}: {userId}
  </Text>
)}            {/* <Text style={styles.userInfo}>Name: {userName}</Text>
            <Text style={styles.userInfo}>Mobile: {userMobile}</Text>
            {userShop && <Text style={styles.userInfo}>Shop: {userShop}</Text>} */}
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
    userInfo: {
        fontSize: 16,
        marginBottom: 5,
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
        backgroundColor: '#004BFF',
    },
    tickText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PointsScreen;
