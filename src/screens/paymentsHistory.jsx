import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

const PaymentsHistory = ({ navigation }) => {
  const data = [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payments History</Text>

      <View style={[styles.row, styles.headerRow]}>
        <Text style={styles.headerCell}>Sr No</Text>
        <Text style={styles.headerCell}>Transaction ID</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Approved</Text>
      </View>

      <ScrollView>
        {data.length === 0 ? (
          <Text style={styles.emptyText}>No transactions found</Text>
        ) : (
          data.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.srNo}</Text>
              <Text style={styles.cell}>{item.id}</Text>
              <Text style={styles.cell}>{item.date}</Text>
              <Text style={styles.cell}>{item.approved}</Text>
            </View>
          ))
        )}
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
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#888',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
