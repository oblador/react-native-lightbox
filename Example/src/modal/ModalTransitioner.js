import React, { PureComponent } from 'react';
import { Animated, Dimensions, Image, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Header from './ModalHeader';
//import Zoomable from '../Zoomable.android';
import Zoomable from '../Zoomable';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99999,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});

export default class ModalTransitioner extends PureComponent {
  render() {
    const { open, transitioning, progress, source, onClosePress } = this.props;

    return (
      <View
        style={styles.container}
        pointerEvents={transitioning ? 'box-only' : open ? 'auto' : 'none'}
      >
        {open && <StatusBar animated barStyle="light-content" backgroundColor="black" />}
        <Animated.View style={[styles.background, { opacity: progress }]} />
        <Header progress={progress} onClosePress={onClosePress} />
        <Animated.View
          style={{
            flex: 1,
            transform: [
              {
                translateY: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('window').height, 0],
                }),
              },
            ],
          }}
        >
          <Animated.ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
            <Zoomable>
              <Image source={source} style={styles.image} fadeDuration={0} />
            </Zoomable>
          </Animated.ScrollView>
        </Animated.View>
      </View>
    );
  }
}
