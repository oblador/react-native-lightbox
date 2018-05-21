import React, { PureComponent } from 'react';
import { Animated, Dimensions, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import Header from './ModalHeader';
import Carousel from '../Carousel';
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
  verticalScrollView: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});

const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class ModalTransitioner extends PureComponent {
  state = {
    dismissing: false,
    zoomed: false,
  };

  scrollYValue = new Animated.Value(DEVICE_HEIGHT);
  dismissValue = this.scrollYValue.interpolate({
    inputRange: [DEVICE_HEIGHT / 2, DEVICE_HEIGHT, DEVICE_HEIGHT * 3 / 2],
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
  });

  handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: this.scrollYValue } } }], {
    useNativeDriver: true,
  });

  handleScrollEndDrag = event => {
    const targetY = event.nativeEvent.targetContentOffset.y;
    if ((!this.state.dismissing && targetY <= 0) || targetY >= 2 * DEVICE_HEIGHT) {
      this.setState({ dismissing: true }, this.props.onClose);
    }
  };

  handleZoomScaleChange = zoomScale => {
    this.setState({ zoomed: zoomScale !== 1 });
  };

  renderImage = ({ source }) => {
    const { ImageComponent, resizeMode } = this.props;
    return (
      <Zoomable onZoomScaleChange={this.handleZoomScaleChange}>
        <ImageComponent
          source={source}
          style={styles.image}
          resizeMode={resizeMode}
          fadeDuration={0}
        />
      </Zoomable>
    );
  };

  render() {
    const { open, transitioning, initialIndex, images, onClose, progress } = this.props;
    const chromeOpacity = Animated.multiply(progress, this.dismissValue);

    return (
      <View
        style={styles.container}
        pointerEvents={transitioning ? 'box-only' : open ? 'auto' : 'none'}
      >
        {open && <StatusBar animated barStyle="light-content" backgroundColor="black" />}
        <Animated.View style={[styles.background, { opacity: chromeOpacity }]} />
        <Header opacity={chromeOpacity} onClosePress={onClose} />
        <Animated.View
          style={{
            flex: 1,
            transform: this.state.dismissing
              ? undefined
              : [
                  {
                    translateY: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [Dimensions.get('window').height, 0],
                    }),
                  },
                ],
          }}
        >
          <Animated.ScrollView
            style={styles.verticalScrollView}
            pagingEnabled
            pinchGestureEnabled={false}
            scrollEnabled={!this.state.zoomed}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}
            contentOffset={{ x: 0, y: DEVICE_HEIGHT }}
            contentContainerStyle={{ height: DEVICE_HEIGHT * 3, paddingVertical: DEVICE_HEIGHT }}
            onScrollEndDrag={this.handleScrollEndDrag}
            onScroll={this.handleScroll}
          >
            <Carousel initialIndex={initialIndex} images={images} renderImage={this.renderImage} />
          </Animated.ScrollView>
        </Animated.View>
      </View>
    );
  }
}
