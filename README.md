# react-native-lightbox

## Installation

```
npm install --save react-native-lightbox
```

This module depends on [`react-native-overlay`](https://github.com/brentvatne/react-native-overlay), so if you haven't already integrated it, follow [these instructions](https://github.com/brentvatne/react-native-overlay#add-it-to-your-project). **Note**: `react-native-overlay` should already be installed as a dependency of `react-native-lightbox`, have a look in `node_modules/react-native-lightbox/node_modules/react-native-overlay`.

## Usage

```js
var Lightbox = require('react-native-lightbox');

var LightboxView = React.createClass({
  render: function() {
    return (
      <Lightbox>
        <Image
          style={{ height: 300 }}
          source={{ uri: 'http://knittingisawesome.com/wp-content/uploads/2012/12/cat-wearing-a-reindeer-hat1.jpg' }}
        />
      </Lightbox>
    );
  },
});
```

### Manual Opening & Closing

The component exposes the `open` and `close` methods. Smack a `ref` on the `<Lightbox>` and you're good to go. This is probably quite useful if you're doing a custom header.

```js
render: function() {
  return (
    <Lightbox ref="lightbox">…</Lightbox>
  );
},
handleSomething: function() {
  this.refs.lightbox.open();
}
```

## Properties

| Prop | Type | Description |
|---|---|---|
|**`activeProps`**|`object`|Optional set of props applied to the content component when in lightbox mode. Usable for applying custom styles or higher resolution image source.|
|**`header`**|`element`|Custom header instead of default with X button|
|**`onClose`**|`function`|Triggered when lightbox is closed|
|**`onOpen`**|`function`|Triggered when lightbox is opened|
|**`underlayColor`**|`string`|Color of touchable background, defaults to `black`|
|**`swipeToDismiss`**|`bool`|Enables gestures to dismiss the fullscreen mode by swiping up or down, defaults to `true`.|

## Demo

![Demo](https://cloud.githubusercontent.com/assets/378279/9074360/16eac5d6-3b09-11e5-90af-a69980e9f4be.gif)

## Example 

Check full example in the `Example` folder. 

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Joel Arvidsson

