import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  StatusBar,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {NavigationEvents} from 'react-navigation';

const VideoLoaderScreen = ({navigation}) => {
  const [url, setUrl] = useState('');

  return (
    <View style={styles.container}>
      <NavigationEvents onWillFocus={() => setUrl('')} />
      <StatusBar backgroundColor="#E66000" />
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginHorizontal: 15,
          marginVertical: 10,
        }}>
        Video URL
      </Text>
      <View style={styles.innerContainer}>
        <TextInput
          placeholder="Enter or Paste your url here . . ."
          value={url}
          onChangeText={value => setUrl(value)}
          selectTextOnFocus={true}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (url !== '') {
            navigation.navigate('videoPlayer', {url});
          }
        }}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContainer: {
    marginHorizontal: 15,
    borderColor: 'white',
    borderWidth: 3,
    padding: 5,
    borderRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
  },
  button: {
    width: Dimensions.get('window').width,
    height: 65,
    alignItems: 'flex-end',
  },
  buttonText: {
    width: 120,
    height: 50,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'orange',
    borderRadius: 6,
    marginHorizontal: 15,
    marginVertical: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default VideoLoaderScreen;
