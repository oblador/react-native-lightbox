import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet } from 'react-native';

export default class Background extends Component {
  static propTypes = {
    color: PropTypes.string.isRequired,
    openProgress: PropTypes.object.isRequired,
    dismissProgress: PropTypes.object.isRequired,
  };

  static defaultProps = {
    color: 'black',
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.color !== this.props.color || nextProps.openProgress !== this.props.openProgress || nextProps.dismissProgress !== this.props.dismissProgress
  }

  render() {
    return (
      <Animated.View style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: this.props.color,
        opacity: Animated.multiply(this.props.openProgress, this.props.dismissProgress),
      }} />
    );
  }
}
