import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Camera, useCameraDevices } from "react-native-vision-camera";

const QRImg = require("../assests/QR_img.png");

const ScanQR = () => {
  const [scannedData, setScannedData] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [redeemPoints, setRedeemPoints] = useState("");

  const devices = useCameraDevices();
  const device = devices?.back || devices[0];

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      const microphonePermission = await Camera.requestMicrophonePermission();

      if (cameraPermission !== "granted" || microphonePermission !== "granted") {
        Alert.alert("Permission Required", "Camera & Microphone permissions are required to scan QR codes.");
      }
    })();
  }, []);

  const onScanSuccess = (qrData) => {
    setScannedData(qrData);
    setIsScannerOpen(false);
    Alert.alert("Scanned QR Code", qrData);
  };

  const handleRedeem = () => {
    if (!selectedMerchant) {
      Alert.alert("Error", "Please select a merchant.");
      return;
    }
    if (!redeemPoints || isNaN(redeemPoints) || parseInt(redeemPoints) <= 0) {
      Alert.alert("Error", "Please enter valid redeem points.");
      return;
    }
    Alert.alert("Success", `Redeemed ${redeemPoints} points with ${selectedMerchant}`);
  };

  return (
    <View style={styles.container}>
      {/* If scanner is open, hide everything else */}
      {!isScannerOpen ? (
        <>
          {scannedData && <Text style={styles.scannedText}>Scanned: {scannedData}</Text>}

          <TouchableOpacity style={styles.imageContainer} onPress={() => setIsScannerOpen(true)}>
            <Image source={QRImg} style={styles.scanImage} resizeMode="stretch" />
          </TouchableOpacity>

          {/* <Text style={styles.orText}>OR</Text> */}

          {/* <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCustomer}
              onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Customer" value="" />
              <Picker.Item label="Customer 1" value="Customer1" />
              <Picker.Item label="Customer 2" value="Customer2" />
              <Picker.Item label="Customer 3" value="Customer3" />
            </Picker>
          </View> */}
{/* 
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Redeem Points</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter points to redeem"
              keyboardType="numeric"
              value={redeemPoints}
              onChangeText={(text) => setRedeemPoints(text)}/>
          </View> */}
{/* 
          <TouchableOpacity style={styles.redeemButton} onPress={handleRedeem}>
            <Text style={styles.redeemButtonText}>Redeem</Text>
          </TouchableOpacity> */}
        </>
      ) : null}

      {/* Camera Modal */}
      <Modal animationType="slide" transparent={true} visible={isScannerOpen}>
        <View style={styles.modalContainer}>
          <View style={styles.cameraContainer}>
            {device && (
              <Camera
                style={styles.cameraPreview}
                device={device}
                isActive={true}
                onError={(error) => console.error("Camera Error:", error)}/>
            )}
            {/* Yellow Corner Indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* QR Code Scan Message */}
          <Text style={styles.scanMessage}>Scan any QR code </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsScannerOpen(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
           {/* Powered By Text at the Bottom */}
  <View style={styles.footerContainer}>
    <Text style={styles.poweredBy}>Powered by Miraasiv Onpay Technologies Pvt Ltd.</Text>
  </View>
        </View>
      </Modal>
    </View>
  );
};

export default ScanQR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  scannedText: {
    fontSize: 18,
    color: "green",
    marginBottom: 10,
  },
  imageContainer: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  scanImage: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
  orText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 10,
  },
  pickerContainer: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginTop: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  inputContainer: {
    width: "80%",
    marginTop: 10,
  },
  label: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  redeemButton: {
    marginTop: 20,
    backgroundColor: "#6A1B9A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  redeemButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    width: 300,
    height: 300,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cameraPreview: {
    width: "260%",
    height: "140%",
  },
  cancelButton: {
    marginTop: 20,
    backgroundColor: "#6A1B9A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  corner: {
    position: "absolute",
    width: 60,
    height: 50,
    borderColor: "#C0392B",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderLeftWidth: 7,
    borderTopWidth: 7,
  },
  topRight: {
    top: 0,
    right: 0,
    borderRightWidth: 7,
    borderTopWidth: 7,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 7,
    borderBottomWidth: 7,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderRightWidth: 7,
    borderBottomWidth: 7,
  },
  scanMessage: {
    position: "absolute",
    bottom: 80,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  footerContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  poweredBy: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    opacity: 0.8,
  },
  
});