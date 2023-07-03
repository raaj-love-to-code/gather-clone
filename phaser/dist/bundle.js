/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/***/ (() => {

eval("$(document).ready(() => {\r\n    var config = {\r\n        type: Phaser.AUTO,\r\n        width: '100%',\r\n        height: 400,\r\n        scene: {\r\n            preload: preload,\r\n            create: create,\r\n            update: update\r\n        }\r\n    };\r\n    \r\n    var game = new Phaser.Game(config);\r\n    \r\n    function preload ()\r\n    {\r\n        this.load.image('sky', '../../assets/bg.png');\r\n    }\r\n    \r\n    function create ()\r\n    {\r\n        this.add.image(500, 200, 'sky');\r\n    }\r\n    \r\n    function update ()\r\n    {\r\n    }\r\n});\n\n//# sourceURL=webpack://phaser/./src/js/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/index.js"]();
/******/ 	
/******/ })()
;