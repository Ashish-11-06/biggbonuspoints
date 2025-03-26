import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { useNavigation } from "@react-navigation/native";
const ScanQR = () => {
  const navigation = useNavigation();
  const [scannedData, setScannedData] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(true); // Set to true by default

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

  return (
    <View style={styles.container}>
      {/* Camera Modal - Always Visible Initially */}
      <Modal animationType="slide" transparent={true} visible={isScannerOpen}>
        <View style={styles.modalContainer}>
          <View style={styles.cameraContainer}>
            {device && (
              <Camera
                style={styles.cameraPreview}
                device={device}
                isActive={true}
                onError={(error) => console.error("Camera Error:", error)}
              />
            )}
            {/* Yellow Corner Indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* QR Code Scan Message */}
          <Text style={styles.scanMessage}>Scan any QR code</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate("Home")}>
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
