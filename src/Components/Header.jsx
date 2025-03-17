import React from 'react';
import { View } from 'react-native';
import { Avatar, Text, IconButton } from 'react-native-paper';

const Header = ({ username = "User Name", location = "Location", avatarUrl, onNotificationsPress, onSettingsPress }) => {
  return (
    <View style={{ backgroundColor: '#9F86C0', padding: 10, flexDirection: 'row', alignItems: 'center' }}>
      <Avatar.Image size={50} source={{ uri: avatarUrl || 'https://via.placeholder.com/50' }} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontSize: 18 }}>{username}</Text>
        <Text style={{ color: 'white', fontSize: 14 }}>{location}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <IconButton icon="bell" color="white" size={24} onPress={onNotificationsPress} />
        <IconButton icon="settings" color="white" size={24} onPress={onSettingsPress} />
      </View>
    </View>
  );
};

export default Header;
