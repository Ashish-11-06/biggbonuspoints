import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

const PaymentsHistory = ({ navigation }) => {
  const data = [
    {
      merchantId: 'M123',
      paidAmount: '₹1500',
      transactionId: 'TXN001',
      paymentMode: 'UPI',
      approve: 'Yes',
      date: '2025-04-18',
    },
    {
      merchantId: 'M124',
      paidAmount: '₹2000',
      transactionId: 'TXN002',
      paymentMode: 'Card',
      approve: 'No',
      date: '2025-04-17',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments History</Text>

      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>Merchant ID</Text>
            <Text style={styles.headerCell}>Paid Amount</Text>
            <Text style={styles.headerCell}>Transaction ID</Text>
            <Text style={styles.headerCell}>Payment Mode</Text>
            <Text style={styles.headerCell}>Approve</Text>
            <Text style={styles.headerCell}>Date</Text>
          </View>

          <ScrollView style={{ maxHeight: 300 }}>
            {data.length === 0 ? (
              <Text style={styles.emptyText}>No transactions found</Text>
            ) : (
              data.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.cell}>{item.merchantId}</Text>
                  <Text style={styles.cell}>{item.paidAmount}</Text>
                  <Text style={styles.cell}>{item.transactionId}</Text>
                  <Text style={styles.cell}>{item.paymentMode}</Text>
                  <Text style={styles.cell}>{item.approve}</Text>
                  <Text style={styles.cell}>{item.date}</Text>
                </View>
              ))
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
    backgroundColor:'#9F86C0',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
