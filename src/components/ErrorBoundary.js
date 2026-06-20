import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class ErrorBoundary extends React.Component {
  state = {hasError: false, error: null};

  static getDerivedStateFromError(error) {
    return {hasError: true, error};
  }

  componentDidCatch(error, errorInfo) {
    console.error('CRASH DÉTAILLÉ:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Erreur fatale détectée :</Text>
          <Text style={styles.error}>{this.state.error?.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {fontSize: 18, color: 'red'},
  error: {fontSize: 14, color: 'gray', marginTop: 10},
});
