import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { customerToMerchantPoints, resetTransferState } from "../Redux/slices/TransferPointsSlice";

const TransferPoints = ({ route, navigation }) => {
  const { merchantId } = route.params;
  const [points, setPoints] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [merchantDetails, setMerchantDetails] = useState({});
  const [customerId, setCustomerId] = useState(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch user details
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData.customer_id) {
            setCustomerId(parsedData.customer_id);
            setUserDetails({
              name: `Customer ${parsedData.customer_id}`,
            });
          }
        }
        
        // Fetch merchant details (you'll need to implement this API call)
        // setMerchantDetails(response.data);
        setMerchantDetails({
          name: `Merchant ${merchantId}`
        });
        
      } catch (error) {
        console.error("Error fetching details:", error);
        Alert.alert("Error", "Failed to load user data");
      }
    };
    
    fetchDetails();

    // Reset transfer state when component unmounts
    return () => {
      dispatch(resetTransferState());
    };
  }, [merchantId, dispatch]);



const handleTransfer = async () => {
    if (!customerId) {
      Alert.alert("Error", "Customer ID not found");
      return;
    }
  
    if (!points || isNaN(points) || parseInt(points) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid points amount");
      return;
    }
  
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) {
        throw new Error("Authentication required");
      }
      
      // Use .unwrap() to get the actual promise that can be caught
      const response = await dispatch(customerToMerchantPoints({
        customer_id: customerId,
        merchant_id: merchantId,
        points: parseInt(points)
      })).unwrap();
  
    //   console.log("Transfer successful:", response);
      Alert.alert("Success", "Points transferred successfully!");
      
    } catch (error) {
      console.error("Transfer failed:", error);
      // The error will now include the rejected value from your thunk
      Alert.alert("Error", error || "Transfer failed");
    }
  };




   return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>Transfer Points</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>From:</Text>
            <Text style={styles.detailValue}>{userDetails.name || `Customer ${customerId || 'Loading...'}`}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>To:</Text>
            <Text style={styles.detailValue}>{merchantDetails.name || `Merchant ${merchantId}`}</Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Enter points to transfer"
            keyboardType="numeric"
            value={points}
            onChangeText={setPoints}
            autoFocus={true}
          />
          
          <TouchableOpacity
            style={styles.transferButton}
            onPress={handleTransfer}
            disabled={!customerId}
          >
            <Text style={styles.transferButtonText}>
              {/* {status === 'loading' ? "Processing..." : "Transfer Points"} */}
              transfer points
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 20,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  detailLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  transferButton: {
    backgroundColor: "#6A1B9A",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  transferButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#6A1B9A",
  },
  cancelButtonText: {
    color: "#6A1B9A",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TransferPoints;