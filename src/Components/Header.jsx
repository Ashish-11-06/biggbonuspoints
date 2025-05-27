import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
// import logout from '../../assets/logout.png';
import profile from '../../assets/profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconButton } from 'react-native-paper';
const Header = ({ user, location = "Location", avatarUrl, onSettingsPress, unreadNotificationCount }) => {
  // console.log('user',user);
  const [merchantLogo, setMerchantLogo] = useState(null);
  const logo=user?.logo_base64;
    const navigation = useNavigation();
  
  const onClickProfile =()=> {
    navigation.navigate('MerchantForm');
// console.log('pressed')`
  }

  const onNotificationsPress = () => {
    navigation.navigate('Notifications');
  }

  useEffect(() => {
    const getMerchantLogo = async () => {
      try {
        const logo = await AsyncStorage.getItem('merchant_logo');
        if (logo) {
          setMerchantLogo(logo);
        }
      } catch (error) {
        console.error('Error retrieving merchant logo:', error);
      }
    };
    if (user?.user_category === 'merchant') {
      getMerchantLogo();
    }
  }, [user?.user_category]);

const API_BASE = 'http://192.168.1.62:8000';
const logoPath = merchantLogo ;
// Remove '/api' and join with logo path
// const imageUrl = logoPath?.startsWith('http') ? logoPath : `${API_BASE}${logoPath}`;
const imageUrl=merchantLogo
// console.log('image url',imageUrl);
const onLogoutPress = () => {
  Alert.alert(
    'Confirm Logout',
    'Are you sure you want to logout?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
            await AsyncStorage.removeItem('user'); // only removes user key
          console.log('All AsyncStorage data cleared!');
          navigation.navigate('Login');
        },
      },
    ],
    { cancelable: false }
  );
};

// console.log('merchant logo',merchantLogo);

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'rgb(241, 66, 66)' ,  borderBottomLeftRadius: 10,  borderBottomRightRadius: 10,

    }}>
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
            logo ? { uri: logo } : profile
          }
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
       {/* <Image
          source={
            user?.user_category === "customer"
              ? (logo ? { uri: logo } : profile)
              : (merchantLogo
                  ? { uri: `data:image/png;base64,${merchantLogo}` }
                  : profile)
          }
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        /> */}
      </TouchableOpacity>
      {/* User Info */}
      <View style={{ flex: 1 }}>
<Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>
  {user
    ? user.user_category === 'terminal'
      ? 'Terminal'
      : `${user.first_name} ${user.last_name}`
    : ''}
</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>{location}</Text>
      </View>
      <Image
    source={logo}
    style={{ width: 30, height: 30 }}
    resizeMode="contain"
  />
      {/* Notification Icon */}
<TouchableOpacity onPress={onNotificationsPress} style={{ marginHorizontal: 10 }}>
  <View style={{ position: 'relative' }}>
    <Image
      source={require('../../assets/notification.png')}
      style={{ width: 24, height: 24 }}
    />

    {unreadNotificationCount > 0 && (
      <View
        style={{
          position: 'absolute',
          top: -8,
          right: -7,
          backgroundColor: '#004BFF',
          borderRadius: 10,
          minWidth: 18,
          height: 18,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 2,
        }}
      >
        <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold' }}>
          {unreadNotificationCount}
        </Text>
      </View>
    )}
  </View>
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
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: '#f33', // your header background
  },
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
