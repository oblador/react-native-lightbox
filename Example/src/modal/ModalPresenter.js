import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { Provider } from '../PresenterContext';
import { IMAGE_PRESS_EVENT_NAME } from '../constants';
import Transitioner from './ModalTransitioner';

export default class ModalPresenter extends Component {
  state = {
    open: false,
    transitioning: false,
    source: null,
  };

  progress = new Animated.Value(0);

  componentDidMount() {
    this.props.eventEmitter.addListener(IMAGE_PRESS_EVENT_NAME, this.handleImagePress);
  }

  componentWillUnmount() {
    this.props.eventEmitter.removeListener(IMAGE_PRESS_EVENT_NAME, this.handleImagePress);
  }

  handleImagePress = source => {
    if (this.state.open) {
      console.warn('Cannot open lightbox because it is already open');
      return;
    }

    this.setState(
      {
        source,
        open: true,
        transitioning: true,
      },
      () => {
        Animated.timing(this.progress, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }).start(endState => {
          if (endState.finished) {
            this.setState({ transitioning: false });
          }
        });
      }
    );
  };

  handleClosePress = () => {
    this.setState(
      {
        open: false,
        transitioning: true,
      },
      () => {
        Animated.timing(this.progress, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }).start(endState => {
          if (endState.finished) {
            this.setState({
              source: null,
              transitioning: false,
            });
          }
        });
      }
    );
  };

  render() {
    const { open, transitioning, source } = this.state;

    if (!open && !transitioning) {
      return null;
    }

    return (
      <Transitioner
        progress={this.progress}
        open={open}
        source={source}
        transitioning={transitioning}
        onClosePress={this.handleClosePress}
      />
    );
  }
}
