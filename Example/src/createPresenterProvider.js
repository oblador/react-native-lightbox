import React, { Component, Fragment } from 'react';
import { Image, TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { Provider } from './PresenterContext';
import EventEmitter from 'events';

const createPresenterProvider = (Presenter, defaultProps = {}) =>
  class PresenterProvider extends Component {
    static propTypes = {
      ImageComponent: PropTypes.func,
      TouchableComponent: PropTypes.func,
      ChromeComponent: PropTypes.func,
      BackgroundComponent: PropTypes.func,
      defaultTouchableProps: PropTypes.object,
      eventEmitter: PropTypes.object,
    };

    static defaultProps = {
      ImageComponent: Image,
      TouchableComponent: TouchableHighlight,
      defaultTouchableProps: {},
      eventEmitter: new EventEmitter(),
      ...defaultProps,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
      if (
        prevState.ImageComponent !== nextProps.ImageComponent ||
        prevState.TouchableComponent !== nextProps.TouchableComponent ||
        prevState.defaultTouchableProps !== nextProps.defaultTouchableProps ||
        prevState.eventEmitter !== nextProps.eventEmitter
      ) {
        // Cache context provider value to avoid redundant renders when consuming PresenterContext
        return {
          ImageComponent: nextProps.ImageComponent,
          TouchableComponent: nextProps.TouchableComponent,
          defaultTouchableProps: nextProps.defaultTouchableProps,
          eventEmitter: nextProps.eventEmitter,
        };
      }

      return null;
    }

    constructor(props) {
      super(props);

      // For compatibility with React < 16.3
      this.state = PresenterProvider.getDerivedStateFromProps(props, {});
    }

    render() {
      return (
        <Fragment>
          <Provider value={this.state}>{this.props.children}</Provider>
          <Presenter
            BackgroundComponent={this.props.BackgroundComponent}
            ChromeComponent={this.props.ChromeComponent}
            ImageComponent={this.props.ImageComponent}
            eventEmitter={this.props.eventEmitter}
          />
        </Fragment>
      );
    }
  };

export default createPresenterProvider;
