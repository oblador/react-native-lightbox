# react-native-lightbox

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

## Properties

| Prop | Type | Description |
|---|---|---|
|**`header`**|`element`|Custom header instead of default with X button|
|**`onClose`**|`function`|Triggered when lightbox is closed|
|**`onOpen`**|`function`|Triggered when lightbox is opened|
|**`underlayColor`**|`string`|Color of touchable background, defaults to `black`|

## Example 

Check full example in the `Example` folder. 

## License

[MIT License](http://opensource.org/licenses/mit-license.html). © Joel Arvidsson

