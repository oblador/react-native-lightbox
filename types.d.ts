declare module 'react-native-lightbox' {
  import { Animated } from 'react-native'

  interface LightboxProps {
    activeProps?: any
    renderHeader?: () => void
    renderContent?: () => void
    underlayColor?: string
    backgroundColor?: string
    didOpen?: () => void
    onOpen?: () => void
    willClose?: () => void
    onClose?: () => void
    springConfig?: Animated.SpringAnimationConfig['friction' | 'tension']
    swipeToDismiss?: boolean
  }

  const Lightbox: React.FC<LightboxProps>

  export default Lightbox
}
