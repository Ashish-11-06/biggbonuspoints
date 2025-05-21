/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  customerToCustomerPoints,
  customerToMerchantPoints,
  merchantToCustomerPoints,
  merchantToMerchantPoints,
  resetTransferState,
  terminalToCustomerPoints,
  customerToCorporatePoints,
  customerToGlobalPoints,
  chooseGlobal,
} from '../Redux/slices/TransferPointsSlice';
import {useNavigation} from '@react-navigation/native';
import {
  fetchCustomerPoints,
  fetchMerchantPoints,
} from '../Redux/slices/pointsSlice';
import {Picker} from '@react-native-picker/picker';

const TransferPoints = ({route, navigation}) => {
  // Get both merchantId and merchantName from route params
  const {
    merchantId,
    chooseCorporateMerchant,
    merchantName,
    fromScanQR,
    fromTransferHome,
    fromSelectUser,
    fromCorporateQR,
    chooseGlobalMerchant,
    fromGlobalQR,
    fromChooseMerchant,
  } = route.params;
  console.log(fromSelectUser);
  console.log('choose corporate', chooseCorporateMerchant);

  // console.log('merchant id',merchantId);
  // console.log('merchant name',merchantName);

  // console.log('from choose global',chooseGlobalMerchant);
  // console.log('from global ',chooseGlobal);
  console.log('fromChooseMerchant', fromChooseMerchant);
  console.log('from transfer home', fromTransferHome);
  console.log('from select user', fromSelectUser);

  const [points, setPoints] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState('');
  const [userDetails, setUserDetails] = useState({});
  const [pointsData, setPointsData] = useState([]);
  const [terminalMerchant, setTerminalMerchant] = useState(null);
  const [corporateId, setCorporateId] = useState(null);
  const [merchantDetails, setMerchantDetails] = useState({
    name: merchantName || `Merchant ${receiverId}`, // Use passed name or fallback
  });
  const [customerId, setCustomerId] = useState(null);
  const [terminalId, setTerminalId] = useState(null);
  const receiverId = merchantId;
  const [merchant_Id, setMerchantId] = useState(null);
  console.log('Merchant ID:', receiverId);
  console.log('Merchant Name:', merchantName);
  const [userCategory, setUserCategory] = useState(null);
  const dispatch = useDispatch();
  const nav = useNavigation();
  const [user, setUser] = useState(null);
  const isMounted = useRef(true);

  const fetchDetails = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedData = JSON.parse(userData);
        // console.log("Parsed user data:", parsedData);
        if (parsedData.user_category === 'customer') {
          setCustomerId(parsedData.customer_id);
        }
        if (parsedData.user_category === 'merchant') {
          setMerchantId(parsedData.merchant_id);
        }
        if (
          parsedData.user_category === 'merchant' &&
          parsedData.user_type === 'corporate'
        ) {
          setMerchantId(parsedData.merchant_id);
          setCorporateId(parsedData.corporate_id);
        }

        if (parsedData.user_category === 'terminal') {
          setTerminalId(parsedData.terminal_id);
          console.log('terminal merchantt', parsedData.merchant_id);
          setTerminalMerchant(parsedData.merchant_id);
        }
        setUserCategory(parsedData.user_category);
        setUserDetails({
          name: `Customer ${parsedData.customer_id}`,
          pin: parsedData.pin,
        });
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    }
  };

  useEffect(() => {
    fetchDetails(); // Call fetchDetails on page load

    return () => {
      isMounted.current = false;
      dispatch(resetTransferState());
    };
  }, []);
  // Set header options
  useEffect(() => {
    nav.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={navigateToHome} style={{marginLeft: 15}}>
          <Text style={{fontSize: 16, color: '#6A1B9A'}}>Back</Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  // Use navigation.reset to go directly to HomeScreen and clear stack
  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Update navigateToHome to also use reset
  const navigateToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  useEffect(() => {
    if (userCategory === 'customer') {
      const customerPoints = async () => {
        const requestData = {
          customer_id: customerId,
          pin: userDetails?.pin,
        };
        const res = await dispatch(fetchCustomerPoints(requestData));
        console.log('customer points res', res);

        const merchantPoints = res?.payload?.merchant_points || [];
        setPointsData(merchantPoints);
        console.log('customer points', res);
      };
      customerPoints();
    }
  }, [customerId, dispatch]);

  console.log('ppoints data', pointsData);

  const totalPoints = Array.isArray(pointsData)
    ? pointsData.reduce((sum, item) => sum + parseInt(item.points || 0), 0)
    : 0;

  const merchantData = pointsData.reduce((acc, item) => {
    const merchantKey = item.merchant_name || item.merchant_id;

    if (!acc[merchantKey]) {
      acc[merchantKey] = {
        merchantName: item.merchant_name || `Merchant ${item.merchant_id}`,
        merchantId: item.merchant_id,
        totalPoints: 0,
        transactions: [],
      };
    }

    acc[merchantKey].totalPoints += parseInt(item.points || 0);
    acc[merchantKey].transactions.push(item);

    return acc;
  }, {});

  // Convert merchant data into section format
  const merchantSections = Object.values(merchantData).map(merchant => ({
    title: merchant.merchantName,
    data: merchant.transactions,
    merchantId: merchant.merchantId, // Pass merchantId for redeem functionality
  }));

  console.log('user data', userDetails);
  console.log('merchant section', merchantSections);

  // console.log('terminal user',userCategory)
  console.log('terminal merchant', terminalMerchant);
  console.log('terminal id', terminalId);

  const handleTransfer = () => {
    console.log('Transfer button pressed');

    if (!points || isNaN(points) || parseInt(points) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid points amount');
      return;
    }

    navigation.navigate('PointsScreen', {
      receiverId,
      merchantName,
      fromHomeScreen: false, // Indicate not from HomeScreen
      fromRedeem: true, // Indicate redeem flow
      ...(chooseGlobalMerchant ? {chooseGlobalMerchant: true} : {}),
      onPinEntered: async pin => {
        try {
          console.log('PIN entered:', pin);

          if (
            userCategory === 'customer' &&
            !fromTransferHome &&
            !fromSelectUser &&
            !fromCorporateQR &&
            !chooseGlobalMerchant &&
            !fromGlobalQR &&
            !chooseCorporateMerchant
          ) {
            try {
              const response = await dispatch(
                customerToMerchantPoints({
                  customer_id: customerId,
                  merchant_id: receiverId,
                  pin,
                  points: parseInt(points),
                }),
              ).unwrap();

              console.log('res', response);

              if (response?.message) {
                Alert.alert('Success', response.message, [
                  {text: 'OK', onPress: navigateToHome},
                ]);
              }
            } catch (error) {
              console.error('Customer to Merchant transfer error:', error);

              Alert.alert(
                'Error',
                error || 'Something went wrong. Please try again.',
                [{text: 'OK'}],
              );
            }
          } else if (
            (userCategory === 'merchant' || userCategory === 'terminal') &&
            !fromTransferHome &&
            !fromSelectUser
          ) {
            console.log('hello merchant to customer');

            try {
              let requestData;
              let response;

              if (userCategory === 'merchant') {
                if (corporateId) {
                  requestData = {
                    customer_id: receiverId,
                    merchant_id: merchant_Id,
                    corporate_id: corporateId,
                    purchased_amt: parseInt(points),
                    pin: pin,
                  };
                } else {
                  requestData = {
                    customer_id: receiverId,
                    merchant_id: merchant_Id,
                    pin,
                    purchased_amt: parseInt(points),
                  };
                }

                console.log('request data:', requestData);

                response = await dispatch(
                  merchantToCustomerPoints(requestData),
                ).unwrap();
                console.log('response merchant to cust', response);
              } else {
                requestData = {
                  customer_id: receiverId,
                  merchant_id: terminalMerchant,
                  terminal_id: terminalId,
                  tid_pin: pin,
                  points: parseInt(points),
                };

                response = await dispatch(
                  terminalToCustomerPoints(requestData),
                ).unwrap();
              }

              console.log('Transfer response:', response);

              if (response.message) {
                Alert.alert(
                  'Success',
                  response.message || 'Points awarded successfully',
                  [{text: 'OK', onPress: navigateToHome}],
                );
              }
            } catch (error) {
              console.error('Transfer error:', error);

              Alert.alert(
                'Error',
                error || 'Something went wrong. Please try again.',
                [{text: 'OK'}],
              );
            }
          } else if (
            (userCategory === 'merchant' && fromSelectUser) ||
            (userCategory === 'merchant' && fromTransferHome)
          ) {
            try {
              const response = await dispatch(
                merchantToMerchantPoints({
                  receiver_merchant_id: receiverId,
                  sender_merchant_id: merchant_Id,
                  pin,
                  points: parseInt(points),
                  // ...(user?.corporate_id && { corporate_id: user.corporate_id })  // Add only if exists
                }),
              ).unwrap();

              console.log('Transfer response:', response);

              Alert.alert(
                'Success',
                response.message || 'Points transferred successfully',
                [{text: 'OK', onPress: navigateToHome}],
              );
            } catch (error) {
              console.error('Merchant to Merchant transfer error:', error);

              Alert.alert(
                'Error',
                error || 'Something went wrong. Please try again.',
                [{text: 'OK'}],
              );
            }
          } else if (
            (userCategory === 'customer' &&
              fromSelectUser &&
              (!chooseGlobalMerchant || !fromGlobalQR)) ||
            (userCategory === 'customer' &&
              fromTransferHome &&
              (!chooseGlobalMerchant || !fromGlobalQR))
          ) {
            console.log('customer to customer points');
            console.log('choose global merchant', chooseGlobalMerchant);
            console.log('global', chooseGlobal);

            try {
              const response = await dispatch(
                customerToCustomerPoints({
                  receiver_customer_id: receiverId,
                  sender_customer_id: customerId,
                  merchant_id: selectedMerchant,
                  pin,
                  points: parseInt(points),
                }),
              ).unwrap();

              console.log('Transfer response:', response);

              if (response.message) {
                Alert.alert(
                  'Success',
                  response.message || 'Points transferred successfully',
                  [{text: 'OK', onPress: navigateToHome}],
                );
              }
            } catch (error) {
              console.error('Customer to Customer transfer error:', error);

              Alert.alert(
                'Error',
                error || 'Something went wrong. Please try again.',
                [{text: 'OK'}],
              );
            }
          } else if (
            (userCategory === 'customer' && chooseGlobalMerchant) ||
            (userCategory === 'customer' && fromGlobalQR)
          ) {
            console.log('customer to merchant global points');
            const response = await dispatch(
              customerToGlobalPoints({
                // receiver_customer_id: receiverId,
                customer_id: customerId,
                merchant_id: receiverId,
                pin,
                points: parseInt(points),
              }),
            ).unwrap();

            console.log('Transfer response:', response);
            // if(response.message && isMounted.current) {
            Alert.alert(
              'success',
              response.message || 'Points transferred successfullyyy',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('Home'), // Navigate to the home screen
                },
              ],
            );
            // }
          } else if (
  userCategory === 'customer' &&
  (fromCorporateQR || chooseCorporateMerchant)
) {
  if (fromCorporateQR && receiverId.startsWith('C')) {
    Alert.alert(
      'Error',
      "Please scan a valid QR code. If you want to transfer points to a customer, then select the 'Transfer Points' option from the home screen.",
      [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]
    );
    return;
  }

  try {
    const response = await dispatch(
      customerToCorporatePoints({
        merchant_id: receiverId,
        customer_id: customerId,
        pin:Number(pin),
        points: parseInt(points),
      })
    ).unwrap();

    console.log('Transfer response:', response);

    if (response.message) {
      Alert.alert(
        'Success',
        response.message || 'Points transferred successfully',
        [{ text: 'OK', onPress: navigateToHome }]
      );
    }

  } catch (error) {
    // 👇 Show backend error in alert box
    Alert.alert(
      'Error',
      typeof error === 'string' ? error : error?.message || 'Something went wrong.',
      [{ text: 'OK' }]
    );
  }
}       
        } catch (error) {
          if (isMounted.current) {
            Alert.alert('Error', error, [{text: 'OK'}]);
          }
        }
      },
    });
  };

  console.log('user cateogry', userCategory);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Transfer Points</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>From:</Text>
            <Text style={styles.detailValue}>
              {userCategory === 'customer'
                ? customerId
                : userCategory === 'merchant'
                ? merchant_Id
                : terminalId}
            </Text>
            {/* <Text style={styles.detailValue}>{userDetails.name || ` ${customerId}`}</Text> */}
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To:</Text>
            <Text style={styles.detailValue}>
              {merchantName || `${receiverId}`}{' '}
              {/* Show merchantName or fallback to merchantId */}
            </Text>
          </View>

          {(fromSelectUser && userCategory === 'customer') ||
          (fromTransferHome && userCategory === 'customer') ? (
            <>
              <Text style={styles.label}>Select Merchant:</Text>
              <Picker
                selectedValue={selectedMerchant}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedMerchant(itemValue)
                }
                style={styles.picker}>
                <Picker.Item label="-- Choose a Merchant --" value="" />
                {pointsData.map((merchant, index) => (
                  <Picker.Item
                    key={index}
                    label={`${
                      merchant.merchant_name ? merchant.merchant_name : ''
                    } | ${merchant.merchant_id}`}
                    value={merchant.merchant_id}
                  />
                ))}
              </Picker>
            </>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder={
              (fromChooseMerchant || fromScanQR) && userCategory === 'merchant'
                ? 'Enter purchased amount'
                : 'Enter points to transfer'
            }
            keyboardType="numeric"
            value={points}
            onChangeText={setPoints}
            autoFocus={true}
          />

          <TouchableOpacity
            style={styles.transferButton}
            onPress={handleTransfer}
            // disabled={!customerId}
          >
            <Text style={styles.transferButtonText}>Transfer Points</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={navigateToHome}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F14242',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  transferButton: {
    backgroundColor: '#004BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#004BFF',
  },
  cancelButtonText: {
    color: '#004BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransferPoints;
