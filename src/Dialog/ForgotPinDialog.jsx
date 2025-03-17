import React, { useRef, useState } from "react";
import { Dialog, Portal, Button, Text, TextInput, Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import ResetPinDialog from "./ResetPinDialog"; // Import the new component

const ForgotPinDialog = ({ visible, onDismiss, onSubmit }) => {
    const mobileRef = useRef(""); // Use ref for mobile number
    const otpRef = useRef(""); // Use ref for OTP
    const [otpRequested, setOtpRequested] = useState(false);
    const [showResetPinDialog, setShowResetPinDialog] = useState(false); // State to control ResetPinDialog visibility
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const onRequestOTP = () => {
        if (mobileRef.current.length !== 10) {
            showSnackbar("Enter a valid 10-digit mobile number.");
            setOtpRequested(false);
        } else {
            setOtpRequested(true);
        }
    };

    const onOk = () => {
        if (!otpRef.current) {
            showSnackbar("Please enter OTP.");
        } else if (otpRef.current.length !== 6) {
            showSnackbar("OTP must be 6 digits.");
        } else {
            console.log("Submitting OTP...");
            // Simulate OTP verification success
            setShowResetPinDialog(true); // Show the ResetPinDialog
            setOtpRequested(false);
        }
    };

    const onCancel = () => {
        setOtpRequested(false);
        onDismiss();
    };

    const handleResetPin = (newPin) => {
        console.log("New PIN:", newPin);
        // Call the onSubmit callback with the new PIN
        onSubmit({ mobile: mobileRef.current, otp: otpRef.current, newPin });
        setShowResetPinDialog(false); // Close the ResetPinDialog
        onDismiss(); // Close the ForgotPinDialog
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Forgot PIN?</Dialog.Title>
                <Dialog.Content>
                    <Text>Enter your registered mobile number to reset your PIN.</Text>
                    <TextInput
                        label="Mobile Number"
                        mode="outlined"
                        keyboardType="phone-pad"
                        defaultValue={mobileRef.current}
                        onChangeText={(text) => (mobileRef.current = text)}
                        maxLength={10}
                        style={{ marginTop: 10 }}
                    />
                    {otpRequested && (
                        <TextInput
                            label="OTP"
                            mode="outlined"
                            defaultValue={otpRef.current}
                            onChangeText={(text) => (otpRef.current = text)}
                            keyboardType="numeric"
                            maxLength={6}
                            style={{ marginTop: 10 }}
                        />
                    )}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onCancel}>Cancel</Button>
                    {otpRequested ? (
                        <Button onPress={onOk}>Submit</Button>
                    ) : (
                        <Button onPress={onRequestOTP}>Request OTP</Button>
                    )}
                </Dialog.Actions>
                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={500}
                    style={styles.snackbar}
                >
                    {snackbarMessage}
                </Snackbar>
            </Dialog>

            {/* Render the ResetPinDialog */}
            <ResetPinDialog
                visible={showResetPinDialog}
                onDismiss={() => setShowResetPinDialog(false)}
                onSubmit={handleResetPin}
            />
        </Portal>
    );
};

const styles = StyleSheet.create({
    snackbar: {
        // Custom styles for Snackbar
    },
});

export default ForgotPinDialog;