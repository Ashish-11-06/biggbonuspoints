
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Example icon libraries
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";

import profile from '../../assets/profile.png';
const Header = ({ username = "User Name",user, location = "Location", avatarUrl, onSettingsPress }) => {
  console.log(user);
    const navigation = useNavigation();
  
  const onClickProfile =()=> {
    navigation.navigate('Profile');
// console.log('pressed')
  }

  const onNotificationsPress = () => {
    navigation.navigate('Notifications');
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgb(241, 66, 66)' }}>
      {/* Avatar */}
      <TouchableOpacity onPress={onClickProfile}>
      <Image
        source={{ uri: avatarUrl || '../../assets/neha.jpg' }}
        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
      />
       </TouchableOpacity>
      {/* User Info */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>{user ? `${user.first_name} ${user.last_name}` : ''}</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>{location}</Text>
      </View>
      
      {/* Notification Icon */}
      <TouchableOpacity onPress={onNotificationsPress} style={{ marginHorizontal: 10 }}>
      <Image source={require('../../assets/notification.png')} style={{ width: 24, height: 24 }} />
       {/* <MaterialIcons name="../../assets/notification.png" size={24} color="white" />  */}
      </TouchableOpacity> 
      
      {/* Settings Icon */}
      {/* <TouchableOpacity onPress={onSettingsPress}>
      <Image source={require('../../assets/setting.png')} style={{ width: 21, height: 21 }} /> */}
        {/* <FontAwesome name="cog" size={24} color="white" /> Change icon here */}
      {/* </TouchableOpacity> */}
    </View>
  );
};

export default Header;
