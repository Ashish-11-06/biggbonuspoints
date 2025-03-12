import React from "react";
import { Dialog, Portal, Button, Text, TextInput } from "react-native-paper";

const ForgotPinDialog = ({ visible, onDismiss, mobile, setMobile, onSubmit }) => {
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
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Cancel</Button>
                    <Button onPress={onSubmit}>Submit</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
};

export default ForgotPinDialog;
