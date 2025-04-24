/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { fetchTransactionHistory } from '../Redux/slices/transactionHistorySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const History = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          setLoggedInUser(user);
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchTransactionHistoryData = async () => {
      if (!loggedInUser || !loggedInUser.customer_id || !loggedInUser.user_category) {
        console.error("LoggedInUser details are incomplete or null");
        return;
      }

      try {
        const user_id = loggedInUser.customer_id;
        const user_category = loggedInUser.user_category;

        const response = await dispatch(
          fetchTransactionHistory({ user_id, user_category })
        );

        setTransactionHistory(response.payload.transaction_history);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    };

    fetchTransactionHistoryData();
  }, [loggedInUser, dispatch]);

  const renderItem = ({ item, index }) => {
    const pointsStyle = [
      styles.cell,
      styles.colPoints,
      item.transaction_type === 'award' ? styles.pointsAward : null,
    ];

    const pointsText = item.transaction_type === 'award' ? `+${item.points}` : item.points;

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.colSr]}>{index + 1}</Text>
        <Text style={[styles.cell, styles.colMerchantName]}>{item.merchant_name}</Text>
        <Text style={[styles.cell, styles.colMerchant]}>{item.merchant_id}</Text>
        <Text style={pointsStyle}>{pointsText}</Text>
        <Text style={[styles.cell, styles.colCreatedAt]}>{item.created_at}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, marginBottom: 10, textAlign: 'center' }}>Transaction History</Text>
      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          {/* Header Row */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.headerCell, styles.colSr]}>Sr. No.</Text>
            <Text style={[styles.headerCell, styles.colMerchantName]}>Merchant Name</Text>
            <Text style={[styles.headerCell, styles.colMerchant]}>Merchant ID</Text>
            <Text style={[styles.headerCell, styles.colPoints]}>Points</Text>
            <Text style={[styles.headerCell, styles.colCreatedAt]}>Created At</Text>
          </View>

          {/* Data Rows */}
          <FlatList
            data={transactionHistory}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    minWidth: 720, // Total width of the table
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9', // Alternating row color
  },
  header: {
    backgroundColor: '#9F86C0', // Green header background
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

