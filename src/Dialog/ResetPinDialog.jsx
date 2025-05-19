import React, { useRef, useState } from "react";
import { Dialog, Portal, Button, Text, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";

const ResetPinDialog = ({ visible, onDismiss, onSubmit }) => {
    const newPinRef = useRef(""); // Use ref for new PIN
    const confirmPinRef = useRef(""); // Use ref for confirm PIN
    const [newPinError, setNewPinError] = useState(""); // State for new PIN error
    const [confirmPinError, setConfirmPinError] = useState(""); // State for confirm PIN error

    const validateFields = () => {
        let isValid = true;

        // Reset errors
        setNewPinError("");
        setConfirmPinError("");

        // Validate New PIN
        if (!newPinRef.current) {
            setNewPinError("New PIN is required.");
            isValid = false;
        } else if (newPinRef.current.length !== 4) {
            setNewPinError("PIN must be 4 digits.");
            isValid = false;
        }

        // Validate Confirm PIN
        if (!confirmPinRef.current) {
            setConfirmPinError("Confirm PIN is required.");
            isValid = false;
        } else if (confirmPinRef.current.length !== 4) {
            setConfirmPinError("PIN must be 4 digits.");
            isValid = false;
        }

        // Check if both PINs match (only if both are 4 digits)
        if (
            newPinRef.current &&
            confirmPinRef.current &&
            newPinRef.current.length === 4 &&
            confirmPinRef.current.length === 4 &&
            newPinRef.current !== confirmPinRef.current
        ) {
            setConfirmPinError("PIN and Confirm PIN must match.");
            isValid = false;
        }

        return isValid;
    };

    const onResetPin = () => {
        if (!validateFields()) return;

        // Call the onSubmit callback with the new PIN
        onSubmit(newPinRef.current);
        onDismiss(); // Close the dialog after submission
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>Reset PIN</Dialog.Title>
                <Dialog.Content>
                    <Text>Enter your new PIN and confirm it.</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="New PIN"
                            mode="outlined"
                            keyboardType="numeric"
                            secureTextEntry
                            defaultValue={newPinRef.current}
                            onChangeText={(text) => (newPinRef.current = text)}
                            maxLength={4}
                            style={styles.input}
                        />
                        {newPinError ? <Text style={styles.errorText}>{newPinError}</Text> : null}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            label="Confirm New PIN"
                            mode="outlined"
                            keyboardType="numeric"
                            secureTextEntry
                            defaultValue={confirmPinRef.current}
                            onChangeText={(text) => (confirmPinRef.current = text)}
                            maxLength={4}
                            style={styles.input}
                        />
                        {confirmPinError ? <Text style={styles.errorText}>{confirmPinError}</Text> : null}
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={onResetPin}>Submit</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 15, // Add spacing between input fields
    },
    input: {
        marginTop: 10, // Add spacing above the input field
    },
    errorText: {
        color: "red", // Red color for error messages
        fontSize: 12, // Smaller font size for error messages
        marginTop: 5, // Add spacing between input field and error message
    },
});

export default ResetPinDialog;