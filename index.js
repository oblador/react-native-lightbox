/**
 * @providesModule Lightbox
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
  LayoutAnimation,
  PanResponder,
  TouchableHighlight,
  TouchableOpacity,
  StatusBarIOS,
  Modal,
  cloneElement,
} = React;

var onlyChild = require('react-native/node_modules/react-tools/src/isomorphic/children/onlyChild');

var WINDOW_HEIGHT = Dimensions.get('window').height;
var WINDOW_WIDTH = Dimensions.get('window').width;
var SPRING_CONFIG = { tension: 30, friction: 7 };
var DRAG_DISMISS_THRESHOLD = 150;

var Lightbox = React.createClass({
  propTypes: {
    activeProps:    PropTypes.object,
    header:         PropTypes.element,
    underlayColor:  PropTypes.string,
    onOpen:         PropTypes.func,
    onClose:        PropTypes.func,
    swipeToDismiss: PropTypes.bool,
  },
  getDefaultProps: function() {
    return {
      swipeToDismiss: true,
      onOpen: () => {},
      onClose: () => {},
    };
  },

  getInitialState: function() {
    return {
      isOpen: false,
      isAnimating: false,
      isPanning: false,
      width: 0,
      height: 0,
      target: {
        x: 0,
        y: 0,
        opacity: 1,
      },
      origin: {
        x: 0,
        y: 0,
        opacity: 0,
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
  },

  toggle: function() {
    if(this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open: function() {
    this._root.measure((ox, oy, width, height, px, py) => {
      StatusBarIOS.setHidden(true, 'fade');
      this.props.onOpen();
      this.state.pan.setValue(0);

      this.setState({
        isOpen: true,
        isAnimating: true,
        width,
        height,
        target: {
          x: 0,
          y: 0,
          opacity: 1,
        },
        origin: {
          x: px,
          y: py,
          opacity: 0,
        },
      }, () => {
        this.state.layoutOpacity.setValue(0);
        Animated.spring(
          this.state.openVal,
          { toValue: 1, ...SPRING_CONFIG }
        ).start(() => this.setState({ isAnimating: false }));
      });
    });
  },

  close: function() {
    StatusBarIOS.setHidden(false, 'fade');
    this.setState({
      isAnimating: true,
    });
    Animated.spring(
      this.state.openVal,
      { toValue: 0, ...SPRING_CONFIG }
    ).start(() => {
      this.state.layoutOpacity.setValue(1);
      // Delay isOpen until next tick to avoid flicker.
      setTimeout(() => {
        this.setState({
          isOpen: false,
          isAnimating: false,
        },
          this.props.onClose
        );
      });
    });
  },

  render: function() {
    var {
      header,
      swipeToDismiss,
    } = this.props;

    var {
      isOpen,
      isPanning,
      isAnimating,
      layoutOpacity,
      openVal,
      origin,
      target,
      width,
      height,
    } = this.state;


    var layoutOpacityStyle = {
      opacity: layoutOpacity,
    };
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
      left: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.x, target.x]}),
      top: openVal.interpolate({inputRange: [0, 1], outputRange: [origin.y, target.y]}),
      width: openVal.interpolate({inputRange: [0, 1], outputRange: [width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [height, WINDOW_HEIGHT]}),
    }];

    if(!header) {
      header = (
        <TouchableOpacity onPress={this.toggle}>
          <Text style={styles.closeButton}>×</Text>
        </TouchableOpacity>
      );
    }

    var overlayContent = this.props.children;
    if(this.props.activeProps) {
      overlayContent = cloneElement(
        onlyChild(overlayContent),
        this.props.activeProps
      );
    }

    return (
      <View
        ref={component => this._root = component}
        style={this.props.style}
      >
        <Animated.View style={layoutOpacityStyle}>
          <TouchableHighlight
            underlayColor={this.props.underlayColor}
            onPress={this.toggle}
          >
            {this.props.children}
          </TouchableHighlight>
        </Animated.View>
        <Modal visible={this.state.isOpen} transparent={true}>
          <Animated.View style={[styles.background, lightboxOpacityStyle]}></Animated.View>
          <Animated.View style={[openStyle, dragStyle]} {...handlers}>
            {overlayContent}
          </Animated.View>
          <Animated.View style={[styles.header, lightboxOpacityStyle]}>
            {header}
          </Animated.View>
        </Modal>
      </View>
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

module.exports = Lightbox;
