import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { addNewNumber, verifyNewNumber } from '../Redux/slices/changeMobileNoSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const ChangeMobileNo = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [choice, setChoice] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [pin, setPin] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [resendOtpVisible, setResendOtpVisible] = useState(false);
  const [countdown, setCountdown] = useState(0); // Add countdown state
  const [verifyLoading, setVerifyLoading] = useState(false); // Add loading state for OTP verification

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

  useEffect(() => {
    if (isOtpSent) {
      const timer = setTimeout(() => {
        setResendOtpVisible(true);
      }, 60000); // 1 minute

      return () => clearTimeout(timer);
    }
  }, [isOtpSent]);

  const startCountdown = () => {
    setCountdown(30); // Set countdown to 30 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleUpdate = async () => {
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      Alert.alert("Invalid Number", "Please enter a valid 10-digit mobile number.");
      return;
    }
  
    let data = {
      new_mobile: mobile,
      ...(userDetails.user_category === 'customer' ? { customer: userDetails.id } : { merchant: userDetails.id }),
    };
  
    if (choice === 'pin') {
      data.pin = pin;
    } else if (choice === 'security_question') {
      data.security_question = securityQuestion;
      data.security_answer = securityAnswer;
    }
  
    console.log('data', data);
  
    const res = await dispatch(addNewNumber(data));
    console.log('res', res);
  console.log('request id',res.payload.request_id);
  
    if (res?.payload.message) {
      setNewMobile(res.payload.new_mobile);
      setRequestId(res.payload.request_id);
      Alert.alert(res.payload.message);
    }
  
    setIsOtpSent(true);
    // Alert.alert("OTP Sent", "An OTP has been sent to your mobile number.");
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }
  
    setVerifyLoading(true); // Start loader
    let data;
    if (userDetails.user_category === 'customer') {
      data = {
        customer_id: userDetails.id,
        new_mobile: Number(newMobile),
        new_mobile_otp: Number(otp),
      };
    } else if (userDetails.user_category === 'merchant') {
      data = {
        new_mobile: Number(newMobile),
        new_mobile_otp: Number(otp),
        merchant_id: userDetails.id,
      };
    }
  
    const res = await dispatch(verifyNewNumber(data));
    console.log('Verify OTP response:', res);
    if (res?.message) { 
      Alert.alert('Success', res.message);
    }
    
    setVerifyLoading(false); // Stop loader
  
    if (res.message) {
      Alert.alert('Success', res.message);
      setIsOtpSent(false);
      setMobile('');
      setOtp('');
    }
  
    if (res.error) {
      Alert.alert(res.error);
      setIsOtpSent(false);
      setMobile('');
      setOtp('');
      return;
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return; // Prevent resending if countdown is active

    let data = {
      new_mobile: newMobile,
      ...(userDetails.user_category === 'customer' ? { customer: userDetails.id } : { merchant: userDetails.id }),
    };
  
    const res = await dispatch(addNewNumber(data));
    console.log('Resend OTP response:', res);
  
    if (res?.payload.message) {
      Alert.alert(res.payload.message);
      startCountdown(); // Start countdown after resending OTP
    }
  
    setResendOtpVisible(false);
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

        <View style={styles.radioRow}>
          <RadioButton
            value="pin"
            status={choice === 'pin' ? 'checked' : 'unchecked'}
            onPress={() => setChoice('pin')}
          />
          <Text 
            style={styles.radioLabel} 
            onPress={() => setChoice('pin')} // Added onPress to Text
          >
            PIN
          </Text>

          <RadioButton
            value="security_question"
            status={choice === 'security_question' ? 'checked' : 'unchecked'}
            onPress={() => setChoice('security_question')}
          />
          <Text 
            style={styles.radioLabel} 
            onPress={() => setChoice('security_question')} // Added onPress to Text
          >
            Security Question
          </Text>
        </View>

        {choice === 'pin' && (
          <TextInput
            style={styles.input}
            placeholder="Enter PIN"
            keyboardType="numeric"
            value={pin}
            onChangeText={setPin}
            maxLength={4}
          />
        )}

        {choice === 'security_question' && (
          <>
            <Picker
              selectedValue={securityQuestion}
              onValueChange={(value) => setSecurityQuestion(value)}
              style={[styles.picker, { height: 60 }]} // Increased height
            >
              <Picker.Item label="Select a security question" value="" />
              <Picker.Item label="What is your pet's name?" value="pet_name" />
              <Picker.Item label="What is your mother's maiden name?" value="mother_maiden" />
              <Picker.Item label="What was your first school?" value="first_school" />
            </Picker>
            <TextInput
              style={[styles.input, { height: 50 }]} // Increased height
              placeholder="Answer"
              value={securityAnswer}
              onChangeText={setSecurityAnswer}
            />
          </>
        )}

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
              <TouchableOpacity
                style={styles.buttonBackground}
                onPress={handleVerifyOtp}
                disabled={verifyLoading} // Disable button while loading
              >
                {verifyLoading ? (
                  <Text style={styles.buttonText}>Verifying...</Text>
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </View>
            {resendOtpVisible && (
              <View style={styles.button}>
                <TouchableOpacity
                  style={styles.buttonBackground}
                  onPress={handleResendOtp}
                  disabled={countdown > 0} // Disable button during countdown
                >
                  <Text style={styles.buttonText}>
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {!isOtpSent && (
          <View style={styles.button}>
            <TouchableOpacity style={styles.buttonBackground} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Verify Number</Text>
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
    backgroundColor: '#004BFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  picker: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default ChangeMobileNo;
