module.exports = {
    
    isArrayShifter: function(node) {
        return (node.type == 'VariableDeclarator')
        && (node.id && node.id.type == 'Identifier')
        && (node.init && node.init.type == 'FunctionExpression')
        && (node.init.params && node.init.params.length == 2)
        && (node.init.body && node.init.body.type == 'BlockStatement')
        && (node.init.body.body[0] && node.init.body.body[0].type == 'ExpressionStatement')
        && (node.init.body.body[0].expression && node.init.body.body[0].expression.type == 'AssignmentExpression')
        && (node.init.body.body[0].expression.right && node.init.body.body[0].expression.right.type == 'BinaryExpression');
    },

    isStringArrayVariableWrapper: function(node, functionNames) {
        return (node.type == 'VariableDeclaration' && node.declarations)
        && (node.declarations[0].init && node.declarations[0].init.type == 'Identifier')
        && (!functionNames.includes(node.declarations[0].id.name) && functionNames.includes(node.declarations[0].init.name));
    },

    isStringArrayFunctionWrapper: function(node, functionName) {
        return (node.type == 'VariableDeclarator')
        && (node.id && node.id.type == 'Identifier')
        && (node.init && node.init.type == 'FunctionExpression')
        && (node.init.params && node.init.params.length == 2)
        && (node.init.body && node.init.body.type == 'BlockStatement')
        && (node.init.body.body[0] && node.init.body.body[0].type == 'ReturnStatement')
        && (node.init.body.body[0].argument && node.init.body.body[0].argument.type == 'CallExpression')
        && (node.init.body.body[0].argument.callee && node.init.body.body[0].argument.callee.type == 'Identifier')
        && (node.init.body.body[0].argument.callee.name == functionName);
    },

    isStringUse: function(node, functionNames) {
        return (node.type == 'CallExpression')
        && (node.callee && node.callee.type == 'Identifier')
        && (functionNames.includes(node.callee.name))
        && (node.arguments);
    },

    isSelfDefendingExpression(node) {
        return (node.type == 'ReturnStatement')
        && (node.argument && node.argument.type == 'CallExpression')
        && (node.argument.callee && node.argument.callee.type == 'MemberExpression')
        && (node.argument.callee.property && node.argument.callee.property.type == 'Literal' && node.argument.callee.property.value == 'test')
        && (node.argument.arguments && node.argument.arguments.length == 1);
    },

    isUnarySelfDefendingExpression: function(node) {
        return (node.type == 'ReturnStatement')
        && (node.argument && node.argument.type == 'UnaryExpression')
        && (node.argument.argument && node.argument.argument.type == 'CallExpression')
        && (node.argument.argument.callee && node.argument.argument.callee.type == 'MemberExpression')
        && (node.argument.argument.callee.property && node.argument.argument.callee.property.type == 'Literal' && node.argument.argument.callee.property.value == 'test')
        && (node.argument.argument.arguments && node.argument.argument.arguments.length == 1);
    },

    getVariableName: function(index) {
        let name = '';
        while (index > 0) {
            t = (index - 1) % 26;
            name = String.fromCharCode(97 + t) + name;
            index = (index - t)/26 | 0;
        }
        return name;
    },

    keywords: ['await','break','case','catch','class','const','continue','debugger','default','delete','do','else','enum','export','extends','false','finally','for','function','if','implements','import','in','instanceof','interface','let','new','null','package','private','protected','public','return','super','switch','static','this','throw','try','True','typeof','var','void','while','with','yield']
}