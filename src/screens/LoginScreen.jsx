import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar, Provider, RadioButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ForgotPinDialog from "../Dialog/ForgotPinDialog";
import { Picker } from "@react-native-picker/picker";
import { loginUser } from "../Redux/slices/userSlice";
import { useDispatch } from "react-redux";

const LoginScreen = ({ navigation }) => {
    const [mobile, setMobile] = useState("");
    const [merchantId, setMerchantId] = useState("");
    const [terminal, setTerminal] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [dialogVisible, setDialogVisible] = useState(false);
    const [choice, setChoice] = useState("");
    const [selectedUserType, setSelectedUserType] = useState("");
    const dispatch = useDispatch();

    const showSnackbar = (message) => {
        setSnackbarMessage(message ? String(message) : "");
        setSnackbarVisible(true);
    };

    const handleUserTypeChange = (itemValue) => {
        setSelectedUserType(itemValue);
        setMobile("");
        setMerchantId("");
        setTerminal("");
        setPin("");
        setChoice("");
    };

    const handleLogin = async () => {
        console.log('login clicked');
        
        if (!selectedUserType) {
            showSnackbar("Please select a user type.");
            return;
        }

        if (!pin) {
            showSnackbar("Please enter your PIN.");
            return;
        }

        if (pin.length !== 4 || !/^\d+$/.test(pin)) {
            showSnackbar("PIN must be 4 digits.");
            return;
        }

        if (selectedUserType === 'customer') {
            if (!mobile) {
                showSnackbar("Please enter your mobile number.");
                return;
            }

            if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
                showSnackbar("Enter a valid 10-digit mobile number.");
                return;
            }
        }

        if (selectedUserType === 'merchant') {
            if (choice === 'mobile') {
                if (!mobile) {
                    showSnackbar("Please enter your mobile number.");
                    return;
                }

                if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
                    showSnackbar("Enter a valid 10-digit mobile number.");
                    return;
                }
            } else if (choice === 'merchant_id') {
                if (!merchantId) {
                    showSnackbar("Please enter your Merchant ID.");
                    return;
                }

                if (!/^[a-zA-Z0-9]+$/.test(merchantId)) {
                    showSnackbar("Merchant ID must be alphanumeric.");
                    return;
                }
            } else {
                showSnackbar("Please select a valid option for Merchant login.");
                return;
            }
        }

        if (selectedUserType === 'terminal') {
            if (!terminal) {
                showSnackbar("Please enter your Terminal ID.");
                return;
            }

            // if (!/^[a-zA-Z0-9]+$/.test(terminal)) {
            //     showSnackbar("Terminal ID must be alphanumeric.");
            //     return;
        // }
    }

        setLoading(true);

        try {
            let userData;
            if (selectedUserType === 'customer') {
                userData = {
                    mobile,
                    pin,
                    user_category: selectedUserType,
                };
            } else if (selectedUserType === 'merchant' && choice === 'mobile') {
                userData = {
                    mobile,
                    pin,
                    user_category: selectedUserType,
                };
            } else if (selectedUserType === 'merchant' && choice === 'merchant_id') {
                userData = {
                    merchant_id: merchantId,
                    pin,
                    user_category: selectedUserType,
                };
            } else if (selectedUserType === 'terminal') {
                userData = {
                    terminal_id: terminal,
                    pin,
                    user_category: selectedUserType,
                };
            }

            console.log('login data', userData);

            const res = await dispatch(loginUser(userData)).unwrap();
            console.log('res', res);

            if (res?.message === "Login successful") {

                const storageData = {
                    user_category: res.user_category,
                    pin: res.pin,
                    token: res.token,
                    username: res.first_name,
                    is_profile_updated: res.is_profile_updated,
                    first_name: res.first_name,
                    last_name: res.last_name,
                };

                if (res.user_category === "customer") {
                    storageData.customer_id = res.customer_id;
                } 
                if(res.user_type == 'corporate') {
                    storageData.user_type = res.user_type,
                    storageData.corporate_id = res.corporate_id;
                }
                if (res.user_category === "merchant") {
                    storageData.merchant_id = res.merchant_id;
                }

                if(res.user_category === 'terminal') {
                    storageData.terminal_id=res?.terminal_id,
                    storageData.merchant_id=res?.merchant_id,
                    storageData.user_category=res?.user_category
                    storageData.pin=res?.tid_pin
                }
                //  else if (res.user_category === "corporate") {
                //     storageData.corporate_id = res.corporate_id;
                // }
               
console.log('storageeee ',storageData);

                console.log('is profile updated', res.is_profile_updated);
                await AsyncStorage.setItem("user", JSON.stringify(storageData));
                showSnackbar("Login successful");
                if (res.is_profile_updated === false) {
                navigation.navigate("MerchantForm", { userData: storageData });
                } else {
                    navigation.navigate("Home", { userData: storageData });
                }
            } else {
                showSnackbar(res?.message || "Login failed. Please try again.");
            }
        } catch (error) {
            showSnackbar(error?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPinSubmit = async (mobileNumber) => {
        try {
            showSnackbar(`PIN reset instructions sent to ${mobileNumber}`);
            setDialogVisible(false);
        } catch (error) {
            showSnackbar(error?.message || "Failed to process PIN reset. Please try again.");
        }
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text variant="headlineMedium" style={styles.title}>Login</Text>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedUserType}
                        onValueChange={handleUserTypeChange} // Updated to use the new handler
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a user type" value="" />
                        <Picker.Item label="Customer" value="customer" />
                        <Picker.Item label="Merchant" value="merchant" />
                        <Picker.Item label="Terminal" value="terminal" />
                    </Picker>
                </View>
                {selectedUserType === "merchant" && (
                    <>
                     <View style={styles.radioRow}>
          <RadioButton
            value="mobile"
            status={choice === 'mobile' ? 'checked' : 'unchecked'}
            onPress={() => setChoice('mobile')}
            color="#004BFF" // Updated checked color
          />
          <Text 
            style={styles.radioLabel} 
            onPress={() => setChoice('mobile')} // Added onPress to Text
          >
            Mobile
          </Text>

          <RadioButton
            value="Merchant_id"
            status={choice === 'merchant_id' ? 'checked' : 'unchecked'}
            onPress={() => setChoice('merchant_id')}
            color="#004BFF" // Updated checked color
          />
          <Text 
            style={styles.radioLabel} 
            onPress={() => setChoice('merchant_id')} // Added onPress to Text
          >
            Merchant ID
          </Text>

        </View>
  
    </>
)}


{selectedUserType === "customer" && (
    <TextInput
        label="Mobile Number"
        mode="outlined"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ""))}
        maxLength={10}
        style={styles.input}
    />
)}

                { (selectedUserType === 'merchant' && choice === 'mobile') && (
    <TextInput
        label="Mobile Number"
        mode="outlined"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ""))}
        maxLength={10}
        style={styles.input}
    />
)}
                { (selectedUserType === 'merchant' && choice === 'merchant_id') && (
    <TextInput
        label="Merchant ID"
        mode="outlined"
        value={merchantId} // Ensure merchantId state is bound here
        onChangeText={(text) => setMerchantId(text.replace(/[^a-zA-Z0-9]/g, ""))} // Allow alphanumeric characters
        maxLength={15} // Adjust maxLength if needed
        style={styles.input}
    />
)}

                { (selectedUserType === 'terminal') && (
    <TextInput
        label="Terminal ID"
        mode="outlined"
        // keyboardType="phone-pad"
        value={terminal}
        onChangeText={(text) => setTerminal(text.replace(/[^a-zA-Z0-9]/g, ""))}
        // maxLength={10}
        style={[styles.input, { borderColor: "#F14242" }]}    />
)}





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


                <Button
                    mode="contained"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                    style={styles.button}
                    labelStyle={styles.buttonLabel}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <View style={styles.linkContainer}>
                    <Button
                        onPress={() => setDialogVisible(true)}
                        textColor="#007BFF"
                        disabled={loading}
                        style={styles.linkButton}
                    >
                        Forgot PIN?
                    </Button>
                    <Button
                        onPress={() => navigation.navigate("Register")}
                        textColor="#007BFF"
                        disabled={loading}
                        style={styles.linkButton}
                    >
                        New user? Register
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
                    <Text style={styles.snackbarText}>{snackbarMessage}</Text>
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
        color: "#333",
    },
    input: {
        marginBottom: 15,
        backgroundColor: "white",
        borderColor: "#004BFF !importatnt",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#004BFF",
        borderRadius: 4,
        marginBottom: 15,
        overflow: "hidden",
    },
    picker: {
        backgroundColor: "white",
        height: 50,
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
        borderRadius: 4,
        backgroundColor:'#004BFF'
    },
    buttonLabel: {
        fontSize: 16,
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
    },
    linkButton: {
        minWidth: 0,
    },
    snackbar: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "#333",
    },
    snackbarText: {
        color: "white",
    },
    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
      },
      radioLabel: {
        marginRight: 20,
        fontSize: 16,
        color: '#444',
      },
  
});

export default LoginScreen;
