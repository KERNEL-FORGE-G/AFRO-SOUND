import {useDispatch, useSelector} from 'react-redux';
import {
  createGroupPlaylist,
  addTrackToGroup,
  removeTrackFromGroup,
  addMemberToGroup,
  markPlaylistSynced,
} from '../store/slices/playlistsSlice';

export const useGroupPlaylist = () => {
  const dispatch = useDispatch();
  const groupPlaylists = useSelector(state => state.playlists.groupPlaylists);

  const createPlaylist = (name, ownerId, members = []) => {
    dispatch(createGroupPlaylist({name, ownerId, members}));
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

  const markSynced = playlistId => {
    dispatch(markPlaylistSynced({playlistId}));
  };

  return {
    groupPlaylists,
    createPlaylist,
    addTrack,
    removeTrack,
    addMember,
    markSynced,
  };
};

export default useGroupPlaylist;
