import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, View, ScrollView, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default class Carousel extends PureComponent {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.any).isRequired,
    initialIndex: PropTypes.number,
    gutterWidth: PropTypes.number,
    renderImage: PropTypes.func,
    onIndexChange: PropTypes.func,
  };

  static defaultProps = {
    initialIndex: 0,
    gutterWidth: 30,
  };

  constructor(props) {
    super(props);

    this.state = {
      currentIndex: this.props.initialIndex,
      didScroll: false,
    };
  }

  isInitialScroll = true;

  getSnapToInterval = () => Dimensions.get('window').width + this.props.gutterWidth

  handleScroll = event => {
    if (this.isInitialScroll) {
      // Because of a bug in RN the initial onScroll event is always
      // offset x: 0 despite `contentOffset` prop. So we'll just ignore it.
      this.isInitialScroll = false;
      return;
    }
    const { images, renderImage, onIndexChange } = this.props;
    const snapToInterval = this.getSnapToInterval();
    const scrollX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollX / snapToInterval);
    if (this.state.currentIndex !== currentIndex) {
      this.setState({ currentIndex });
      if (onIndexChange) {
        onIndexChange(currentIndex);
      }
    } else if (!this.state.didScroll) {
      this.setState({ didScroll: true });
    }
  };

  render() {
    const { gutterWidth, images, initialIndex, renderImage } = this.props;
    const pageWidth = Dimensions.get('window').width;
    const snapToInterval = this.getSnapToInterval();
    const indicesToRender = this.state.didScroll
      ? Array(3)
          .fill(this.state.currentIndex - 1)
          .map((start, i) => start + i)
          .filter(i => i >= 0 && i < images.length)
      : [this.state.currentIndex];

    return (
      <ScrollView
        ref={this.handleRef}
        scrollsToTop={false}
        horizontal
        showsHorizontalScrollIndicator={false}
        pinchGestureEnabled={false}
        decelerationRate="fast"
        snapToInterval={snapToInterval}
        snapToAlignment="start"
        scrollEventThrottle={16}
        onScroll={this.handleScroll}
        style={this.props.style || styles.container}
        contentOffset={{ x: initialIndex * snapToInterval }}
        contentContainerStyle={{ width: snapToInterval * images.length - gutterWidth }}
      >
        {indicesToRender.map(index => (
          <View
            key={images[index].id}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: index * snapToInterval,
              width: pageWidth,
            }}
          >
            {renderImage(images[index])}
          </View>
        ))}
      </ScrollView>
    );
  }
}
