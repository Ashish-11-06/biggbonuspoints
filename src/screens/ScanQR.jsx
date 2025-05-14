import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Platform
} from "react-native";
import { Camera, CameraType } from 'react-native-camera-kit';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from "react-redux";

const ScanQR = () => {
  const navigation = useNavigation();
  const [scannedData, setScannedData] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
  const cameraRef = useRef(null);
  const route = useRoute();
  const fromTransferHome = route.params?.fromTransferHome;
  const fromScanQR = route.params?.fromScanQR;
  const fromCorporateQR = route.params?.fromCorporateQR;
  const fromGlobalQR = route.params?.fromGlobalQR;

  console.log('from fromScanQRe',fromScanQR);
  console.log('from transfer homee',fromTransferHome);
  
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userCategory, setUserCategory] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        console.log("User data from AsyncStorage:", userString);
        
        if (userString) {
          const user = JSON.parse(userString);
          console.log("Parsed user data:", user);

          // Set the loggedInUser state
          setLoggedInUser(user);
// console.log(username);

          // Extract and set the user_category
          const category = user.user_category || 'User';
          setUserCategory(category);

          // Set user details
          setUserDetails({
            user_category: category,
            user_name:user.username,
            id: user.customer_id || user.merchant_id || user.corporate_id || 'N/A',
          });
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const navigateToHome = () => {
    navigation.navigate('Home');
  };
  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const userData = await AsyncStorage.getItem('userDetails');
        if (userData) {
          setUserDetails(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    };
    
    loadUserDetails();
    requestCameraPermission();
  }, []);

  const fetchDataFromQR = async (qrData) => {
    try {
      setIsFetching(true);
      return {
        type: 'raw',
        data: qrData,
        raw: qrData
      };
    } catch (error) {
      console.error("Error handling QR data:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };
console.log('userrrrr categoryyy',loggedInUser?.user_category);

const handleScanSuccess = async (qrData) => {
  try {
    const result = await fetchDataFromQR(qrData);
    console.log('QR code data:', result);
    console.log(result.raw);

    const rawData = result.raw;

    let extractedData;
    if (rawData.includes(":")) {
      // Example: "receive:MEID30680592289"
      extractedData = rawData.split(":")[1];
    } else {
      extractedData = rawData;
    }

    console.log("Extracted Data:", extractedData);

    if (fromTransferHome) {
      const isCustomer = loggedInUser?.user_category === 'customer' && loggedInUser?.customer_id?.startsWith('C');
      const isMerchant = loggedInUser?.user_category === 'merchant' && loggedInUser?.merchant_id?.startsWith('M');

      if (isCustomer && extractedData?.startsWith('M')) {
        Alert.alert('Error', 'This option cannot be used to send points to a merchant. To transfer points to a merchant, please use the "Scan QR" feature available on the Home Screen',
          [
            { text: "OK", onPress: navigateToHome }
          ]
        );
        return;
      }

      if (isMerchant && extractedData?.startsWith('C')) {
        Alert.alert('Error', 'This option cannot be used to send points to a customer. To transfer points to a customer, please use the "Scan QR" feature available on the Home Screen',
          [
            { text: "OK", onPress: navigateToHome }
          ]
        );
        return;
      }
    }
    if (fromScanQR) {
      const isCustomer = loggedInUser?.user_category === 'customer' && loggedInUser?.customer_id?.startsWith('C');
      const isMerchant = loggedInUser?.user_category === 'merchant' && loggedInUser?.merchant_id?.startsWith('M');

      if (isCustomer && extractedData?.startsWith('C')) {
        Alert.alert('Error', 'This option cannot be used to send points to a customer. To transfer points to a customer, please use the "Transfer BBP" feature available on the Home Screen',
          [
            { text: "OK", onPress: navigateToHome }
          ]
        );
        return;
      }

      if (isMerchant && extractedData?.startsWith('M')) {
        Alert.alert('Error', 'This option cannot be used to send points to a merchant. To transfer points to a merchant, please use the "Transfer BBP" feature available on the Home Screen',
          [
            { text: "OK", onPress: navigateToHome }
          ]
        );
        return;
      }
    }
    
    console.log('extractedData', extractedData);
    navigation.navigate("TransferPoints", {
      merchantId: extractedData,
      customerId: userDetails.id,
      fromTransferHome: fromTransferHome,
      fromCorporateQR: fromCorporateQR,
      fromGlobalQR: fromGlobalQR,
    });

    setScannedData(null);
    setIsScannerOpen(false);
  } catch (error) {
    Alert.alert(
      "Error",
      "Could not read QR code data.",
      [{
        text: "OK",
        onPress: () => {
          setScannedData(null);
          setIsScannerOpen(true);
        }
      }]
    );
  }
};


  const onBarcodeScan = (event) => {
    if (event.nativeEvent.codeStringValue !== scannedData && !isFetching) {
      setScannedData(event.nativeEvent.codeStringValue);
      setIsScannerOpen(false);
      handleScanSuccess(event.nativeEvent.codeStringValue);
    }
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera to scan QR codes",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          setIsScannerOpen(true);
        } else {
          setHasPermission(false);
        }
      } else {
        setHasPermission(true);
        setIsScannerOpen(true);
      }
    } catch (err) {
      console.warn(err);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A1B9A" />
        {isFetching && <Text style={styles.loadingText}>Processing QR data...</Text>}
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes.
        </Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.settingsButtonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal 
        animationType="slide" 
        transparent={true} 
        visible={isScannerOpen}
        onRequestClose={() => setIsScannerOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.cameraPreview}
              cameraType={CameraType.Back}
              scanBarcode={true}
              onReadCode={onBarcodeScan}
              showFrame={true}
              frameColor="#6A1B9A"
              laserColor="#6A1B9A"
              surfaceColor="rgba(0,0,0,0.5)"
            />
          </View>

          <Text style={styles.scanMessage}>Align QR code within frame</Text>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <View style={styles.footerContainer}>
            <Text style={styles.poweredBy}>
              Powered by biggbonuspoints
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6A1B9A',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  settingsButton: {
    backgroundColor: '#6A1B9A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  settingsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  cameraPreview: {
    width: "100%",
    height: "100%",
  },
  cancelButton: {
    marginTop: 30,
    backgroundColor: "#6A1B9A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scanMessage: {
    marginTop: 20,
    fontSize: 16,
    color: "white",
    textAlign: "center",
    backgroundColor: 'rgba(106, 27, 154, 0.7)',
    padding: 10,
    borderRadius: 20,
  },
  footerContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  poweredBy: {
    fontSize: 12,
    color: "white",
    textAlign: "center",
    opacity: 0.7,
  },
});

export default ScanQR;