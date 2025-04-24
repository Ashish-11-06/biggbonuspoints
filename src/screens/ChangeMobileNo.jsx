import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { addNewNumber, verifyNewNumber } from '../Redux/slices/changeMobileNoSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeMobileNo = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
 const [requestId, setRequestId] = useState(null);

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
console.log('user',userDetails);

  const handleUpdate =async () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit mobile number.");
      return;
    }
    let data;
    if(userDetails.user_category === 'customer'){ 
    data={
      new_mobile:mobile,
      customer:userDetails.id, 
    } 
  } else {
    data={
      new_mobile:mobile,
      merchant:userDetails.id, 
    }
  }
  console.log('data',data);
  
  const res=await dispatch(addNewNumber(data));
  console.log('res',res);
  if(res?.payload.message) {
    setRequestId(res.payload.request_id);
    Alert.alert(res.payload.message);
  }
    setIsOtpSent(true);
    Alert.alert("OTP Sent", "An OTP has been sent to your mobile number.");
  };

  const handleVerifyOtp =async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }
    const data={
      request_id:requestId,
      otp:otp,
    }
const res=await dispatch(verifyNewNumber(data));
console.log('res',res);
if(res.message) {
  Alert.alert(res.message);
  setIsOtpSent(false);
  setMobile('');
  setOtp('');
}
if(res.error) {
  Alert.alert(res.error);
  setIsOtpSent(false);
  setMobile('');
  setOtp('');
  return;
}
    // Alert.alert("Success", `Your mobile number ${mobile} has been updated successfully.`);
   
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.heading}>Change Mobile Number</Text>

        <Text style={styles.label}>New Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new mobile number"
          keyboardType="numeric"
          value={mobile}
          onChangeText={setMobile}
          maxLength={10}
        />

        {isOtpSent && (
          <>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
            />
            <View style={styles.button}>
              <TouchableOpacity style={styles.buttonBackground} onPress={handleVerifyOtp}>
                <Text style={styles.buttonText}>Verify OTP</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!isOtpSent && (
          <View style={styles.button}>
            <TouchableOpacity style={styles.buttonBackground} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Update Number</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '60%',
    alignSelf: 'center',
  },
  buttonBackground: {
    backgroundColor: '#9F86C0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangeMobileNo;
