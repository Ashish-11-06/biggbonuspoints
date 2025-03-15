import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar, Provider, Portal } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import HelpDialog from "../Dialog/HelpDialog";

const RegisterScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [helpDialog, setHelpDialog] = useState(false);

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const sendOtp = () => {
        if (!firstName || !lastName || !mobile) {
            showSnackbar("Please fill all fields.");
        }
        if (mobile.length !== 10) {
            showSnackbar("Enter a valid 10-digit mobile number.");
            return;
        }

        setOtpSent(true);
        showSnackbar("OTP sent to your mobile number.");
    };

    const handleClickHelp = () => {
        setHelpDialog(true);
    };

    const handleDismissHelp = () => {
        setHelpDialog(false);
    };

    const handleRegister = () => {
        if (!firstName || !lastName || !mobile || !otp) {
            showSnackbar("Please fill all fields.");
            return;
        }

        if (otp.length !== 6) {
            showSnackbar("OTP must be 6 digits.");
            return;
        }

        if (pin !== confirmPin) {
            showSnackbar("PIN and Confirm PIN must match.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            showSnackbar("Registration Successful! Please login.");
            navigation.replace("Login");
        }, 1500);
    };

    return (
        <Provider>
            <Portal>
                <View style={styles.container}>
                    <Text variant="headlineMedium" style={styles.title}>
                        Register
                    </Text>

                    <View style={styles.nameContainer}>
                        <TextInput
                            label="First Name"
                            mode="outlined"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={[styles.input, styles.halfInput]}
                        />
                        <TextInput
                            label="Last Name"
                            mode="outlined"
                            value={lastName}
                            onChangeText={setLastName}
                            style={[styles.input, styles.halfInput]}
                        />
                    </View>

                    <TextInput
                        label="Mobile Number"
                        mode="outlined"
                        keyboardType="phone-pad"
                        value={mobile}
                        onChangeText={setMobile}
                        maxLength={10}
                        style={styles.input}
                    />

                    <View style={styles.nameContainer}>
                        <TextInput
                            label="Enter PIN"
                            keyboardType="numeric"
                            secureTextEntry
                            mode="outlined"
                            value={pin}
                            onChangeText={setPin}
                            style={[styles.input, styles.halfInput]}
                        />
                        <TextInput
                            label="Confirm PIN"
                            keyboardType="numeric"
                            secureTextEntry
                            mode="outlined"
                            value={confirmPin}
                            onChangeText={setConfirmPin}
                            style={[styles.input, styles.halfInput]}
                        />
                    </View>

                     {/* <View style={styles.container}> */}
                     <Picker
                            selectedValue={selectedQuestion}
                            onValueChange={(itemValue) => setSelectedQuestion(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a security question" value="" />
                            <Picker.Item label="What is your pet's name?" value="pet_name" />
                            <Picker.Item label="What is your mother's maiden name?" value="mother_maiden" />
                            <Picker.Item label="What was your first school?" value="first_school" />
                        </Picker>
                        <TextInput
                            label="Answer"
                            mode="outlined"
                            style={styles.input}
                            value={securityAnswer}
                            onChangeText={setSecurityAnswer}
                        />
                       
                    {/* </View>  */}

                    <Button mode="outlined" onPress={sendOtp} disabled={otpSent} style={styles.otpButton}>
                        {otpSent ? "OTP Sent" : "Send OTP"}
                    </Button>

                    <TextInput
                        label="Enter OTP"
                        mode="outlined"
                        keyboardType="numeric"
                        value={otp}
                        onChangeText={(text) => {
                            if (text.length <= 6) setOtp(text);
                        }}
                        maxLength={6}
                        style={styles.input}
                    />

                    <Button mode="contained" onPress={handleRegister} loading={loading} style={styles.button}>
                        Register
                    </Button>

                    <Button onPress={() => navigation.navigate("Login")} textColor="#007BFF">
                        Already have an account? Login
                    </Button>

                    <Button onPress={handleClickHelp} textColor="#007BFF">
                      Need Help?
                    </Button>

                    {/* Help Dialog */}
                    <HelpDialog
                    visible={helpDialog}
                    onDismiss={handleDismissHelp}
                />

                    {/* Snackbar inside Portal */}
                    <Snackbar
                        visible={snackbarVisible}
                        onDismiss={() => setSnackbarVisible(false)}
                        duration={3000}
                        style={styles.snackbar}
                    >
                        {snackbarMessage}
                    </Snackbar>
                </View>
            </Portal>
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
    nameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    input: {
        marginBottom: 15,
    },
    halfInput: {
        flex: 1,
        marginRight: 10,
    },
    otpButton: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
    },
    snackbar: {
        position: "absolute",
        bottom: 20,
        left: 20,
        // right: 20,
    },
    picker: {
        backgroundColor: "#fff",
      },
});

export default RegisterScreen;
