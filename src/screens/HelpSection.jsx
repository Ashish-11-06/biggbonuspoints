import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { addHelpQuery } from '../Redux/slices/helpSectionSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HelpSection = () => {
  const [query, setQuery] = useState('');
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [terminal,setTerminal] = useState(null);
  const [terminalMerchant,setTerminalMerchant] = useState(null);

  const dispatch = useDispatch();

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
console.log('userrr',user);
if(user?.user_category === 'terminal') {
  setTerminal(user.terminal_id);
  setTerminalMerchant(user.merchant_id);
}
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
  const handleSubmit = async () => {
    let data;
  
    if (userDetails.user_category === 'customer') {
      data = {
        issue_description: query,
        customer: userDetails.id,
        // merchant: null,
      };
    } else if (userDetails.user_category === 'merchant') {
      data = {
        issue_description: query,
        // customer: null,
        merchant: userDetails.id,
      };
    } else if(userDetails.user_category === 'terminal') {
      data = {
        issue_description: query,
        // customer: null,
        merchant:terminalMerchant,
        terminal:terminal
      }
    }
    console.log('data', data);
  
    try {
      const res = await dispatch(addHelpQuery(data)); // Use unwrap to handle success
      console.log('Response:', res.payload.message);
  
      Alert.alert('Success', res?.payload.message || 'Query submitted successfully');
      setQuery(''); // Clear the input field after submission
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error || 'Failed to submit query');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Help & Support</Text>

        <TextInput
          style={styles.input}
          placeholder="Query / question"
          placeholderTextColor="#aaa"
          value={query}
          onChangeText={setQuery}
          height={100} // Increased height for the input box
          multiline={true} // Allow multiple lines
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            If you are facing any issues, please contact our customer support.
            {"\n"}
            Contact Number:{" "}
            <Text style={styles.contactNumber}>9876543210</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    width: '100%', // Ensure input spans full width
    rows:4,
    height: 100, // Increased height for the input box
  },
  button: {
    backgroundColor: '#004BFF',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    width: '50%', // Adjust button width
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center', // Center text horizontally
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'center', // Center text
  },
  contactNumber: {
    color: '#0000FF',
    fontWeight: 'bold',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
    alignItems: 'center', // Center content inside the card
  },
});

export default HelpSection;
