import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { Picker } from '@react-native-picker/picker';
import { addPaymentDetails } from '../Redux/slices/paymentDetailsSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RadioButton } from 'react-native-paper';

  const Payments = () => {
    const navigation = useNavigation();

    const formatDate = (date) => {
      const d = new Date(date);
      const day = (`0${d.getDate()}`).slice(-2);
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const dispatch=useDispatch();
    const [transactionId, setTransactionId] = useState('');
    const [date, setDate] = useState(formatDate(new Date())); // Today's date auto-filled
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [paidAmount,setPaidAmount] = useState(null);
    const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userCategory, setUserCategory] = useState(null);
    const [choice,setChoice] = useState(null);
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const userString = await AsyncStorage.getItem('user');
          console.log("User data from AsyncStorage:", userString);
          
          if (userString) {
            const user = JSON.parse(userString);
            console.log("Parsed user data:", user);
  
            // Set the loggedInUser state
            setLoggedInUser(user);
  // console.log(username);
  
            // Extract and set the user_category
            const category = user.user_category || 'User';
            setUserCategory(category);
  
            // Set user details
            setUserDetails({
              user_category: category,
              user_name:user.username,
              id: user.customer_id || user.merchant_id || user.corporate_id || 'N/A',
            });
          }
        } catch (error) {
          console.error('Error fetching user details from AsyncStorage:', error);
        }
      };
  
      fetchUserDetails();
    }, []);
    
    const handleDateInputChange = (text) => {
      setDate(text);
    };
  
    const validateDateFormat = (dateString) => {
      // Checks DD-MM-YYYY format
      const regex = /^\d{2}-\d{2}-\d{4}$/;
      return regex.test(dateString);
    };
  
    // console.log('user',loggedInUser);
    
    const handleSubmit =async () => {
      if (!transactionId) {
        Alert.alert('Error', 'Please enter a Transaction ID.');
        return;
      }
      if (!paidAmount) {
        Alert.alert('Error', 'Please enter a Paid Amount.');
        return;
      }
      if (!validateDateFormat(date)) {
        Alert.alert('Error', 'Please enter date in DD-MM-YYYY format.');
        return;
      }
      if (paymentMethod === 'option') {
        Alert.alert('Error', 'Please select a payment method.');
        return;
      }
  
      let plan_type;
      // if (choice === 'rental') {
      //   plan_type = 1;
      // } else {
      //   plan_type = 2;
      // }
      
      const data = {
        merchant: loggedInUser?.merchant_id,
        paid_amount: paidAmount,
        transaction_id: transactionId,
        payment_mode: paymentMethod,
        plan_type: 2,
      };
      

      console.log('data ', data);

      const res = await dispatch(addPaymentDetails(data));
      console.log(res);
      if(res?.payload.message) {
        Alert.alert('Success',res.payload.message ,[{
          text:'OK',
          onPress: () => navigation.goBack()
        }])
      } 
      if(res.error) {
        console.log('errrr',res.payload);
        Alert.alert(res?.payload);
        return;
      }
      // Alert.alert(
      //   'Payment Info Submitted!',
      //   'Amount will be reflected in 24hrs if details are genuine',
      //   [{ text: 'OK',
      //     onPress: () => navigation.goBack()
      //    }]
      // );
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>New Payment</Text>
  
        <Text style={styles.label}>Transaction ID:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Transaction ID"
          value={transactionId}
          onChangeText={setTransactionId}
        />
        <Text style={styles.label}>Paid Amount:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Paid Amount"
          value={paidAmount}
          onChangeText={setPaidAmount}
          keyboardType='phone-pad'
        />
  
        <Text style={styles.label}>Enter Date (DD-MM-YYYY):</Text>
        <TextInput
          style={styles.input}
          placeholder="DD-MM-YYYY"
          value={date}
          onChangeText={handleDateInputChange}
          keyboardType="numeric"
        />
  
        <Text style={styles.label}>Payment Method:</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Choose Option" value="option" />
            <Picker.Item label="UPI" value="UPI" />
            <Picker.Item label="Credit Card" value="Credit Card" />
            <Picker.Item label="Debit Card" value="Debit Card" />
            {/* <Picker.Item label="Bank Transfer" value="Bank Transfer" /> */}
          </Picker>
        </View>

       
        {/* <Text style={styles.label}>Select Plan Type:</Text>
        <View style={styles.radioRow}>
          <RadioButton
            value="rental"
            status={choice === 'rental' ? 'checked' : 'unchecked'}
            onPress={() => setChoice('rental')}
          />
          <Text 
            style={styles.radioLabel} 
            onPress={() => setChoice('rental')} // Added onPress to Text
          >
            Rental
          </Text>

          <RadioButton
            value="prepaid"
            status={choice === 'prepaid' ? 'checked' : 'unchecked'}
            onPress={() => setChoice('prepaid')}
          />
          <Text 
            style={styles.radioLabel} 
            onPress={() => setChoice('prepaid')} // Added onPress to Text
          >
            Prepaid
          </Text>
        </View> */}
  
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default Payments;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    heading: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      marginTop: 12,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 6,
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      overflow: 'hidden',
    },
    submitButton: {
      marginTop: 24,
      backgroundColor: '#004BFF',
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    submitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    radioRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    radioLabel: {
      marginRight: 20,
      fontSize: 16,
      color: '#444',
    },
  });
  