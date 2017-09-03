/**
 * @providesModule LightboxOverlay
 */
'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Animated, Dimensions, Modal, PanResponder, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

var WINDOW_HEIGHT = Dimensions.get('window').height;
var WINDOW_WIDTH = Dimensions.get('window').width;
var DRAG_DISMISS_THRESHOLD = 150;
var STATUS_BAR_OFFSET = (Platform.OS === 'android' ? -25 : 0);

class LightboxOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAnimating: false,
      isPanning: false,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      },
      pan: new Animated.Value(0),
      openVal: new Animated.Value(0),
    }
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => !this.state.isAnimating,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => !this.state.isAnimating,
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.state.isAnimating,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => !this.state.isAnimating,

      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setValue(0);
        this.setState({ isPanning: true });
      },
      onPanResponderMove: Animated.event([
        null,
        {dy: this.state.pan}
      ]),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        if(Math.abs(gestureState.dy) > DRAG_DISMISS_THRESHOLD) {
          this.setState({
            isPanning: false,
            target: {
              y: gestureState.dy,
              x: gestureState.dx,
              opacity: 1 - Math.abs(gestureState.dy / WINDOW_HEIGHT)
            }
          });
          this.close();
        } else {
          Animated.spring(
            this.state.pan,
            {toValue: 0, ...this.props.springConfig}
          ).start(() => { this.setState({ isPanning: false }); });
        }
      },
    });
  }

  componentDidMount() {
    if(this.props.isOpen) {
      this.open();
    }
  }

  open = () => {
    StatusBar.setHidden(true, 'fade');
    this.state.pan.setValue(0);
    this.setState({
      isAnimating: true,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      }
    });

    Animated.spring(
      this.state.openVal,
      { toValue: 1, ...this.props.springConfig }
    ).start(() => this.setState({ isAnimating: false }));
  }

  close = () => {
    StatusBar.setHidden(false, 'fade');
    this.setState({
      isAnimating: true,
    });
    Animated.spring(
      this.state.openVal,
      { toValue: 0, ...this.props.springConfig }
    ).start(() => {
      this.setState({
        isAnimating: false,
      });
      this.props.onClose();
    });
  }

  componentWillReceiveProps(props) {
    if(this.props.isOpen != props.isOpen && props.isOpen) {
      this.open();
    }
  }

  render() {
    var {
      isOpen,
      renderHeader,
      swipeToDismiss,
      origin,
      backgroundColor,
    } = this.props;

    var {
      isPanning,
      isAnimating,
      openVal,
      target,
    } = this.state;


    var lightboxOpacityStyle = {
      opacity: openVal.interpolate({inputRange: [0, 1], outputRange: [0, target.opacity]})
    };

    var handlers;
    if(swipeToDismiss) {
      handlers = this._panResponder.panHandlers;
    }

    var dragStyle;
    if(isPanning) {
      dragStyle = {
        top: this.state.pan,
      };
      lightboxOpacityStyle.opacity = this.state.pan.interpolate({inputRange: [-WINDOW_HEIGHT, 0, WINDOW_HEIGHT], outputRange: [0, 1, 0]});
    }

    var openStyle = [styles.open, {
      left:   openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
      top:    openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y + STATUS_BAR_OFFSET, target.y + STATUS_BAR_OFFSET]}),
      width:  openVal.interpolate({inputRange: [0, 1], outputRange: [origin.width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.height, WINDOW_HEIGHT]}),
    }];

    var background = (<Animated.View style={[styles.background, { backgroundColor: backgroundColor }, lightboxOpacityStyle]}></Animated.View>);
    var header = (<Animated.View style={[styles.header, lightboxOpacityStyle]}>{(renderHeader ?
      renderHeader(this.close) :
      (
        <TouchableOpacity onPress={this.close}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      )
    )}</Animated.View>);
    var content = (
      <Animated.View style={[openStyle, dragStyle]} {...handlers}>
        {this.props.children}
      </Animated.View>
    );
    if(this.props.navigator) {
      return (
        <View>
          {background}
          {content}
          {header}
        </View>
      );
    }
    return (
      <Modal visible={isOpen} transparent={true} onRequestClose={() => null}>
        {background}
        {content}
        {header}
      </Modal>
    );
  }
}

LightboxOverlay.propTypes = {
  origin: PropTypes.shape({
    x:        PropTypes.number,
    y:        PropTypes.number,
    width:    PropTypes.number,
    height:   PropTypes.number,
  }),
  springConfig: PropTypes.shape({
    tension:  PropTypes.number,
    friction: PropTypes.number,
  }),
  backgroundColor: PropTypes.string,
  isOpen:          PropTypes.bool,
  renderHeader:    PropTypes.func,
  onOpen:          PropTypes.func,
  onClose:         PropTypes.func,
  swipeToDismiss:  PropTypes.bool,
}

LightboxOverlay.defaultProps = {
  springConfig: { tension: 30, friction: 7 },
  backgroundColor: 'black',
}

var styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  },
  open: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    // Android pan handlers crash without this declaration:
    backgroundColor: 'transparent',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    backgroundColor: 'transparent',
  },
  closeButton: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    width: 40,
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

export default LightboxOverlay
