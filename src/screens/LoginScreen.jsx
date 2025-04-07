import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPinDialog from "../Dialog/ForgotPinDialog";
import { Picker } from "@react-native-picker/picker";
// Import Reactotron configuration
import Reactotron from 'reactotron-react-native';
import { loginUser } from "../Redux/slices/userSlice";
import { useDispatch } from "react-redux";

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedUserType, setSelectedUserType] = useState("");
    const dispatch = useDispatch();
    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    // const handleLogin = async () => {
    //     const userData = {
    //         mobile: mobile,
    //         pin: pin,
    //         user_category: selectedUserType,
    //     };
    //     console.log("userdata", userData);

    //     if (!mobile || !pin) {
    //         showSnackbar("Please enter both mobile number and PIN.");
    //         return;
    //     } else if (mobile.length !== 10) {
    //         showSnackbar("Enter a valid 10-digit mobile number.");
    //         return;
    //     } else if (pin.length !== 4) {
    //         showSnackbar("PIN must be 4 digits.");
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         const res = await dispatch(loginUser(userData)).unwrap();
    //         console.log("login res", res);

    //         if (res && res.message === "Login successful") {
    //             console.log(res);
    //             console.log(res.message);

    //             // Store data in AsyncStorage based on user_category
    //             const storageData = {
    //                 user_category: res.user_category,
    //             };
    //             if (res.user_category === "customer") {
    //                 storageData.customer_id = res.customer_id;
    //             } else if (res.user_category === "merchant") {
    //                 storageData.merchant_id = res.merchant_id;
    //             }
    //             await AsyncStorage.setItem("user", JSON.stringify(storageData));

    //             showSnackbar(res.message); // Display success message
    //             navigation.navigate("Home");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         showSnackbar("Login failed. Please try again.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                    style={styles.picker}>
                    <Picker.Item label="Select a user type" value="" />
                    <Picker.Item label="Customer" value="customer" />
                    <Picker.Item label="Merchant" value="merchant" />
                    <Picker.Item label="Corporate Merchant" value="corporate" />
                </Picker>

                <Button mode="contained" onPress={navigation.navigate("Home")} loading={loading} style={styles.button}>
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
  <Text>{snackbarMessage}</Text>
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
        bottom: 200,
        left: 20,
        // right: 10,
    },
    picker: {
        backgroundColor: "#fff",
      },
});

export default LoginScreen;
