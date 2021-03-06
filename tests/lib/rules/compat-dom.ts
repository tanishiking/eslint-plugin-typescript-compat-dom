var rule = require("../../../lib/rules/compat-dom"),

RuleTester = require("eslint").RuleTester;

var ruleTester = new RuleTester({
    parserOptions: {
        preserveNodeMaps: true,
        tsconfigRootDir: './tests/fixture-project/',
        project: './tsconfig.json',
        createDefaultProgram: true,
    },

    parser: require.resolve('@typescript-eslint/parser'),
});

ruleTester.run("compat-dom", rule, {

    valid: [
        `e.prepend();`,
        `e.appendChild();`,
         `class A { prepend() {} }; new A().prepend();`,
         `namespace Foo { class Element { }; new Element().prepend(); }`,
         {
            code: `navigator.vibrate()`,
            options: [ { browserslist: ['android 4.4.3']} ],
        },
        {
            code: `document.createElement('div')`,
            options: [ { browserslist: ['android >= 4.1']} ],
        },
    ],

    invalid: [
        {
            code: `const p = (e: Element) => { e.prepend() };`,
            errors: [{
                message: "prepend is not supported in ie 11. https://developer.mozilla.org/docs/Web/API/ParentNode/prepend",
                type: "MemberExpression"
            }],
            options: [ { browserslist: ['ie 11']} ],
        },
        {
            code: `const p = (e: Element) => { e.prepend };`,
            errors: [{
                message: "prepend is not supported in ie 11. https://developer.mozilla.org/docs/Web/API/ParentNode/prepend",
                type: "MemberExpression"
            }],
            options: [ { browserslist: ['ie 11']} ],
        },
        {
            code: `document.querySelector('div').prepend();`,
            errors: [{
                message: "prepend is not supported in ie 11. https://developer.mozilla.org/docs/Web/API/ParentNode/prepend",
                type: "MemberExpression"
            }],
            options: [ { browserslist: ['ie 11']} ],
        },
        {
            code: `document.querySelector('div');`,
            errors: [{
                message: "querySelector is not supported in ie 6. https://developer.mozilla.org/docs/Web/API/Document/querySelector",
                type: "MemberExpression"
            }],
            options: [ { browserslist: ['ie 6']} ],
        },
        {
            code: `new ServiceWorker()`,
            errors: [{
                message: "ServiceWorker is not supported in ie 6. https://developer.mozilla.org/docs/Web/API/ServiceWorker",
                type: "Identifier"
            }],
            options: [ { browserslist: ['ie 6']} ],
        },
        {
            code: `navigator.vibrate()`,
            errors: [{
                message: "vibrate is not supported in android 4.4. https://developer.mozilla.org/docs/Web/API/Navigator/vibrate",
                type: "MemberExpression"
            }],
            options: [ { browserslist: ['android 4.4']} ],
        },
    ]
});
