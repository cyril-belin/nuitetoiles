import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider, extendTheme, Box, Text, useColorMode } from 'native-base';
import { enableScreens } from 'react-native-screens';
import HomeScreen from './screens/HomeScreen';
import StoryScreen from './screens/StoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfilesScreen from './screens/ProfilesScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ChildrenManagementScreen from './screens/ChildrenManagementScreen';
import ParentProfileScreen from './screens/ParentProfileScreen';
import AddChildScreen from './screens/AddChildScreen';
import EditChildScreen from './screens/EditChildScreen';
import StoryGeneratorScreen from './screens/StoryGeneratorScreen';
import FloatingNavBar from './components/FloatingNavBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AudioManager from './utils/audioManager';

// Enable screens
enableScreens();

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Configuration du thème
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
  },
  colors: {
    primary: {
      50: '#E3F2F9',
      100: '#C5E4F3',
      200: '#A2D4EC',
      300: '#7AC1E4',
      400: '#47A9DA',
      500: '#0088CC',
      600: '#007AB8',
      700: '#006BA1',
      800: '#005885',
      900: '#003F5E',
    },
    background: {
      light: '#FFF5E4',
      dark: '#2D3250'
    },
    accent: {
      light: '#FFB4B4',
      dark: '#82AAFF'
    }
  },
  components: {
    Text: {
      baseStyle: ({ colorMode }) => ({
        color: colorMode === 'dark' ? 'gray.50' : 'gray.800',
      }),
    },
    Heading: {
      baseStyle: ({ colorMode }) => ({
        color: colorMode === 'dark' ? 'gray.50' : 'gray.800',
      }),
    },
  },
});

// Stack Navigator pour les écrans de profil
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ProfilesMain" component={ParentProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ChildrenManagement" component={ChildrenManagementScreen} />
      <Stack.Screen name="AddChild" component={AddChildScreen} />
      <Stack.Screen name="EditChild" component={EditChildScreen} />
    </Stack.Navigator>
  );
}

// Stack Navigator pour l'écran d'accueil
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function MainNavigator() {
  const { colorMode } = useColorMode();
  return (
    <Box 
      flex={1} 
      safeArea 
      bg={colorMode === 'dark' ? 'background.dark' : 'background.light'}
    >
      <Tab.Navigator
        tabBar={props => <FloatingNavBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{
            title: 'Accueil',
          }}
        />
        <Tab.Screen 
          name="Story" 
          component={StoryScreen}
          options={{
            title: 'Lecture',
          }}
        />
        <Tab.Screen 
          name="StoryGeneratorScreen" 
          component={StoryGeneratorScreen}
          options={{
            title: 'Créer',
          }}
        />
        <Tab.Screen 
          name="Profiles" 
          component={ProfileStack}
          options={{
            title: 'Profil',
          }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{
            title: 'Réglages',
          }}
        />
      </Tab.Navigator>
    </Box>
  );
}

export default function App() {
  useEffect(() => {
    // Initialiser l'audio au démarrage de l'application
    const initAudio = async () => {
      const success = await AudioManager.init();
      if (!success) {
        console.warn('Failed to initialize audio');
      }
    };
    
    initAudio();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer
          onStateChange={(state) => {
            if (__DEV__) {
              console.log('New navigation state:', state);
            }
          }}
          fallback={<Box flex={1} justifyContent="center" alignItems="center">
            <Text>Chargement...</Text>
          </Box>}
          onError={(error) => {
            console.error('Navigation error:', error);
          }}
        >
          <MainNavigator />
        </NavigationContainer>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}
