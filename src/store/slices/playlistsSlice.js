import {createSlice, nanoid} from '@reduxjs/toolkit';

const initialState = {
  groupPlaylists: {},
  offlineQueue: [], // actions to sync when back online
};

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {
    createGroupPlaylist: {
      reducer(state, action) {
        const {id, name, ownerId, members = []} = action.payload;
        state.groupPlaylists[id] = {
          id,
          name,
          ownerId,
          members,
          tracks: [],
          createdAt: Date.now(),
          isSynced: false,
        };
      },
      prepare({name, ownerId, members}) {
        return {payload: {id: nanoid(), name, ownerId, members}};
      },
    },
    addTrackToGroup(state, action) {
      const {playlistId, track} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl) {
        pl.tracks.push(track);
        pl.isSynced = false;
        // enqueue sync
        state.offlineQueue.push({type: 'syncPlaylist', playlistId});
      }
    },
    removeTrackFromGroup(state, action) {
      const {playlistId, trackId} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl) {
        pl.tracks = pl.tracks.filter(t => t.id !== trackId);
        pl.isSynced = false;
        state.offlineQueue.push({type: 'syncPlaylist', playlistId});
      }
    },
    addMemberToGroup(state, action) {
      const {playlistId, memberId} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl && !pl.members.includes(memberId)) {
        pl.members.push(memberId);
        pl.isSynced = false;
        state.offlineQueue.push({type: 'syncPlaylist', playlistId});
      }
    },
    markPlaylistSynced(state, action) {
      const {playlistId} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl) {
        pl.isSynced = true;
      }
      // remove related queue items
      state.offlineQueue = state.offlineQueue.filter(
        q => q.playlistId !== playlistId,
      );
    },
    enqueueAction(state, action) {
      state.offlineQueue.push(action.payload);
    },
    clearQueue(state) {
      state.offlineQueue = [];
    },
  },
});

export const {
  createGroupPlaylist,
  addTrackToGroup,
  removeTrackFromGroup,
  addMemberToGroup,
  markPlaylistSynced,
  enqueueAction,
  clearQueue,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
