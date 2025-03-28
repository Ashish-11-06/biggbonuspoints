import React from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const MerchantForm = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const navigation = useNavigation();

  const onSubmit = (data) => {
    Alert.alert('Form Submitted');
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Additional Information</Text>
      
      {/* Age & Gender Row */}
      <View style={styles.rowContainer}>
        {['age', 'gender'].map((name, index) => (
          <View key={name} style={styles.halfWidthContainer}>
            <Text>{name === 'age' ? 'Age' : 'Gender'}</Text>
            <Controller
              control={control}
              rules={{ required: `${name === 'age' ? 'Age' : 'Gender'} is required` }}
              render={({ field: { onChange, value } }) => (
                name === 'gender' ? (
                  <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                    <Picker.Item label="Select Gender" value="" />
                    {['Male', 'Female', 'Other'].map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                ) : (
                  <TextInput style={styles.input} keyboardType="numeric" onChangeText={onChange} value={value} />
                )
              )}
              name={name}
            />
            {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
          </View>
        ))}
      </View>
      
      {/* City & State Row */}
      <View style={styles.rowContainer}>
        {['city', 'state'].map((name, index) => (
          <View key={name} style={styles.halfWidthContainer}>
            <Text>{name === 'city' ? 'City' : 'State'}</Text>
            <Controller
              control={control}
              rules={{ required: `${name === 'city' ? 'City' : 'State'} is required` }}
              render={({ field: { onChange, value } }) => (
                name === 'state' ? (
                  <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                    <Picker.Item label="Select State" value="" />
                    {[ 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Gujarat', 'Haryana',
                      'Himachal Pradesh', 'Jammu', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
                      'Meghalaya', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
                      'Uttar Pradesh', 'Uttarakhand', 'West Bengal' ].map((option) => (
                      <Picker.Item key={option} label={option} value={option} />
                    ))}
                  </Picker>
                ) : (
                  <TextInput style={styles.input} onChangeText={onChange} value={value} />
                )
              )}
              name={name}
            />
            {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
          </View>
        ))}
      </View>
      
      {/* Country & Pincode Row */}
      <View style={styles.rowContainer}>
        {['country', 'pincode'].map((name, index) => (
          <View key={name} style={styles.halfWidthContainer}>
            <Text>{name === 'country' ? 'Country' : 'Pincode'}</Text>
            <Controller
              control={control}
              rules={{ required: `${name === 'country' ? 'Country' : 'Pincode'} is required` }}
              render={({ field: { onChange, value } }) => (
                <TextInput style={styles.input} keyboardType={name === 'pincode' ? 'numeric' : 'default'} onChangeText={onChange} value={value} />
              )}
              name={name}
            />
            {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
          </View>
        ))}
      </View>

      {/* Other Fields */}
      {[ 'address', 'aadhar', 'pan', 'shopName', 'registerShopName', 'gst' ].map((name) => (
        <View key={name} style={styles.inputContainer}>
          <Text>{name.replace(/([A-Z])/g, ' $1').trim()}</Text>
          <Controller
            control={control}
            rules={{ required: name !== 'aadhar' && name !== 'pan' && name !== 'gst' }}
            render={({ field: { onChange, value } }) => (
              <TextInput style={styles.input} onChangeText={onChange} value={value} />
            )}
            name={name}
          />
          {errors[name] && <Text style={styles.error}>{errors[name].message}</Text>}
        </View>
      ))}
      
      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  halfWidthContainer: {
    width: '48%',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    borderColor: '#ccc',
    marginTop: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
});

export default MerchantForm;
