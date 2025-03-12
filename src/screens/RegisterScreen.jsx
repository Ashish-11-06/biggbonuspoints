import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar, Provider, Portal } from "react-native-paper";

const RegisterScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const sendOtp = () => {
        if (mobile.length !== 10) {
            showSnackbar("Enter a valid 10-digit mobile number.");
            return;
        }

        setOtpSent(true);
        showSnackbar("OTP sent to your mobile number.");
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

                    <TextInput
                        label="First Name"
                        mode="outlined"
                        value={firstName}
                        onChangeText={setFirstName}
                        style={styles.input}
                    />

                    <TextInput
                        label="Last Name"
                        mode="outlined"
                        value={lastName}
                        onChangeText={setLastName}
                        style={styles.input}
                    />

                    <TextInput
                        label="Mobile Number"
                        mode="outlined"
                        keyboardType="phone-pad"
                        value={mobile}
                        onChangeText={setMobile}
                        maxLength={10}
                        style={styles.input}
                    />

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
    input: {
        marginBottom: 15,
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
});

export default RegisterScreen;
