const esprima = require('esprima');
const fs = require('fs');
const beautify = require('js-beautify').js;
const utils = require('./utils');
const { exit } = require('process');


let source = fs.readFileSync('input/source.js').toString();


// remove any self defending expressions (these will break our string deobfuscation)
let editedSource = source;
esprima.parseScript(source, {}, (node, meta) => {
    if (utils.isSelfDefendingExpression(node) || utils.isUnarySelfDefendingExpression(node)) {
        let nodeSource = source.substring(meta.start.offset, meta.end.offset);
        editedSource = editedSource.replace(nodeSource, 'return true;');
        console.log('Removed a self defending expression');
    }
});


// find and eval the string array and string shifter functions
let functionName;
let shiftSource;
let startIndex;
editedSource = source;
esprima.parseScript(source, { range: true }, (node, meta) => {
    if (utils.isArrayShifter(node)) {
        functionName = node.id.name;
        shiftSource = editedSource.substring(0, meta.end.offset);
        startIndex = meta.end.offset + 1;
    }
});

if (!functionName || !shiftSource || !startIndex) {
    console.log('Unrecognized obfuscation');
    exit(1);
}
eval(shiftSource);
editedSource = editedSource.substring(startIndex);


// detect and replace string obfuscation function reassignments
let replaced = true;
while (replaced) {
    replaced = false;
    let source = editedSource;
    esprima.parseScript(source, {}, (node, meta) => {
        if (utils.isArrayShifterReassignment(node, functionName)) {
            let re = new RegExp(node.declarations[0].id.name, 'g');
            editedSource = editedSource.replace(re, functionName);
            replaced = true;
        }
    });
}


// undo string obfuscation
source = editedSource;
esprima.parseScript(source, {}, (node, meta) => {
    if (utils.isStringUse(node, functionName)) {
        let res = eval(`${functionName}(${node.arguments[0].value})`);
        if (res) {
            let nodeSource = source.substring(meta.start.offset, meta.end.offset);
            let string = unescape(res).replace(/'/g, "\\'");
            editedSource = editedSource.replace(nodeSource, `'${string}'`);
        }
    }
});
console.log('Reversed string obfuscation');


// unescape all strings
source = editedSource;
esprima.parseScript(source, {}, (node, meta) => {
    if (node.type == 'Literal' && typeof node.value == 'string' && node.value != node.raw) {
        if (node.value != '\n') {
            let string = eval(node.raw).replace(/'/g, "\\'");
            let nodeSource = source.substring(meta.start.offset, meta.end.offset);
            editedSource = editedSource.replace(nodeSource, `'${string}'`);
        }
    }
});
console.log('Unescaped strings');


// remove any self defending expressions that have now been unveiled
source = editedSource;
esprima.parseScript(source, {}, (node, meta) => {
    if (utils.isSelfDefendingExpression(node) || utils.isUnarySelfDefendingExpression(node)) {
        let nodeSource = source.substring(meta.start.offset, meta.end.offset);
        editedSource = editedSource.replace(nodeSource, 'return true;');
        console.log('Removed a self defending expression');
    }
});


// make variable names easier on the eyes
source = editedSource;
let mappings = {};
let varIndex = 1;
esprima.parseScript(source, {}, (node, meta) => {
    if (node.type == 'Identifier' && node.name.startsWith('_0x')) {
        while (!mappings[node.name] || utils.keywords.includes(mappings[node.name]))
            mappings[node.name] = utils.getVariableName(varIndex++);

        let nodeSource = source.substring(meta.start.offset, meta.end.offset);
        editedSource = editedSource.replace(nodeSource, mappings[node.name]);
    }
});
console.log('Cleaned up variable names');


// clean up the look of the code, e.g. replace window['chrome'] with window.chrome
editedSource = editedSource.replace(/(\[("|')([\w\d_$]+)("|')\])/g, '.$3');
editedSource = editedSource.replace(/\[\.([\w\d_$]+)\]/gi, '\[\[\'$1\'\]\]') // reverses any accidental damage we did with the line above


fs.writeFileSync('output/deobfuscated.js', beautify(editedSource));
console.log('Wrote deobfuscated file to output/deobfuscated.js');