// import { 
//     StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, 
//     KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList
// } from "react-native";
// import React, { useState } from "react";

// const CustomerSelection = () => {
//     const [amt, setAmount] = useState("");
//     const [contact, setContact] = useState("");
//     const [points, setPoints] = useState("");
//     const [chooseCustomer, setChooseCustomer] = useState("");
//     const [search, setSearch] = useState("");
//     const [filteredCustomers, setFilteredCustomers] = useState([]);
//     const [showDropdown, setShowDropdown] = useState(false);

//     const [mobileSearch, setMobileSearch] = useState("");
//     const [filteredMobileNumbers, setFilteredMobileNumbers] = useState([]);
//     const [showMobileDropdown, setShowMobileDropdown] = useState(false);
//     const [showNewMobileInput, setShowNewMobileInput] = useState(false);
//     const [newMobileNumber, setNewMobileNumber] = useState("");

//     const customers = ["Customer1", "Customer2", "Customer3", "Customer4", "Customer5"];
//     const mobileNumbers = ["9876543210", "9123456789", "8765432109", "9988776655", "9556677889"];

//     const handleSearch = (text) => {
//         setSearch(text);
//         if (text) {
//             const filteredData = customers.filter(customer =>
//                 customer.toLowerCase().includes(text.toLowerCase())
//             );
//             setFilteredCustomers(filteredData);
//             setShowDropdown(true);
//         } else {
//             setFilteredCustomers([]);
//             setShowDropdown(false);
//         }
//     };

//     const handleSelectCustomer = (customer) => {
//         setChooseCustomer(customer);
//         setSearch(customer);
//         setShowDropdown(false);
//     };

//     const handleMobileSearch = (text) => {
//         setMobileSearch(text);
//         if (text.length > 0 && text.length <= 10) {
//             const filteredData = mobileNumbers.filter(number =>
//                 number.startsWith(text)
//             );
//             setFilteredMobileNumbers(filteredData);
//             setShowMobileDropdown(true);
//         } else {
//             setFilteredMobileNumbers([]);
//             setShowMobileDropdown(false);
//         }
//     };

//     const handleSelectMobile = (number) => {
//         setMobileSearch(number);
//         setShowMobileDropdown(false);
//     };

//     const handleSubmit = () => {
//         if (!mobileSearch || !points || !amt) {
//             Alert.alert("Error", "All fields are required!");
//             return;
//         }
//         Alert.alert("Success", "Your message has been submitted.");
//         setAmount("");
//         setContact("");
//         setPoints("");
//         setChooseCustomer("");
//         setSearch("");
//         setMobileSearch("");
//         setShowNewMobileInput(false);
//         setNewMobileNumber("");
//     };

//     const handleCancel = () => {
//         setAmount("");
//         setContact("");
//         setPoints("");
//         setChooseCustomer("");
//         setSearch("");
//         setMobileSearch("");
//         setShowNewMobileInput(false);
//         setNewMobileNumber("");
//     };

//     return (
//         <KeyboardAvoidingView 
//             behavior={Platform.OS === "ios" ? "padding" : "height"} 
//             style={styles.container}
//         >
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//                 <View>
//                     <Text style={styles.title}>Awards</Text>

//                     {/* Searchable Customer Dropdown */}
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Select Customer"
//                         value={search}
//                         onChangeText={handleSearch}
//                     />
//                     {showDropdown && (
//                         <FlatList
//                             data={filteredCustomers}
//                             keyExtractor={(item, index) => index.toString()}
//                             style={styles.dropdown}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity onPress={() => handleSelectCustomer(item)}>
//                                     <Text style={styles.dropdownItem}>{item}</Text>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     )}

//                     {/* Searchable Mobile Number Dropdown */}
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Customer Mobile no."
//                         value={mobileSearch}
//                         onChangeText={handleMobileSearch}
//                         keyboardType="phone-pad"
//                         maxLength={10}
//                     />
//                     {showMobileDropdown && (
//                         <FlatList
//                             data={filteredMobileNumbers}
//                             keyExtractor={(item, index) => index.toString()}
//                             style={styles.dropdown}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity onPress={() => handleSelectMobile(item)}>
//                                     <Text style={styles.dropdownItem}>{item}</Text>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     )}

//                     <TouchableOpacity 
//                         style={styles.addCustomerButton} 
//                         onPress={() => setShowNewMobileInput(true)}>
//                         <Text style={styles.buttonText}>Add Customer</Text>
//                     </TouchableOpacity>

//                     {showNewMobileInput && (
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Enter New Mobile Number"
//                             value={newMobileNumber}
//                             onChangeText={setNewMobileNumber}
//                             keyboardType="phone-pad"
//                             maxLength={10}
//                         />
//                     )}

//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Purchase Amount"
//                         value={amt}
//                         onChangeText={setAmount}
//                         keyboardType="phone-pad"
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Autocalculate Loyalty Points"
//                         value={contact}
//                         onChangeText={setContact}
//                         keyboardType="phone-pad"
//                     />
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Enter Additional Loyalty Points"
//                         value={points}
//                         onChangeText={setPoints}
//                     />

//                     <View style={styles.buttonContainer}>
//                         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//                             <Text style={styles.buttonText}>Submit</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
//                             <Text style={styles.buttonText}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//     );
// };

// export default CustomerSelection;
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: "#f2f2f2",
//         justifyContent: "center",
//         marginTop: -50,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         color: "black",
//         textAlign: "center",
//         marginBottom: 20,
//     },
//     input: {
//         width: "100%",
//         height: 50,
//         backgroundColor: "#fff",
//         borderColor: "black",
//         borderWidth: 1,
//         borderRadius: 10,
//         paddingHorizontal: 15,
//         marginBottom: 15,
//         fontSize: 16,
//     },
//     dropdown: {
//         backgroundColor: "#fff",
//         borderColor: "black",
//         borderWidth: 1,
//         borderRadius: 10,
//         maxHeight: 120,
//         marginBottom: 15,
//     },
//     dropdownItem: {
//         padding: 10,
//         fontSize: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#ddd",
//     },
//     buttonContainer: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         marginTop: 15,
//     },
//     submitButton: {
//         backgroundColor: "#6A1B9A",
//         paddingVertical: 14,
//         borderRadius: 10,
//         flex: 1,
//         marginRight: 10,
//         alignItems: "center",
//         elevation: 3,
//     },
//     cancelButton: {
//         backgroundColor: "#555",
//         paddingVertical: 14,
//         borderRadius: 10,
//         flex: 1,
//         alignItems: "center",
//         elevation: 3,
//     },
//     buttonText: {
//         color: "white",
//         fontSize: 16,
//         fontWeight: "bold",    
//     },
//     addCustomerButton: {
//         backgroundColor: "#6A1B9A", // Light Blue Color
//         paddingVertical: 14,
//         borderRadius: 10,
//         alignItems: "center",
//         elevation: 3,
//         marginBottom: 15, // Adds spacing below the button
//     },
// });

import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";

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
        <Text>Loading merchants...</Text>
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
          // In your CustomerSelection component's renderItem:
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

export default CustomerSelection;