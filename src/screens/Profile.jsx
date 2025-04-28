import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('Samruddhi Manikeri');
  const [email, setEmail] = useState('samruddhi@example.com');
  const [phone, setPhone] = useState('9876543210');

  const handleEditToggle = () => {
    if (isEditing) {
      alert('Changes saved!');
    }
    setIsEditing(!isEditing);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://via.placeholder.com/120' }}
        style={styles.avatar}
      />
      <Text style={styles.title}>Profile</Text>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name</Text>
        {isEditing ? (
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        ) : (
          <Text style={styles.value}>{name}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.value}>{email}</Text>
        )}
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Phone</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{phone}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditToggle}>
        <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginVertical: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Profile;
