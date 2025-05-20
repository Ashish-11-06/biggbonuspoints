import React, { useState,useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, BackHandler } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { getAllCustomers, getAllMerchants, getAllCorporateMerchants, getAllPrepaidMerchant, getCorporateGlobalMerchants } from "../Redux/slices/userSlice";
import { useNavigation, useRoute } from "@react-navigation/native";

const CustomerSelection = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const route = useRoute();
  const { userCategory, chooseCorporateMerchant,chooseGlobalMerchant } = route.params;
  const { merchants = [], customers = [], status, error } = useSelector((state) => state.user);
  const [prepaidMerchants, setPrepaidMerchants] = useState([]);
// console.log('choose global merchant',chooseGlobalMerchant);
console.log('choose corporate merchant',chooseCorporateMerchant);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userCategory === "customer") {
          if (!chooseCorporateMerchant && !chooseGlobalMerchant) {
            const res = await dispatch(getAllMerchants());
          } else if(chooseGlobalMerchant) {
            const res = await dispatch(getCorporateGlobalMerchants());
            setPrepaidMerchants(res?.payload.merchants);
          } else {
            const res = await dispatch(getAllCorporateMerchants());
          }
        } else {
          await dispatch(getAllCustomers());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch, userCategory]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Home');
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.length === 0) {
      setFilteredContacts([]);
      return;
    }

    const dataToFilter = userCategory === "merchant" ? customers : merchants;

    const filtered = dataToFilter
      .filter(contact => {
        const fullName = `${contact?.first_name || ''} ${contact?.last_name || ''}`.toLowerCase();
        const phone = contact?.mobile || '';
        return (
          fullName.includes(text.toLowerCase()) ||
          phone.includes(text)
        );
      })
      .slice(0, 10);

    setFilteredContacts(filtered);
  };

  if (status === "loading") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#004BFF"/>
        <Text>{userCategory === "merchant" ? "Loading customers..." : "Loading merchants..."}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
        <TouchableOpacity
          style={{ marginTop: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5 }}
          onPress={() => dispatch(userCategory === "merchant" ? getAllCustomers() : getAllMerchants())}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <TextInput
        placeholder="Search by name or number"
        value={searchText}
        onChangeText={handleSearch}
        style={{
          height: 50,
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 10,
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      />

      <FlatList
        data={
          searchText.length > 0
            ? filteredContacts
            : (
                userCategory === "customer"
                  ? (chooseGlobalMerchant ? prepaidMerchants : merchants)
                  : customers
              )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 15, borderBottomWidth: 1, borderColor: "#ccc" }}
            onPress={() =>
              navigation.navigate("TransferPoints", {
                merchantId: chooseGlobalMerchant ? item.merchant_id : item.user_id,
                merchantName: `${item.first_name || ''} ${item.last_name || ''}`.trim(),
                userMobile: item.mobile || 'No phone',
                userShop: item.shop_name || null,
                fromChooseMerchant: true,
                chooseGlobalMerchant: chooseGlobalMerchant,
                chooseGlobal : true,
                chooseCorporateMerchant: chooseCorporateMerchant,
              })
            }
          >
            <View>
              <Text style={{ fontWeight: 'bold' }}>
                {`${item.first_name || ''} ${item.last_name || ''}`.trim() || 'No name'}
              </Text>
              <Text>{item.mobile || 'No phone'}</Text>
              {item.shop_name && <Text>Shop: {item.shop_name}</Text>}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) =>
          chooseGlobalMerchant
            ? item.merchant_id || item.mobile || `user-${index}`
            : item.user_id || item.mobile || `user-${index}`
        }
        ListEmptyComponent={
          <View style={{ padding: 15 }}>
            <Text style={{ textAlign: 'center' }}>No {userCategory === "merchant" ? "customers" : "merchants"} found</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        extraData={searchText}
      />

      {searchText.length > 0 && filteredContacts.length === 0 && userCategory === 'merchant' && (
        <TouchableOpacity
          style={{
            padding: 15,
            marginTop: 10,
            backgroundColor: "#004BFF",
            borderRadius: 10,
          }}
          onPress={() =>
            navigation.navigate("Awards", {
              customerName: "Guest",
              customerMobile: searchText,
            })
          }
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Add New Number
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomerSelection;