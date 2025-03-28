import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const Awards = ({ route }) => {
  // Receiving customer details from the previous screen
  const { customerName, customerMobile } = route.params || {
    customerName: "Guest",
    customerMobile: "",
  };

  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState("");

  // Handle auto-calculation of loyalty points
  const handlePurchaseAmountChange = (amount) => {
    setPurchaseAmount(amount);
    const points = Math.floor(amount / 100) * 10; // Example: 10 points per 100 spent
    setLoyaltyPoints(points.toString());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Awards</Text>

      {/* Display Customer Name or Mobile Number dynamically */}
      <Text style={styles.label}>
        Customer: {customerName} | {customerMobile}
      </Text>

      {/* Purchase Amount Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Purchase Amount"
        value={purchaseAmount}
        onChangeText={handlePurchaseAmountChange}
        keyboardType="numeric"
      />

      {/* Auto Calculated Loyalty Points */}
      <TextInput
        style={[styles.input, { backgroundColor: "#f0f0f0" }]}
        placeholder="Auto-calculate Loyalty Points"
        value={loyaltyPoints}
        editable={false}
      />

      {/* Submit & Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
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
    backgroundColor: "#6A1B9A",
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
