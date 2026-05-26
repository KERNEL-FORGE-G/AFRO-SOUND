import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import theme from '../theme';

export default function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E67E22" style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#181411', // Fond noir/brun profond
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  spinner: { 
    marginTop: 40 
  }
});
