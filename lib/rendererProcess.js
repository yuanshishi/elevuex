"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var rendererProcess = function () {
    function rendererProcess(store) {
        (0, _classCallCheck3.default)(this, rendererProcess);

        this.store = store;
        this.store.originDispatch = this.store.dispatch;
        this.init();
    }

    (0, _createClass3.default)(rendererProcess, [{
        key: "init",
        value: function init() {
            var _this = this;

            this.store.commit = function () {
                throw new Error("vuex\u8BF7\u4F7F\u7528dispatch.");
            };
            this.store.dispatch = function (type, payload) {
                _this.noticeMain({ type: type, payload: payload });
            };
            _electron.ipcRenderer.send(CONNECT);
            _electron.ipcRenderer.on(SENDDATA, function (event, mutation) {
                _this.updateVuex(mutation);
            });

            this.store.replaceState(vuexStore.get());
        }
    }, {
        key: "noticeMain",
        value: function noticeMain(mutation) {
            _electron.ipcRenderer.send(SENDDATA, mutation);
        }
    }, {
        key: "updateVuex",
        value: function updateVuex(mutation) {
            this.store.originDispatch(mutation.type, mutation.payload);
        }
    }]);
    return rendererProcess;
}();

exports.default = function (store) {
    new rendererProcess(store);
};