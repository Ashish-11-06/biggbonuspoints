import React, { useState } from 'react';
import { View, ScrollView, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';
import Header from '../Components/Header';

const ChooseMerchantScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const merchants = [
    { id: '1', name: 'Merchant A', phone: '123-456-7890' },
    { id: '2', name: 'Merchant B', phone: '987-654-3210' },
    { id: '3', name: 'Merchant C', phone: '456-789-1234' },
  ];

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f3f3' }}>
      {/* Header */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <Header 
          username="John Doe"
          location="New York, USA"
          avatarUrl="https://randomuser.me/api/portraits/men/1.jpg"
          onNotificationsPress={() => console.log("Notifications Pressed")}
          onSettingsPress={() => console.log("Settings Pressed")}
        />
      </View>

      {/* Search Bar */}
      <View style={{ marginTop: 100, padding: 10 }}>
        <TextInput
          placeholder="Search Merchant"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ccc',
          }}
        />
      </View>

      {/* Merchant List */}
      <FlatList
        data={filteredMerchants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ fontSize: 14, color: '#555' }}>{item.phone}</Text>
          </TouchableOpacity>
        )}
        style={{ margin: 10 }}
      />
    </View>
  );
};

export default ChooseMerchantScreen;
