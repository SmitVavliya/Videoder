import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import {showNavigationBar} from 'react-native-navigation-bar-color';
import Orientation from 'react-native-orientation';

const FoldersListScreen = ({navigation}) => {
  const [files, setFiles] = useState([]);

  showNavigationBar();
  Orientation.lockToPortrait();

  const item = navigation.getParam('item');

  const fetchData = async () => {
    try {
      const files = await RNFS.readDir(item.path + '/');

      const sortedFiles = _.sortBy(files, 'name');
      const originalFiles = _.filter(sortedFiles, file => {
        return file.name.split('')[0] !== '.';
      });

      let newFiles = [];
      for (let outerFile of originalFiles) {
        if (outerFile.isDirectory()) {
          const res = await RNFS.readDir(outerFile.path + '/');
          let numberOfFiles = 0;
          let numberOfFolders = 0;
          for (let file of res) {
            if (file.isDirectory()) {
              numberOfFolders++;
            } else {
              numberOfFiles++;
            }
          }

          outerFile = {
            isDirectory: outerFile.isDirectory,
            isFile: outerFile.isFile,
            mtime: outerFile.mtime,
            name: outerFile.name,
            path: outerFile.path,
            size: outerFile.size,
            subFolders: numberOfFolders,
            mediaFiles: numberOfFiles,
          };
        }

        newFiles.push(outerFile);
      }
      setFiles(newFiles);
    } catch (err) {
      console.log(err);
    }
  };

  const setImage = item => {
    let extension = item.name.split('.')[1];
    if (item.isDirectory()) {
      return (
        <Icon
          name="folder-plus"
          size={40}
          color="brown"
          style={{marginHorizontal: 10}}
        />
      );
    } else if (
      extension == 'mp4' ||
      extension == 'mkv' ||
      extension == 'm4a' ||
      extension == 'm4v' ||
      extension == 'f4v' ||
      extension == 'f4a' ||
      extension == 'm4b' ||
      extension == 'm4r' ||
      extension == 'f4b' ||
      extension == 'mov' ||
      extension == 'jpg' ||
      extension == 'png' ||
      extension == 'jpeg'
    ) {
      return (
        <Image
          source={{
            uri: `file://${item.path}`,
          }}
          style={styles.image}
        />
      );
    } else {
      return (
        <Icon
          name="file-signature"
          size={40}
          color="brown"
          style={{marginHorizontal: 10}}
        />
      );
    }
  };

  const renderFolders = files => {
    if (files.length) {
      return (
        <FlatList
          data={files}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                if (item.isDirectory()) {
                  navigation.navigate('subFoldersList', {item});
                } else {
                  const extension = item.name.split('.')[1];
                  if (
                    extension == 'mp4' ||
                    extension == 'mkv' ||
                    extension == 'm4a' ||
                    extension == 'm4v' ||
                    extension == 'f4v' ||
                    extension == 'f4a' ||
                    extension == 'm4b' ||
                    extension == 'm4r' ||
                    extension == 'f4b' ||
                    extension == 'mov'
                  ) {
                    navigation.navigate('videoPlayer', {item: item});
                  }
                }
              }}>
              <View style={styles.item}>
                <View>{setImage(item)}</View>
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
                    {!item.mediaFiles &&
                    !item.subFolders &&
                    item.isDirectory() ? (
                      <Text style={{color: 'grey', fontSize: 12}}>
                        Directory is empty
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.path}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 16}}>Loading</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <NavigationEvents
        onWillFocus={() => {
          fetchData();
          showNavigationBar();
          Orientation.lockToPortrait();
        }}
      />
      <StatusBar backgroundColor="#E66000" />
      <View style={styles.innerContainer}>{renderFolders(files)}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 1.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
  image: {
    height: 40,
    width: 40,
    borderRadius: 4,
    marginHorizontal: 10,
  },
});

export default FoldersListScreen;
