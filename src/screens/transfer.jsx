import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
// Dummy list of merchants
const dummyMerchants = [
  { id: "1", name: "Rahul Traders", phone: "9876543210" },
  { id: "2", name: "Mohan Store", phone: "7890123456" },
  { id: "3", name: "Patil Mart", phone: "9012345678" },
  { id: "4", name: "Sahil Bazaar", phone: "8765432109" },
];

// Dummy transaction history
// const transactionHistory = {
//   "1": { date: "2024-04-01", points: 50 },
//   "2": { date: "2024-03-25", points: 100 },
//   "3": { date: "2024-04-02", points: 30 },
//   "4": { date: "2024-03-20", points: 80 },
// };

const Transfer = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredMerchants, setFilteredMerchants] = useState(dummyMerchants);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [points, setPoints] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const filtered = dummyMerchants.filter((merchant) =>
      merchant.name.toLowerCase().includes(searchText.toLowerCase()) ||
      merchant.phone.includes(searchText)
    );
    setFilteredMerchants(filtered);
  }, [searchText]);

  const handleTransfer = () => {
    if (!selectedMerchant || !points) {
      alert("Please select a merchant and enter points.");
      return;
    }

    alert(
      `Transferred ${points} points to ${selectedMerchant.name} (${selectedMerchant.phone})`
    );

    setPoints("");
    setSelectedMerchant(null);
    setSearchText("");
    Keyboard.dismiss();
    navigation.navigate("Transferpointstomerchant");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search Merchant (Name or Phone)</Text>

      <TextInput
        placeholder="Type to search..."
        style={styles.input}
        value={searchText}
        onChangeText={(text) => {
          setSearchText(text);
          setShowDropdown(true); // show dropdown when typing
        }}
      />

      { showDropdown && searchText.length > 0 && (
        <FlatList
          data={filteredMerchants}
          keyExtractor={(item) => item.id}
          style={styles.dropdown}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setSelectedMerchant(item);
                setSearchText(item.name);
                setShowDropdown(false); 
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.optionName}>{item.name}</Text>
              <Text style={styles.optionPhone}>{item.phone}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {selectedMerchant && (
        <View style={styles.selectionBox}>
          <Text style={styles.selectedText}>{selectedMerchant.name}</Text>
          <Text style={styles.selectedPhone}>{selectedMerchant.phone}</Text>

          
          {/* <View style={styles.transactionBox}>
            <Text style={styles.transactionTitle}>Last Transaction</Text>
            <Text>Date: {transactionHistory[selectedMerchant.id]?.date || "N/A"}</Text>
            <Text>Points: {transactionHistory[selectedMerchant.id]?.points || "N/A"}</Text>
          </View> */}
        </View>
      )}

      {selectedMerchant && (
        <>
          <TextInput
            placeholder="Enter Points"
            style={styles.input}
            keyboardType="numeric"
            value={points}
            onChangeText={setPoints}
          />

          <Button
            mode="contained"
            onPress={handleTransfer}
            style={styles.button}
          >
            Transfer Points
          </Button>
        </>
      )}
    </View>
  );
};

export default Transfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  dropdown: {
    maxHeight: 150,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  option: {
    padding: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  optionName: {
    fontWeight: "600",
    fontSize: 16,
  },
  optionPhone: {
    color: "#555",
    fontSize: 14,
  },
  selectionBox: {
    backgroundColor: "#d0f0d0",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  selectedText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  selectedPhone: {
    color: "#444",
    marginBottom: 8,
  },
  transactionBox: {
    backgroundColor: "#f4fff4",
    padding: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  transactionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  button: {
    marginTop: 20,
  },
});
