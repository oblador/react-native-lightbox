/**
 * @providesModule LightboxOverlay
 */
'use strict';

var React = require('react-native');
var {
  PropTypes,
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  StatusBarIOS,
  Modal,
  Platform,
} = React;

var WINDOW_HEIGHT = Dimensions.get('window').height;
var WINDOW_WIDTH = Dimensions.get('window').width;
var SPRING_CONFIG = { tension: 30, friction: 7 };
var DRAG_DISMISS_THRESHOLD = 150;
var STATUS_BAR_OFFSET = (Platform.OS === 'android' ? -25 : 0);

var LightboxOverlay = React.createClass({
  getInitialState: function() {
    return {
      isAnimating: false,
      isPanning: false,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      },
      pan: new Animated.Value(0),
      openVal: new Animated.Value(0),
      layoutOpacity: new Animated.Value(1),
    };
  },

  componentWillMount: function() {
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
            {toValue: 0, ...SPRING_CONFIG}
          ).start(() => { this.setState({ isPanning: false }); });
        }
      },
    });
    if(this.props.isOpen) {
      this.open();
    }
  },

  open: function() {
    if(StatusBarIOS) {
      StatusBarIOS.setHidden(true, 'fade');
    }
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
      { toValue: 1, ...SPRING_CONFIG }
    ).start(() => this.setState({ isAnimating: false }));
  },

  close: function() {
    if(StatusBarIOS) {
      StatusBarIOS.setHidden(false, 'fade');
    }
    this.setState({
      isAnimating: true,
    });
    Animated.spring(
      this.state.openVal,
      { toValue: 0, ...SPRING_CONFIG }
    ).start(() => {
      this.props.onClose();
      // Delay isOpen until next tick to avoid flicker.
      setTimeout(() => {
        this.setState({
          isAnimating: false,
        });
      });
    });
  },

  componentWillReceiveProps: function(props) {
    if(this.props.isOpen != props.isOpen) {
      if(props.isOpen) {
        this.open();
      }
    }
  },

  render: function() {
    var {
      isOpen,
      renderHeader,
      swipeToDismiss,
      origin,
      width,
      height,
    } = this.props;

    var {
      isPanning,
      isAnimating,
      openVal,
      target,
    } = this.state;


    var lightboxOpacityStyle = {
      opacity: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.opacity, target.opacity]})
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
      width:  openVal.interpolate({inputRange: [0, 1], outputRange: [width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [height, WINDOW_HEIGHT]}),
    }];

    var background = (<Animated.View style={[styles.background, lightboxOpacityStyle]}></Animated.View>);
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
      <Modal visible={isOpen} transparent={true}>
        {background}
        {content}
        {header}
      </Modal>
    );
  }
});

var styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: 'black',
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

module.exports = LightboxOverlay;
