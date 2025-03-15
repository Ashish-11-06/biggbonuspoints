import React, { useState } from "react";
import { Dialog, Portal, Button, Text, TextInput, Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";

const ForgotPinDialog = ({ visible, onDismiss, mobile, setMobile, onSubmit }) => {
    const [otpRequested, setOtpRequested] = useState(false);
    const [otp, setOtp] = useState("");
 const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarVisible(true);
    };

    const onRequestOTP = () => {  
        if (mobile.length !== 10) {
            showSnackbar("Enter a valid 10-digit mobile number.");
            setOtpRequested(false);
        } else {
            setOtpRequested(true);
        }
    };

    const onOk = () => {
        if(!otp) {
             showSnackbar("Please enter OTP.");
        } else if (otp.length !== 6) {
            showSnackbar("OTP must be 6 digits.");
        } else { 
            console.log("Submitting OTP...");
            onSubmit();
            setOtpRequested(false);
        }
    };

    const onCancel = () => {
        setOtpRequested(false);
        onDismiss();
    }
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
                        value={mobile}
                        onChangeText={setMobile}
                        maxLength={10}
                        style={{ marginTop: 10 }}
                    />
                    {otpRequested && (
                        <TextInput
                            label="OTP"
                            mode="outlined"
                            value={otp}
                            onChangeText={setOtp}
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
                        duration={3000}
                        style={styles.snackbar}
                    >
                        {snackbarMessage}
                    </Snackbar>
            </Dialog>
        </Portal>
    );
};


const styles = StyleSheet.create({
    snackbar: {
        position: "absolute",
        bottom:400,
        left: 20,
        right: 10,
    },
});

export default ForgotPinDialog;
