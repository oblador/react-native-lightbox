import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SAFE_INSET_TOP } from './constants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'flex-start',
    top: SAFE_INSET_TOP,
    right: 0,
    left: 0,
    zIndex: 1,
  },
  button: {
    padding: 10,
  },
  cross: {
    color: 'white',
    backgroundColor: 'transparent',
    fontSize: 40,
    lineHeight: 32,
  },
});

export default class Header extends Component {
  static propTypes = {
    onClosePress: PropTypes.func.isRequired,
    openProgress: PropTypes.object.isRequired,
    dismissProgress: PropTypes.object.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.onClosePress !== this.props.onClosePress || nextProps.openProgress !== this.props.openProgress || nextProps.dismissProgress !== this.props.dismissProgress
  }

  render() {
    return (
      <Animated.View
        style={[styles.container, { opacity: Animated.multiply(this.props.openProgress, this.props.dismissProgress) }]}
        pointerEvents="box-none"
      >
        <TouchableOpacity onPress={this.props.onClosePress} style={styles.button}>
          <Text style={styles.cross}>&times;</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
