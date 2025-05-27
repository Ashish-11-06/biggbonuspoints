/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, StatusBar } from 'react-native';
import { fetchTransactionHistory } from '../Redux/slices/transactionHistorySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';


const History = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [terminalMerchant,setTerminalMerchant] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        // console.log('user string',userString);
        
        if (userString) {
          const user = JSON.parse(userString);
          setLoggedInUser(user);
          // console.log('user',user);   
          if(user.user_category === 'terminal') {
            setTerminalMerchant(user.merchant_id);
          }
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };
    fetchUserDetails();
  }, []);
// console.log('logged user',loggedInUser);

  // console.log('logged user',loggedInUser.user_category);
  useEffect(() => {
    const fetchTransactionHistoryData = async () => {
      if (!loggedInUser) {
        console.error("LoggedInUser details are incomplete or null");
        return;
      }

      try {
        setLoading(true); // Start loader
        let user_id;
        let user_category;
        if(loggedInUser?.user_category === 'customer') {
         user_category = loggedInUser.user_category;
          user_id = loggedInUser.customer_id;
        } else if(loggedInUser?.user_category === 'merchant') {
          user_category = loggedInUser.user_category;
          user_id = loggedInUser.merchant_id;
        } else if(loggedInUser?.user_category === 'terminal') {
          user_category = 'merchant';
          user_id = terminalMerchant;
        } 
        const response = await dispatch(
          fetchTransactionHistory({ user_id, user_category })
        );
        console.log(response);
        setTransactionHistory(response.payload.history);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchTransactionHistoryData();
  }, [loggedInUser, dispatch]);

  const renderItem = ({ item, index, key }) => {
   const pointsStyle = [
  styles.cell,
  styles.colPoints,
  loggedInUser.user_category === 'customer'
    ? item.transaction_type === 'redeem'
      ? styles.pointsRedeem
      : item.transaction_type === 'award'
      ? styles.pointsAward
      : null
    : item.transaction_type === 'award'
    ? styles.pointsRedeem
    : item.transaction_type === 'redeem'
    ? styles.pointsAward
    : null,
];


    const pointsText = item.transaction_type === 'award' ? `${item.points}` : item.points;
    const convertUTCtoIST = (utcDate) => {
      const date = new Date(utcDate);
      date.setMinutes(date.getMinutes() + 330); // Add 5 hours 30 minutes
    
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const year = date.getFullYear();
    
      const hours = date.getHours() % 12 || 12;
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    
      return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };
    
    const isCustomer = loggedInUser?.user_category === 'customer';

    return isCustomer ? (
      <View style={styles.row} key={key}>
        <Text style={[styles.cell, styles.colSr]}>{index + 1}</Text>
        {/* <Text style={[styles.cell, styles.colMerchantName]}>{item.merchant_name}</Text> */}
        <Text style={[styles.cell, styles.colMerchant]}>{item.merchant_id}</Text>
        <Text style={pointsStyle}>{pointsText}</Text>
        <Text style={[styles.cell, styles.colCreatedAt]}>
          {convertUTCtoIST(item.created_at)}
        </Text>
      </View>
    ) : (
      <View style={styles.row} key={key}>
        <Text style={[styles.cell, styles.colSr]}>{index + 1}</Text>
        {/* <Text style={[styles.cell, styles.colMerchantName]}>{item.customer_name}</Text> */}
        <Text style={[styles.cell, styles.colMerchant]}>{item.customer_id}</Text>
        <Text style={pointsStyle}>{pointsText}</Text>
        <Text style={[styles.cell, styles.colCreatedAt]}>
          {convertUTCtoIST(item.created_at)}
        </Text>
      </View>
    );
    
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
            <StatusBar barStyle="light-content" backgroundColor="#004BFF" />

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#004BFF" />
        </View>
      ) : (
        <>
          <Text style={{ fontSize: 22, marginBottom: 10, textAlign: 'center', color:'#F14242', fontWeight:'700' }}>
            Transaction History
          </Text>
          <ScrollView horizontal style={{ flex: 1 }}>
            <View style={styles.tableContainer}>
              {/* Header Row */}
              {loggedInUser?.user_category == 'customer' ? (
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerCell, styles.colSr]}>Sr. No.</Text>
                  {/* <Text style={[styles.headerCell, styles.colMerchantName]}>
                    Merchant Name
                  </Text> */}
                  <Text style={[styles.headerCell, styles.colMerchant]}>
                    Merchant ID
                  </Text>
                  <Text style={[styles.headerCell, styles.colPoints]}>Points</Text>
                  <Text style={[styles.headerCell, styles.colCreatedAt]}>
                    Time
                  </Text>
                </View>
              ) : (
                <View style={[styles.row, styles.header]}>
                  <Text style={[styles.headerCell, styles.colSr]}>Sr. No.</Text>
                  {/* <Text style={[styles.headerCell, styles.colMerchantName]}>
                    Customer Name
                  </Text> */}
                  <Text style={[styles.headerCell, styles.colMerchant]}>
                    Customer ID
                  </Text>
                  <Text style={[styles.headerCell, styles.colPoints]}>Points</Text>
                  <Text style={[styles.headerCell, styles.colCreatedAt]}>
                    Time
                  </Text>
                </View>
              )}

              {/* Data Rows */}
              <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                {transactionHistory && transactionHistory.length > 0 ? (
                  transactionHistory.map((item, index) =>
                    renderItem({ item, index, key: item._id || index }) // Pass key as prop
                  )
                ) : (
                  <View style={styles.row}>
                    <Text style={[styles.cell, { flex: 1, textAlign: 'center' }]} colSpan={5}>
                      No transaction history found.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    minWidth: 520, // Total width of the table
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    flex: 1, // Make table container take available height
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9', // Alternating row color
  },
  header: {
    backgroundColor: '#004BFF', // Green header background
  },
  cell: {
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
    padding: 10,
    borderRightWidth: 1,
    borderColor: '#aaa',
    textAlign: 'center',
    color: '#fff', // White text for header
  },
  colSr: {
    width: 60,
  },
  colMerchantName: {
    width: 200,
  },
  colMerchant: {
    width: 180,
  },
  colPoints: {
    width: 80,
  },
  colCreatedAt: {
    width: 200,
  },
  // Add hover effect for rows
  rowHover: {
    backgroundColor: '#e0f7fa', // Light blue on hover
  },
  pointsRedeem: {
    color: 'red', // Points deducted
  },
  pointsAward: {
    color: 'green', // Points added
  },
});

export default History;

