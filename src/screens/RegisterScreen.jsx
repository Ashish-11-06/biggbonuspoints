import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ToastAndroid, ScrollView, Platform } from "react-native";
import { Text, TextInput, Button, Provider, Portal, ActivityIndicator } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import HelpDialog from "../Dialog/HelpDialog";
import { registerUser, verifyOtp } from "../Redux/slices/userSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecurityQuestions } from "../Redux/slices/securityQuestionsSlice";

const RegisterScreen = ({ navigation }) => {
    // Refs for form inputs
    const firstNameRef = useRef("");
    const lastNameRef = useRef("");
    const mobileRef = useRef("");
    const otpRef = useRef("");
    const pinRef = useRef("");
    const confirmPinRef = useRef("");
    const securityQuestionRef = useRef("");
    const securityAnswerRef = useRef("");
    const referenceQuestionRef = useRef("");
    const referenceAnswerRef = useRef("");
    const userTypeRef = useRef("");

    // State management
    const [otpSent, setOtpSent] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [helpDialog, setHelpDialog] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [customerId, setCustomerId] = useState("");
    const [selectedReference, setSelectedReference] = useState(""); // Add state for reference question
    const [userType, setUserType] = useState(""); // Add state for user type
    const [securityQuestions, setSecurityQuestions] = useState([]); // State to store security questions
    

    // Error states
    const [firstNameError, setFirstNameError] = useState("");
    const [lastNameError, setLastNameError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [pinError, setPinError] = useState("");
    const [confirmPinError, setConfirmPinError] = useState("");
    const [securityQuestionError, setSecurityQuestionError] = useState("");
    const [securityAnswerError, setSecurityAnswerError] = useState("");
    const [referenceQuestionError, setReferenceQuestionError] = useState("");
    const [referenceAnswerError, setReferenceAnswerError] = useState("");
    const [userTypeError, setUserTypeError] = useState("");

    const dispatch = useDispatch();

    // Show toast message
    const showToast = (message) => {
        if (Platform.OS === "android") {
            ToastAndroid.showWithGravity(
                message,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
            );
        } else {
            console.log("Toast not supported on this platform");
        }
    };

        useEffect(() => {
            const fetchSecurityQuestions = async () => {
                try {
                    const response = await dispatch(getSecurityQuestions());
                    console.log("Security Questions:", response);
                    setSecurityQuestions(response?.payload.questions); // Assuming response contains the questions
                    } catch (error) {
                    console.error("Error fetching security questions:", error);
                }
            };
            fetchSecurityQuestions();
        }, []);
    // Validate all form fields
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
 setReferenceAnswerError("");
        setReferenceQuestionError("");
 


        // Validate First Name
        if (!firstNameRef.current) {
            setFirstNameError("First Name is required");
            isValid = false;
        }

        // Validate Last Name
        if (!lastNameRef.current) {
            setLastNameError("Last Name is required");
            isValid = false;
        }

        // Validate Mobile Number
        if (!mobileRef.current) {
            setMobileError("Mobile Number is required");
            isValid = false;
        } else if (mobileRef.current.length !== 10 || !/^\d+$/.test(mobileRef.current)) {
            setMobileError("Enter a valid 10-digit mobile number");
            isValid = false;
        }

        // Validate PIN
        if (!pinRef.current) {
            setPinError("PIN is required");
            isValid = false;
        } else if (pinRef.current.length !== 4 || !/^\d+$/.test(pinRef.current)) {
            setPinError("PIN must be 4 digits");
            isValid = false;
        }

        // Validate Confirm PIN
        if (!confirmPinRef.current) {
            setConfirmPinError("Confirm PIN is required");
            isValid = false;
        } else if (confirmPinRef.current !== pinRef.current) {
            setConfirmPinError("PINs do not match");
            isValid = false;
        }

        // Validate Security Question
        if (!securityQuestionRef.current) {
            setSecurityQuestionError("Security Question is required");
            isValid = false;
        }

        // Validate Security Answer
        if (!securityAnswerRef.current) {
            setSecurityAnswerError("Security Answer is required");
            isValid = false;
        }
        if (!referenceQuestionRef.current && userTypeRef.current === "merchant") {
            setReferenceQuestionError("reference Question is required");
            isValid = false;
        }

        // Validate Security Answer
        if (!referenceAnswerRef.current && referenceQuestionRef.current === "emp_id") {
            setReferenceAnswerError("reference Answer is required");
            isValid = false;
        }

        // Validate User Type
        if (!userTypeRef.current) {
            setUserTypeError("User Type is required");
            isValid = false;
        }

        return isValid;
    };

    // Handle OTP sending
    const sendOtp = async () => {
        console.log('button clicked');
        
        if (!validateFields()) return;

        setRegisterLoading(true);

        try {
            const formData = {
                first_name: firstNameRef.current,
                last_name: lastNameRef.current,
                mobile: mobileRef.current,
                pin: pinRef.current,
                security_question: securityQuestionRef.current, // <-- This is the ID
                answer: securityAnswerRef.current,
                user_category: userTypeRef.current,
                ...(userTypeRef.current === "merchant" && {
                    reference_question: referenceQuestionRef.current,
                    reference_answer: referenceAnswerRef.current,
                    user_type:"individual"
                }),
            };
            console.log('form', formData);
            const res = await dispatch(registerUser(formData));
            // const res= 'abc';
            if (res?.type === "user/registerUser/fulfilled") {
                const { user_id, user_category } = res.payload;
                
                // Store the user_id and user_category in state
                setCustomerId(user_id);
                
                showToast("OTP sent to your mobile number");
                setOtpSent(true);
                startCountdown();
            } else {
                showToast(res?.payload?.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error("Registration error:", error);
            showToast("Failed to send OTP. Please try again.");
        } finally {
            setRegisterLoading(false);
        }
    };

    // Start OTP resend countdown
    const startCountdown = () => {
        setCountdown(30);
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Resend OTP
    const resendOtp = async () => {
        if (countdown > 0) return;

        setRegisterLoading(true);
        try {
            // You might want to call a separate API for resend OTP
            // For now, we'll just show a message
            showToast("OTP resent to your mobile number");
            startCountdown();
        } catch (error) {
            showToast("Failed to resend OTP");
        } finally {
            setRegisterLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async () => {
        if (!otpRef.current || otpRef.current.length !== 6) {
            setOtpError("Enter a valid 6-digit OTP");
            return;
        }

        if (!customerId) {
            showToast("Registration session expired. Please register again.");
            return;
        }

        setVerifyLoading(true);

        try {
            const formData = {
                user_id: customerId,
                user_category: userTypeRef.current,
                otp: Number(otpRef.current)
            };

            const res = await dispatch(verifyOtp(formData));

            if (res?.type === "user/verifyOtp/fulfilled") {
                showToast("Registration successful!");
                navigation.navigate("Login");
            } else {
                showToast(res?.payload?.message || "OTP verification failed");
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            showToast("OTP verification failed. Please try again.");
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <Provider>
            <Portal>
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <Text variant="headlineMedium" style={styles.title}>
                            Register
                        </Text>

                        {/* User Type Picker */}
                        <Picker
                            selectedValue={userType}
                            onValueChange={(value) => {
                                setUserType(value); // Update state to trigger re-render
                                userTypeRef.current = value;
                                setSelectedReference(""); // Reset reference selection when user type changes
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a user type" value="" />
                            <Picker.Item label="Customer" value="customer" />
                            <Picker.Item label="Merchant" value="merchant" />
                            <Picker.Item label="Corporate Merchant" value="corporate" />
                        </Picker>
                        {userTypeError ? <Text style={styles.errorText}>{userTypeError}</Text> : null}

                        {/* Name Fields */}
                        <View style={styles.nameContainer}>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="First Name"
                                    mode="outlined"
                                    onChangeText={(text) => (firstNameRef.current = text)}
                                    error={!!firstNameError}
                                    style={styles.input}
                                />
                                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                            </View>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="Last Name"
                                    mode="outlined"
                                    onChangeText={(text) => (lastNameRef.current = text)}
                                    error={!!lastNameError}
                                    style={styles.input}
                                />
                                {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                            </View>
                        </View>

                        {/* Mobile Number */}
                        <TextInput
                            label="Mobile Number"
                            mode="outlined"
                            keyboardType="phone-pad"
                            onChangeText={(text) => (mobileRef.current = text.replace(/[^0-9]/g, ""))}
                            maxLength={10}
                            error={!!mobileError}
                            style={styles.input}
                        />
                        {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}

                        {/* PIN Fields */}
                        <View style={styles.nameContainer}>
                            <View style={styles.halfInput}>
                                <TextInput
                                    label="Enter 4-digit PIN"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    mode="outlined"
                                    onChangeText={(text) => (pinRef.current = text.replace(/[^0-9]/g, ""))}
                                    maxLength={4}
                                    error={!!pinError}
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
                                    onChangeText={(text) => (confirmPinRef.current = text.replace(/[^0-9]/g, ""))}
                                    maxLength={4}
                                    error={!!confirmPinError}
                                    style={styles.input}
                                />
                                {confirmPinError ? <Text style={styles.errorText}>{confirmPinError}</Text> : null}
                            </View>
                        </View>

                        {/* Security Question */}
                        <Picker
                            selectedValue={securityQuestionRef.current}
                            onValueChange={(value) => (securityQuestionRef.current = value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a security question" value="" />
                            {securityQuestions && securityQuestions.map((q) => (
                                <Picker.Item key={q.id} label={q.question} value={q.id.toString()} />
                            ))}
                        </Picker>
                        {securityQuestionError ? <Text style={styles.errorText}>{securityQuestionError}</Text> : null}

                        {/* Security Answer */}
                        <TextInput
                            label="Answer"
                            mode="outlined"
                            onChangeText={(text) => (securityAnswerRef.current = text)}
                            error={!!securityAnswerError}
                            style={styles.input}
                        />
                        {securityAnswerError ? <Text style={styles.errorText}>{securityAnswerError}</Text> : null}

                        {/* Reference Question Picker (only for merchants) */}
                        {userType === "merchant" && (
                            <>
                                <Picker
                                    selectedValue={selectedReference}
                                    onValueChange={(value) => {
                                        setSelectedReference(value); // Update state
                                        referenceQuestionRef.current = value;
                                        if (value !== "emp_id") {
                                            referenceAnswerRef.current = null; // Reset answer if not "Sales Person"
                                        }
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select a Reference" value="" />
                                    <Picker.Item label="Social Media" value="Social Media" />
                                    <Picker.Item label="Sales " value="emp_id" />
                                    <Picker.Item label="News Paper" value="News Paper" />
                                    <Picker.Item label="Other" value="Other" />
                                </Picker>
                                {referenceQuestionError ? <Text style={styles.errorText}>{referenceQuestionError}</Text> : null}

                                {/* Reference Answer Input */}
                                {selectedReference === "emp_id" && (
                                    <TextInput
                                        label="Please enter Sales Person ID"
                                        mode="outlined"
                                        onChangeText={(text) => (referenceAnswerRef.current = text)}
                                        error={!!referenceAnswerError}
                                        style={styles.input}
                                    />
                                )}
                                {selectedReference === "Other" && (
                                    <TextInput
                                        label="Please enter Reference"
                                        mode="outlined"
                                        onChangeText={(text) => (referenceAnswerRef.current = text)}
                                        error={!!referenceAnswerError}
                                        style={styles.input}
                                    />
                                )}
                                {referenceAnswerError ? <Text style={styles.errorText}>{referenceAnswerError}</Text> : null}
                            </>
                        )}

                        {/* Register/OTP Button */}
                        <Button
                            mode="contained"
                            onPress={otpSent ? resendOtp : sendOtp}
                            loading={registerLoading}
                            disabled={registerLoading || (otpSent && countdown > 0)}
                            style={styles.button}
                        >
                            {registerLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : otpSent ? (
                                countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"
                            ) : (
                                "Register & Send OTP"
                            )}
                        </Button>

                        {/* OTP Field (only shown after OTP is sent) */}
                        {otpSent && (
                            <>
                                <TextInput
                                    label="Enter 6-digit OTP"
                                    mode="outlined"
                                    keyboardType="numeric"
                                    onChangeText={(text) => (otpRef.current = text.replace(/[^0-9]/g, ""))}
                                    maxLength={6}
                                    error={!!otpError}
                                    style={styles.input}
                                />
                                {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

                                <Button
                                    mode="contained"
                                    onPress={handleVerifyOtp}
                                    loading={verifyLoading}
                                    disabled={verifyLoading}
                                    style={styles.button}
                                >
                                    {verifyLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </Button>
                            </>
                        )}

                        {/* Navigation Links */}
                        <Button 
                            onPress={() => navigation.navigate("Login")} 
                            textColor="#007BFF"
                            style={styles.linkButton}
                        >
                            Already have an account? Login
                        </Button>
                        <Button 
                            onPress={() => setHelpDialog(true)} 
                            textColor="#007BFF"
                            style={styles.linkButton}
                        >
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
        backgroundColor: "white",
    },
    halfInput: {
        flex: 1,
        marginRight: 10,
    },
    button: {
        marginTop: 10,
        paddingVertical: 8,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 10,
        marginTop: -5,
    },
    picker: {
        backgroundColor: "#fff",
        marginBottom: 10,
    },
    linkButton: {
        marginTop: 10,
    },
});

export default RegisterScreen;