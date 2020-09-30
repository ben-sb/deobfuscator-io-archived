# A JavaScript deobfuscator for [obfuscator.io](https://obfuscator.io/)

A (incomplete) deobfuscator for scripts obfuscated with obfuscator.io, feel free to use it.<br/>
I may add more features at some point.

### Current Features
* Reverses string array obfuscation
* Reverses rotated and shuffled string array obfuscation
* Removes string array wrapper chained calls
* Will remove self defending calls (that prevent you from beautifying the obfuscated script)
* Simplifies the nasty \_0x23b78c variable names to something more readable
* Beautifies the code


### Example
Obfuscated script (beautified for easier viewing)
```
var _0x2a4c = ['log', 'Hello World!'];
(function(_0x4a5137, _0x2a4c55) {
    var _0x5db15f = function(_0x6dd03) {
        while (--_0x6dd03) {
            _0x4a5137['push'](_0x4a5137['shift']());
        }
    };
    _0x5db15f(++_0x2a4c55);
}(_0x2a4c, 0xac));
var _0x5db1 = function(_0x4a5137, _0x2a4c55) {
    _0x4a5137 = _0x4a5137 - 0x0;
    var _0x5db15f = _0x2a4c[_0x4a5137];
    return _0x5db15f;
};

function _0x31311a() {
    var _0x9dcbb5 = _0x5db1;
    console[_0x9dcbb5('0x0')](_0x9dcbb5('0x1'));
}
_0x31311a();
```

Deobfuscated script
```
function a() {
    console.log('Hello World!');
}
a();
```

### To Run
Put the obfuscated script in source/obfuscated.js and run:<br/>
npm start
