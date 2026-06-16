import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');

jest.mock('react-native-sound', () => {
  const Sound = jest.fn();
  Sound.setCategory = jest.fn();
  Sound.prototype.setVolume = jest.fn();
  Sound.prototype.play = jest.fn();
  Sound.prototype.stop = jest.fn();
  Sound.prototype.release = jest.fn();
  Sound.prototype.getDuration = jest.fn();
  return Sound;
});

jest.mock('./src/store', () => ({store: {}, persistor: {}}));

jest.mock('react-redux', () => ({
  Provider: ({children}) => children,
}));

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: ({children}) => children,
}));

jest.mock('rn-fetch-blob', () => ({
  __esModule: true,
  default: {
    fs: {dirs: {DocumentDir: '/tmp'}},
    config: () => ({fetch: () => Promise.resolve()}),
  },
}));

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(() => Promise.resolve()),
    updateOptions: jest.fn(() => Promise.resolve()),
    setRepeatMode: jest.fn(() => Promise.resolve()),
    add: jest.fn(() => Promise.resolve()),
    reset: jest.fn(() => Promise.resolve()),
    play: jest.fn(() => Promise.resolve()),
    pause: jest.fn(() => Promise.resolve()),
    skip: jest.fn(() => Promise.resolve()),
    skipToNext: jest.fn(() => Promise.resolve()),
    skipToPrevious: jest.fn(() => Promise.resolve()),
  },
  Capability: {},
  RepeatMode: {Queue: 0},
  State: {Playing: 'playing', Paused: 'paused'},
  Event: {PlaybackActiveTrackChanged: 'playback-active-track-changed'},
  usePlaybackState: () => ({state: undefined}),
  useProgress: () => ({position: 0, duration: 0}),
  useTrackPlayerEvents: () => {},
}));

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    NavigationContainer: ({children}) => children,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      replace: jest.fn(),
    }),
  };
});

jest.mock('./src/supabaseClient', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({data: [], error: null}),
        order: () => ({
          limit: () => Promise.resolve({data: [], error: null}),
        }),
      }),
    }),
    auth: {
      signUp: jest.fn(() => Promise.resolve({data: {}, error: null})),
    },
  },
}));
