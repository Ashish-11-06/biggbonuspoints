import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.title}>
            Details Screen
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  card: {
    padding: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DetailsScreen;
