import { StyleSheet, Text, View, SectionList, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ShowPoints = ({ route }) => {
    const navigation = useNavigation();

    // Safely get and filter valid points data
    const pointsData = (route?.params?.points || []).filter(
        item => item && typeof item.points !== 'undefined'
    );

    // Calculate total available points
    const totalPoints = pointsData.reduce((sum, item) => {
        return sum + parseInt(item.points || 0);
    }, 0);

    // Group by merchant
    const merchantData = pointsData.reduce((acc, item) => {
        const merchantKey = item.merchant_name || item.merchant_id;

        if (!acc[merchantKey]) {
            acc[merchantKey] = {
                merchantName: item.merchant_name || `Merchant ${item.merchant_id}`,
                merchantId: item.merchant_id,
                totalPoints: 0,
                transactions: []
            };
        }

        acc[merchantKey].totalPoints += parseInt(item.points || 0);
        acc[merchantKey].transactions.push(item);

        return acc;
    }, {});

    // Convert merchant data into section format
    const merchantSections = Object.values(merchantData).map(merchant => ({
        title: merchant.merchantName,
        data: merchant.transactions,
        merchantId: merchant.merchantId, // Pass merchantId for redeem functionality
    }));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text>← Back to Home</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Points</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Total Points */}
            <View style={styles.totalPointsContainer}>
                <Text style={styles.totalPointsLabel}>Total Available Points</Text>
                <Text style={styles.totalPointsValue}>{totalPoints.toLocaleString()} BBP</Text>
            </View>

            {/* Points by Merchant */}
            <Text style={styles.sectionHeader}>Points by Merchant</Text>

            {merchantSections.length > 0 ? (
                <SectionList
                    sections={merchantSections}
                    keyExtractor={(item, index) => `${item.merchant_id}_${index}`}
                    renderItem={({ item }) => (
                        <View style={styles.transactionRow}>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionText}>Merchant ID: {item.merchant_id}</Text>
                                {item.transaction_date && (
                                    <Text style={styles.transactionDate}>
                                        {new Date(item.transaction_date).toLocaleDateString()}
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.pointsText}>+{item.points} BBP</Text>
                        </View>
                    )}
                    renderSectionHeader={({ section }) => (
                        <View style={styles.merchantHeader}>
    <Text style={styles.merchantName}>{section.title}</Text>
    <TouchableOpacity
        style={styles.redeemButton}
        onPress={() =>
            navigation.navigate('TransferPoints', {
                merchantId: section.merchantId, // Pass userId as merchantId
                merchantName: section.title,         // Pass userName as merchantName
            })
        }
    >
        <Text style={styles.redeemButtonText}>Redeem</Text>
    </TouchableOpacity>
</View>

                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.noTransactions}>No merchant data available</Text>
                </View>
            )}
        </View>
    );
};

export default ShowPoints;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingTop: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#edf2f7',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2d3748',
    },
    headerRight: {
        width: 24, // To balance the back button
    },
    totalPointsContainer: {
        backgroundColor: '#4e73df',
        borderRadius: 12,
        padding: 20,
        margin: 20,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    totalPointsLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#e6e9f9',
        marginBottom: 5,
    },
    totalPointsValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2d3748',
        marginBottom: 15,
        paddingLeft: 25,
    },
    merchantHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#4e73df',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
        marginHorizontal: 20,
    },
    merchantName: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    redeemButton: {
        backgroundColor: '#10b981',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    redeemButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    transactionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: 20,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionText: {
        fontSize: 15,
        color: '#4a5568',
        fontWeight: '500',
    },
    transactionDate: {
        fontSize: 12,
        color: '#a0aec0',
        marginTop: 3,
    },
    pointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#10b981',
        marginLeft: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#edf2f7',
        marginVertical: 4,
        marginHorizontal: 20,
    },
    sectionSeparator: {
        height: 10,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noTransactions: {
        fontSize: 16,
        color: '#a0aec0',
        textAlign: 'center',
    },
});