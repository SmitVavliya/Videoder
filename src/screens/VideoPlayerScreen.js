import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import {NavigationEvents} from 'react-navigation';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Orientation from 'react-native-orientation';
import VerticalSlider from 'rn-vertical-slider';
import DeviceBrightness from 'react-native-device-brightness';
import VolumeControl from 'react-native-volume-control';

const VideoPlayerScreen = ({navigation}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('cover');
  const [screen, setScreen] = useState(Dimensions.get('window'));
  const [height, setHeight] = useState(Dimensions.get('screen').height);
  const [width, setWidth] = useState(Dimensions.get('screen').width);
  const [show, setShow] = useState(true);
  const [lockVisibility, setLockVisibility] = useState(true);
  const [showSetting, setShowSetting] = useState(false);
  const [volume, setVolume] = useState(5);
  const [brightness, setBrightness] = useState(0.2);

  const item = navigation.getParam('item');
  const url = navigation.getParam('url');
  const video = navigation.getParam('video');

  let VideoPlayer;

  const onLoadStart = data => {
    setIsLoading(true);
  };

  const onLoad = data => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onProgress = data => {
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
  };

  const onPaused = playerState => {
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    setPlayerState(PLAYER_STATES.PLAYING);
    VideoPlayer.seek(0);
  };

  const onSeek = seek => {
    VideoPlayer.seek(seek);
  };

  const onSeeking = currentTime => {
    setCurrentTime(currentTime);
  };

  const getOrientation = () => {
    if (screen.width > screen.height) {
      return 'LANDSCAPE';
    } else {
      return 'PORTRAIT';
    }
  };

  const getStyle = () => {
    if (getOrientation() === 'LANDSCAPE') {
      return landscapeStyles;
    } else {
      return portraitStyles;
    }
  };

  const onLayout = () => {
    setScreen(Dimensions.get('window'));
    setHeight(Dimensions.get('screen').height);
    setWidth(Dimensions.get('screen').width);
  };

  const getName = () => {
    if (item) {
      return item.name;
    } else if (url) {
      return 'Online Video';
    } else {
      let array = video.path.split('/');
      return array[array.length - 1];
    }
  };

  const renderComponent = () => {
    if (show) {
      return (
        <MediaControls
          isLoading={isLoading}
          duration={duration}
          mainColor="orange"
          onPaused={onPaused}
          onReplay={onReplay}
          onSeek={onSeek}
          onSeeking={onSeeking}
          playerState={playerState}
          progress={currentTime}>
          <MediaControls.Toolbar>
            <View style={{...getStyle().container, width}}>
              <Icon
                name="arrow-left"
                size={20}
                style={{marginLeft: 10}}
                color="white"
                onPress={() => navigation.navigate('VideoSelect')}
              />
              <Text style={getStyle().text}>{getName()}</Text>
              <Icon
                name="lock-open"
                size={20}
                style={{width: 30, height: 30}}
                color="white"
                onPress={() => {
                  setShow(false);
                }}
              />
            </View>
          </MediaControls.Toolbar>
          <MediaControls.Toolbar>
            <View style={{...getStyle().setting, width, height: height - 60}}>
              <Icon
                name="ellipsis-h"
                size={30}
                style={{
                  width: 50,
                  height: 45,
                  padding: 10,
                }}
                color="white"
                onPress={() => setShowSetting(!showSetting)}
              />
            </View>
          </MediaControls.Toolbar>
        </MediaControls>
      );
    } else if (lockVisibility) {
      return (
        <View style={styles.lock}>
          <Icon
            name="lock"
            size={30}
            color="white"
            onPress={() => setShow(true)}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  const loadUrl = () => {
    if (item) {
      return `file://${item.path}`;
    } else if (url) {
      return url;
    } else {
      return video.path;
    }
  };

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={async () => {
          await Orientation.unlockAllOrientations();
          await StatusBar.setHidden(true);
          await hideNavigationBar();
          const volume = await VolumeControl.getVolume();
          setVolume(volume);
          const brightness = await DeviceBrightness.getBrightnessLevel();
          setBrightness(brightness);
        }}
      />
      <View onLayout={onLayout}>
        <TouchableWithoutFeedback
          onPress={() => {
            setLockVisibility(!lockVisibility);
          }}>
          <Video
            ref={videoPlayer => (VideoPlayer = videoPlayer)}
            source={{uri: loadUrl()}}
            onLoadStart={onLoadStart}
            onLoad={onLoad}
            onProgress={onProgress}
            paused={paused}
            onEnd={onEnd}
            resizeMode={screenType}
            onFullScreen={isFullScreen}
            style={{...styles.mediaPlayer, height}}
          />
        </TouchableWithoutFeedback>
        {renderComponent()}
        {showSetting ? (
          <View style={{...styles.volume, height}}>
            <VerticalSlider
              value={volume}
              disabled={false}
              min={0}
              max={15}
              onChange={volume => {
                setVolume(volume);
                VolumeControl.change(volume);
              }}
              onComplete={volume => {
                setVolume(volume);
                VolumeControl.change(volume);
              }}
              width={20}
              height={150}
              step={1}
              borderRadius={4}
              minimumTrackTintColor={'orange'}
              maximumTrackTintColor={'white'}
            />
          </View>
        ) : null}
        {showSetting ? (
          <View style={{...styles.brightness, height, width: width - 80}}>
            <VerticalSlider
              value={brightness}
              disabled={false}
              min={0}
              max={1}
              onChange={brightness => {
                setBrightness(brightness);
                DeviceBrightness.setBrightnessLevel(brightness);
              }}
              onComplete={brightness => {
                setBrightness(brightness);
                DeviceBrightness.setBrightnessLevel(brightness);
              }}
              width={20}
              height={150}
              step={0.1}
              borderRadius={4}
              minimumTrackTintColor={'orange'}
              maximumTrackTintColor={'white'}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    backgroundColor: 'black',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  iconContainer: {
    height: 65,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  lock: {
    position: 'absolute',
    marginVertical: 30,
    marginHorizontal: 30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderColor: 'white',
    borderWidth: 1,
  },
  volume: {
    position: 'absolute',
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  brightness: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

const portraitStyles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginLeft: 0,
  },
  setting: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

const landscapeStyles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
    marginLeft: 0,
  },
  setting: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default VideoPlayerScreen;
