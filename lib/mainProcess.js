"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _electron = require("electron");

var _electronStore = require("electron-store");

var _electronStore2 = _interopRequireDefault(_electronStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vuexStore = new _electronStore2.default();

var INIT = "ys_init";
var CONNECT = "ys_connect";
var SENDDATA = "ys_senddata";

var mainProcess = function () {
    function mainProcess(store) {
        (0, _classCallCheck3.default)(this, mainProcess);

        this.List = new _map2.default();
        this.store = store;
        if (this.store.state) {
            var vuex = vuexStore.get();
            if ((0, _stringify2.default)(vuex) != "{}") {
                var newsState = (0, _assign2.default)(JSON.parse((0, _stringify2.default)(this.store.state)), vuex);
                vuexStore.set(newsState);
                this.store.replaceState(newsState);
            } else {
                vuexStore.set(this.store.state);
            }
        }
        this.init();
    }

    (0, _createClass3.default)(mainProcess, [{
        key: "init",
        value: function init() {
            var _this = this;

            _electron.ipcMain.on(CONNECT, function (event) {
                var id = event.sender.id;
                _this.List.set(event.sender.id, event.sender);
                event.sender.on("destroyed", function () {
                    _this.List.delete(id);
                });
            });

            _electron.ipcMain.on(SENDDATA, function (event, mutation) {
                _this.store.dispatch(mutation.type, mutation.payload);
                if (_this.store.state) {
                    vuexStore.set(_this.store.state);
                }
                _this.noticeRenderers(mutation);
            });
        }
    }, {
        key: "noticeRenderers",
        value: function noticeRenderers(payload) {
            this.List.forEach(function (sender) {
                if (!sender.isDestroyed()) {
                    sender.webContents.send(SENDDATA, payload);
                }
            });
        }
    }]);
    return mainProcess;
}();

exports.default = function (store) {
    new mainProcess(store);
};