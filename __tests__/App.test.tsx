/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

import {it} from '@jest/globals';
import renderer, {act} from 'react-test-renderer';

jest.mock('../src/navigation/AppNavigator', () => {
  const {View, Text} = require('react-native');
  return () => (
    <View>
      <Text>AFRO SOUND</Text>
    </View>
  );
});

it('renders correctly', async () => {
  await act(async () => {
    renderer.create(<App />);
  });
});
