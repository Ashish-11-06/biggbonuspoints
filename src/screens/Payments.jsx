import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert,
  } from 'react-native';
  import React, { useState } from 'react';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import { Picker } from '@react-native-picker/picker';
  
  const Payments = () => {
    const [transactionId, setTransactionId] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
  
    const handleDateChange = (event, selectedDate) => {
      if (event.type === 'set') {
        const currentDate = selectedDate || date;
        setShowDatePicker(false);
        setDate(currentDate);
      } else {
        setShowDatePicker(false); // closes the picker when canceled
      }
    };
  
    const formatDate = (date) => {
      const d = new Date(date);
      const day = (`0${d.getDate()}`).slice(-2);
      const month = (`0${d.getMonth() + 1}`).slice(-2);
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };
  
    const handleSubmit = () => {
      Alert.alert(
        'Payment Info',
        'Amount will be reflected in 24hrs if details are genuine',
        [{ text: 'OK' }]
      );
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
  
        <Text style={styles.label}>Select Date:</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateInput}
        >
          <Text>{formatDate(date)}</Text>
        </TouchableOpacity>
  
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
  
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
            <Picker.Item label="Bank Transfer" value="Bank Transfer" />
          </Picker>
        </View>
  
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
    dateInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 6,
      backgroundColor: '#f9f9f9',
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      overflow: 'hidden',
    },
    submitButton: {
      marginTop: 24,
      backgroundColor: '#007bff',
      paddingVertical: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    submitText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  