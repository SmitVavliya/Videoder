import React from 'react';
import {View, Text} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import MainScreen from './src/screens/MainScreen';
import FoldersListScreen from './src/screens/FoldersListScreen';
import SubFoldersListScreen from './src/screens/SubFoldersListScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';
import VideoLoaderScreen from './src/screens/VideoLoaderScreen';
import VideoSelectScreen from './src/screens/VideoSelectScreen';
import VideoInfoScreen from './src/screens/VideoInfoScreen';
import {setNavigator, navigate} from './src/navigationRef';
import Icon from 'react-native-vector-icons/FontAwesome5';

const foldersListFlow = createStackNavigator({
  Main: {
    screen: MainScreen,
    navigationOptions: {
      title: 'Main Screen',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#FF9500',
      },
      headerTintColor: 'white',
    },
  },
  FoldersList: {
    screen: FoldersListScreen,
    navigationOptions: {
      title: 'Internal Storage',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#FF9500',
      },
      headerTintColor: 'white',
    },
  },
  subFoldersList: {
    screen: SubFoldersListScreen,
    navigationOptions: {
      title: 'Internal Storage',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#FF9500',
      },
      headerTintColor: 'white',
    },
  },
});

foldersListFlow.navigationOptions = {
  title: 'Folders',
  tabBarIcon: <Icon name="folder-open" size={25} color="white" />,
  tabBarOptions: {
    style: {
      backgroundColor: '#FF9500',
      height: 55,
      borderTopColor: 'transparent',
      borderTopWidth: 1,
      paddingRight: 5,
      paddingLeft: 5,
      borderTopWidth: 1,
      borderTopColor: 'white',
    },
    showLabel: true,
    showIcon: true,
    activeTintColor: 'white',
    inactiveTintColor: '#E66000',
    labelStyle: {
      fontSize: 14,
    },
    tabBarBadge: 1,
  },
};

const videoloader = createStackNavigator({
  VideoLoader: {
    screen: VideoLoaderScreen,
    navigationOptions: {
      title: 'Video Loader',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Icon
          name="arrow-left"
          size={25}
          style={{marginLeft: 10}}
          onPress={() => navigate('Main')}
          color="white"
        />
      ),
      headerStyle: {
        backgroundColor: '#FF9500',
      },
      headerTintColor: 'white',
    },
  },
});

const videoSelect = createStackNavigator({
  VideoSelect: {
    screen: VideoSelectScreen,
    navigationOptions: {
      title: 'Video Select',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Icon
          name="arrow-left"
          size={25}
          style={{marginLeft: 10}}
          onPress={() => navigate('Main')}
          color="white"
        />
      ),
      headerStyle: {
        backgroundColor: '#FF9500',
      },
      headerTintColor: 'white',
    },
  },
  VideoInfo: {
    screen: VideoInfoScreen,
    navigationOptions: {
      title: 'Video Info',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#FF9500',
      },
      headerTintColor: 'white',
    },
  },
  videoPlayer: {
    screen: VideoPlayerScreen,
    navigationOptions: {
      header: () => <View />,
    },
  },
});

const switchNavigator = createSwitchNavigator({
  mainFlow: createBottomTabNavigator({
    foldersListFlow,
    VideoLoader: {
      screen: videoloader,
      navigationOptions: {
        tabBarIcon: <Icon name="video" size={25} color="white" />,
        tabBarVisible: false,
        tabBarOptions: {
          style: {
            backgroundColor: '#FF9500',
            height: 55,
            borderTopColor: 'transparent',
            borderTopWidth: 1,
            paddingRight: 5,
            paddingLeft: 5,
            borderTopWidth: 1,
            borderTopColor: 'white',
          },
          showLabel: true,
          showIcon: true,
          labelStyle: {
            fontSize: 14,
          },
          activeTintColor: 'white',
          inactiveTintColor: '#E66000',
        },
      },
    },
    VideoSelect: {
      screen: videoSelect,
      navigationOptions: {
        tabBarIcon: <Icon name="file-video" size={25} color="white" />,
        tabBarVisible: false,
        tabBarOptions: {
          style: {
            backgroundColor: '#FF9500',
            height: 55,
            borderTopColor: 'transparent',
            borderTopWidth: 1,
            paddingRight: 5,
            paddingLeft: 5,
            borderTopWidth: 1,
            borderTopColor: 'white',
          },
          showLabel: true,
          showIcon: true,
          labelStyle: {
            fontSize: 14,
          },
          activeTintColor: 'white',
          inactiveTintColor: '#E66000',
        },
      },
    },
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return <App ref={navigator => setNavigator(navigator)} />;
};
