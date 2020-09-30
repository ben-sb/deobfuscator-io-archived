# A JavaScript deobfuscator for [obfuscator.io](https://obfuscator.io/)

A (partial) deobfuscator for scripts obfuscated with obfuscator.io, feel free to use it.
I may add more features at some point.

### To Run
npm start

### Current Features
* Reverses string array obfuscation
* Reverses rotated and shuffled string array obfuscation
* Removes string array wrapper chained calls
* Will remove self defending calls (that prevent you from beautifying the obfuscated script)
* Simplifies the nasty \_0x23b78c variable names to something more readable
* Beautifies the code
