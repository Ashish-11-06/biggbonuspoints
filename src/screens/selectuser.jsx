import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers, getAllMerchants } from "../Redux/slices/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SelectUser = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  // Get merchants from Redux state with default empty array
  const { merchants = [],customers = [], status, error } = useSelector((state) => state.user);
  const cm=useSelector((state) => state.user);
  console.log('cmm',cm);
  
  console.log('customers',customers);
  console.log('merchants',merchants);
  

  // Fetch merchants when component mounts

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

  console.log("User Details:", userDetails);
  // console.log("User Category:", userCategory);
  // console.log('logged user',loggedInUser);
  
  
  useEffect(() => {
    const fetchMerchants = async () => {
      console.log('called');
      
      try {
        if(userCategory === "merchant" && merchants.length === 0){
          console.log('merch called');   
          const res=dispatch(getAllMerchants());
          console.log(res);
        } else if(userCategory === "customer" && customers.length === 0 ){
          console.log('cust called');
          
    const res=dispatch(getAllCustomers());
    console.log(res);
        }  
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    fetchMerchants();
  }, [userCategory,dispatch]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length === 0) {
      setFilteredContacts([]);
      return;
    }

    const dataToFilter = userCategory === "merchant" ? merchants : customers;

    // Create a combined name field from first_name and last_name
    const filtered = dataToFilter
      .filter(contact => {
        const fullName = `${contact?.first_name || ''} ${contact?.last_name || ''}`.toLowerCase();
        const phone = contact?.mobile || '';
        return (
          fullName.includes(text.toLowerCase()) ||
          phone.includes(text)
        );
      })
      .slice(0, 10); // Limit to 10 entries

    setFilteredContacts(filtered);
  };

  // Loading state
  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading users...</Text>
      </View>
    );
  }

  console.log("Merchants:", merchants);
  console.log("Filtered Contacts:", filteredContacts);

  // Error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
             <Text style={{ color: 'red' }}>Error: {error}</Text>
             <TouchableOpacity
               style={{ marginTop: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}
               onPress={() => dispatch(userCategory === "merchant" ? getAllMerchants() : getAllCustomers())}
             >
               <Text style={{ color: 'white' }}>Retry</Text>
             </TouchableOpacity>
           </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <TextInput
        placeholder="Search by name or number"
        value={searchText}
        onChangeText={handleSearch}
        style={{
          height: 50,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 10,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      />

      {/* List of Filtered Contacts */}
      return (
  <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
    {/* <TextInput
      placeholder="Search by name or number"
      value={searchText}
      onChangeText={handleSearch}
      style={{
        height: 50,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
      }}
    /> */}

    {/* List of Merchants */}
    <FlatList
        data={searchText.length > 0 ? filteredContacts : (userCategory === "merchant" ? merchants : customers)}
        renderItem={({ item }) => (
        <TouchableOpacity
          style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
          onPress={() =>
            navigation.navigate("TransferPoints", {
              merchantId: item.user_id, // Pass the merchant's user_id
              merchantName: `${item.first_name || ''} ${item.last_name || ''}`.trim(), // Pass merchant name for display
            fromSelectUser:true
            })
          }
        >
          <View>
            <Text style={{ fontWeight: 'bold' }}>
              {`${item.first_name || ''} ${item.last_name || ''}`.trim() || 'No name'}
            </Text>
            <Text>{item.mobile || 'No phone'}</Text>
            {item.shop_name && <Text>Shop: {item.shop_name}</Text>}
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item, index) => item.user_id || item.mobile || `merchant-${index}`}
      ListEmptyComponent={
        <View style={{ padding: 15 }}>
          <Text style={{ textAlign: 'center' }}>{userCategory === 'merchant' ? 'No merchants found' : 'No customer found'}</Text>
        </View>
      }
      keyboardShouldPersistTaps="handled"
      extraData={searchText}
    />
  </View>
);
      {/* {searchText.length > 0 && (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => item.user_id || item.mobile || `merchant-${index}`}
          keyboardShouldPersistTaps="handled"
          // In your selectuser component's renderItem:
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
              onPress={() =>
                navigation.navigate("TransferPoints", {
                  merchantId: item.user_id, // Pass the merchant's user_id
                  merchantName: `${item.first_name || ''} ${item.last_name || ''}`.trim() // Pass merchant name for display
                })
              }
            >
              <View>
                <Text style={{ fontWeight: 'bold' }}>
                  {`${item.first_name || ''} ${item.last_name || ''}`.trim() || 'No name'}
                </Text>
                <Text>{item.mobile || 'No phone'}</Text>
                {item.shop_name && <Text>Shop: {item.shop_name}</Text>}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={{ padding: 15 }}>
              <Text style={{ textAlign: 'center' }}>No matching merchants found</Text>
            </View>
          }
        />
      )} */}

      {/* Add New Number button */}
      {searchText.length > 0 && filteredContacts.length === 0 && merchants.length > 0 && (
        <TouchableOpacity
          style={{
            padding: 15,
            marginTop: 10,
            backgroundColor: "#007bff",
            borderRadius: 10,
          }}
          onPress={() =>
            navigation.navigate("Awards", {
              customerName: "Guest",
              customerMobile: searchText,
            })
          }
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Add New Number
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SelectUser;