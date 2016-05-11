/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react');
var {
  AppRegistry,
  Dimensions,
  Image,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} = require('react-native');

var Lightbox = require('react-native-lightbox');
var Carousel = require('react-native-looped-carousel');

var WINDOW_WIDTH = Dimensions.get('window').width;
var BASE_PADDING = 10;

var LightboxView = React.createClass({
  renderCarousel: function() {
    return (
      <Carousel style={{ width: WINDOW_WIDTH, height: WINDOW_WIDTH }}>
        <Image
          style={{flex: 1}}
          resizeMode="contain"
          source={{ uri: 'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg' }}
        />
        <View style={{backgroundColor:'#6C7A89',flex: 1}}/>
        <View style={{backgroundColor:'#019875',flex: 1}}/>
        <View style={{backgroundColor:'#E67E22',flex: 1}}/>
      </Carousel>
    );
  },

  render: function() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
        <Lightbox underlayColor="white" navigator={this.props.navigator}>
          <Image
            style={styles.contain}
            resizeMode="contain"
            source={{ uri: 'https://www.yayomg.com/wp-content/uploads/2014/04/yayomg-pig-wearing-party-hat.jpg' }}
          />
        </Lightbox>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
        <Lightbox navigator={this.props.navigator} springConfig={{tension: 15, friction: 7}} swipeToDismiss={false} renderContent={this.renderCarousel}>
          <Image
            style={styles.carousel}
            resizeMode="contain"
            source={{ uri: 'http://cdn.lolwot.com/wp-content/uploads/2015/07/20-pictures-of-animals-in-hats-to-brighten-up-your-day-1.jpg' }}
          />
        </Lightbox>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
        <Lightbox
          navigator={this.props.navigator}
          renderHeader={close => (
            <TouchableOpacity onPress={close}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          )}>
          <View style={styles.customHeaderBox}>
            <Text>I have a custom header</Text>
          </View>
        </Lightbox>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
        <View style={styles.row}>
          <Lightbox style={styles.col} navigator={this.props.navigator}>
            <View style={[styles.square, styles.squareFirst]}><Text style={styles.squareText}>I'm a square</Text></View>
          </Lightbox>
          <Lightbox style={styles.col}>
            <View style={[styles.square, styles.squareSecond]}><Text style={styles.squareText}>I'm a square</Text></View>
          </Lightbox>
        </View>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text></View>
      </ScrollView>
    );
  },
});


var Example = React.createClass({
  renderScene: function(route, navigator) {
    var Component = route.component;

    return (
      <Component navigator={navigator} route={route} {...route.passProps} />
    );
  },

  render: function() {
    return (
      <Navigator
        ref="navigator"
        style={styles.navigator}
        renderScene={this.renderScene}
        initialRoute={{
          component: LightboxView,
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
  closeButton: {
    color: 'white',
    borderWidth: 1,
    borderColor: 'white',
    padding: 8,
    borderRadius: 3,
    textAlign: 'center',
    margin: 10,
    alignSelf: 'flex-end',
  },
  customHeaderBox: {
    height: 150,
    backgroundColor: '#6C7A89',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    marginLeft: -BASE_PADDING,
    marginRight: -BASE_PADDING,
  },
  col: {
    flex: 1,
  },
  square: {
    width: WINDOW_WIDTH/2,
    height: WINDOW_WIDTH/2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  squareFirst: {
    backgroundColor: '#C0392B',
  },
  squareSecond: {
    backgroundColor: '#019875',
  },
  squareText: {
    textAlign: 'center',
    color: 'white',
  },
  carousel: {
    height: WINDOW_WIDTH - BASE_PADDING * 2,
    width: WINDOW_WIDTH - BASE_PADDING * 2,
    backgroundColor: 'white',
  },
  contain: {
    flex: 1,
    height: 150,
  },
  text: {
    marginVertical: BASE_PADDING*2,
  },
});

module.exports = Example;
