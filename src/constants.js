import { NativeModules } from 'react-native';

export const SUPPORTS_NATIVE_ANIMATION_DRIVER =
  NativeModules && !!NativeModules.NativeAnimatedModule;
