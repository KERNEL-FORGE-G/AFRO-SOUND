import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {PlayerProvider} from './src/context/PlayerContext';
<<<<<<< HEAD
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store';

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PlayerProvider>
          <AppNavigator />
        </PlayerProvider>
      </PersistGate>
    </Provider>
=======

function App(): JSX.Element {
  return (
    <PlayerProvider>
      <AppNavigator />
    </PlayerProvider>
>>>>>>> upstream/main
  );
}

export default App;
