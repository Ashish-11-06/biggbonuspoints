import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar, Provider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPinDialog from "../Dialog/ForgotPinDialog";
import { Picker } from "@react-native-picker/picker";
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

    const handleLogin = async () => {
        if (!selectedUserType) {
            showSnackbar("Please select a user type.");
            return;
        }

        if (!mobile || !pin) {
            showSnackbar("Please enter both mobile number and PIN.");
            return;
        }

        if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
            showSnackbar("Enter a valid 10-digit mobile number.");
            return;
        }

        if (pin.length !== 4 || !/^\d+$/.test(pin)) {
            showSnackbar("PIN must be 4 digits.");
            return;
        }

        setLoading(true);

        try {
            const userData = {
                mobile: mobile,
                pin: pin,
                user_category: selectedUserType,
            };

            const res = await dispatch(loginUser(userData)).unwrap();

            if (res?.message === "Login successful") {
                // Store data in AsyncStorage based on user_category
                const storageData = {
                    user_category: res.user_category,
                    token: res.token, // assuming your API returns a token
                };

                if (res.user_category === "customer") {
                    storageData.customer_id = res.customer_id;
                } else if (res.user_category === "merchant") {
                    storageData.merchant_id = res.merchant_id;
                }

                await AsyncStorage.setItem("user", JSON.stringify(storageData));
                showSnackbar("Login successful");
                navigation.navigate("Home");
            }
        } catch (error) {
            // console.error("Login error:", error);
            showSnackbar(error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPinSubmit = async (mobileNumber) => {
        try {
            // Here you would typically call an API to handle forgot PIN
            // For now, we'll just show a success message
            showSnackbar(`PIN reset instructions sent to ${mobileNumber}`);
            setDialogVisible(false);
        } catch (error) {
            showSnackbar("Failed to process PIN reset. Please try again.");
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text variant="headlineMedium" style={styles.title}>
                    Login
                </Text>

                <TextInput
                    label="Mobile Number"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ""))}
                    maxLength={10}
                    style={styles.input}
                />

                <TextInput
                    label="4-Digit PIN"
                    mode="outlined"
                    keyboardType="numeric"
                    secureTextEntry
                    value={pin}
                    onChangeText={(text) => setPin(text.replace(/[^0-9]/g, ""))}
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

                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <View style={styles.linkContainer}>
                    <Button
                        onPress={() => setDialogVisible(true)}
                        textColor="#007BFF"
                        disabled={loading}
                    >
                        Forgot PIN?
                    </Button>
                    <Button
                        onPress={() => navigation.navigate("Register")}
                        textColor="#007BFF"
                        disabled={loading}
                    >
                        New user? Register.
                    </Button>
                </View>

                <ForgotPinDialog
                    visible={dialogVisible}
                    onDismiss={() => setDialogVisible(false)}
                    mobile={mobile}
                    setMobile={setMobile}
                    onSubmit={handleForgotPinSubmit}
                    loading={loading}
                />

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                    action={{
                        label: "OK",
                        onPress: () => setSnackbarVisible(false),
                    }}
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
        backgroundColor: "white",
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    snackbar: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    picker: {
        backgroundColor: "white",
        marginBottom: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#ccc",
    },
});

export default LoginScreen;