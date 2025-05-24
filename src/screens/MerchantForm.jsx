import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, Image, TouchableOpacity, BackHandler } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { addAdditinalDetails, addAdditinalDetailsMerchant, fetchAdditionalDetails, fetchAdditionalDetailsMerchant} from '../Redux/slices/additionalDetailsSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const MerchantForm = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm();
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState([]); // New state for profile data
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
    shop_name: 'Shop Name',
    gst_number: 'GST Number',
    logo_data:'Logo',
  };

  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        // console.log("User data from AsyncStorage:", userString);

        if (userString) {
          const user = JSON.parse(userString);
          // console.log("Parsed user data:", user);

          setLoggedInUser(user);
          const category = user.user_category || 'User';
          setUserCategory(category);
          // console.log('userrrrr 52',user);
          
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
            shop_name: user.shop_name || '',
            // registershop_name: user.registershop_name || '',
            gst_number: user.gst_number || '',
            logo_data: user.logo_data || '',
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

//     const fetchAdditinalDetails = async () => {
//       const userId = userDetails?.customer_id || userDetails?.merchant_id || userDetails?.corporate_id || 'N/A';
//      let response = null;
//       if(userDetails?.user_category === 'customer') {
//         console.log('cust');
        
//          response = await dispatch(fetchAdditionalDetails(userId));
//       } else if(userDetails?.user_category === 'merchant') {
//         console.log('merchant');
        
//           response = await dispatch(fetchAdditionalDetailsMerchant(userId));
//       }
//       console.log('res',response);
      
//       console.log('Fetched additional details:', response?.payload.profile_data);
      
//       const fetchedData = response?.payload.profile_data;
//       setProfileData(fetchedData); // Set fetched data to profileData
//       console.log('fetched Data 109:', fetchedData);
      
//       if (fetchedData) {
//         const initialDetails  = {
//           user_category: loggedInUser?.user_category || 'User',
//           first_name: fetchedData.first_name || '', // Separate first_name
//           last_name: fetchedData.last_name || '', // Separate last_name
//           id: fetchedData.customer_id || fetchedData.merchant_id || fetchedData.corporate_id || 'N/A',
//           age: fetchedData.age?.toString() || '', // Ensure age is converted to string
//           gender: fetchedData.gender || '',
//           city: fetchedData.city || '',
//           state: fetchedData.state || '',
//           country: fetchedData.country || '',
//           pincode: fetchedData.pincode?.toString() || '', // Ensure pincode is converted to string
//           address: fetchedData.address || '',
//           aadhar_number: fetchedData.aadhar_number || '',
//           pan_number: fetchedData.pan_number || '',
//           shop_name: fetchedData.shop_name || '',
//           // registershop_name: fetchedData.registershop_name || 'Shop Name',
//           gst_number: fetchedData.gst_number || '',
//         };
//         setUserDetails(initialDetails);
// // console.log('update data payload',updatedUserDetails)
// //         setUserDetails(updatedUserDetails); // Update userDetails using profileData

//         // Pre-fill form fields if profile is updated
//         // if (loggedInUser?.is_profile_updated) {
//         //   Object.keys(updatedUserDetails).forEach((key) => {
//         //     setValue(key, updatedUserDetails[key]);
//         //   });
//         // }
//       }
//     };
//     fetchAdditinalDetails();

    fetchUserDetails();
  }, []);
// console.log(loggedInUser.id);
// console.log(userDetails.id);
// console.log('gender');
console.log('loggedInUser',loggedInUser);

const navigateToHome = () => {
  navigation.navigate('Home');
};

  useEffect(() => {
    console.log('user category',loggedInUser?.user_category);
    
    const fetchAdditinalDetails = async () => {
      const userId = loggedInUser?.customer_id || loggedInUser?.merchant_id || loggedInUser?.corporate_id || 'N/A';
     let response = null;
      if(loggedInUser?.user_category === 'customer') {
         response = await dispatch(fetchAdditionalDetails(userId));
      } else if(loggedInUser?.user_category === 'merchant') {
          response = await dispatch(fetchAdditionalDetailsMerchant(userId));
      }
      console.log('Fetched additional details: 162', response?.payload.profile_data);
      
      const fetchedData = response?.payload.profile_data;
      setProfileData(fetchedData); // Set fetched data to profileData
      // console.log('fetched Data 109:', fetchedData);
      
//       if (fetchedData) {
//         const updatedUserDetails = {
//           user_category: loggedInUser?.user_category || 'User',
//           first_name: fetchedData.first_name || '', // Separate first_name
//           last_name: fetchedData.last_name || '', // Separate last_name
//           id: fetchedData.customer_id || fetchedData.merchant_id || fetchedData.corporate_id || 'N/A',
//           age: fetchedData.age?.toString() || '', // Ensure age is converted to string
//           gender: fetchedData.gender || '',
//           city: fetchedData.city || '',
//           state: fetchedData.state || '',
//           country: fetchedData.country || '',
//           pincode: fetchedData.pincode?.toString() || '', // Ensure pincode is converted to string
//           address: fetchedData.address || '',
//           aadhar_number: fetchedData.aadhar_number || '',
//           pan_number: fetchedData.pan_number || '',
//           shop_name: fetchedData.shop_name || '',
//           // registershop_name: fetchedData.registershop_name || 'Shop Name',
//           gst_number: fetchedData.gst_number || '',
//         };
// console.log('update data payload',updatedUserDetails)
//         setUserDetails(updatedUserDetails); // Update userDetails using profileData


// if (fetchedData) {
  const initialDetails  = {
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
    shop_name: fetchedData.shop_name || '',
    // registershop_name: fetchedData.registershop_name || 'Shop Name',
    gst_number: fetchedData.gst_number || '',
    logo_data: fetchedData.logo || '',
  };

  // console.log('initial details',initialDetails);
  
  setUserDetails(initialDetails);

        // Pre-fill form fields if profile is updated
        // if (loggedInUser?.is_profile_updated) {
        //   Object.keys(updatedUserDetails).forEach((key) => {
        //     setValue(key, updatedUserDetails[key]);
        //   });
        // }
      
    };
    fetchAdditinalDetails();
  }, [loggedInUser, dispatch]);
  
const storeMerchantLogo = async (logo_data) => {
  try {
    if (logo_data) {
      await AsyncStorage.setItem('merchant_logo', logo_data);
      console.log('Merchant logo saved!');
    } else {
      console.warn('No logo found to save');
    }
  } catch (error) {
    console.error('Error saving merchant logo:', error);
  }
};
   useEffect(() => {
    const getMerchantLogo = async () => {
      try {
        const logo = await AsyncStorage.getItem('merchant_logo');
        if (logo) {
          console.log('Merchant logo retrieved:', logo);
          
          // setMerchantLogo(logo);
        }
      } catch (error) {
        console.error('Error retrieving merchant logo:', error);
      }
    };
    if (loggedInUser?.user_category === 'merchant') {
      getMerchantLogo();
    }
  }, [loggedInUser?.user_category]);
  const onSubmit = async (data) => {
    // console.log('hello');
    
   

    console.log('Form submitted:', data);
    let res=null;
    if(loggedInUser?.user_category === 'customer') {
      res = await dispatch(addAdditinalDetails({ userId: userDetails.id, data }));
      // console.log('customer resonse',res);
      
    }
    else if(loggedInUser?.user_category === 'merchant') {
      console.log('merchant logo',data.logo_data);
      console.log('data to be sent merchant',data);
      
     res = await dispatch(addAdditinalDetailsMerchant({ userId: userDetails.id, data }));
     console.log('merchant response',res);
     
    }
    console.log(res);
    // if(res?.payload.message) {

    //   Alert.alert('success',res?.payload.message, [
    //    { text:"OK", onPress: navigateToHome}
    //   ]);
    // }
    setIsEditing(false); // Exit edit mode after submission

    // Move navigation to Home here if submission is successful
    if(res?.payload?.message) {
      Alert.alert('success', res?.payload.message, [
        { text: "OK", onPress: navigateToHome }
      ]);
      return; // Prevent further code execution after navigation
    }

    // Fetch updated details (this will run only if navigation didn't happen)
    const userId = loggedInUser?.customer_id || loggedInUser?.merchant_id || loggedInUser?.corporate_id || 'N/A';
    let response ;
    if(loggedInUser?.user_category === 'merchant') {
      response = await dispatch(fetchAdditionalDetailsMerchant(userId));
    } else if(loggedInUser?.user_category === 'customer') {
      response = await dispatch(fetchAdditionalDetails(userId));
    }
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
        shop_name: updatedData.shop_name || '',
        // registershop_name: updatedData.registershop_name || '',
        gst_number: updatedData.gst_number || '',
        logo_data: updatedData.logo || '',
      };
// console.log('update data payload 283',updatedUserDetails);

      setUserDetails(updatedUserDetails);
      // Update form fields with the latest data
      Object.keys(updatedUserDetails).forEach((key) => {
        setValue(key, updatedUserDetails[key]);
      });
      // Ensure logo_data field is updated in the form as well
      setValue('logo_data', updatedUserDetails.logo_data);

      // Save merchant logo if merchant
      if (loggedInUser?.user_category === 'merchant') {
        await storeMerchantLogo(updatedUserDetails.logo_data);
      }
    }
     if(res?.payload.message) {

      Alert.alert('success',res?.payload.message, [
       { text:"OK", onPress: navigateToHome}
      ]);
    }
  };

// console.log('profile data',profileData);

// const storeMerchantLogo = async () => {
//   try {
//     const logo = profileData?.logo;
//     if (logo) {
//       await AsyncStorage.setItem('merchant_logo', logo);
//       console.log('Merchant logo saved!');
//     } else {
//       console.warn('No logo found in profileData');
//     }
//   } catch (error) {
//     console.error('Error saving merchant logo:', error);
//   }
// };


const handleEdit = () => {
  Object.keys(userDetails).forEach((key) => {
    setValue(key, userDetails[key]); // Pre-fill form fields with existing data
  });
  setIsEditing(true);
};

  // Handler for picking logo image
  const handlePickLogo = async (onChange) => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.7,
      includeBase64: true, // <-- Add this line
    });
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.base64) {
        const base64String = `data:${asset.type};base64,${asset.base64}`;
        console.log('Selected logo base64:', base64String);
        onChange(base64String);
        setValue('logo_data', base64String); // <-- Ensure preview updates immediately

        // Update AsyncStorage "user" object with new logo_base64
        try {
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const storageData = JSON.parse(userString);
            storageData.logo_base64 = base64String;
            await AsyncStorage.setItem('user', JSON.stringify(storageData));
            console.log('Updated user.logo_base64 in AsyncStorage');
          }
        } catch (err) {
          console.error('Failed to update user.logo_base64 in AsyncStorage:', err);
        }
      } else if (asset.uri) {
        onChange(asset.uri);
        setValue('logo_data', asset.uri); // fallback if base64 not available
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Additional Information</Text>
{/* <Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/> */}

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
            {row
              // Hide shop_name and gst_number for customers
              .filter((key) => {
                if (userCategory === 'customer' && (key === 'shop_name' || key === 'gst_number' || key === 'logo_data')) {
                  return false;
                }
                return !(key === 'shop_name' && userCategory === 'customer');
              })
              .map((key) => (
                <View key={key} style={styles.halfWidthContainer}>
                  <Text>{fieldLabels[key] || key}</Text>
                  {key === 'logo_data' && userCategory === 'merchant' && userDetails[key] ? (
                    <Image
                      source={
                        userDetails[key].startsWith('data:')
                          ? { uri: userDetails[key] }
                          : { uri: `data:image/png;base64,${userDetails[key]}` }
                      }
                      style={styles.logoPreview}
                      resizeMode="contain"
                    />
                  ) : (
                    <TextInput
                      style={[styles.input, { backgroundColor: '#f9f9f9', borderColor: '#004BFF' }]}
                      value={userDetails[key]}
                      editable={false}
                    />
                  )}
                </View>
              ))}
          </View>
          ))}
          <Button title="Edit" onPress={handleEdit} color="#004BFF" />
        </>
      ) : (
        // Show form for input or editing
        <>
          {Object.keys(userDetails)
            // Hide shop_name and gst_number for customers
            .filter((key) => {
              if (userCategory === 'customer' && (key === 'shop_name' || key === 'gst_number')) {
                return false;
              }
              // Hide logo for customers
              if (key === 'logo_data' && userCategory === 'customer') {
                return false;
              }
              return true;
            })
            .map((key) => (
            <View key={key} style={styles.inputContainer}>
              <Text>{fieldLabels[key] || key}</Text>
              {key === 'user_category' ? (
                <TextInput
                  style={[styles.input, { backgroundColor: '#f9f9f9', borderColor: '#004BFF' }]}
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
              ) : key === 'logo_data' && userCategory === 'merchant' ? (
                <Controller
                  control={control}
                  name="logo_data"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <TouchableOpacity
                        style={styles.logoPickerButton}
                        onPress={() => handlePickLogo(onChange)}
                        disabled={!(isEditing || !loggedInUser?.is_profile_updated)}
                      >
                        <Text style={{ color: '#004BFF' }}>
                          {value ? 'Change Logo' : 'Upload Logo'}
                        </Text>
                      </TouchableOpacity>
                      {value && typeof value === 'string' ? (
                        <Image
                          source={
                            value.startsWith('data:')
                              ? { uri: value }
                              : { uri: `data:image/png;base64,${value}` }
                          }
                          style={styles.logoPreview}
                          resizeMode="contain"
                        />
                      ) : null}
                    </>
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  rules={{
                    required: key !== 'aadhar_number' && key !== 'pan_number' && key !== 'gst_number',
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
                  {key !== 'aadhar_number' && key !== 'pan_number' && key !== 'gst_number' && `${fieldLabels[key] || key} is required.`}
                </Text>
              )}
            </View>
          ))}
          <Button title="Submit" onPress={handleSubmit(onSubmit)} color="#004BFF" />
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
    color: '#F14242',
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
    borderColor: '#004BFF',
    backgroundColor: '#f9f9f9',
    marginTop: 5,
  },
  picker: {
    height: 50, // Adjust height for better alignment
    borderWidth: 1,
    borderColor: '#004BFF',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  logoPickerButton: {
    borderWidth: 1,
    borderColor: '#004BFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#f9f9f9',
  },
  logoPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#004BFF',
    alignSelf: 'center',
  },
});

export default MerchantForm;
