import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

export default class Zoomable extends PureComponent {
  static propTypes = {
    minimumZoomScale: PropTypes.number,
    maximumZoomScale: PropTypes.number,
  };

  static defaultProps = {
    minimumZoomScale: 1,
    maximumZoomScale: 3,
  };

  zoomScale = 1;

  handlePress = () => {
    if (this.zoomScale !== 1) {
      if (this.scrollView) {
        this.zoomScale = 1;
        this.scrollView.setNativeProps({ zoomScale: 1 });
      }
    }
  };

  handleRef = ref => {
    this.scrollView = ref;
  };

  handleScroll = event => {
    this.zoomScale = event.nativeEvent.zoomScale;
  };

  render() {
    return (
      <ScrollView
        centerContent
        contentContainerStyle={styles.contentContainer}
        maximumZoomScale={this.props.maximumZoomScale}
        minimumZoomScale={this.props.minimumZoomScale}
        onScrollEndDrag={this.handleScroll}
        ref={this.handleRef}
        scrollsToTop={false}
        style={this.props.style || styles.container}
      >
        <TouchableWithoutFeedback onPress={this.handlePress}>
          {this.props.children}
        </TouchableWithoutFeedback>
      </ScrollView>
    );
  }
}
