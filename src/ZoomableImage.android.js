import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});

const calculateDistance = (x0, y0, x1, y1) =>
  Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));

const calculateTouchDistance = touches =>
  calculateDistance(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);

const clamp = (value, max, min) => Math.max(Math.min(value, max), min);

export default class ZoomableImage extends PureComponent {
  static propTypes = {
    source: PropTypes.any.isRequired,
    resizeMode: PropTypes.string.isRequired,
    minimumZoomScale: PropTypes.number,
    maximumZoomScale: PropTypes.number,
  };

  static defaultProps = {
    minimumZoomScale: 1,
    maximumZoomScale: 3,
    resizeMode: 'contain',
  };

  constructor(props) {
    super(props);

    const initialScale = 1;
    const initialOffset = { x: 0, y: 0 };

    this.scale = initialScale;
    this.scaleValue = new Animated.Value(initialScale);

    this.offset = initialOffset;
    this.offsetValue = new Animated.ValueXY(initialOffset.x, initialOffset.y);

    this.startOffset = initialOffset;
    this.startScale = initialScale;
    this.startDistance = 0.1;

    this.size = { width: 0, height: 0 };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) =>
        gestureState.dx > 2 || gestureState.dy > 2 || gestureState.numberActiveTouches === 2,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,
      onPanResponderGrant: (event, gestureState) => {
        this.startOffset = this.offset;
        this.startScale = this.scale;
        if (gestureState.numberActiveTouches === 2) {
          this.startDistance = calculateTouchDistance(event.nativeEvent.touches);
        }
      },
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.numberActiveTouches === 1) {
          const offset = this.calculateOffset(gestureState);
          this.offset = offset;
          this.offsetValue.setValue(offset);
        } else if (gestureState.numberActiveTouches === 2) {
          const scale = this.calculateScale(event.nativeEvent.touches);
          this.scale = scale;
          this.scaleValue.setValue(scale);
        }
      },
      onPanResponderTerminationRequest: (event, gestureState) => false,
      onPanResponderRelease: (event, gestureState) => {
        const scale = clamp(this.scale, this.props.maximumZoomScale, this.props.minimumZoomScale);
        const verticalLeeway = (scale - 1) * this.size.height / scale / 2;
        const horizontalLeeway = (scale - 1) * this.size.width / scale / 2;
        const offset = {
          x: clamp(this.offset.x, horizontalLeeway, -horizontalLeeway),
          y: clamp(this.offset.y, verticalLeeway, -verticalLeeway),
        };

        if (scale !== this.scale) {
          Animated.timing(this.scaleValue, { toValue: scale, duration: 300 }).start();
        }
        if (offset.x !== this.offset.x || offset.y !== this.offset.y) {
          Animated.spring(this.offsetValue, { toValue: offset, duration: 300 }).start();
        }
        this.scale = scale;
        this.offset = offset;
      },
      onShouldBlockNativeResponder: (event, gestureState) => false,
    });
  }

  calculateOffset = gestureState => ({
    x: this.startOffset.x + gestureState.dx / this.scale,
    y: this.startOffset.y + gestureState.dy / this.scale,
  });

  calculateScale = touches =>
    calculateTouchDistance(touches) / this.startDistance * this.startScale;

  handleLayout = event => {
    const { width, height } = event.nativeEvent.layout;
    this.size = { width, height };
  };

  render() {
    return (
      <View
        style={this.props.style || styles.container}
        onLayout={this.handleLayout}
        {...this.panResponder.panHandlers}
      >
        <Animated.Image
          source={this.props.source}
          resizeMode={this.props.resizeMode}
          style={{
            flex: 1,
            width: null,
            height: null,
            transform: [
              { scale: this.scaleValue },
              { translateX: this.offsetValue.x },
              { translateY: this.offsetValue.y },
            ],
          }}
          fadeDuration={0}
        />
      </View>
    );
  }
}
