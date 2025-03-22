import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, Provider, Portal } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import HelpDialog from "../Dialog/HelpDialog";
import { registerUser, verifyOtp } from "../Redux/slices/userSlice";
import { useDispatch } from "react-redux";

const RegisterScreen = ({ navigation }) => {
    const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const mobileRef = useRef("");
    const otpRef = useRef("");
    const pinRef = useRef("");
    const confirmPinRef = useRef("");
    const securityQuestionRef = useRef("");
    const securityAnswerRef = useRef("");
    const userTypeRef = useRef("");

    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [helpDialog, setHelpDialog] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // Track registration process

    // State for error messages
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [pinError, setPinError] = useState("");
    const [confirmPinError, setConfirmPinError] = useState("");
    const [securityQuestionError, setSecurityQuestionError] = useState("");
    const [securityAnswerError, setSecurityAnswerError] = useState("");
    const [userTypeError, setUserTypeError] = useState("");

    const dispatch = useDispatch();

    const validateFields = () => {
        let isValid = true;

        // Reset errors
        setFirstNameError("");
        setLastNameError("");
        setMobileError("");
        setOtpError("");
        setPinError("");
        setConfirmPinError("");
        setSecurityQuestionError("");
        setSecurityAnswerError("");
        setUserTypeError("");

        // Validate First Name
        if (!firstNameRef.current) {
            setFirstNameError("First Name is required.");
            isValid = false;
        }

        // Validate Last Name
        if (!lastNameRef.current) {
            setLastNameError("Last Name is required.");
            isValid = false;
        }

        // Validate Mobile Number
        if (!mobileRef.current) {
            setMobileError("Mobile Number is required.");
            isValid = false;
        } else if (mobileRef.current.length !== 10) {
            setMobileError("Enter a valid 10-digit mobile number.");
            isValid = false;
        }

        // Validate PIN
        if (!pinRef.current) {
            setPinError("PIN is required.");
            isValid = false;
        } else if (pinRef.current.length < 4) {
            setPinError("PIN must be at least 4 digits.");
            isValid = false;
        }

        // Validate Confirm PIN
        if (!confirmPinRef.current) {
            setConfirmPinError("Confirm PIN is required.");
            isValid = false;
        } else if (confirmPinRef.current !== pinRef.current) {
            setConfirmPinError("PIN and Confirm PIN must match.");
            isValid = false;
        }

        // Validate Security Question
        if (!securityQuestionRef.current) {
            setSecurityQuestionError("Security Question is required.");
            isValid = false;
        }

        // Validate Security Answer
        if (!securityAnswerRef.current) {
            setSecurityAnswerError("Security Answer is required.");
            isValid = false;
        }

        // Validate User Type
        if (!userTypeRef.current) {
            setUserTypeError("User Type is required.");
            isValid = false;
        }

        // Validate OTP only during registration
        if (isRegistering) {
            if (!otpRef.current) {
                setOtpError("OTP is required.");
                isValid = false;
            } else if (otpRef.current.length !== 6) {
                setOtpError("OTP must be 6 digits.");
                isValid = false;
            }
        }

        return isValid;
    };

    const sendOtp = () => {
        console.log("sendOtp called"); // Add this line
        if (!validateFields()) return;
        setIsRegistering(true); // Start registration process
        if (!validateFields()) return;
    
        const formData = {
            firstName: firstNameRef.current,
            lastName: lastNameRef.current,
            mobile: mobileRef.current,
            otp: otpRef.current,
            pin: pinRef.current,
            confirmPin: confirmPinRef.current,
            securityQuestion: securityQuestionRef.current,
            securityAnswer: securityAnswerRef.current,
            userType: userTypeRef.current,
        };
    
        console.log("Form Data:", formData); // Log form data
    
        const res = dispatch(registerUser(formData));
        console.log("Dispatch Response:", res); // Log dispatch response
    
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            // navigation.replace("Login");
        }, 1500);
        setOtpSent(true);
    };// console.log(userTypeRef.current);

    const handleVerifyOtp = () => {

    };

    return (
        <Provider>
            <Portal>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <Text variant="headlineMedium" style={styles.title}>Register</Text>
                        <Picker
                            selectedValue={userTypeRef.current}
                            onValueChange={(value) => (userTypeRef.current = value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a user type" value="" />
                            <Picker.Item label="Customer" value="customer" />
                            <Picker.Item label="Merchant" value="merchant" />
                            <Picker.Item label="Corporate Merchant" value="corporate" />
                        </Picker>

                        {userTypeError ? <Text style={styles.errorText}>{userTypeError}</Text> : null}

                        <View style={styles.nameContainer}>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="First Name"
                                    mode="outlined"
                                    onChangeText={(text) => (firstNameRef.current = text)}
                                    style={styles.input}
                                />
                                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                            </View>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="Last Name"
                                    mode="outlined"
                                    onChangeText={(text) => (lastNameRef.current = text)}
                                    style={styles.input}
                                />
                                {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                            </View>
                        </View>

                        <TextInput
                            label="Mobile Number"
                            mode="outlined"
                            keyboardType="phone-pad"
                            onChangeText={(text) => (mobileRef.current = text)}
                            maxLength={10}
                            style={styles.input}
                        />
                        {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

                        <View style={styles.nameContainer}>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="Enter PIN"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    mode="outlined"
                                    onChangeText={(text) => (pinRef.current = text)}
                                    style={styles.input}
                                />
                                {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}
                            </View>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="Confirm PIN"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    mode="outlined"
                                    onChangeText={(text) => (confirmPinRef.current = text)}
                                    style={styles.input}
                                />
                                {confirmPinError ? <Text style={styles.errorText}>{confirmPinError}</Text> : null}
                            </View>
                        </View>

                        <Picker
                            selectedValue={securityQuestionRef.current}
                            onValueChange={(value) => (securityQuestionRef.current = value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a security question" value="" />
                            <Picker.Item label="What is your pet's name?" value="pet_name" />
                            <Picker.Item label="What is your mother's maiden name?" value="mother_maiden" />
                            <Picker.Item label="What was your first school?" value="first_school" />
                        </Picker>
                        {securityQuestionError ? <Text style={styles.errorText}>{securityQuestionError}</Text> : null}

                        <TextInput
                            label="Answer"
                            mode="outlined"
                            onChangeText={(text) => (securityAnswerRef.current = text)}
                            style={styles.input}
                        />
                        {securityAnswerError ? <Text style={styles.errorText}>{securityAnswerError}</Text> : null}

                        <Button mode="outlined" onPress={sendOtp} disabled={otpSent} style={styles.otpButton}>
                            {otpSent ? "OTP Sent" : "Register"}
                        </Button>

                        <TextInput
                            label="Enter OTP"
                            mode="outlined"
                            keyboardType="numeric"
                            onChangeText={(text) => (otpRef.current = text)}
                            maxLength={6}
                            style={styles.input}
                        />
                        {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

                        <Button mode="contained" onPress={handleVerifyOtp} loading={loading} style={styles.button}>
                            Verify OTP
                        </Button>
                        <Button onPress={() => navigation.navigate("Login")} textColor="#007BFF">
                            Already have an account? Login
                        </Button>
                        <Button onPress={() => setHelpDialog(true)} textColor="#007BFF">
                            Need Help?
                        </Button>
                        <HelpDialog visible={helpDialog} onDismiss={() => setHelpDialog(false)} />
                    </View>
                </ScrollView>
            </Portal>
        </Provider>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
    },
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
        marginBottom: 5,
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
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
    },
    picker: {
        backgroundColor: "#fff",
    },
});

export default RegisterScreen;