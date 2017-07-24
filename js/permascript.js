---
---

class PermaScript {
  constructor(canonName) {
    this.canonName = canonName;
  }

  setup() {
    $("#load-progress").show(500);
    let canonUrl = `/canon/${this.canonName}.txt`;
    $.get(canonUrl, this.receiveCanon.bind(this), "text");
    $(window)
      .on("popstate", this.handleLocationChange.bind(this));
    $("body")
      .on("mouseup", this.adjustSelection.bind(this));
  }

  receiveCanon(text, status, jqxhr) {
    $("#load-progress").hide(500);
    this.setCanon(text);
  }

  setCanon(text) {
    this.canon = text.split("\n").map(this.normalizeLine).filter(this.nonEmptyLine);
    let container = $("#permascript");
    let lineNos = $('<div class="line-nos col s2 m1">').appendTo(container);
    let lines = $('<div class="lines col s10 m11">').appendTo(container);
    for (let [index, line] of this.canon.entries()) {
      index = index + 1;
      lineNos.append($(`<div class="line-no"><a href="#${index}" id="${index}"><span class="line-no-text">${index}</span></div>`));
      let wordNo = 1;
      let wordedLine = line.replace(/([A-Za-zæþðÆÞĐÐǽáéíóúýǼÁÉÍÓÚÝċĊġĠǣāēīōūȳǢĀĒĪŌŪȲ-]+)/g, function( word ) {
        return `<span class="word" data-wordno="${wordNo++}">${word}</span>`
      });
      lines.append($(`<div id="line-${index}" class="line" data-lineno="${index}"><span class="line-text">${wordedLine}</span></div>`));
    }
    this.selectByHash(window.location.hash);
    window.location = window.location;
  };

  normalizeLine(line) {
    return line.trim();
  }

  nonEmptyLine(line) {
    return line.length > 0;
  }

  selectByHash(hash) {
    let [address, lineNo] = /^#(\d+)/.exec(hash);
    let lineNode = $(`#line-${lineNo}`).get(0);
    let sel = rangy.getSelection();
    sel.selectAllChildren(lineNode);
  }

  handleLocationChange() {
    this.selectByHash(window.location.hash);
  }

  adjustSelection() {
    let sel = rangy.getSelection();
    if (sel.rangeCount != 1) {
      return;
    }
    let range = sel.getRangeAt(0);
    var wordNodes = range.getNodes([Node.ELEMENT_NODE], function(node) {
      return $(node).hasClass("word");
    });
    if (wordNodes.length == 0) {
      return;
    }
    let newHash = this.wordNodesToHash(wordNodes);
    window.location.hash = newHash;
  }

  wordNodesToHash(nodes) {
    let firstNode = nodes[0], lastNode = nodes[ nodes.length - 1 ];
    let firstLine = $(firstNode).closest(".line"), lastLine = $(lastNode).closest(".line");
    let firstLineNo = $(firstLine).data("lineno");
    let lastLineNo = $(lastLine).data("lineno");
    let firstWordNo = $(firstNode).data("wordno");
    let lastWordNo = $(lastNode).data("wordno");
    let startAddr = firstLineNo;
    if (firstWordNo > 1) {
      startAddr += "." + firstWordNo;
    }
    return `#${startAddr}-${lastLineNo}.${lastWordNo}`;
  }
}
