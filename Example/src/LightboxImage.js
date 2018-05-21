import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import withLightboxContext from './withLightboxContext';
import { PRESENT_IMAGE_EVENT_NAME } from './constants';

const styles = StyleSheet.create({
  image: {
    backgroundColor: 'white',
    ...StyleSheet.absoluteFillObject,
    width: null,
    height: null,
  },
});

export class LightboxImage extends Component {
  static propTypes = {
    id: PropTypes.string,
    source: PropTypes.any,
    lightboxSource: PropTypes.any,
    lightboxResizeMode: PropTypes.oneOf(['contain', 'cover', 'stretch']),
  };

  handlePress = () => {
    this.props.eventEmitter.emit(PRESENT_IMAGE_EVENT_NAME, {
      id: this.props.id,
      source: this.props.lightboxSource || this.props.source,
      resizeMode: this.props.lightboxResizeMode || this.props.resizeMode,
      gallery: this.props.gallery,
    });
  };

  render() {
    const {
      style,
      ImageComponent,
      TouchableComponent,
      defaultTouchableProps,
      eventEmitter,
      ...restProps
    } = this.props;
    return (
      <TouchableComponent {...defaultTouchableProps} onPress={this.handlePress} style={style}>
        <ImageComponent style={styles.image} {...restProps} />
      </TouchableComponent>
    );
  }
}

export default withLightboxContext(LightboxImage);
