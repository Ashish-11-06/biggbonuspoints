import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { addAdditinalDetails, addAdditinalDetailsMerchant, fetchAdditionalDetails, fetchAdditionalDetailsMerchant} from '../Redux/slices/additionalDetailsSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MerchantForm = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null); // New state for profile data
  const fieldLabels = {
    user_category: 'User Category',
    first_name: 'First Name',
    last_name: 'Last Name',
    id: 'User ID',
    mobile_number: 'Mobile Number',
    age: 'Age',
    gender: 'Gender',
    city: 'City',
    state: 'State',
    country: 'Country',
    pincode: 'Pincode',
    address: 'Address',
    aadhar_number: 'Aadhar Number',
    pan_number: 'PAN Number',
    shopName: 'Shop Name',
    // registerShopName: 'Registered Shop Name',
    gst: 'GST Number',
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        console.log("User data from AsyncStorage:", userString);

        if (userString) {
          const user = JSON.parse(userString);
          console.log("Parsed user data:", user);

          setLoggedInUser(user);
          const category = user.user_category || 'User';
          setUserCategory(category);

          const initialDetails = {
            user_category: category,
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            id: user.customer_id || user.merchant_id || user.corporate_id || 'N/A',
            mobile_number: user.mobile_number || '', // Add mobile number if available
            age: user.age || '',
            gender: user.gender || '',
            city: user.city || '',
            state: user.state || '',
            country: user.country || '',
            pincode: user.pincode || '',
            address: user.address || '',
            aadhar_number: user.aadhar_number || '',
            pan_number: user.pan_number || '',
            shopName: user.shopName || '',
            // registerShopName: user.registerShopName || '',
            gst: user.gst || '',
          };

          setUserDetails(initialDetails);

          // Pre-fill form fields
          Object.keys(initialDetails).forEach((key) => {
            setValue(key, initialDetails[key]);
          });
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails();
  }, []);
// console.log(loggedInUser.id);
console.log(userDetails.id);


  useEffect(() => {
    const fetchAdditinalDetails = async () => {
      const userId = loggedInUser?.customer_id || loggedInUser?.merchant_id || loggedInUser?.corporate_id || 'N/A';
     let response = null;
      if(loggedInUser?.user_category === 'customer') {
         response = await dispatch(fetchAdditionalDetails(userId));
      } else if(loggedInUser?.user_category === 'merchant') {
          response = await dispatch(fetchAdditionalDetailsMerchant(userId));
      }
      console.log('Fetched additional details:', response?.payload.profile_data);
      
      const fetchedData = response?.payload.profile_data;
      setProfileData(fetchedData); // Set fetched data to profileData

      if (fetchedData) {
        const updatedUserDetails = {
          user_category: loggedInUser?.user_category || 'User',
          first_name: fetchedData.first_name || '', // Separate first_name
          last_name: fetchedData.last_name || '', // Separate last_name
          id: fetchedData.customer_id || fetchedData.merchant_id || fetchedData.corporate_id || 'N/A',
          age: fetchedData.age?.toString() || '', // Ensure age is converted to string
          gender: fetchedData.gender || '',
          city: fetchedData.city || '',
          state: fetchedData.state || '',
          country: fetchedData.country || '',
          pincode: fetchedData.pincode?.toString() || '', // Ensure pincode is converted to string
          address: fetchedData.address || '',
          aadhar_number: fetchedData.aadhar_number || '',
          pan_number: fetchedData.pan_number || '',
          shopName: fetchedData.shopName || '',
          // registerShopName: fetchedData.registerShopName || 'Shop Name',
          gst: fetchedData.gst || '',
        };
console.log('update data payload',updatedUserDetails)
        setUserDetails(updatedUserDetails); // Update userDetails using profileData

        // Pre-fill form fields if profile is updated
        if (loggedInUser?.is_profile_updated) {
          Object.keys(updatedUserDetails).forEach((key) => {
            setValue(key, updatedUserDetails[key]);
          });
        }
      }
    };
    fetchAdditinalDetails();
  }, [loggedInUser, dispatch]);
  
  const onSubmit = async (data) => {
    console.log('hello');
    
    console.log('Form submitted:', data);
    let res=null;
    if(loggedInUser?.user_category === 'customer') {
      res = await dispatch(addAdditinalDetails({ userId: userDetails.id, data }));
    }
    else if(loggedInUser?.user_category === 'merchant') {
     res = await dispatch(addAdditinalDetailsMerchant({ userId: userDetails.id, data }));
    }
    console.log(res);
    Alert.alert('Form Submitted');
    setIsEditing(false); // Exit edit mode after submission

    // Fetch updated details
    const userId = loggedInUser?.customer_id || loggedInUser?.merchant_id || loggedInUser?.corporate_id || 'N/A';
    const response = await dispatch(fetchAdditionalDetails(userId));
    console.log('Updated additional details:', response?.payload.profile_data);
    setProfileData(response?.payload.profile_data);

    if (response?.payload.profile_data) {
      const updatedData = response.payload.profile_data;
      const updatedUserDetails = {
        user_category: loggedInUser?.user_category || 'User',
        first_name: updatedData.first_name || '', // Separate first_name
        last_name: updatedData.last_name || '', // Separate last_name
        id: updatedData.customer_id || updatedData.merchant_id || updatedData.corporate_id || 'N/A',
        age: updatedData.age?.toString() || '', // Ensure age is converted to string
        gender: updatedData.gender || '',
        city: updatedData.city || '',
        state: updatedData.state || '',
        country: updatedData.country || '',
        pincode: updatedData.pincode?.toString() || '', // Ensure pincode is converted to string
        address: updatedData.address || '',
        aadhar_number: updatedData.aadhar_number || '',
        pan_number: updatedData.pan_number || '',
        shopName: updatedData.shopName || '',
        // registerShopName: updatedData.registerShopName || '',
        gst: updatedData.gst || '',
      };

      setUserDetails(updatedUserDetails);
console.log('hiii');

      // Update form fields with the latest data
      Object.keys(updatedUserDetails).forEach((key) => {
        setValue(key, updatedUserDetails[key]);
      });
    }
  };

console.log(loggedInUser);

const handleEdit = () => {
  Object.keys(userDetails).forEach((key) => {
    setValue(key, userDetails[key]); // Pre-fill form fields with existing data
  });
  setIsEditing(true);
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Additional Information</Text>

      {loggedInUser?.is_profile_updated && !isEditing ? (
        // Display user details in text fields
        <>
          {Object.keys(userDetails).reduce((rows, key, index) => {
            if (index % 2 === 0) {
              rows.push([key]);
            } else {
              rows[rows.length - 1].push(key);
            }
            return rows;
          }, []).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.rowContainer}>
              {row.map((key) => (
                <View key={key} style={styles.halfWidthContainer}>
                  <Text>{fieldLabels[key] || key}</Text>
                  <TextInput
                    style={[styles.input, { backgroundColor: '#f9f9f9', borderColor: '#9F86C0' }]} // Reverted styling
                    value={userDetails[key]}
                    editable={false}
                  />
                </View>
              ))}
            </View>
          ))}
          <Button title="Edit" onPress={handleEdit} color="#9F86C0" />
        </>
      ) : (
        // Show form for input or editing
        <>
          {Object.keys(userDetails).map((key) => (
            <View key={key} style={styles.inputContainer}>
              <Text>{fieldLabels[key] || key}</Text>
              {key === 'user_category' ? (
                <TextInput
                  style={[styles.input, { backgroundColor: '#f9f9f9', borderColor: '#9F86C0' }]}
                  value={userDetails[key]}
                  editable={false} // Make user_category non-editable
                />
              ) : key === 'state' ? (
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[styles.input, styles.picker]} // Added picker-specific styling
                      enabled={isEditing || !loggedInUser?.is_profile_updated}
                    >
                      <Picker.Item label="Select State" value="" />
                      { [
                        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat',
                        'Haryana', 'Himachal Pradesh', 'Jammu', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
                        'Maharashtra', 'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
                        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
                      ].map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                      ))}
                    </Picker>
                  )}
                  name={key}
                />
              ) : key === 'gender' ? (
                <Controller
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Picker
                      selectedValue={value}
                      onValueChange={onChange}
                      style={[styles.input, styles.picker]} // Added picker-specific styling
                      enabled={isEditing || !loggedInUser?.is_profile_updated}
                    >
                      <Picker.Item label="Select Gender" value="" />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  )}
                  name={key}
                />
              ) : (
                <Controller
                  control={control}
                  rules={{
                    required: key !== 'aadhar_number' && key !== 'pan_number' && key !== 'gst',
                    pattern: key === 'mobile_number' ? /^[0-9]{10}$/ : key === 'aadhar_number' ? /^[0-9]{12}$/ : undefined, // Validate 10-digit mobile number or 12-digit aadhar
                    minLength: key === 'pincode' ? 6 : undefined, // Minimum length for pincode
                    maxLength: key === 'pincode' ? 6 : undefined, // Maximum length for pincode
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      editable={isEditing || !loggedInUser?.is_profile_updated}
                      keyboardType={key === 'mobile_number' || key === 'aadhar_number' || key === 'pincode' || key === 'age' ? 'numeric' : 'default'} // Numeric keyboard for specific fields
                    />
                  )}
                  name={key}
                />
              )}
              {errors[key] && (
                <Text style={styles.error}>
                  {key === 'mobile_number' && 'Mobile number must be 10 digits.'}
                  {key === 'pincode' && 'Pincode must be 6 digits.'}
                  {key === 'aadhar_number' && 'Aadhar number must be 12 digits.'}
                  {key !== 'aadhar_number' && key !== 'pan_number' && key !== 'gst' && `${fieldLabels[key] || key} is required.`}
                </Text>
              )}
            </View>
          ))}
          <Button title="Submit" onPress={handleSubmit(onSubmit)} color="#9F86C0" />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#9F86C0',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfWidthContainer: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    borderColor: '#9F86C0',
    backgroundColor: '#f9f9f9',
    marginTop: 5,
  },
  picker: {
    height: 50, // Adjust height for better alignment
    borderWidth: 1,
    borderColor: '#9F86C0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
});

export default MerchantForm;
