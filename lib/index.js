"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rendererProcess = exports.mainProcess = undefined;

var _mainProcess = require("./mainProcess");

var _mainProcess2 = _interopRequireDefault(_mainProcess);

var _rendererProcess = require("./rendererProcess");

var _rendererProcess2 = _interopRequireDefault(_rendererProcess);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.mainProcess = _mainProcess2.default;
exports.rendererProcess = _rendererProcess2.default;