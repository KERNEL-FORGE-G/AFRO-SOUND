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
        const {
          id,
          name,
          ownerId,
          members = [],
          description = '',
          visibility = 'shared',
          accentColor = '#E7A53B',
        } = action.payload;
        state.groupPlaylists[id] = {
          id,
          name,
          ownerId,
          description,
          visibility,
          accentColor,
          members: Array.from(new Set([ownerId, ...members])),
          tracks: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          activity: [],
          pendingChanges: 0,
          isSynced: false,
        };
      },
      prepare({
        name,
        ownerId,
        members = [],
        description,
        visibility,
        accentColor,
      }) {
        return {
          payload: {
            id: nanoid(),
            name,
            ownerId,
            members,
            description,
            visibility,
            accentColor,
          },
        };
      },
    },
    addTrackToGroup(state, action) {
      const {playlistId, track} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (
        pl &&
        !pl.tracks.some(existingTrack => existingTrack.id === track.id)
      ) {
        pl.tracks.push(track);
        pl.isSynced = false;
        pl.updatedAt = Date.now();
        pl.pendingChanges += 1;
        pl.activity.unshift({
          id: nanoid(),
          type: 'track_added',
          label: `${track.title} a ete ajoute`,
          createdAt: Date.now(),
        });
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
        pl.updatedAt = Date.now();
        pl.pendingChanges += 1;
        pl.activity.unshift({
          id: nanoid(),
          type: 'track_removed',
          label: 'Un titre a ete retire',
          createdAt: Date.now(),
        });
        state.offlineQueue.push({type: 'syncPlaylist', playlistId});
      }
    },
    addMemberToGroup(state, action) {
      const {playlistId, memberId} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl && !pl.members.includes(memberId)) {
        pl.members.push(memberId);
        pl.isSynced = false;
        pl.updatedAt = Date.now();
        pl.pendingChanges += 1;
        pl.activity.unshift({
          id: nanoid(),
          type: 'member_added',
          label: `${memberId} a rejoint la playlist`,
          createdAt: Date.now(),
        });
        state.offlineQueue.push({type: 'syncPlaylist', playlistId});
      }
    },
    updateGroupPlaylist(state, action) {
      const {playlistId, updates} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl) {
        Object.assign(pl, updates, {updatedAt: Date.now(), isSynced: false});
        pl.pendingChanges += 1;
        state.offlineQueue.push({type: 'syncPlaylist', playlistId});
      }
    },
    markPlaylistSynced(state, action) {
      const {playlistId} = action.payload;
      const pl = state.groupPlaylists[playlistId];
      if (pl) {
        pl.isSynced = true;
        pl.pendingChanges = 0;
        pl.lastSyncedAt = Date.now();
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
  updateGroupPlaylist,
  markPlaylistSynced,
  enqueueAction,
  clearQueue,
} = playlistsSlice.actions;

export default playlistsSlice.reducer;
