import React, {useEffect, useRef, useState} from 'react';
import {
  Dialog,
  Portal,
  Button,
  Text,
  TextInput,
  Snackbar,
  RadioButton,
} from 'react-native-paper';
import {Alert, StyleSheet, View} from 'react-native';
import ResetPinDialog from './ResetPinDialog'; // Import the new component
import {getSecurityQuestions} from '../Redux/slices/securityQuestionsSlice';
import {useDispatch} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {changePin, verifyPinOtp, verifyPinSecurity} from '../Redux/slices/changePinSlice';

const ForgotPinDialog = ({visible, onDismiss, onSubmit}) => {
  const mobileRef = useRef(''); // Use ref for mobile number
  const dispatch = useDispatch();
  const otpRef = useRef(''); // Use ref for OTP
  const pinRef = useRef('');
  const securityQuestionRef = useRef('');
  const securityAnswerRef = useRef(''); // Use ref for security question answer
  const [otpRequested, setOtpRequested] = useState(false);
  const [showResetPinDialog, setShowResetPinDialog] = useState(false); // State to control ResetPinDialog visibility
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [choice, setChoice] = useState(''); // State to manage radio button choice
  const [securityQuestions, setSecurityQuestions] = useState([]); // State to store security questions
  const [selectedQuestion, setSelectedQuestion] = useState(''); // Use '' as default
  const [answer, setAnswer] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('');
  const [pin, setPin] = useState(''); // State to manage PIN input

  const showSnackbar = message => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        const response = await dispatch(getSecurityQuestions());
        // console.log('Security Questions:', response);
        setSecurityQuestions(response?.payload.questions); // Assuming response contains the questions
      } catch (error) {
        console.error('Error fetching security questions:', error);
      }
    };
    fetchSecurityQuestions();
  }, []);

const closeDailogue =() => {
    onDismiss();
}

  const onRequestOTP = async () => {
    let requestData;
    if (!selectedUserType) {
      showSnackbar('Please select a user type.');
      return;
    }
    if (choice === 'otp') {
      if (mobileRef.current.length !== 10) {
        showSnackbar('Enter a valid 10-digit mobile number.');
        setOtpRequested(false);
      } else {
        requestData = {
          mobile: Number(mobileRef.current),
          user_category: selectedUserType,
          pin:pinRef.current,
          method:'otp'
        };
        // setOtpRequested(true);
      }
    } else if (choice === 'security_question') {
      //   if (!selectedQuestion) {
      //     showSnackbar('Please select a security question.');
      //     return;
      //   }
      //   if (!answer) {
      //     showSnackbar('Please enter your answer.');
      //     return;
      //   }
      requestData = {
        // security_question: selectedQuestion, // This is the id
        // answer: answer,
        pin: pinRef.current,
        user_category: selectedUserType,
        method: 'security',
        mobile: Number(mobileRef.current),
      };
      // setOtpRequested(true);
    }

    console.log('Request Data:', requestData);
    const res = await dispatch(changePin(requestData));
    console.log('Response from changePin:', res);
    if(choice === 'otp') {
        if(res?.payload.message) {
            Alert.alert('Success',res.payload.message)
        }
    }

    if (res?.payload.message) {
      setOtpRequested(true);
      Alert.alert('Success',res?.payload.message)
    //   showSnackbar(res?.payload.message || 'OTP sent successfully.');
    }
  }; // <-- Fix: close onRequestOTP here

  const onOk = async () => {
    if (choice === 'otp') {
      if (!otpRef.current) {
        showSnackbar('Please enter OTP.');
      } else if (otpRef.current.length !== 6) {
        showSnackbar('OTP must be 6 digits.');
      } else {
        const data={
            otp:Number(otpRef.current),
            user_category:selectedUserType,
            mobile:Number(mobileRef.current),
            pin:pin
        }
        console.log('request data ',data);
        
        const res = await dispatch(verifyPinOtp(data));
        console.log('res',res);
        if(res?.payload.message) {
            Alert.alert('Success',res.payload.message)
        }
        
        console.log('Submitting OTP...');
        // Simulate OTP verification success
        // setShowResetPinDialog(true); // Show the ResetPinDialog
        setOtpRequested(false);
        onDismiss();
      }
    } else if (choice === 'security_question') {
      if (choice === 'security_question') {
        const data = {
          user_category: selectedUserType,
          mobile: Number(mobileRef.current),
          security_question: selectedQuestion,
          answer: answer,
        };
        console.log('data', data);
        const res = await dispatch(verifyPinSecurity(data));
        if (res.meta.requestStatus === 'fulfilled') {
          console.log('Success:', res.payload);
          Alert.alert('Success',res.payload.message,
            [
                { text: 'OK', onPress:() =>{closeDailogue}}
            ]
          )
        } else {
        //   console.log('Failed:', res.payload); // This is what rejectWithValue 
          Alert.alert('Error',res.payload);
        }
      }
    }
  };

  //   console.log('Security Questions:', securityQuestions);

  // Add a function to reset all dialog state
  const resetDialogState = () => {
    setOtpRequested(false);
    setShowResetPinDialog(false);
    setSnackbarVisible(false);
    setSnackbarMessage('');
    setChoice('');
    setSelectedQuestion('');
    setAnswer('');
    mobileRef.current = '';
    otpRef.current = '';
    securityQuestionRef.current = '';
    securityAnswerRef.current = '';
  };

  // Update onCancel to reset state and call onDismiss
  const onCancel = () => {
    resetDialogState();
    onDismiss();
  };

  // Also reset state when dialog is dismissed via overlay or parent
  useEffect(() => {
    if (!visible) {
      resetDialogState();
    }
  }, [visible]);

  const handleResetPin = newPin => {
    console.log('New PIN:', newPin);
    // Call the onSubmit callback with the new PIN
    onSubmit({mobile: mobileRef.current, otp: otpRef.current, newPin});
    setShowResetPinDialog(false); // Close the ResetPinDialog
    onDismiss(); // Close the ForgotPinDialog
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>Forgot PIN?</Dialog.Title>
        <Dialog.Content>
          {/* <Text>Enter your registered mobile number to reset your PIN.</Text> */}
          {/* <Text style={styles.userText}>Select User Type</Text> */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedUserType}
              onValueChange={itemValue => setSelectedUserType(itemValue)}
              style={styles.picker}>
              <Picker.Item label="Select a user type" value="" />
              <Picker.Item label="Customer" value="customer" />
              <Picker.Item label="Merchant" value="merchant" />
              <Picker.Item label="Terminal" value="terminal" />
            </Picker>
          </View>
          <View style={styles.radioRow}>
            <View style={styles.radioOption}>
              <RadioButton
                value="otp"
                status={choice === 'otp' ? 'checked' : 'unchecked'}
                onPress={() => setChoice('otp')}
                color="#004BFF"
              />
              <Text style={styles.radioLabel} onPress={() => setChoice('otp')}>
                OTP
              </Text>
            </View>
            <View style={styles.radioOption}>
              <RadioButton
                value="security_question"
                status={
                  choice === 'security_question' ? 'checked' : 'unchecked'
                }
                onPress={() => setChoice('security_question')}
                color="#004BFF"
              />
              <Text
                style={styles.radioLabel}
                onPress={() => setChoice('security_question')}>
                Security Question
              </Text>
            </View>
          </View>
          {/* {choice === 'security_question' && otpRequested  && (
            <>
              <Picker
                selectedValue={selectedQuestion}
                onValueChange={value => setSelectedQuestion(value)}
                style={styles.picker}>
                <Picker.Item label="Select a security question" value="" />
                {securityQuestions &&
                  securityQuestions.map(q => (
                    <Picker.Item
                      key={q.id}
                      label={q.question}
                      value={q.id.toString()}
                    />
                  ))}
              </Picker>
              <TextInput
                label="Answer"
                mode="outlined"
                value={answer}
                onChangeText={text => setAnswer(text)}
                style={styles.input}
              />
            </>
          )} */}

          {!otpRequested && (
            <TextInput
              label="Mobile Number"
              mode="outlined"
              keyboardType="phone-pad"
              defaultValue={mobileRef.current}
              onChangeText={text => (mobileRef.current = text)}
              maxLength={10}
              style={{marginTop: 10}}
            />
          )}
          {!otpRequested && (
            <TextInput
              label="Enter new PIN"
              mode="outlined"
              defaultValue={pinRef.current}
              onChangeText={text => (pinRef.current = text)}
              keyboardType="numeric"
              maxLength={4}
              style={{marginTop: 10}}
            />
          )}

          {choice === 'security_question' && otpRequested && (
            <>
              <Picker
                selectedValue={selectedQuestion}
                onValueChange={value => setSelectedQuestion(value)}
                style={styles.picker}>
                <Picker.Item label="Select a security question" value="" />
                {securityQuestions &&
                  securityQuestions.map(q => (
                    <Picker.Item
                      key={q.id}
                      label={q.question}
                      value={q.question}
                    />
                  ))}
              </Picker>
              <TextInput
                label="Answer"
                mode="outlined"
                value={answer}
                onChangeText={text => setAnswer(text)}
                style={styles.input}
              />
            </>
          )}
          {otpRequested && choice !== 'security_question' && (
            <TextInput
              label="OTP"
              mode="outlined"
              defaultValue={otpRef.current}
              onChangeText={text => (otpRef.current = text)}
              keyboardType="numeric"
              maxLength={6}
              style={{marginTop: 10}}
            />
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancel</Button>
          {otpRequested ? (
            <Button onPress={onOk}>Submit</Button>
          ) : (
            <Button onPress={onRequestOTP}>
              {choice === 'otp' ? 'Request OTP' : 'Verify'}
            </Button>
          )}
        </Dialog.Actions>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={500}
          style={styles.snackbar}>
          {snackbarMessage}
        </Snackbar>
      </Dialog>

      {/* Render the ResetPinDialog */}
      <ResetPinDialog
        visible={showResetPinDialog}
        onDismiss={() => setShowResetPinDialog(false)}
        onSubmit={handleResetPin}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    // Custom styles for Snackbar
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  radioLabel: {
    fontSize: 16,
    color: '#444',
  },
  userText: {
    fontSize: 16,
    color: '#444',
  },
});

export default ForgotPinDialog;
