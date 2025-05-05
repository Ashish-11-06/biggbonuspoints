import React, { useState,useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers, getAllMerchants } from "../Redux/slices/userSlice";
import { useNavigation, useRoute } from "@react-navigation/native";

const contacts = [
  { id: "1", name: "customer1", phone: "8080252251" },
  { id: "2", name: "customer2", phone: "9764181163" },
  { id: "3", name: "customer3", phone: "9822878861" },
  { id: "4", name: "customer4", phone: "9422204705" },
  { id: "5", name: "customer5", phone: "1234567890" },
  { id: "6", name: "customer6", phone: "7840910538" },
  { id: "7", name: "customer7", phone: "8999649495" },
];

const CustomerSelection = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const route = useRoute();
  const { userCategory } = route.params;
  // Get merchants and customers from Redux state with default empty arrays
  const { merchants = [], customers = [], status, error } = useSelector((state) => state.user);
console.log('user category',userCategory);

  // Assume userCategory is passed as a prop or fetched from Redux
  // const userCategory = useSelector((state) => state.auth.userCategory); // Example: "merchant" or "customer"

  // Fetch merchants or customers when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userCategory === "customer") {
          const res = dispatch(getAllMerchants());
          // const res = dispatch(getAllCustomers());
          console.log("Fetched Merchants:", res);
        } else {
          const res = dispatch(getAllCustomers());
          console.log("Fetched Customers:", res);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch, userCategory]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length === 0) {
      setFilteredContacts([]);
      return;
    }

    const dataToFilter = userCategory === "merchant" ? customers : merchants;

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
        <ActivityIndicator size="large" color="#F14242"/>
        <Text>{userCategory === "merchant" ? "Loading customers..." : "Loading merchants..."}</Text>
      </View>
    );
  }

  console.log(userCategory === "merchant" ? "Customers:" : "Merchants:", userCategory === "merchant" ? customers : merchants);
  console.log("Filtered Contacts:", filteredContacts);

  // Error state
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
        <TouchableOpacity
          style={{ marginTop: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}
          onPress={() => dispatch(userCategory === "merchant" ? getAllCustomers() : getAllMerchants())}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  // console.log(user)

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
      <FlatList
        data={searchText.length > 0 ? filteredContacts : (userCategory === "customer" ? merchants : customers)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
            onPress={() =>
              navigation.navigate("PointsScreen", {
                userId: item.user_id,
                userName: `${item.first_name || ''} ${item.last_name || ''}`.trim(), // Correctly pass userName
                userMobile: item.mobile || 'No phone',
                userShop: item.shop_name || null,
                fromChooseMerchant: true // Custom variable
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
        keyExtractor={(item, index) => item.user_id || item.mobile || `user-${index}`}
        ListEmptyComponent={
          <View style={{ padding: 15 }}>
            <Text style={{ textAlign: 'center' }}>No {userCategory === "merchant" ? "customers" : "merchants"} found</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        extraData={searchText}
      />

      {/* Add New Number button */}
      {searchText.length > 0 && filteredContacts.length === 0 && userCategory === 'merchant' && (
        <TouchableOpacity
          style={{
            padding: 15,
            marginTop: 10,
            backgroundColor: "#F14242",
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

export default CustomerSelection;