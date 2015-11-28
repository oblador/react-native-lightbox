'use strict';

var React = require('react-native');
var {
  Navigator,
} = React;

var LightboxNavigator = React.createClass({
  _root: null,
  _transitionViews: {},

  componentWillMount: function() {
    this.parentNavigator = this.props.navigator;
  },

  componentDidMount: function() {
    this.__defineGetter__('navigationContext', this._root._getNavigationContext);
  },

  _configureSceneProxy: function(route) {
    if(route.type === 'LightboxImage') {
      return SceneConfigs.Lightbox;
    } else if(this.props.configureScene) {
      return this.props.configureScene(route);
    }
    return SceneConfigs.PushFromRight;
  },

  _renderSceneProxy: function(route, navigator) {
    var scene;
    if(route.type === 'LightboxImage') {
      var Component = route.component;
      scene = (<Component route={route} navigator={navigator} {...route.passProps}>{route.passProps.children}</Component>);
    } else {
      scene = this.props.renderScene(route, this);
    }
    if(this._root && this._root.state) {
      var stackIndex = this._root.state.routeStack.indexOf(route);
      var sceneConfig = this._root.state.sceneConfigStack[stackIndex];

      if(sceneConfig.transitionComponent) {
        var TransitionComponent = sceneConfig.transitionComponent;
        var transitionProps = {
          ...sceneConfig.transitionProps,
          ...route.transitionProps,
        };
        return (
          <TransitionComponent
            {...transitionProps}
            ref={component => this._transitionViews[stackIndex] = component}
            onOpeningTransitionStart={() => {
              this._routeWillFocus(route);
              if(transitionProps.onOpeningTransitionStart) {
                transitionProps.onOpeningTransitionStart();
              }
            }}
            onOpeningTransitionEnd={() => {
              this._routeDidFocus(route);
              if(transitionProps.onOpeningTransitionEnd) {
                transitionProps.onOpeningTransitionEnd();
              }
            }}
          >
            {scene}
          </TransitionComponent>
        );
      }
    }
    return scene;
  },

  _routeWillFocus: function(route) {
    this._root._emitWillFocus(route);
  },

  _routeDidFocus: function(route) {
    this._root._emitDidFocus(route);
    this._root._hideScenes();
  },

  _immediatelyPush: function(route) {
    var routes = this._root.getCurrentRoutes();
    routes.push(route);
    this._root.immediatelyResetRouteStack(routes);
    this._root._emitDidFocus(route);
  },

  _immediatelyPop: function() {
    var routes = this._root.getCurrentRoutes();
    routes.pop();
    this._root.immediatelyResetRouteStack(routes);
    this._root._emitDidFocus(routes[routes.length-1]);
  },

  push: function(route) {
    var pushIndex = this._root.state.presentedIndex + 1;
    var sceneConfig = this._root.props.configureScene(route);
    if(sceneConfig.transitionComponent) {
      this._immediatelyPush(route);
    } else {
      this._root.push(route);
    }
  },

  pop: function() {
    var stackIndex = this._root.state.presentedIndex;
    var transitionView = this._transitionViews[stackIndex];
    if(transitionView) {
      var popIndex = stackIndex - 1;
      this._root._emitWillFocus(this._root.state.routeStack[popIndex]);
      this._root._enableScene(popIndex);
      this._root._transitionSceneStyle(stackIndex, popIndex, 1, popIndex);
      transitionView.close(() => {
        this._immediatelyPop();
        delete this._transitionViews[popIndex];
      });
    } else {
      this._root.pop();
    }
  },

  render: function() {
    var { children, ref, renderScene, configureScene, sceneStyle, ...props } = this.props;
    return (
      <Navigator
        ref={component => {
          this._root = component
          if(typeof ref === 'function') {
            ref(component);
          }
        }}
        renderScene={this._renderSceneProxy}
        configureScene={this._configureSceneProxy}
        {...props}
        >
        {children}
      </Navigator>
    );
  },
});

var LightboxOverlay = require('./Overlay');

var SceneConfigs = {
  ...Navigator.SceneConfigs,
  Lightbox: {
    ...Navigator.SceneConfigs.PushFromRight,
    transitionComponent: LightboxOverlay,
    gestures: {},
  },
};

module.exports = LightboxNavigator;
module.exports.SceneConfigs = SceneConfigs;
