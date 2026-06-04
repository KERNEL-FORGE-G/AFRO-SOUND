import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import OfflineSyncService from '../services/syncService';

/**
 * Hook for starting auto-sync when the app initializes or network state changes.
 * Call this once in App.tsx or a root component.
 */
export const useOfflineSyncInit = (store) => {
  const dispatch = useDispatch();
  const offlineQueue = useSelector(state => state.playlists.offlineQueue);
  const groupPlaylists = useSelector(state => state.playlists.groupPlaylists);

  useEffect(() => {
    // Start the auto-sync listener
    OfflineSyncService.startAutoSync(store);

    // Optionally sync immediately if queue is not empty
    if (offlineQueue.length > 0) {
      OfflineSyncService.syncQueue(offlineQueue, groupPlaylists, store);
    }
  }, [offlineQueue, groupPlaylists, store]);
};

export default useOfflineSyncInit;
