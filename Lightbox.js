/**
 * @providesModule Lightbox
 */
'use strict';

var React = require('react-native');
var {
  PropTypes,
  View,
  TouchableHighlight,
  Animated,
  Children,
  cloneElement,
} = React;
var TimerMixin = require('react-timer-mixin');

var LightboxOverlay = require('./LightboxOverlay');

var Lightbox = React.createClass({
  mixins: [TimerMixin],

  propTypes: {
    activeProps:    PropTypes.object,
    renderHeader:   PropTypes.func,
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
      layoutOpacity: new Animated.Value(1),
    };
  },

  getOverlayProps: function() {
    var overlayContent = this.props.children;
    if(this.props.activeProps) {
      overlayContent = cloneElement(
        Children.only(overlayContent),
        this.props.activeProps
      );
    }
    return {
      isOpen: this.state.isOpen,
      width: this.state.width,
      height: this.state.height,
      origin: this.state.origin,
      renderHeader: this.props.renderHeader,
      swipeToDismiss: this.props.swipeToDismiss,
      children: overlayContent,
      onClose: this.onClose,
    };
  },

  open: function() {
    this._root.measure((ox, oy, width, height, px, py) => {
      this.props.onOpen();

      this.setState({
        isOpen: (this.props.navigator ? true : false),
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
        if(this.props.navigator) {
          var overlayContent = this.props.children;
          if(this.props.activeProps) {
            overlayContent = cloneElement(
              Children.only(overlayContent),
              this.props.activeProps
            );
          }
          var route = {
            component: LightboxOverlay,
            passProps: this.getOverlayProps(),
          };
          var routes = this.props.navigator.getCurrentRoutes();
          routes.push(route);
          this.props.navigator.immediatelyResetRouteStack(routes);
        } else {
          this.setState({
            isOpen: true,
          });
        }
        this.setTimeout(() => {
          this.state.layoutOpacity.setValue(0);
        });
      });
    });
  },

  close: function() {
    throw new Error('Lightbox.close method is deprecated. Use renderHeader(close) prop instead.')
  },

  onClose: function() {
    this.state.layoutOpacity.setValue(1);
    this.setState({
      isOpen: false,
    }, this.props.onClose);
    if(this.props.navigator) {
      var routes = this.props.navigator.getCurrentRoutes();
      routes.pop();
      this.props.navigator.immediatelyResetRouteStack(routes);
    }
  },

  render: function() {
    var layoutOpacityStyle = {
      opacity: this.state.layoutOpacity,
    };
    var overlay;
    if(!this.props.navigator) {
      var props = this.getOverlayProps();
      overlay = (
        <LightboxOverlay {...props} />
      );
    }

    // measure will not return anything useful if we dont attach a onLayout handler on android
    return (
      <View
        ref={component => this._root = component}
        style={this.props.style}
        onLayout={() => {}}
      >
        <Animated.View style={layoutOpacityStyle}>
          <TouchableHighlight
            underlayColor={this.props.underlayColor}
            onPress={this.open}
          >
            {this.props.children}
          </TouchableHighlight>
        </Animated.View>
        {overlay}
      </View>
    );
  }
});

module.exports = Lightbox;
