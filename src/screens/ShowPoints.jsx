import { StyleSheet, Text, View, SectionList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCustomerPoints } from '../Redux/slices/pointsSlice';

const ShowPoints = ({ route }) => {
    const navigation = useNavigation();
    const [userDetails, setUserDetails] = useState({ user_category: '', id: '' });
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userCategory, setUserCategory] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
   const [points,setPoints] = useState(null);
    
   
    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const userString = await AsyncStorage.getItem('user');
          console.log("User data from AsyncStorage:", userString);
          
          if (userString) {
            const user = JSON.parse(userString);
            console.log("Parsed user data:", user);
            setLoggedInUserId(user.user_category === 'merchant' ? user.merchant_id : user.customer_id);

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

    // useEffect(() => {
    //   const fetchPoints= async() => {
    //     const requestData = {
    //       customer_id: loggedInUserId,
    //       pin: 1234,
    //   };
    //     const response = await dispatch(fetchCustomerPoints(requestData)).unwrap();
    //     console.log('fetch customer points response',response);
    //     setPoints(response.merchant_points);
        
    //   }
    // })
    // Safely get and filter valid points data
    const pointsData = (route?.params?.points || []).filter(
        item => item && typeof item.points !== 'undefined'
    );
console.log('points dataaa',pointsData)
    // Calculate total available points
    const totalPoints = pointsData.reduce((sum, item) => {
        return sum + parseInt(item.points || 0);
    }, 0);
console.log('total points',totalPoints);

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

    const customerData = pointsData.reduce((acc, item) => {
        const customerKey = item.customer_name || item.customer_id;

        if (!acc[customerKey]) {
            acc[customerKey] = {
                merchantName: item.customer_name || `Customer ${item.customer_id}`,
                merchantId: item.customer_id,
                totalPoints: 0,
                transactions: []
            };
        }

        acc[customerKey].totalPoints += parseInt(item.points || 0);
        acc[customerKey].transactions.push(item);

        return acc;
    }, {});

    // Convert merchant data into section format
    const merchantSections = Object.values(merchantData).map(merchant => ({
        title: merchant.merchantName,
        data: merchant.transactions,
        merchantId: merchant.merchantId, // Pass merchantId for redeem functionality
    }));

    const customerSections = Object.values(customerData).map(merchant => ({
        title: merchant.merchantName,
        data: merchant.transactions,
        merchantId: merchant.merchantId, // Pass merchantId for redeem functionality
    }));


    console.log('cust data',customerData);
    console.log('cust section',customerSections);
    
    const isCustomer = loggedInUser?.user_category === 'customer';
    const safeMerchantSections = merchantSections || [];
    const safeCustomerSections = customerSections || [];
    
    const dataToRender = isCustomer ? safeMerchantSections : safeCustomerSections;
    const noDataMessage = isCustomer
      ? 'No merchant data available'
      : 'No customer data available';
    
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
            {userCategory === 'customer' &&
            <>
            <Text style={styles.sectionHeader}>{loggedInUser?.user_category === 'customer' ? 'Points by Merchant' : 'Points to Customer'}</Text>
            {dataToRender.length > 0 ? (
  <SectionList
    sections={dataToRender}
    keyExtractor={(item, index) => `${item.merchant_id || item.customer_id}_${index}`}
    renderItem={({ item }) => (
      <View style={styles.transactionRow}>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionText}>
            {isCustomer
              ? `Merchant ID: ${item.merchant_id}`
              : `Customer ID: ${item.customer_id}`}
          </Text>
          {item.transaction_date && (
            <Text style={styles.transactionDate}>
              {new Date(item.transaction_date).toLocaleDateString()}
            </Text>
          )}
        </View>
        {loggedInUser?.user_category=== 'customer' ? (
        <Text style={styles.pointsText}>+{item.points} BBP</Text>
    ):(
        <Text style={styles.awardPointsText}>{item.points} BBP</Text>

    )
    }
      </View>
    )}
    renderSectionHeader={({ section }) => (
      <View style={styles.merchantHeader}>
        <Text style={styles.merchantName}>{section.title}</Text>
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={() =>
            navigation.navigate('TransferPoints', {
              merchantId: section.merchantId || '', // or customerId if needed
              merchantName: section.title,
            })
          }
        >
          <Text style={styles.redeemButtonText}>{loggedInUser?.user_category === 'customer' ? 'Redeem' : 'Award'}</Text>
        </TouchableOpacity>
      </View>
    )}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
  />
) : (
  <View style={styles.emptyState}>
    <Text style={styles.noTransactions}>{noDataMessage}</Text>
  </View>
)}
</>
}

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
        backgroundColor: '#F14242',
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
        backgroundColor: '#F14242',
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
    awardPointsText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
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