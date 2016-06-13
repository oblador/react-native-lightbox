'use strict';

var React = require('react');
var {
  PropTypes
} = React;
var {
  Image,
  ScrollView,
  Dimensions,
} = require('react-native');

var DEVICE_HEIGHT = Dimensions.get('window').height;
var DEVICE_WIDTH = Dimensions.get('window').width;

var ZoomableImage = React.createClass({
  propTypes: {
    imageComponent:     PropTypes.func,
    maximumZoomScale:   PropTypes.number,
    minimumZoomScale:   PropTypes.number,
  },

  getDefaultProps: function() {
    return {
      maximumZoomScale: 1,
      minimumZoomScale: 1,
      imageComponent: Image,
    };
  },

  getInitialState: function() {
    return {
      width: DEVICE_WIDTH,
      height: DEVICE_HEIGHT,
    };
  },

  componentDidMount: function() {
    if(Image.getSize && this.props.source) {
      Image.getSize(this.props.source.uri,
        (width, height) => {
          this.setState({width, height});
        }
      );
    }
  },

  render: function() {
    var { width, height } = this.state;
    var {
      style,
      minimumZoomScale,
      maximumZoomScale,
      imageComponent,
      ...props
    } = this.props;

    var ImageComponent = imageComponent;
    var scale = Math.max(width/DEVICE_WIDTH, height/DEVICE_HEIGHT);

    return (
      <ScrollView
        style={{ flex: 1 }}
        automaticallyAdjustContentInsets={false}
        bounces={false}
        centerContent={true}
        decelerationRate={0.95}
        minimumZoomScale={minimumZoomScale}
        maximumZoomScale={maximumZoomScale}
      >
        <ImageComponent {...props} style={[{ width: width/scale, height: height/scale }, style]} />
      </ScrollView>
    );
  }
});

module.exports = ZoomableImage;
