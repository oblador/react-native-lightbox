'use strict';

var pick = require('lodash/object/pick');
var React = require('react');
var {
  PropTypes
} = React;
var {
  StyleSheet,
  Image,
  View,
  ScrollView,
  TouchableHighlight,
  Animated,
  Children,
  Dimensions,
  StatusBar,
  Platform,
} = require('react-native');

var DEVICE_HEIGHT = Dimensions.get('window').height;
var DEVICE_WIDTH = Dimensions.get('window').width;
var DRAG_DISMISS_THRESHOLD = 120;
var STATUS_BAR_OFFSET = (Platform.OS === 'android' ? 25 : 0);

var LightboxOverlay = require('./Overlay');
var LightboxHeader = require('./Header');
var ZoomableImage = require('./ZoomableImage');

var Lightbox = React.createClass({
  propTypes: {
    navigator:          PropTypes.object.isRequired,
    activeProps:        PropTypes.object,
    routeProps:         PropTypes.object,
    renderHeader:       PropTypes.func,
    renderFooter:       PropTypes.func,
    renderBackground:   PropTypes.func,
    underlayColor:      PropTypes.string,
    onOpen:             PropTypes.func,
    onClose:            PropTypes.func,
    onSourceChange:     PropTypes.func,
    springConfig:       PropTypes.shape({
      tension:          PropTypes.number,
      friction:         PropTypes.number,
    }),
    hidesStatusBar:     PropTypes.bool,
    lightboxResizeMode: PropTypes.oneOf(['none', 'stretch', 'contain', 'cover']),
    imageComponent:     PropTypes.func,
    maximumZoomScale:   PropTypes.number,
    minimumZoomScale:   PropTypes.number,
    swipeToDismiss:     PropTypes.bool,
    touchableComponent: PropTypes.func,
  },

  _offsetY: 0,

  getDefaultProps: function() {
    return {
      swipeToDismiss: true,
      hidesStatusBar: true,
      maximumZoomScale: 1,
      minimumZoomScale: 1,
      imageComponent: Image,
      touchableComponent: TouchableHighlight,
      routeProps: {
        name: 'lightbox-image',
      },
      activeProps: {
        style: {}
      }
    };
  },

  getInitialState: function() {
    return {
      origin: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
      layoutOpacity: new Animated.Value(1),
      sourceIndex: 0,
    };
  },

  open: function() {
    this._root.measure((ox, oy, width, height, px, py) => {
      var origin = {
        width,
        height,
        x: px,
        y: py - STATUS_BAR_OFFSET,
      }
      var ImageComponent = this.props.imageComponent;
      var AnimatedImage = Animated.createAnimatedComponent(ImageComponent);
      var transitionProps = pick(this.props, Object.keys(LightboxOverlay.propTypes));

      var sources = Array.isArray(this.props.source) ? this.props.source : [this.props.source];
      var isGallery = sources.length > 1;
      var isZoomable = this.props.minimumZoomScale !== this.props.maximumZoomScale;
      var children = this.props.children;
      var imageProps = { ...this._getImageProps(), ...this.props.activeProps };

      var route = {
        type: 'LightboxImage',
        component: ImageComponent,
        passProps: {
          children: children,
          ...imageProps,
        },
        transitionProps: {
          ...transitionProps,
          resizeMode: this.props.lightboxResizeMode || 'none',
          origin,
          renderHeader: this._renderHeader,
          renderFooter: this._renderFooter,
          renderBackground: this._renderBackground,
          hidesPreviousSceneAfterTransition: false,
          onOpeningTransitionStart: () => {
            if(this.props.hidesStatusBar && StatusBar) {
              StatusBar.setHidden(true, true);
            }
            if(this.props.onOpeningTransitionStart) {
              this.props.onOpeningTransitionStart();
            }
            this.state.layoutOpacity.setValue(0);
          },
          onClosingTransitionStart: () => {
            if(this.props.hidesStatusBar && StatusBar) {
              StatusBar.setHidden(false, true);
            }
            if(this.props.onClosingTransitionStart) {
              this.props.onClosingTransitionStart();
            }
          },
          onClosingTransitionEnd: () => {
            this.state.layoutOpacity.setValue(1);
          },
        },
      };

      if(isZoomable || isGallery) {
        route.component = View;
        route.passProps = {
          style: { flex: 1 },
          children: sources.map((source, i) => (
            <ZoomableImage
              {...imageProps}
              key={i}
              source={source}
              minimumZoomScale={this.props.minimumZoomScale}
              maximumZoomScale={this.props.maximumZoomScale}
              imageComponent={ImageComponent}
            />
          ))
        };
        route.transitionProps.originElement = (<AnimatedImage {...imageProps} source={sources[this.state.sourceIndex]} />);
      }

      if(this.props.swipeToDismiss || isGallery) {
        route.component = ScrollView;
        route.passProps = {
          ...route.passProps,
          ref: component => this._scrollView = component,
          directionalLockEnabled: true,
          automaticallyAdjustContentInsets: false,
          contentContainerStyle: { flex: 1 },
          scrollEventThrottle: 16,
          onScroll: event => {
            if(isGallery) {
              var sourceIndex = Math.round(event.nativeEvent.contentOffset.x / DEVICE_WIDTH);
              if(sourceIndex !== this.state.sourceIndex) {
                this.setState({ sourceIndex });

                this.props.navigator.navigationContext.emit('originElementChanged', {
                  originElement: (<AnimatedImage {...imageProps} source={sources[sourceIndex]} />),
                  route: route,
                });

                if(this.props.onSourceChange) {
                  this.props.onSourceChange(this.props.source[sourceIndex], sourceIndex);
                }
              }
            }
            if(this.props.swipeToDismiss) {
              var offsetY = -event.nativeEvent.contentOffset.y;
              if(this._offsetY !== offsetY) {
                this._offsetY = offsetY;
                this.props.navigator.navigationContext.emit('offsetYChanged', {
                  offsetY,
                  route: route,
                });
              }
            }
          }
        };
        if(!isGallery && !isZoomable) {
          route.passProps.children = (<ImageComponent {...imageProps} />);
        }
      }

      if(isGallery) {
        route.passProps = {
          ...route.passProps,
          horizontal: true,
          pagingEnabled: true,
          contentOffset: { x: DEVICE_WIDTH * this.state.sourceIndex },
          contentContainerStyle: { flex: 1, width: DEVICE_WIDTH * sources.length },
        };
      }

      if(this.props.swipeToDismiss) {
        route.passProps = {
          ...route.passProps,
          alwaysBounceVertical: true,
          onScrollEndDrag: event => {
            if(event.nativeEvent.contentOffset.y + event.nativeEvent.contentInset.top <= -DRAG_DISMISS_THRESHOLD || event.nativeEvent.contentSize.height - event.nativeEvent.layoutMeasurement.height - event.nativeEvent.contentOffset.y <= -DRAG_DISMISS_THRESHOLD) {
              if(this._scrollView) {
                // Disable bouncing for better closing animation performance
                this._scrollView.setNativeProps({
                  bounces: false,
                });
              }
              this.props.navigator.pop();
            }
          }
        };
      }

      this.props.navigator.push(route);
    });
  },

  close: function() {
    this.props.navigator.pop();
  },

  _renderBackground: function(openValue) {
    if(this.props.renderBackground) {
      return this.props.renderBackground(openValue);
    }
    return (
      <Animated.View style={[styles.background, { opacity: openValue }]} />
    );
  },

  _renderHeader: function(openValue) {
    if(this.props.renderHeader) {
      return this.props.renderHeader(openValue);
    }
    return (
      <LightboxHeader style={{ opacity: openValue }} navigator={this.props.navigator} />
    );
  },

  _renderFooter: function(openValue) {
    if(this.props.renderFooter) {
      return this.props.renderFooter(openValue);
    }
    return null;
  },

  _getImageProps: function() {
    // TODO: As of RN 0.16/17? all core components includes all View props in propTypes
    // so this approach is not good anymore.
    var props = pick(this.props, Object.keys(this.props.imageComponent.propTypes));
    if(Array.isArray(props.source)) {
      props.source = props.source[this.state.sourceIndex];
    }
    return props;
  },

  _getTouchableProps: function() {
    return pick(this.props, Object.keys(this.props.touchableComponent.propTypes));
  },

  render: function() {
    var ImageComponent = this.props.imageComponent;
    var TouchableComponent = this.props.touchableComponent;
    var imageProps = this._getImageProps();
    var touchableProps = this._getTouchableProps();

    // measure will not return anything useful if we dont attach a onLayout handler on android
    return (
      <View
        ref={component => this._root = component}
        onLayout={event => this.props.onLayout && this.props.onLayout(event)}
      >
        <Animated.View style={{opacity: this.state.layoutOpacity}}>
          <TouchableComponent
            {...touchableProps}
            onPress={this.open}
          >
            <ImageComponent {...imageProps}>
              {this.props.children}
            </ImageComponent>
          </TouchableComponent>
        </Animated.View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    backgroundColor: 'black',
  },
});

module.exports = Lightbox;
