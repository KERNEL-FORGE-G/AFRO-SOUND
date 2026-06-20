import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {PlayerProvider} from './src/context/PlayerContext';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store';
import {startRealtimePlaylistSync} from './src/services/realtimeService';
import ErrorBoundary from './src/components/ErrorBoundary';

function App(): JSX.Element {
  useEffect(() => {
    try {
      const unsubscribe = startRealtimePlaylistSync();
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } catch (error) {
      console.warn('[App] Realtime sync init failed:', error.message);
    }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PlayerProvider>
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
        </PlayerProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
