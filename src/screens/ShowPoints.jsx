import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';

const ShowPoints = () => {
    const availablePoints = "50,535"; // Available points

    // Dummy transaction history data
    // const transactions = [
    //     { id: '1', customer: 'Customer1', points: '100 BBP' },
    //     { id: '2', customer: 'Customer2', points: '250 BBP' },
    //     { id: '3', customer: 'Customer3', points: '300 BBP' },
    //     { id: '4', customer: 'Customer4', points: '150 BBP' },
    //     { id: '5', customer: 'Customer5', points: '500 BBP' },
    // ];

    return (
        <View style={styles.container}>
            {/* Available Points */}
            <Text style={styles.pointsText}>Available Points: {availablePoints}</Text>

            {/* Transaction History */}
            {/* <Text style={styles.historyTitle}>Transaction History</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.transactionRow}>
                        <Text style={styles.customerText}>{item.customer}</Text>
                        <Text style={styles.pointsText}>{item.points}</Text>
                    </View>
                )}
            /> */}
        </View>
    );
};

export default ShowPoints;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    pointsText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    customerText: {
        fontSize: 16,
        color: 'black',
    },
});
