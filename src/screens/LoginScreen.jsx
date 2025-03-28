import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPinDialog from "../Dialog/ForgotPinDialog";
import { Picker } from "@react-native-picker/picker";
// Import Reactotron configuration
import Reactotron from 'reactotron-react-native';

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState("");
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const handleLogin = async () => {
        console.log('hiii sam');

        try {
            
        Reactotron.log('Hello from Reactotron!');
        } catch (error) {
            console.log(error);
        }
        
        if (!mobile || !pin) {
            // setSnackbarMessage("Please enter both mobile number and PIN.");
            showSnackbar("Please enter both mobile number and PIN.");
            // setSnackbarVisible(true);
            return;
        } else if (mobile.length !== 10) {
            showSnackbar("Enter a valid 10-digit mobile number.");
            return;
        } else if (pin.length !== 4) {
            setSnackbarMessage("PIN must be 4 digits.");
            setSnackbarVisible(true);
            return;
        }

        setLoading(true);

        setTimeout(async () => {
            setLoading(false);
            if (mobile === "9876543210" && pin === "1234") {
                await AsyncStorage.setItem("userToken", "dummy-token");
                navigation.replace("Home");
            } else {
                setSnackbarMessage("Invalid credentials!");
                setSnackbarVisible(true);
            }
        }, 1500);
       navigation.navigate("MerchantForm"); 
    };

    const handleForgotPinSubmit = () => {
        setSnackbarMessage("PIN reset instructions sent!");
        setSnackbarVisible(true);
        setDialogVisible(false);
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text variant="headlineMedium" style={styles.title}>Login</Text>

                <TextInput
                    label="Mobile Number"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                    maxLength={10}
                    style={styles.input}
                />

                <TextInput
                    label="4-Digit PIN"
                    mode="outlined"
                    keyboardType="numeric"
                    secureTextEntry
                    value={pin}
                    onChangeText={(text) => {
                        if (text.length <= 4) setPin(text);
                    }}
                    maxLength={4}
                    style={styles.input}
                />

                <Picker
                    selectedValue={selectedUserType}
                    onValueChange={(itemValue) => setSelectedUserType(itemValue)}
                    style={styles.picker}

                >
                    <Picker.Item label="Select a user type" value="" />
                    <Picker.Item label="Customer" value="customer" />
                    <Picker.Item label="Merchant" value="merchant" />
                    <Picker.Item label="Corporate Merchant" value="corporate" />
                </Picker>

                <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
                    Login
                </Button>

                <View style={styles.linkContainer}>
                    <Button onPress={() => setDialogVisible(true)} textColor="#007BFF">
                        Forgot PIN?
                    </Button>
                    <Button onPress={() => navigation.navigate("Register")} textColor="#007BFF">
                        New user? Register.
                    </Button>
                </View>

                {/* Forgot PIN Dialog */}
                <ForgotPinDialog
                    visible={dialogVisible}
                    onDismiss={() => setDialogVisible(false)}
                    mobile={mobile}
                    setMobile={setMobile}
                    onSubmit={handleForgotPinSubmit}
                />

                {/* Snackbar for notifications */}
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    style={styles.snackbar}
                >
                    {snackbarMessage}
                </Snackbar>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        textAlign: "center",
        marginBottom: 20,
        fontWeight: "bold",
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    snackbar: {
        position: "absolute",
        bottom: 450,
        left: 20,
        // right: 10,
    },
    picker: {
        backgroundColor: "#fff",
      },
});

export default LoginScreen;
