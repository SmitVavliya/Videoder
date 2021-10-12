import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  StatusBar,
} from 'react-native';

const VideoInfoScreen = ({navigation}) => {
  const videos = navigation.getParam('originalVideos');

  const renderComponent = item => {
    const videoName = video => {
      const array = video.split('/');
      return array[array.length - 1];
    };

    return (
      <View style={styles.outerContainer}>
        <View style={styles.leftContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('videoPlayer', {video: item})}>
            <Image
              source={{
                uri: item.path,
              }}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.innerContainer}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                }}>
                FileName :
              </Text>
              <Text numberOfLines={2} style={styles.text}>
                {` ${videoName(item.path)}`}
              </Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.textBox}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                }}>
                Duration :
              </Text>
              <Text>{` ${item.duration / 1000} seconds`}</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.textBox}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                }}>
                mime :
              </Text>
              <Text>{` ${item.mime}`}</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.textBox}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                }}>
                Size :
              </Text>
              <Text>{` ${item.size / 1000} KB`}</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.textBox}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                }}>
                Height :
              </Text>
              <Text>{` ${item.height}`}</Text>
            </View>
          </View>
          <View style={styles.innerContainer}>
            <View style={styles.textBox}>
              <Text
                style={{
                  textAlignVertical: 'center',
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'green',
                }}>
                Width :
              </Text>
              <Text>{` ${item.width}`}</Text>
            </View>
          </View>
          <View />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#E66000" />
      <FlatList
        data={videos}
        renderItem={({item}) => renderComponent(item)}
        keyExtractor={video => video.path}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  outerContainer: {
    height: Dimensions.get('window').height / 2.1,
    width: Dimensions.get('window').width / 1.1,
    borderColor: 'white',
    borderWidth: 2,
    elevation: 5,
    backgroundColor: 'white',
    shadowColor: '#1F54C3',
    shadowRadius: 10,
    shadowOpacity: 1,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 15,
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    width: Dimensions.get('window').width / 1.1,
    justifyContent: 'flex-start',
  },
  innerContainer: {
    alignItems: 'center',
  },
  text: {
    height: Dimensions.get('window').height / 10,
    width: Dimensions.get('window').width / 1.5,
    textAlignVertical: 'center',
  },
  image: {
    height: Dimensions.get('window').height / 7,
    width: Dimensions.get('window').width / 3,
    borderRadius: 4,
  },
  textBox: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: Dimensions.get('window').width / 1.1,
    paddingBottom: 5,
  },
});

export default VideoInfoScreen;
