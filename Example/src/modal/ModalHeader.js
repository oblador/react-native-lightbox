import React, { PureComponent } from 'react';
import { Animated, Button, StyleSheet } from 'react-native';
import { SAFE_INSET_TOP } from '../constants';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'flex-start',
    top: SAFE_INSET_TOP,
    right: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
  },
});

export default class ModalHeader extends PureComponent {
  render() {
    return (
      <Animated.View
        style={[styles.container, { opacity: this.props.opacity }]}
        pointerEvents="box-none"
      >
        <Button onPress={this.props.onClosePress} title="Close" />
      </Animated.View>
    );
  }
}
