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
  Children,
  InteractionManager,
} = React;

var cloneElement = require('react-native-clone-referenced-element');

var DEVICE_HEIGHT = Dimensions.get('window').height;
var DEVICE_WIDTH = Dimensions.get('window').width;
var DRAG_DISMISS_THRESHOLD = 150;

var noop = function() {};

var LightboxOverlay = React.createClass({
  propTypes: {
    onOpeningTransitionStart: PropTypes.func,
    onOpeningTransitionEnd:   PropTypes.func,
    onClosingTransitionStart: PropTypes.func,
    onClosingTransitionEnd:   PropTypes.func,

    renderHeader: PropTypes.func,
    renderFooter: PropTypes.func,
    renderBackground: PropTypes.func,
    originElement: PropTypes.element,

    resizeMode: PropTypes.oneOf(['none', 'stretch', 'contain', 'cover']),
    isOpen:     PropTypes.bool,

    origin:     PropTypes.shape({
      x:        PropTypes.number,
      y:        PropTypes.number,
      width:    PropTypes.number,
      height:   PropTypes.number,
    }),
    target:     PropTypes.shape({
      x:        PropTypes.number,
      y:        PropTypes.number,
      width:    PropTypes.number,
      height:   PropTypes.number,
    }),
    springConfig: PropTypes.shape({
      tension:    PropTypes.number,
      friction:   PropTypes.number,
    }),
  },

  getInitialState: function() {
    return {
      isAnimating: false,
      isOpen: false,
      target: {
        opacity: 1,
        ...this.props.target
      },
      openVal: new Animated.Value(0),
    };
  },

  getDefaultProps: function() {
    return {
      onOpeningTransitionStart: noop,
      onOpeningTransitionEnd: noop,
      onClosingTransitionStart: noop,
      onClosingTransitionEnd: noop,
      springConfig: { tension: 30, friction: 7 },
      origin: {
        x: DEVICE_WIDTH/2,
        y: DEVICE_HEIGHT/2,
        width: 1,
        height: 1,
      },
      target: {
        x: 0,
        y: 0,
        width: DEVICE_WIDTH,
        height: DEVICE_HEIGHT,
      },
      isOpen: true,
      resizeMode: 'none',
    };
  },

  componentWillMount: function() {
    this._originElementSubscription = this.props.navigator.navigationContext.addListener('originElementChanged', event => {
      if(event.data.route === this.props.route) {
        this.setState({
          originElement: event.data.originElement
        });
      }
    });
  },

  componentWillUnmount: function() {
    this._originElementSubscription.remove();
  },

  _isContentRendered: false,
  contentDidLayout: function() {
    if(!this._isContentRendered && this.props.isOpen) {
      this.open();
    }
    this._isContentRendered = true;
  },

  open: function() {
    this.props.onOpeningTransitionStart();
    this.setState({
      isAnimating: true,
      target: {
        opacity: 1,
        ...this.props.target
      }
    }, () => {
      Animated.spring(
        this.state.openVal,
        { toValue: 1, ...this.props.springConfig }
      ).start(() => {
        this.setState({
          isAnimating: false,
          isOpen: true,
        }, this.props.onOpeningTransitionEnd);
      });
    });
  },

  close: function(cb) {
    if(this.props.onClosingTransitionStart) {
      this.props.onClosingTransitionStart();
    }
    this.setState({
      isAnimating: true,
    }, () => {
      Animated.spring(
        this.state.openVal,
        { toValue: 0, ...this.props.springConfig }
      ).start(() => {
        this.setState({
          isAnimating: false,
          isOpen: false,
        }, () => {
          if(cb) {
            cb();
          }
          if(this.props.onClosingTransitionEnd) {
            this.props.onClosingTransitionEnd();
          }
        });
      });
    });
  },

  componentWillReceiveProps: function(props) {
    if(this.props.isOpen != props.isOpen && props.isOpen) {
      this.open();
    }
  },

  _createInterpolation: function(fromValue, toValue) {
    return this.state.openVal.interpolate({
      inputRange: [0, 1],
      outputRange: [fromValue, toValue]
    });
  },

  render: function() {
    var {
      renderBackground,
      renderHeader,
      renderFooter,
      origin,
      resizeMode,
    } = this.props;

    var {
      isAnimating,
      isOpen,
      openVal,
      target,
    } = this.state;

    var originElement = this.state.originElement || this.props.originElement;

    var openStyle = [styles.open];
    if(resizeMode !== 'none') {
      var scaleX = origin.width / target.width;
      var scaleY = origin.height / target.height;
      if(resizeMode === 'contain') {
        scaleY = scaleX = Math.min(scaleX, scaleY);
      } else if(resizeMode === 'cover') {
        scaleY = scaleX = Math.max(scaleX, scaleY);
      }
      // Offset scale shrinking
      var deltaX = (target.width - origin.width)/-2;
      var deltaY = (target.height - origin.height)/-2;

      openStyle.push({
        left:   this._createInterpolation(origin.x + deltaX, target.x),
        top:    this._createInterpolation(origin.y + deltaY, target.y),
        width:  target.width,
        height: target.height,
        transform: [{
          scaleX: this._createInterpolation(scaleX , 1),
        },{
          scaleY: this._createInterpolation(scaleY, 1),
        }]
      });
    } else {
      openStyle.push({
        left:   this._createInterpolation(origin.x, target.x),
        top:    this._createInterpolation(origin.y, target.y),
        width:  this._createInterpolation(origin.width, target.width),
        height: this._createInterpolation(origin.height, target.height),
      });
    }

    var preview = originElement && cloneElement(
      Children.only(originElement),
      {
        style: [
          openStyle,
          { opacity: !this._isContentRendered || isAnimating ? 1 : 0 },
        ],
      }
    );

    var content = (
      <Animated.View
        onLayout={this.contentDidLayout}
        style={[
          preview ? {
            flex: 1,
            opacity: !this._isContentRendered || isAnimating ? 0 : 1
          } : openStyle
        ]}
      >{this.props.children}</Animated.View>
    );

    return (
      <View style={styles.container}>
        {renderBackground && renderBackground(openVal)}
        {preview}
        {content}
        {renderHeader && renderHeader(openVal)}
        {renderFooter && renderFooter(openVal)}
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  open: {
    position: 'absolute',
    flex: 1,
  },
});

module.exports = LightboxOverlay;
