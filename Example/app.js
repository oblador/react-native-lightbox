import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ModalPresenterProvider, GalleryProvider, LightboxImage } from './react-native-lightbox';

const WINDOW_WIDTH = Dimensions.get('window').width;
const BASE_PADDING = 20;

const PLACEHOLDER_TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: BASE_PADDING,
  },
  contain: {
    //flex: 1,
    height: 150,
  },
  cover: {
    height: 150,
    width: 150,
    alignSelf: 'center',
  },
  text: {
    marginVertical: BASE_PADDING * 2,
  },
});

export default () => (
  <ModalPresenterProvider>
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.text}>{PLACEHOLDER_TEXT}</Text>
      <GalleryProvider
        value={[
          {
            uri:
              'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg',
          },
          {
            uri:
              'https://www.yayomg.com/wp-content/uploads/2014/04/yayomg-pig-wearing-party-hat.jpg',
          },
          {
            uri: 'http://www.cutestpaw.com/wp-content/uploads/2015/07/Ribbit....jpeg',
          },
          {
            uri: 'http://www.cutestpaw.com/wp-content/uploads/2015/09/Hipster-WH.jpeg',
          },
        ]}
      >
        <LightboxImage
          style={styles.contain}
          resizeMode="contain"
          source={{
            uri:
              'https://www.yayomg.com/wp-content/uploads/2014/04/yayomg-pig-wearing-party-hat.jpg',
          }}
        />
      </GalleryProvider>
      <Text style={styles.text}>{PLACEHOLDER_TEXT}</Text>
      {/*<LightboxImage
        style={styles.cover}
        resizeMode="cover"
        source={{
          uri: 'https://www.yayomg.com/wp-content/uploads/2014/04/yayomg-pig-wearing-party-hat.jpg',
        }}
      />

    <View style={styles.text}>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </Text>
    </View>
    <LightboxGallery
      style={styles.gallery}
      resizeMode="cover"
      source={{
        uri:
          'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg',
      }}
    >
      <LightboxImage
        style={styles.contain}
        resizeMode="contain"
        source={{
          uri: 'https://www.yayomg.com/wp-content/uploads/2014/04/yayomg-pig-wearing-party-hat.jpg',
        }}
      />
      <LightboxImage
        style={styles.contain}
        resizeMode="contain"
        source={{
          uri:
            'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg',
        }}
      />
    </LightboxGallery>*/}
      <Text style={styles.text}>{PLACEHOLDER_TEXT}</Text>
    </ScrollView>
  </ModalPresenterProvider>
);
