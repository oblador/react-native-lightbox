import React, {
  Component,
  Children,
  cloneElement,
  useState,
  useRef,
} from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import PropTypes from "prop-types";
import LightboxOverlay from "./LightboxOverlay";

const Lightbox = (props) => {
  const layoutOpacity = useRef(new Animated.Value(1));
  const _root = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [origin, setOrigin] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  getContent = () => {
    if (props.renderContent) {
      return props.renderContent();
    } else if (props.activeProps) {
      return cloneElement(Children.only(props.children), props.activeProps);
    }
    return props.children;
  };

  getOverlayProps = () => ({
    isOpen: isOpen,
    origin: origin,
    renderHeader: props.renderHeader,
    swipeToDismiss: props.swipeToDismiss,
    springConfig: props.springConfig,
    backgroundColor: props.backgroundColor,
    children: getContent(),
    didOpen: props.didOpen,
    willClose: props.willClose,
    onClose: onClose,
  });

  open = () => {
    _root.current.measure((ox, oy, width, height, px, py) => {
      props.onOpen();

      setIsOpen(props.navigator ? true : false);
      setOrigin({
        width,
        height,
        x: px,
        y: py,
      });

      props.didOpen();

      if (props.navigator) {
        const route = {
          component: LightboxOverlay,
          passProps: getOverlayProps(),
        };

        const routes = props.navigator.getCurrentRoutes();
        routes.push(route);
        props.navigator.immediatelyResetRouteStack(routes);
      } else {
        setIsOpen(true);
      }

      setTimeout(() => {
        _root && _root.current && layoutOpacity.current.setValue(0);
      });
    });
  };

  close = () => {
    throw new Error(
      "Lightbox.close method is deprecated. Use renderHeader(close) prop instead."
    );
  };

  onClose = () => {
    layoutOpacity.current.setValue(1);

    setIsOpen(false);

    if (props.navigator) {
      const routes = props.navigator.getCurrentRoutes();
      routes.pop();
      props.navigator.immediatelyResetRouteStack(routes);
    }
  };

  return (
    <View ref={_root} style={props.style} onLayout={() => {}}>
      <Animated.View style={{ opacity: layoutOpacity.current }}>
        <TouchableOpacity
          underlayColor={props.underlayColor}
          onPress={open}
          onLongPress={props.onLongPress}
        >
          {props.children}
        </TouchableOpacity>
      </Animated.View>
      {props.navigator ? false : <LightboxOverlay {...getOverlayProps()} />}
    </View>
  );
};

Lightbox.propTypes = {
  activeProps: PropTypes.object,
  renderHeader: PropTypes.func,
  renderContent: PropTypes.func,
  underlayColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  didOpen: PropTypes.func,
  onOpen: PropTypes.func,
  willClose: PropTypes.func,
  onClose: PropTypes.func,
  springConfig: PropTypes.shape({
    tension: PropTypes.number,
    friction: PropTypes.number,
  }),
  swipeToDismiss: PropTypes.bool,
};

Lightbox.defaultProps = {
  swipeToDismiss: true,
  onOpen: () => {},
  didOpen: () => {},
  willClose: () => {},
  onClose: () => {},
  onLongPress: () => {},
};

export default Lightbox;
