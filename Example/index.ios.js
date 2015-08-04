/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  ScrollView,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} = React;

var Lightbox = require('react-native-lightbox');

var WINDOW_WIDTH = Dimensions.get('window').width;
var BASE_PADDING = 10;

var Example = React.createClass({
  render: function() {
    return (
      <ScrollView style={styles.container}>
        <Lightbox underlayColor="white">
          <Image
            style={styles.contain}
            resizeMode="contain"
            source={{ uri: 'http://www.use.com/images/s_2/Cat_in_the_hat_d2bb58c4bf497eaec918_1.jpg' }}
          />
        </Lightbox>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text></View>
        <Lightbox>
          <Image
            style={styles.cover}
            resizeMode="cover"
            source={{ uri: 'http://www.use.com/images/s_2/Cat_in_the_hat_d2bb58c4bf497eaec918_1.jpg' }}
          />
        </Lightbox>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text></View>
        <Lightbox
          ref="lightbox"
          header={(
            <TouchableOpacity onPress={() => this.refs.lightbox.close()}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          )}>
          <View style={styles.redBox}>
            <Text>I have a custom header</Text>
          </View>
        </Lightbox>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text></View>
        <View style={styles.row}>
          <Lightbox style={styles.col}>
            <View style={styles.square}><Text style={styles.squareText}>I'm a square</Text></View>
          </Lightbox>
          <Lightbox style={styles.col}>
            <View style={styles.square}><Text style={styles.squareText}>I'm a square</Text></View>
          </Lightbox>
        </View>
        <View style={styles.text}><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text></View>
      </ScrollView>
    );
  },
});


var styles = StyleSheet.create({
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
  redBox: {
    height: 150,
    backgroundColor: 'red',
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
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  squareText: {
    textAlign: 'center',
  },
  cover: {
    height: 300,
    flex: 1,
  },
  contain: {
    flex: 1,
    height: 200,
  },
  text: {
    marginVertical: BASE_PADDING*2,
  },
});

AppRegistry.registerComponent('Example', () => Example);
