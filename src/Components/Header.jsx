
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Example icon libraries
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({ location = "Location", avatarUrl, onNotificationsPress, onSettingsPress }) => {
 
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  
  const onClickProfile =()=> {
    navigation.navigate('Profile');
// console.log('pressed')
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        // console.log("User data from AsyncStorage:", userString);
        if (userString) {
          const user = JSON.parse(userString);
          // console.log("Parsed user data:", user);
          setUser(user);       
          // console.log("User data set in state:", user);  
        }
      } catch (error) {
        console.error('Error fetching user details from AsyncStorage:', error);
      }
    };
    fetchUserDetails();
  }, []);


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
      {/* <TouchableOpacity onPress={onNotificationsPress} style={{ marginHorizontal: 10 }}>
      <Image source={require('../../assets/notification.png')} style={{ width: 24, height: 24 }} />
      {/* <MaterialIcons name="../../assets/notification.png" size={24} color="white" /> Change icon here */}
      {/* </TouchableOpacity> */} 
      
      {/* Settings Icon */}
      {/* <TouchableOpacity onPress={onSettingsPress}>
      <Image source={require('../../assets/setting.png')} style={{ width: 21, height: 21 }} /> */}
        {/* <FontAwesome name="cog" size={24} color="white" /> Change icon here */}
      {/* </TouchableOpacity> */}
    </View>
  );
};

export default Header;
