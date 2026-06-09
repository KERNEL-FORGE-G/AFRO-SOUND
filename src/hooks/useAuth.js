import {useDispatch, useSelector} from 'react-redux';
import {
  setUser,
  setToken,
  setProvider,
  logout,
  socialLogin,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const {user, token, provider, status, error} = useSelector(
    state => state.auth,
  );

  const handleSocialLogin = socialProvider => {
    // Dispatches the socialLogin async thunk.
    // Actual OAuth implementation should happen in a service,
    // then dispatch setUser/setToken with the result.
    dispatch(socialLogin(socialProvider));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const setUserInfo = userObj => {
    dispatch(setUser(userObj));
  };

  const setTokenInfo = tokenStr => {
    dispatch(setToken(tokenStr));
  };

  const setProviderInfo = providerName => {
    dispatch(setProvider(providerName));
  };

  return {
    user,
    token,
    provider,
    status,
    error,
    handleSocialLogin,
    handleLogout,
    setUserInfo,
    setTokenInfo,
    setProviderInfo,
  };
};

export default useAuth;
