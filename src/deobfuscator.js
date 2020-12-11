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


// detect and replace string obfuscation function wrappers, these
// can be either variable or multiple functions
let functionWrapperIncrement = 0;
let replaced = true;
while (replaced) {
    replaced = false;
    let source = editedSource;
    esprima.parseScript(source, {}, (node, meta) => {
        if (utils.isStringArrayVariableWrapper(node, functionName)) {
            let re = new RegExp(node.declarations[0].id.name, 'g');
            editedSource = editedSource.replace(re, functionName);
            replaced = true;
        } else if (utils.isStringArrayFunctionWrapper(node, functionName)) {
            let nodeSource = source.substring(meta.start.offset, meta.end.offset);

            let arg = node.init.body.body[0].argument.arguments[0];
            let increment = 0;
            if (arg.right.type == 'Literal') {
                increment = eval(arg.operator + arg.right.raw);
            } else if (arg.right.type == 'UnaryExpression') {
                increment = node.init.body.body[0].argument.arguments[0].right.argument.value;
            }
            if (increment != 0 && functionWrapperIncrement != 0 && increment != functionWrapperIncrement) {
                console.log('Control flow flattening not supported');
                process.exit(0);
            }
            functionWrapperIncrement = increment;

            var nextChar = source[meta.end.offset];
            var replacement = nextChar == ';' ? 'test = true;' : '';

            let re = new RegExp(node.id.name, 'g');
            editedSource = editedSource.replace(nodeSource + nextChar, replacement);
            editedSource = editedSource.replace(re, functionName);

            replaced = true;
        }
    });
}
console.log('Removed string array wrappers');


// undo string obfuscation
source = editedSource;
esprima.parseScript(source, {}, (node, meta) => {
    if (utils.isStringUse(node, functionName)) {

        let evalStr;
        if (node.arguments.length == 1) {
            let argument;
            if (node.arguments[0].type == 'Literal') {
                argument = node.arguments[0].value;
            } else if (node.arguments[0].type == 'UnaryExpression') {
                argument = node.arguments[0].operator + node.arguments[0].argument.raw;
            }
            argument = `${argument} + ${functionWrapperIncrement}`;
            evalStr = `${functionName}(${argument})`;

        } else if (node.arguments.length == 2) { // RC4 encoding
            let arg1;
            if (node.arguments[0].type == 'Literal') {
                arg1 = node.arguments[0].value;
            } else if (node.arguments[0].type == 'UnaryExpression') {
                arg1 = node.arguments[0].operator + node.arguments[0].argument.raw;
            }
            arg1 = `${arg1} + ${functionWrapperIncrement}`;

            let arg2 = node.arguments[1].raw;
            evalStr = `${functionName}(${arg1}, ${arg2})`;
        }

        let res;
        try {
            res = eval(evalStr);
        } catch {}

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
            let string = eval(node.raw).replace(/'/g, "\\'").replace(/\n/g, '\\n');
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
editedSource = editedSource.replace(/\[(?:"|')([\w\d_$]+)(?:"|')\]/g, '.$1');
editedSource = editedSource.replace(/\[\.([\w\d_$]+)\]/gi, '\[\[\'$1\'\]\]') // reverses any accidental damage we did with the line above


fs.writeFileSync('output/deobfuscated.js', beautify(editedSource));
console.log('Wrote deobfuscated file to output/deobfuscated.js');
