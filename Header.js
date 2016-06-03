'use strict';

var React = require('react');
var {
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
} = require('react-native');

var LightboxHeader = React.createClass({
  render: function() {
    return (
      <Animated.View style={[styles.header, this.props.style]} pointerEvents="box-none">
        {
          this.props.children ||
          (<TouchableOpacity style={styles.closeButton} onPress={event => this.props.navigator.pop()}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>)
        }
      </Animated.View>
    );
  },
});

var styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  closeButton: {
    width: 40,
  },
  closeButtonText: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
});

module.exports = LightboxHeader;
