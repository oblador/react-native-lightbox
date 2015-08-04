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
} = React;

var Overlay = require('react-native-overlay');

var WINDOW_HEIGHT = Dimensions.get('window').height;
var WINDOW_WIDTH = Dimensions.get('window').width;
var SPRING_CONFIG = { tension: 30, friction: 7 };

var Lightbox = React.createClass({
  propTypes: {
    header:   PropTypes.element,
    onOpen:   PropTypes.func,
    onClose:  PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      onOpen: () => {},
      onClose: () => {},
    };
  },

  getInitialState: function() {
    return {
      isOpen: false,
      width: 0,
      height: 0,
      pan: new Animated.ValueXY(),
      openVal: new Animated.Value(0),
      layoutOpacity: new Animated.Value(1),
    };
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
      this.state.layoutOpacity.setValue(0);
      this.setState({
        isOpen: true,
        width,
        height,
        x: px,
        y: py,
      }, () => {
        Animated.spring(this.state.openVal, {toValue: 1, ...SPRING_CONFIG}).start();
      });
    });
  },

  close: function() {
    StatusBarIOS.setHidden(false, 'fade');
    Animated.spring(this.state.openVal, {toValue: 0, ...SPRING_CONFIG}).start(() => {
      this.setState({ isOpen: false }, this.props.onClose);
      this.state.layoutOpacity.setValue(1);
    });
  },

  render: function() {
    var { header } = this.props;
    var { isOpen, layoutOpacity, openVal, x, y, width, height } = this.state;

    var layoutOpacityStyle = {
      opacity: layoutOpacity,
    };
    var lightboxOpacityStyle = {
      opacity: openVal,
    };
    var openStyle = [styles.open, {
      left: openVal.interpolate({inputRange: [0, 1], outputRange: [x, 0]}),
      top: openVal.interpolate({inputRange: [0, 1], outputRange: [y, 0]}),
      width: openVal.interpolate({inputRange: [0, 1], outputRange: [width, WINDOW_WIDTH]}),
      height: openVal.interpolate({inputRange: [0, 1], outputRange: [height, WINDOW_HEIGHT]}),
    }];

    if(!header) {
      header = (<TouchableOpacity onPress={this.toggle}><Text style={styles.closeButton}>×</Text></TouchableOpacity>);
    }

    return (
      <View
        ref={component => this._root = component}
        style={this.props.style}
      >
        <Animated.View style={layoutOpacityStyle}>
          <TouchableHighlight onPress={this.toggle}>{this.props.children}</TouchableHighlight>
        </Animated.View>
        <Overlay isVisible={this.state.isOpen}>
          <Animated.View style={[styles.background, lightboxOpacityStyle]}></Animated.View>
          <Animated.View style={openStyle}>
            {this.props.children}
          </Animated.View>
          <Animated.View style={[styles.header, lightboxOpacityStyle]}>
            {header}
          </Animated.View>
        </Overlay>
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
