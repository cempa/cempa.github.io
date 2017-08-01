/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PermaScript = function () {
  function PermaScript(canonName) {
    _classCallCheck(this, PermaScript);

    this.canonName = canonName;
  }

  _createClass(PermaScript, [{
    key: "setup",
    value: function setup() {
      $(".modal").modal();
      $("#load-progress").show(500);
      this.selectionMenu = $("#selection-menu");
      var canonUrl = "/canon/" + this.canonName + ".txt";
      $.get(canonUrl, this.receiveCanon.bind(this), "text");
      $(window).on("hashchange", this.handleLocationChange.bind(this));
      $("body").on("keydown", this.handleKeydown.bind(this));
      $("#lines").on("mouseup", this.adjustSelection.bind(this)).on("contextmenu", this.showContextMenu.bind(this));
      $("a").on("click", this.preventDefault);
      $("a[href='#quote']").on("click", function (event) {
        this.hideSelectionMenu();
        this.facebookQuote();
      }.bind(this));
      $("a[href='#worksheet']").on("click", function (event) {
        this.hideSelectionMenu();
      }.bind(this));
    }
  }, {
    key: "preventDefault",
    value: function preventDefault(event) {
      event.preventDefault();
    }
  }, {
    key: "receiveCanon",
    value: function receiveCanon(text, status, jqxhr) {
      $("#load-progress").hide(500);
      this.setCanon(text);
    }
  }, {
    key: "setCanon",
    value: function setCanon(text) {
      this.canon = text.split("\n").map(this.normalizeLine).filter(this.nonEmptyLine);
      var lineNos = $("#line-nos");
      var lines = $("#lines");
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var _step$value = _slicedToArray(_step.value, 2),
              index = _step$value[0],
              line = _step$value[1];

          index = index + 1;
          lineNos.append($("<div class=\"line-no\"><a href=\"#" + index + "\"><span class=\"line-no-text\">" + index + "</span></div>"));
          var wordNo = 1;
          var wordedLine = line.replace(/([A-Za-zæþðÆÞĐÐǽáéíóúýǼÁÉÍÓÚÝċĊġĠǣāēīōūȳǢĀĒĪŌŪȲ-]+)/g, function (word) {
            return "<span data-addr=\"" + index + "." + wordNo + "\" class=\"word\" data-wordno=\"" + wordNo++ + "\">" + word + "</span>";
          });
          lines.append($("<div class=\"line\" data-lineno=\"" + index + "\"><span data-addr=\"" + index + "\"class=\"line-text\">" + wordedLine + "</span>\n</div>"));
        };

        for (var _iterator = this.canon.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.selectByHash(window.location.hash);
    }
  }, {
    key: "normalizeLine",
    value: function normalizeLine(line) {
      return line.trim();
    }
  }, {
    key: "nonEmptyLine",
    value: function nonEmptyLine(line) {
      return line.length > 0;
    }
  }, {
    key: "findNode",
    value: function findNode(addr) {
      return $("[data-addr=\"" + addr + "\"]");
    }
  }, {
    key: "selectByHash",
    value: function selectByHash(hash) {
      hash = hash.replace(/^#/, "");

      var _hash$split = hash.split("-"),
          _hash$split2 = _slicedToArray(_hash$split, 2),
          startAddr = _hash$split2[0],
          endAddr = _hash$split2[1];

      var startNode = this.findNode(startAddr);
      if (startNode.length == 0) {
        return;
      }
      endAddr = endAddr || startAddr;
      var endNode = this.findNode(endAddr);
      var range = rangy.createRange();
      range.selectNodeContents(startNode.get(0));
      range.setEndAfter(endNode.get(0));
      var sel = rangy.getSelection();
      sel.setSingleRange(range);
      this.scrollTo(startNode);
    }
  }, {
    key: "showSelectionMenu",
    value: function showSelectionMenu() {
      var wordNodes = this.getSelectedWordNodes();
      if (wordNodes.length == 0) {
        return;
      }
      var offset = $(wordNodes[0]).offset();
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = wordNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var node = _step2.value;

          var nodeRight = $(node).offset().left + $(node).width();
          if (offset.left < nodeRight) {
            offset.left = nodeRight;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      offset.left += 10;
      this.selectionMenu.show().offset(offset);
    }
  }, {
    key: "hideSelectionMenu",
    value: function hideSelectionMenu() {
      this.selectionMenu.hide();
    }
  }, {
    key: "handleKeydown",
    value: function handleKeydown(event) {
      if (this.selectionMenu.is(":visible") && event.key == "Escape") {
        event.preventDefault();
        this.hideSelectionMenu();
        return false;
      }
    }
  }, {
    key: "facebookQuote",
    value: function facebookQuote() {
      FB.ui({
        method: 'share',
        quote: this.getSelectedText(),
        href: window.location.toString()
      }, function (response) {});
    }
  }, {
    key: "getSelectedText",
    value: function getSelectedText() {
      return rangy.getSelection().toString();
    }
  }, {
    key: "scrollTo",
    value: function scrollTo(node) {
      $('html, body').animate({
        scrollTop: $(node).offset().top - window.innerHeight / 4
      }, 750);
    }
  }, {
    key: "handleLocationChange",
    value: function handleLocationChange(event) {
      event.preventDefault();
      this.selectByHash(window.location.hash);
      return false;
    }
  }, {
    key: "getSelectedWordNodes",
    value: function getSelectedWordNodes() {
      var sel = rangy.getSelection();
      if (sel.rangeCount != 1) {
        return;
      }
      var range = sel.getRangeAt(0);
      var result = range.getNodes([Node.ELEMENT_NODE], function (node) {
        return $(node).hasClass("word");
      });
      if (result.length === 0) {
        result = range.getNodes([Node.TEXT_NODE]).map(function (textNode) {
          return $(textNode).closest(".word");
        }).filter(function (node) {
          return node;
        });
      }
      return result;
    }
  }, {
    key: "adjustSelection",
    value: function adjustSelection(event) {
      var wordNodes = this.getSelectedWordNodes();
      if (wordNodes.length == 0) {
        this.hideSelectionMenu();
        return;
      }
      var newHash = this.wordNodesToHash(wordNodes);
      window.location.hash = newHash;
    }
  }, {
    key: "showContextMenu",
    value: function showContextMenu(event) {
      event.preventDefault();
      var sel = rangy.getSelection();
      if (sel.rangeCount === 1 && !sel.getRangeAt(0).collapsed) {
        this.showSelectionMenu();
      }
    }
  }, {
    key: "wordNodesToHash",
    value: function wordNodesToHash(nodes) {
      var firstNode = nodes[0],
          lastNode = nodes[nodes.length - 1];
      var start = $(firstNode).data("addr"),
          end = $(lastNode).data("addr");
      if (start === end) {
        return "#" + start;
      } else {
        return "#" + start + "-" + end;
      }
    }
  }]);

  return PermaScript;
}();

PermaScript.setup = function (canon) {
  new PermaScript(canon).setup();
};

window.PermaScript = PermaScript;

/***/ })
/******/ ]);