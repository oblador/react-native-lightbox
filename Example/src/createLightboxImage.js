import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { Consumer } from './PresenterContext';
import { IMAGE_PRESS_EVENT_NAME } from './constants';

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'white',
    ...StyleSheet.absoluteFillObject,
  },
});

const createLightboxImage = (ImageComponent, TouchableComponent, defaultTouchableProps = {}) =>
  class LightboxImage extends Component {
    static propTypes = {
      source: PropTypes.any,
      lightboxResizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch']),
    };

    render() {
      const { style, children, source, ...restProps } = this.props;
      return (
        <Consumer>
          {eventEmitter => (
            <TouchableComponent
              {...defaultTouchableProps}
              onPress={() => eventEmitter.emit(IMAGE_PRESS_EVENT_NAME, source)}
              style={style}
            >
              <ImageComponent style={styles.image} source={source} {...restProps} />
            </TouchableComponent>
          )}
        </Consumer>
      );
    }
  };

export default createLightboxImage;
