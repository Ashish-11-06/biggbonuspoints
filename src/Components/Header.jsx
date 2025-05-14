import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Example icon libraries
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
// import logout from '../../assets/logout.png';
import profile from '../../assets/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';
const Header = ({ user, location = "Location", avatarUrl, onSettingsPress }) => {
  console.log(user);
  const logo=user?.logo_base64;
    const navigation = useNavigation();
  
  const onClickProfile =()=> {
    navigation.navigate('MerchantForm');
// console.log('pressed')
  }

  const onNotificationsPress = () => {
    navigation.navigate('Notifications');
  }

  const onLogoutPress =async () => {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared!');
    navigation.navigate('Login');
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgb(241, 66, 66)' }}>
      {/* Avatar */}
      <TouchableOpacity onPress={onClickProfile} style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 15, 
        overflow: 'hidden', 
        marginRight: 10, 
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Image
          source={
            user?.user_category === "customer"
              ? (logo ? { uri: logo } : profile)
              : profile
          }
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
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
      <TouchableOpacity onPress={onLogoutPress} style={{ marginHorizontal: 10 }}>
      <Image source={require('../../assets/logout.jpg')} style={{ width: 21, height: 21 }} /> 
        {/* <FontAwesome name="cog" size={24} color="white" /> Change icon here */}
       </TouchableOpacity>

       {/* <IconButton
    icon="logout"
    size={24}
    onPress={() => console.log('Logout pressed')}
  /> */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
  },
});
