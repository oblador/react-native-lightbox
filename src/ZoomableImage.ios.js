import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
});

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

  render() {
    return (
      <ScrollView
        style={this.props.style || styles.container}
        contentContainerStyle={styles.contentContainer}
        centerContent
        minimumZoomScale={this.props.minimumZoomScale}
        maximumZoomScale={this.props.maximumZoomScale}
      >
        <Image source={this.props.source} resizeMode={this.props.resizeMode} style={styles.image} />
      </ScrollView>
    );
  }
}
