/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Navigator,
  ScrollView,
  Animated,
  Image,
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} = React;

var Lightbox = require('react-native-lightbox');

var WINDOW_WIDTH = Dimensions.get('window').width;
var WINDOW_HEIGHT = Dimensions.get('window').height;
var STATUS_BAR_OFFSET = (Platform.OS === 'android' ? 25 : 0);
var BASE_PADDING = 10;

var IMAGES = {
  partyPig: { uri: 'http://www.yayomg.com/wp-content/uploads/2014/04/yayomg-pig-wearing-party-hat.jpg' },
  hatHampster: { uri: 'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg' }
};

var RootView = React.createClass({
  _navigateToArticle: function(imageSource) {
    this._image.measure((ox, oy, width, height, px, py) => {
      var origin = {
        width,
        height,
        x: px,
        y: py - STATUS_BAR_OFFSET,
      };
      var target = {
        width: WINDOW_WIDTH,
        height: height/width * WINDOW_WIDTH,
        x: 0,
        y: 0,
      }
      this.props.navigator.push({
        component: ArticleView,
        passProps: {
          imageSource,
          imageStyle: {
            width: target.width,
            height: target.height,
          }
        },
        transitionProps: {
          resizeMode: 'cover',
          originElement: (<Animated.Image
            style={styles.image}
            resizeMode="cover"
            source={imageSource}
          />),
          target,
          origin,
        }
      })
    })
  },

  render: function() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
        <Lightbox.Image
          underlayColor="white"
          resizeMode="contain"
          lightboxResizeMode="none"
          navigator={this.props.navigator}
          style={styles.contain}
          activeProps={{ resizeMode: 'contain', style: { flex: 1 }}}
          source={[IMAGES.partyPig, IMAGES.hatHampster]}
          />
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
        <TouchableHighlight onPress={event => this._navigateToArticle(IMAGES.partyPig)}>
          <View>
            <Image
              ref={component => this._image = component}
              source={IMAGES.partyPig}
              style={styles.contain} />
            </View>
        </TouchableHighlight>
        <View style={styles.text}><Text>Tap the pig to open article. </Text></View>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
      </ScrollView>
    );
  },
});

var ArticleView = React.createClass({
  getInitialState: function() {
    return {
      hasFocus: false,
      translateY: new Animated.Value(WINDOW_HEIGHT/3),
      opacity: new Animated.Value(0),
    };
  },

  componentWillMount: function() {
    this._focusSubscription = this.props.navigator.navigationContext.addListener('didfocus', event => {
      if(event.data.route === this.props.route) {
        this.setState({ hasFocus: true });
      }
    });
    this.props.navigator.navigationContext.addListener('willfocus', event => {
      if(event.data.route === this.props.route) {
        Animated.sequence([
          Animated.delay(250),
          Animated.parallel([
            Animated.spring(this.state.opacity, { toValue: 1 }),
            Animated.spring(this.state.translateY, { toValue: 0 })
          ])
        ]).start();
      }
    });
  },

  componentWillUnmount: function() {
    this._focusSubscription.remove();
  },

  close: function() {
    this.setState({ hasFocus: false }, () => {
      this.props.navigator.pop();
      Animated.spring(this.state.opacity, { toValue: 0 }).start();
    });
  },

  render: function() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          bounces={this.state.hasFocus}
          onScrollEndDrag={event => {
            // Lazy mans pull to close
            if(event.nativeEvent.contentOffset.y + event.nativeEvent.contentInset.top <= -100) {
              this.close();
            }
          }}
        >
          <Lightbox.Image
            underlayColor="white"
            lightboxResizeMode="cover"
            maximumZoomScale={2}
            navigator={this.props.navigator}
            style={[{ opacity: this.state.hasFocus ? 1 : 0 }, this.props.imageStyle]}
            source={this.props.imageSource}
            activeProps={{ resizeMode: 'contain', style: { flex: 1 }}}
            />
          <Animated.View style={[styles.text, { opacity: this.state.opacity }]}>
            <Text style={styles.title}>Pig wears hat</Text>
          </Animated.View>
          <Animated.View style={[styles.container, {
            opacity: this.state.opacity,
            transform: [{
              translateY: this.state.translateY,
            }]
          }]}>
            <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
            <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
            <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
            <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
            <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
          </Animated.View>
        </ScrollView>
        <TouchableOpacity style={styles.closeButton} onPress={this.close}>
          <Animated.Text style={[styles.closeButtonText, { opacity: this.state.opacity }]}>×</Animated.Text>
        </TouchableOpacity>
      </View>
    );
  },
});

var App = React.createClass({
  renderScene: function(route, navigator) {
    var Component = route.component;

    return (
      <Component navigator={navigator} route={route} {...route.passProps} />
    );
  },

  configureScene: function(route) {
    if(route.component === ArticleView) {
      return {
        ...Lightbox.Navigator.SceneConfigs.Lightbox,
        transitionProps: {
          hidesContentDuringTransition: false,
          renderBackground: (openValue) => (
            <Animated.View style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              opacity: openValue,
            }}/>
          ),
        }
      };
    }
    return Lightbox.Navigator.SceneConfigs.PushFromRight;
  },

  render: function() {
    return (
      <Lightbox.Navigator
        ref="navigator"
        style={styles.navigator}
        renderScene={this.renderScene}
        configureScene={this.configureScene}
        initialRoute={{
          component: RootView,
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  navigator: {
    flex: 1,
  },
  container: {
    paddingHorizontal: BASE_PADDING,
  },
  content: {
    alignItems: 'center',
  },
  contain: {
    width: 200,
    height: 150,
  },
  text: {
    marginVertical: BASE_PADDING*2,
  },
  title: {
    fontSize: 30,
    fontWeight: '200',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 40,
  },
  closeButtonText: {
    fontSize: 35,
    color: 'white',
    lineHeight: 40,
    textAlign: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1.5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
  },
});

module.exports = App;
