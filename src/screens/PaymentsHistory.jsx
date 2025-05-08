import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { fetchPaymentDetails } from '../Redux/slices/paymentDetailsSlice';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PaymentsHistory = ({ navigation }) => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused(); // detects if screen is active
  
    const [data, setData] = useState([]); // Default to an empty array
    const [loading, setLoading] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [merchantId, setMerchantId] = useState('');
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            setMerchantId(user?.merchant_id); // Set the merchant ID correctly
            setLoggedInUser(user);
          }
        } catch (error) {
          console.error('Error fetching user details from AsyncStorage:', error);
        }
      };
  
      fetchUserDetails();
    }, []); // Run once when component mounts
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const user_id = merchantId;
          setLoading(true);
          const res = await dispatch(fetchPaymentDetails(user_id));
          console.log('API Response:', res);
          setData(res?.payload || []); // Ensure payload is an array
        } catch (error) {
          console.error('Failed to fetch payment details', error);
        } finally {
          setLoading(false);
        }
      };
  
      if (isFocused && merchantId) {
        fetchData();
      }
    }, [dispatch, isFocused, merchantId]); // Dependency array includes merchantId
  
    const convertUTCtoIST = (utcDate) => {
      const date = new Date(utcDate);
      const istFormatter = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });
      return istFormatter.format(date);
    };
  
    return (
      <View style={styles.container}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#004BFF" />
          </View>
        ) : (
          <>
            <Text style={styles.title}>Payments History</Text>
            <ScrollView horizontal>
              <View>
                <View style={[styles.row, styles.headerRow]}>
                  <Text style={styles.headerCell}>Merchant ID</Text>
                  <Text style={styles.headerCell}>Paid Amount</Text>
                  <Text style={styles.headerCell}>Plan Type</Text>
                  <Text style={styles.headerCell}>Transaction ID</Text>
                  <Text style={styles.headerCell}>Payment Mode</Text>
                  <Text style={styles.headerCell}>Date</Text>
                </View>
  
                <ScrollView>
                  {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                      <View key={index} style={styles.row}>
                        <Text style={styles.cell}>{item.merchant}</Text>
                        <Text style={styles.cell}>{item.paid_amount}</Text>
                        <Text style={styles.cell}>
  {item.plan_type === '2' ? 'Prepaid' : item.plan_type === '1' ? 'Rental' : 'N/A'}
</Text>

                        
                        <Text style={styles.cell}>{item.transaction_id}</Text>
                        <Text style={styles.cell}>{item.payment_mode}</Text>
                        <Text style={[styles.cell, styles.colCreatedAt]}>
                          {convertUTCtoIST(item.created_at)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyText}>No transactions found</Text>
                  )}
                </ScrollView>
              </View>
            </ScrollView>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Payments')}
            >
              <Text style={styles.buttonText}>Make New Payment</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };
  
  export default PaymentsHistory;
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  headerCell: {
    width: 120,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    width: 120,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#888',
  },
  button: {
    marginTop: 20,
    backgroundColor:'#004BFF',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});