import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { merchantToCustomerPoints } from "../Redux/slices/TransferPointsSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

const Awards = ({ route }) => {
  // Receiving customer details from the previous screen
  const { customerName, customerMobile } = route.params || {
    customerName: "Guest",
    customerMobile: "",
  };

  const dispatch=useDispatch();
  const [mobile, setMobile] = useState(
    typeof customerMobile === 'number' ? customerMobile.toString() : '');
    const [purchaseAmount, setPurchaseAmount] = useState("");
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
const navigation = useNavigation();
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
  // Handle auto-calculation of loyalty points
  console.log('user details',userDetails.id)
  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  const handlePurchaseAmountChange = (amount) => {
    setPurchaseAmount(amount);
  };

  const handleMobileNumber = (text) => {
    console.log('mobile text',text);
    
    setMobile(text);
  };

  console.log('logged user',loggedInUser?.merchant_id);
  
  const handleSubmitClick =async() =>{
    console.log('submit pressed');
     const response = await dispatch(merchantToCustomerPoints({
                 customer_mobile:mobile,
                  points: parseInt(purchaseAmount),
                  merchant_id:loggedInUser?.merchant_id
                })).unwrap();
      
                console.log("Type of message:", typeof response.message);
                console.log("Message content:", response.message);
                if(response.message) {
                  Alert.alert(
                    "Success", // title
                    response.message || "Points awarded successfullyyy", // message
                    [
                      { text: "OK", onPress: navigateToHome } // buttons array
                    ]
                  );
                  
                }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Awards</Text>

      {/* Display Customer Name or Mobile Number dynamically */}
      <Text style={styles.label}>
        Customer Mobile Number 
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        value={mobile}
        onChangeText={handleMobileNumber}
        keyboardType="numeric"
        maxLength={10}
      />

<Text style={styles.label}>
       Points
      </Text>
      {/* Purchase Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Points"
        value={purchaseAmount}
        onChangeText={handlePurchaseAmountChange}
        keyboardType="numeric"
      />

      {/* Auto Calculated Loyalty Points */}
      {/* <TextInput
        style={[styles.input, { backgroundColor: "#f0f0f0" }]}
        placeholder="Auto-calculate Loyalty Points"
        value={loyaltyPoints}
        editable={false}
      /> */}

      {/* Submit & Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText} onPress={handleSubmitClick}>Transfer Points</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText} onPress={handleCancel}>Cancel</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    backgroundColor: "#eaeaea",
    padding: 10,
    borderRadius: 8,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: "#F14242",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: "#555",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  cancelText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default Awards;
