import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import {showNavigationBar} from 'react-native-navigation-bar-color';
import Orientation from 'react-native-orientation';

const MainScreen = ({navigation}) => {
  const [moviesFiles, setMoviesFiles] = useState([]);
  const [musicFiles, setMusicFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [downloadFiles, setDownloadFiles] = useState([]);
  const [granted, setGranted] = useState(false);
  const [denied, setDenied] = useState(false);

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Vlc-Player-Pro_india',
          message:
            'Allow Vlc-Player-Pro-India to access photos, media, and files on your device ?',
          buttonPositive: 'ALLOW',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setGranted(true);
      }

      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        setDenied(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const setData = (files, name, path) => {
    const sortedFiles = _.sortBy(files, 'name');
    const originalFiles = _.filter(sortedFiles, file => {
      return file.name.split('')[0] !== '.';
    });

    let newFiles = {};
    let numberOfFiles = 0;
    let numberOfFolders = 0;
    for (let outerFile of originalFiles) {
      if (outerFile.isDirectory()) {
        numberOfFolders++;
      } else {
        numberOfFiles++;
      }
    }

    newFiles = {
      name,
      subFolders: numberOfFolders,
      mediaFiles: numberOfFiles,
      path,
    };

    return newFiles;
  };

  const fetchData = async () => {
    try {
      const moviesFiles = await RNFS.readDir(
        RNFS.ExternalStorageDirectoryPath + '/Movies/',
      );
      const musicFiles = await RNFS.readDir(
        RNFS.ExternalStorageDirectoryPath + '/Music/',
      );
      const videoFiles = await RNFS.readDir(
        RNFS.ExternalStorageDirectoryPath + '/WhatsApp/',
      );
      const downloadFiles = await RNFS.readDir(
        RNFS.ExternalStorageDirectoryPath + '/Download/',
      );

      let newMoviesFiles = setData(
        moviesFiles,
        'Movies',
        RNFS.ExternalStorageDirectoryPath + '/Movies/',
      );
      let newMusicFiles = setData(
        musicFiles,
        'Music',
        RNFS.ExternalStorageDirectoryPath + '/Music/',
      );
      let newVideoFiles = setData(
        videoFiles,
        'WhatsApp Video',
        RNFS.ExternalStorageDirectoryPath + '/WhatsApp/',
      );
      let newDownloadFiles = setData(
        downloadFiles,
        'Download',
        RNFS.ExternalStorageDirectoryPath + '/Download/',
      );

      setMoviesFiles(newMoviesFiles);
      setMusicFiles(newMusicFiles);
      setVideoFiles(newVideoFiles);
      setDownloadFiles(newDownloadFiles);
    } catch (err) {
      console.log(err);
    }
  };

  const renderFolders = item => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('FoldersList', {item})}>
        <View style={styles.item}>
          <View>
            <Icon
              name="folder-plus"
              size={40}
              color="brown"
              style={{marginHorizontal: 10}}
            />
          </View>
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.text}>
              {item.name}
            </Text>
            <View style={styles.folderText}>
              {item.subFolders ? (
                <Text style={{color: 'grey', fontSize: 12}}>{`${
                  item.subFolders
                } subfolders`}</Text>
              ) : null}
              {item.subFolders && item.mediaFiles ? (
                <Text style={{color: 'grey', fontSize: 12}}>, </Text>
              ) : null}
              {item.mediaFiles ? (
                <Text style={{color: 'grey', fontSize: 12}}>{`${
                  item.mediaFiles
                } media files`}</Text>
              ) : null}
              {!item.subFolders && !item.mediaFiles ? (
                <Text style={{color: 'grey', fontSize: 12}}>
                  Directory is empty
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <NavigationEvents
        onWillFocus={() => {
          fetchData();
          Orientation.lockToPortrait();
          StatusBar.setHidden(false);
          showNavigationBar();
        }}
      />
      {granted ? (
        <View>
          <StatusBar backgroundColor="#E66000" />
          <Text
            style={{marginVertical: 10, marginHorizontal: 20, color: 'grey'}}>
            Quick Access
          </Text>
          <View style={styles.innerContainer}>
            {renderFolders(moviesFiles)}
          </View>
          <View style={styles.innerContainer}>{renderFolders(musicFiles)}</View>
          <View style={styles.innerContainer}>{renderFolders(videoFiles)}</View>
          <View style={styles.innerContainer}>
            {renderFolders(downloadFiles)}
          </View>
        </View>
      ) : null}
      {denied ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: Dimensions.get('window').height / 1.2,
          }}>
          <Text
            style={{
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            You need to give permission to access your internal storage to parse
            how many media files are in your storage.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  icon: {
    borderColor: 'red',
    borderWidth: 2,
    width: 40,
    height: 40,
  },
  item: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 10,
    textAlignVertical: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
    height: Dimensions.get('window').height / 10,
    justifyContent: 'center',
  },
  text: {
    marginLeft: 10,
    width: Dimensions.get('window').width / 1.5,
    fontWeight: 'bold',
    fontSize: 15,
  },
  folderText: {
    flexDirection: 'row',
    marginLeft: 10,
  },
});

export default MainScreen;
