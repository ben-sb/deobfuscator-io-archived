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
var _0x19be = ['Bg9N', 'q0T0uwe='];
(function(_0x3fa0c3, _0x19bec9) {
    var _0x40d3d0 = function(_0x5180bc) {
        while (--_0x5180bc) {
            _0x3fa0c3['push'](_0x3fa0c3['shift']());
        }
    };
    _0x40d3d0(++_0x19bec9);
}(_0x19be, 0x143));
var _0x40d3 = function(_0x3fa0c3, _0x19bec9) {
    _0x3fa0c3 = _0x3fa0c3 - 0x0;
    var _0x40d3d0 = _0x19be[_0x3fa0c3];
    if (_0x40d3['xHUwua'] === undefined) {
        var _0x5180bc = function(_0x4f8e26) {
            var _0x2d6eea = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=',
                _0x1f9584 = String(_0x4f8e26)['replace'](/=+$/, '');
            var _0xe582fc = '';
            for (var _0x3c4a7a = 0x0, _0x52dbfd, _0x112e70, _0x4ded32 = 0x0; _0x112e70 = _0x1f9584['charAt'](_0x4ded32++); ~_0x112e70 && (_0x52dbfd = _0x3c4a7a % 0x4 ? _0x52dbfd * 0x40 + _0x112e70 : _0x112e70, _0x3c4a7a++ % 0x4) ? _0xe582fc += String['fromCharCode'](0xff & _0x52dbfd >> (-0x2 * _0x3c4a7a & 0x6)) : 0x0) {
                _0x112e70 = _0x2d6eea['indexOf'](_0x112e70);
            }
            return _0xe582fc;
        };
        _0x40d3['CiDTFB'] = function(_0x3452b6) {
            var _0x4265f0 = _0x5180bc(_0x3452b6);
            var _0x23525c = [];
            for (var _0x4e74ff = 0x0, _0x188f0f = _0x4265f0['length']; _0x4e74ff < _0x188f0f; _0x4e74ff++) {
                _0x23525c += '%' + ('00' + _0x4265f0['charCodeAt'](_0x4e74ff)['toString'](0x10))['slice'](-0x2);
            }
            return decodeURIComponent(_0x23525c);
        }, _0x40d3['PiGWwq'] = {}, _0x40d3['xHUwua'] = !![];
    }
    var _0x29219e = _0x40d3['PiGWwq'][_0x3fa0c3];
    return _0x29219e === undefined ? (_0x40d3d0 = _0x40d3['CiDTFB'](_0x40d3d0), _0x40d3['PiGWwq'][_0x3fa0c3] = _0x40d3d0) : _0x40d3d0 = _0x29219e, _0x40d3d0;
};

function _0x4e3536() {
    var _0x5c5a38 = _0x40d3,
        _0x4e384e = {};
    _0x4e384e[_0x5c5a38('0x0')] = 'Hello World!';
    var _0x26386b = _0x4e384e;
    console[_0x5c5a38('0x1')](_0x26386b[_0x5c5a38('0x0')]);
}
_0x4e3536();
```

Deobfuscated script
```
function a() {
    var c = {};
    c.CKtQa = 'Hello World!';
    var d = c;
    console.log(d.CKtQa);
}
a();
```

### To Run
Put the obfuscated script in source/obfuscated.js and run:<br/>
npm start
