import { 
    StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, 
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList
} from "react-native";
import React, { useState } from "react";

const CustomerSelection = () => {
    const [amt, setAmount] = useState("");
    const [contact, setContact] = useState("");
    const [points, setPoints] = useState("");
    const [chooseCustomer, setChooseCustomer] = useState("");
    const [search, setSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const [mobileSearch, setMobileSearch] = useState("");
    const [filteredMobileNumbers, setFilteredMobileNumbers] = useState([]);
    const [showMobileDropdown, setShowMobileDropdown] = useState(false);
    const [showNewMobileInput, setShowNewMobileInput] = useState(false);
    const [newMobileNumber, setNewMobileNumber] = useState("");

    const customers = ["Customer1", "Customer2", "Customer3", "Customer4", "Customer5"];
    const mobileNumbers = ["9876543210", "9123456789", "8765432109", "9988776655", "9556677889"];

    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const filteredData = customers.filter(customer =>
                customer.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredCustomers(filteredData);
            setShowDropdown(true);
        } else {
            setFilteredCustomers([]);
            setShowDropdown(false);
        }
    };

    const handleSelectCustomer = (customer) => {
        setChooseCustomer(customer);
        setSearch(customer);
        setShowDropdown(false);
    };

    const handleMobileSearch = (text) => {
        setMobileSearch(text);
        if (text.length > 0 && text.length <= 10) {
            const filteredData = mobileNumbers.filter(number =>
                number.startsWith(text)
            );
            setFilteredMobileNumbers(filteredData);
            setShowMobileDropdown(true);
        } else {
            setFilteredMobileNumbers([]);
            setShowMobileDropdown(false);
        }
    };

    const handleSelectMobile = (number) => {
        setMobileSearch(number);
        setShowMobileDropdown(false);
    };

    const handleSubmit = () => {
        if (!mobileSearch || !points || !amt) {
            Alert.alert("Error", "All fields are required!");
            return;
        }
        Alert.alert("Success", "Your message has been submitted.");
        setAmount("");
        setContact("");
        setPoints("");
        setChooseCustomer("");
        setSearch("");
        setMobileSearch("");
        setShowNewMobileInput(false);
        setNewMobileNumber("");
    };

    const handleCancel = () => {
        setAmount("");
        setContact("");
        setPoints("");
        setChooseCustomer("");
        setSearch("");
        setMobileSearch("");
        setShowNewMobileInput(false);
        setNewMobileNumber("");
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"} 
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View>
                    <Text style={styles.title}>Awards</Text>

                    {/* Searchable Customer Dropdown */}
                    <TextInput
                        style={styles.input}
                        placeholder="Select Customer"
                        value={search}
                        onChangeText={handleSearch}
                    />
                    {showDropdown && (
                        <FlatList
                            data={filteredCustomers}
                            keyExtractor={(item, index) => index.toString()}
                            style={styles.dropdown}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectCustomer(item)}>
                                    <Text style={styles.dropdownItem}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    {/* Searchable Mobile Number Dropdown */}
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Customer Mobile no."
                        value={mobileSearch}
                        onChangeText={handleMobileSearch}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                    {showMobileDropdown && (
                        <FlatList
                            data={filteredMobileNumbers}
                            keyExtractor={(item, index) => index.toString()}
                            style={styles.dropdown}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelectMobile(item)}>
                                    <Text style={styles.dropdownItem}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}

                    <TouchableOpacity 
                        style={styles.addCustomerButton} 
                        onPress={() => setShowNewMobileInput(true)}>
                        <Text style={styles.buttonText}>Add Customer</Text>
                    </TouchableOpacity>

                    {showNewMobileInput && (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter New Mobile Number"
                            value={newMobileNumber}
                            onChangeText={setNewMobileNumber}
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter Purchase Amount"
                        value={amt}
                        onChangeText={setAmount}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Autocalculate Loyalty Points"
                        value={contact}
                        onChangeText={setContact}
                        keyboardType="phone-pad"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Additional Loyalty Points"
                        value={points}
                        onChangeText={setPoints}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default CustomerSelection;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f2f2f2",
        justifyContent: "center",
        marginTop: -50,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "black",
        textAlign: "center",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    dropdown: {
        backgroundColor: "#fff",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        maxHeight: 120,
        marginBottom: 15,
    },
    dropdownItem: {
        padding: 10,
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    submitButton: {
        backgroundColor: "#6A1B9A",
        paddingVertical: 14,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
        elevation: 3,
    },
    cancelButton: {
        backgroundColor: "#555",
        paddingVertical: 14,
        borderRadius: 10,
        flex: 1,
        alignItems: "center",
        elevation: 3,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",    
    },
    addCustomerButton: {
        backgroundColor: "#6A1B9A", // Light Blue Color
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
        elevation: 3,
        marginBottom: 15, // Adds spacing below the button
    },
});