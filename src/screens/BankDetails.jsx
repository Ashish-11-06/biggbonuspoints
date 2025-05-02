import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { fetchBankDetails, fetchBankDetailsById } from '../Redux/slices/bankDetailsSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';

const BankDetails = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const [bankDetails, setBankDetails] = useState(null);
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userCategory, setUserCategory] = useState(null);
  const [bankData, setBankData] = useState({});
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

  useEffect(() => {
    const fetchBankDetailsByIdOnce = async () => {
      try {
        const user_id = userDetails.id;
        let user_category;
         user_category = userDetails.user_category;
         if(userDetails.user_category === 'terminal') {
          user_category = 'merchant'
         }
        setLoading(true); 
        if (user_id && user_category) {
          console.log("User ID:", user_id);
          console.log("User Category:", user_category);
  try {
    const res = await dispatch(fetchBankDetailsById({ user_id, user_category }));
    console.log("Bank Details Response:", res);
    console.log("Bank Details Response Payload:", res?.payload);

    if (res?.payload) {
      const bankDetailsData = res.payload[0];

      const fetchedData = {
        accountHolder: bankDetailsData.account_holder_name || '',
        accountNumber: bankDetailsData.account_number || '',
        bankName: bankDetailsData.bank_name || '',
        ifscCode: bankDetailsData.ifsc_code || '',
        branch: bankDetailsData.branch || '',
    };
console.log('fetched dataaa',fetchedData);

      setBankData(fetchedData);
      setFormData(fetchedData);  // ✅ important
    }
  } catch (error) {
    console.log(error);  
  }  finally {
    setLoading(false); // 👈 Stop loading whether success or error
  }
         
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
        Alert.alert('Error', 'Failed to fetch bank details');
      }
    };
  
    if (userDetails.id && userDetails.user_category) {
      fetchBankDetailsByIdOnce();
    }
  }, [loggedInUser,dispatch]);
  

  console.log("Bank Detailssss:", bankDetails);
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    branch: '',
  });

  const handleEdit = () => {
    setFormData(bankData); // Populate form with existing data
    setIsEditing(true);
  };
console.log(loggedInUser);
console.log(userDetails);


  const handleSubmit =async () => {
    setBankData(formData);
    const user_id=userDetails.id;
    console.log('Updated Bank Data:', formData);
    const data={
      account_holder_name: formData.accountHolder,
      account_number: formData.accountNumber,
      bank_name: formData.bankName,
      ifsc_code: formData.ifscCode,
      branch: formData.branch,
      user_id:user_id,
    };
    
    try {
    const res= await dispatch(fetchBankDetails({user_id:user_id,user_category:userDetails.user_category,data}));
    console.log(res?.payload.message);
     Alert.alert('Success', res?.payload.message || 'Bank details added successfullyyyy');
         
    // Fetch updated bank details after successful submission
    const updatedRes = await dispatch(fetchBankDetailsById({ user_id, user_category: userDetails.user_category }));
    console.log("Updated Bank Details Response:", updatedRes);
    if (updatedRes?.payload) {
      setBankDetails(updatedRes?.payload);
    }
        } catch (error) {
          console.error('Error:', error);
          Alert.alert('Error', error || 'Failed to submit bank details');
        }
    
    setIsEditing(false);
    Alert.alert("Bank Details Updated", `Account Holder: ${formData.accountHolder}`);
  };

  if (!isEditing && bankData) {
    return (
      <View style={styles.container}>
      <Text style={styles.heading}>Bank Details</Text>

      {loading ? (
        // Show loader while loading
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#9F86C0" />
        </View>
      ) : (
        // Show bank details after loading
        <View>
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Account Holder:</Text>
            <Text style={styles.value}>{bankData.accountHolder}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Account Number:</Text>
            <Text style={styles.value}>{bankData.accountNumber}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Bank Name:</Text>
            <Text style={styles.value}>{bankData.bankName}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>IFSC Code:</Text>
            <Text style={styles.value}>{bankData.ifscCode}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Branch:</Text>
            <Text style={styles.value}>{bankData.branch}</Text>
          </View>

        {userCategory !== 'terminal' ? (
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={handleEdit} color="#9F86C0" />
          </View>
      ) : null}
        </View>
      )}
    </View>
  
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Bank Details</Text>

      <Text style={styles.label}>Account Holder Name</Text>
      <TextInput
        style={styles.input}
        value={formData.accountHolder}
        onChangeText={(text) => setFormData({ ...formData, accountHolder: text })}
        placeholder="Enter name"
      />

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={formData.accountNumber}
        onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
        placeholder="Enter account number"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Bank Name</Text>
      <TextInput
        style={styles.input}
        value={formData.bankName}
        onChangeText={(text) => setFormData({ ...formData, bankName: text })}
        placeholder="Enter bank name"
      />

      <Text style={styles.label}>IFSC Code</Text>
      <TextInput
        style={styles.input}
        value={formData.ifscCode}
        onChangeText={(text) => setFormData({ ...formData, ifscCode: text })}
        placeholder="Enter IFSC code"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Branch</Text>
      <TextInput
        style={styles.input}
        value={formData.branch}
        onChangeText={(text) => setFormData({ ...formData, branch: text })}
        placeholder="Enter branch name"
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} color="#9F86C0" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#9F86C0',
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#9F86C0',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  buttonContainer: {
    marginTop: 10,
    alignSelf: 'center',
    width: '60%',
  },
});

export default BankDetails;
