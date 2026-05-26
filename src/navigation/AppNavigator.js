import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GetStarted from '../screens/GetStarted';
import Home from '../screens/Home';
import NowPlaying from '../screens/NowPlaying';
import ChooseMode from '../screens/ChooseMode';
import Loading from '../screens/Loading';
import Lyrics from '../screens/Lyrics';
import Register from '../screens/Register';
import MusicPage from '../screens/MusicPage';
import PlayerBar from '../components/PlayerBar';
import Search from '../screens/Search';
import Library from '../screens/Library';
import SearchResults from '../screens/SearchResults';
import CreatePlaylist from '../screens/CreatePlaylist';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#181411' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#181411',
            borderTopColor: '#2C241E',
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: '#E67E22', // Orange vibrant
          tabBarInactiveTintColor: '#C4A484', // Ton sable
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Accueil') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Rechercher') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'Créer') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name === 'Bibliothèque') {
              iconName = focused ? 'library' : 'library-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Accueil" component={Home} />
      <Tab.Screen name="Rechercher" component={Search} />
        <Tab.Screen name="Créer" component={CreatePlaylist} />
      <Tab.Screen name="Bibliothèque" component={Library} />
      </Tab.Navigator>
      
      {/* PlayerBar persistante au-dessus de la barre de navigation */}
      <View style={{ position: 'absolute', bottom: 60, left: 0, right: 0 }}>
        <PlayerBar />
      </View>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={GetStarted} />
        <Stack.Screen name="ChooseMode" component={ChooseMode} />
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="MusicPage" component={MusicPage} />
        <Stack.Screen name="NowPlaying" component={NowPlaying} />
        <Stack.Screen name="Lyrics" component={Lyrics} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SearchResults" component={SearchResults} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
