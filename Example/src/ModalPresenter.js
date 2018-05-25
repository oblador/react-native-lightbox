import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { Provider } from './PresenterContext';
import { PRESENT_IMAGE_EVENT_NAME } from './constants';
import Transitioner from './ModalTransitioner';

const getIdFromSource = source =>
  typeof source === 'number' ? source.toString() : source.id || source.uri;

const normalizeGallery = gallery =>
  gallery.map(image => {
    switch (typeof image) {
      case 'string': {
        return { id: image, source: { uri: image } };
      }
      case 'number': {
        return { id: image.toString(), source: image };
      }
      case 'object': {
        if (image.source) {
          if (!image.id) {
            return { id: getIdFromSource(image.source), ...image };
          }
          return image;
        } else if (image.uri) {
          return { id: getIdFromSource(image), source: image };
        }
      }
    }
    throw new Error(
      'Unrecognized gallery image type, it must either be a source or an object with a source property'
    );
  });

export default class ModalPresenter extends Component {
  state = {
    open: false,
    transitioning: false,
    images: [],
    initialIndex: 0,
    resizeMode: undefined,
  };

  progress = new Animated.Value(0);

  componentDidMount() {
    this.props.eventEmitter.addListener(PRESENT_IMAGE_EVENT_NAME, this.open);
  }

  componentWillUnmount() {
    this.props.eventEmitter.removeListener(PRESENT_IMAGE_EVENT_NAME, this.open);
  }

  open = ({ id, source, resizeMode, gallery }) => {
    if (this.state.open) {
      console.warn('Cannot open lightbox because it is already open');
      return;
    }

    const initialImage = { id: getIdFromSource(source), source };
    const images = gallery ? normalizeGallery(gallery) : [initialImage];
    let initialIndex = images.findIndex(image => image.id === initialImage.id);
    if (initialIndex === -1) {
      images.unshift(initialImage);
      initialIndex = 0;
    }

    this.setState(
      {
        images,
        initialIndex,
        resizeMode,
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

  close = () => {
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
              images: [],
              initialIndex: 0,
              resizeMode: undefined,
              transitioning: false,
            });
          }
        });
      }
    );
  };

  render() {
    const { open, transitioning, initialIndex, images, resizeMode } = this.state;

    if (!open && !transitioning) {
      return null;
    }

    return (
      <Transitioner
        progress={this.progress}
        open={open}
        initialIndex={initialIndex}
        resizeMode={resizeMode}
        images={images}
        transitioning={transitioning}
        onClose={this.close}
        ImageComponent={this.props.ImageComponent}
        ChromeComponent={this.props.ChromeComponent}
        BackgroundComponent={this.props.BackgroundComponent}
      />
    );
  }
}
