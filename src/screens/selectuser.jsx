import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers, getAllMerchants } from "../Redux/slices/userSlice";

const SelectUser = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  // Get merchants from Redux state with default empty array
  const { merchants = [], status, error } = useSelector((state) => state.user);

  // Fetch merchants when component mounts
  useEffect(() => {
    const fetchMerchants = async () => {
      try {
    const res=dispatch(getAllMerchants());
    console.log(res);
    
      } catch (error) {
        console.error("Error fetching merchants:", error);
      }
    };
    fetchMerchants();
  }, [dispatch]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length === 0) {
      setFilteredContacts([]);
      return;
    }

    // Create a combined name field from first_name and last_name
    const filtered = merchants
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
          onPress={() => dispatch(getAllMerchants())}
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
      data={searchText.length > 0 ? filteredContacts : merchants} // Show filteredContacts if searching, otherwise show all merchants
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
          onPress={() =>
            navigation.navigate("TransferPoints", {
              merchantId: item.user_id, // Pass the merchant's user_id
              merchantName: `${item.first_name || ''} ${item.last_name || ''}`.trim(), // Pass merchant name for display
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
          <Text style={{ textAlign: 'center' }}>No merchants found</Text>
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