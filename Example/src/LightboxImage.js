import { Image, TouchableHighlight, TouchableNativeFeedback, Platform } from 'react-native';
import createLightboxImage from './createLightboxImage';
/*
const IS_ANROID = Platform.OS === 'android';
const TouchableComponent = IS_ANROID ? TouchableNativeFeedback : TouchableHighlight;
const defaultTouchableProps = IS_ANROID
  ? { background: TouchableNativeFeedback.SelectableBackground() }
  : {};
*/
export default createLightboxImage(Image, TouchableHighlight);
