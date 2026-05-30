import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {PlayerProvider} from './src/context/PlayerContext';

function App(): JSX.Element {
  return (
    <PlayerProvider>
      <AppNavigator />
    </PlayerProvider>
  );
}

export default App;
