import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPagerAndroid, StyleSheet } from 'react-native';

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

  handleScroll = event => {
    const { onIndexChange } = this.props;
    const { offset, position } = event.nativeEvent;
    const currentIndex = Math.round(position + offset);
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
    const indicesToRender = this.state.didScroll
      ? Array(3)
          .fill(this.state.currentIndex - 1)
          .map((start, i) => start + i)
          .filter(i => i >= 0 && i < images.length)
      : [this.state.currentIndex];

    return (
      <ViewPagerAndroid
        initialPage={initialIndex}
        pageMargin={gutterWidth}
        onPageScroll={this.handleScroll}
        style={this.props.style || styles.container}
      >
        {images.map((image, index) => (
          <View key={image.id}>
            {indicesToRender.includes(index) && renderImage(images[index])}
          </View>
        ))}
      </ViewPagerAndroid>
    );
  }
}
