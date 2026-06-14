import {useDispatch, useSelector} from 'react-redux';
import {
  createGroupPlaylist,
  addTrackToGroup,
  removeTrackFromGroup,
  addMemberToGroup,
  updateGroupPlaylist,
  markPlaylistSynced,
} from '../store/slices/playlistsSlice';

export const useGroupPlaylist = () => {
  const dispatch = useDispatch();
  const groupPlaylists = useSelector(state => state.playlists.groupPlaylists);

  const createPlaylist = (name, ownerId, members = [], options = {}) => {
    dispatch(createGroupPlaylist({name, ownerId, members, ...options}));
  };

  const addTrack = (playlistId, track) => {
    dispatch(addTrackToGroup({playlistId, track}));
  };

  const removeTrack = (playlistId, trackId) => {
    dispatch(removeTrackFromGroup({playlistId, trackId}));
  };

  const addMember = (playlistId, memberId) => {
    dispatch(addMemberToGroup({playlistId, memberId}));
  };

  const updatePlaylist = (playlistId, updates) => {
    dispatch(updateGroupPlaylist({playlistId, updates}));
  };

  const markSynced = playlistId => {
    dispatch(markPlaylistSynced({playlistId}));
  };

  return {
    groupPlaylists,
    createPlaylist,
    addTrack,
    removeTrack,
    addMember,
    updatePlaylist,
    markSynced,
  };
};

export default useGroupPlaylist;
