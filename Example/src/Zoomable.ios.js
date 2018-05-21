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
    onZoomScaleChange: PropTypes.func,
  };

  static defaultProps = {
    minimumZoomScale: 1,
    maximumZoomScale: 3,
  };

  state = {
    zoomScale: 1,
  };

  handlePress = () => {
    if (this.state.zoomScale !== 1) {
      this.setState({ zoomScale: 1 });
      if (this.props.onZoomScaleChange) {
        this.props.onZoomScaleChange(1);
      }
    }
  };

  handleRef = ref => {
    this.scrollView = ref;
  };

  handleScrollEndDrag = event => {
    const { zoomScale } = event.nativeEvent;
    if (this.state.zoomScale !== zoomScale) {
      this.setState({ zoomScale });
      if (this.props.onZoomScaleChange) {
        this.props.onZoomScaleChange(zoomScale);
      }
    }
  };

  render() {
    return (
      <ScrollView
        centerContent
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={this.state.zoomScale !== 1}
        zoomScale={this.state.zoomScale}
        maximumZoomScale={this.props.maximumZoomScale}
        minimumZoomScale={this.props.minimumZoomScale}
        onScrollEndDrag={this.handleScrollEndDrag}
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
