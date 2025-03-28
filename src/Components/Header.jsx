
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Example icon libraries
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const Header = ({ username = "User Name", location = "Location", avatarUrl, onNotificationsPress, onSettingsPress }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#9F86C0' }}>
      {/* Avatar */}
      <Image
        source={{ uri: avatarUrl || 'https://via.placeholder.com/50' }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
      
      {/* User Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{username}</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>{location}</Text>
      </View>
      
      {/* Notification Icon */}
      <TouchableOpacity onPress={onNotificationsPress} style={{ marginHorizontal: 10 }}>
      {/* <Image source={require('../../assets/notification.png')} style={{ width: 24, height: 24 }} /> */}
      {/* <MaterialIcons name="../../assets/notification.png" size={24} color="white" /> Change icon here */}
      </TouchableOpacity>
      
      {/* Settings Icon */}
      <TouchableOpacity onPress={onSettingsPress}>
        
        <FontAwesome name="cog" size={24} color="white" /> {/* Change icon here */}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
