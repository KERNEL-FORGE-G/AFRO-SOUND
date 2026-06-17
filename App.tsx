import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {PlayerProvider} from './src/context/PlayerContext';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store';
import {startRealtimePlaylistSync} from './src/services/realtimeService';

function App(): JSX.Element {
  useEffect(() => {
    const unsubscribe = startRealtimePlaylistSync();
    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PlayerProvider>
          <AppNavigator />
        </PlayerProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
