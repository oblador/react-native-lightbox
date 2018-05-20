import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet } from 'react-native';

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

  render() {
    return (
      <ScrollView
        centerContent
        contentContainerStyle={styles.contentContainer}
        maximumZoomScale={this.props.maximumZoomScale}
        minimumZoomScale={this.props.minimumZoomScale}
        style={this.props.style || styles.container}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}
