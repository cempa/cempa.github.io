---
---

class PermaScript {
  constructor(canonName) {
    this.canonName = canonName;
  }

  setup() {
    $("#load-progress").show(500);
    this.selectionMenu = $("#selection-menu");
    let canonUrl = `/canon/${this.canonName}.txt`;
    $.get(canonUrl, this.receiveCanon.bind(this), "text");
    $(window).on("hashchange", this.handleLocationChange.bind(this));
    $("body").on("mouseup", this.handleSelection.bind(this));
  }

  receiveCanon(text, status, jqxhr) {
    $("#load-progress").hide(500);
    this.setCanon(text);
  }

  setCanon(text) {
    this.canon = text.split("\n").map(this.normalizeLine).filter(this.nonEmptyLine);
    let lineNos = $("#line-nos");
    let lines = $("#lines");
    for (let [index, line] of this.canon.entries()) {
      index = index + 1;
      lineNos.append($(`<div class="line-no"><a href="#${index}"><span class="line-no-text">${index}</span></div>`));
      let wordNo = 1;
      let wordedLine = line.replace(/([A-Za-zæþðÆÞĐÐǽáéíóúýǼÁÉÍÓÚÝċĊġĠǣāēīōūȳǢĀĒĪŌŪȲ-]+)/g, function( word ) {
        return `<span data-addr="${index}.${wordNo}" class="word" data-wordno="${wordNo++}">${word}</span>`
      });
      lines.append($(`<div data-addr="${index}" class="line" data-lineno="${index}"><span class="line-text">${wordedLine}</span></div>`));
    }
    this.selectByHash(window.location.hash);
  };

  normalizeLine(line) {
    return line.trim();
  }

  nonEmptyLine(line) {
    return line.length > 0;
  }

  findNode(addr) {
    return $(`[data-addr="${addr}"]`);
  }

  selectByHash(hash) {
    hash = hash.replace(/^#/,"");
    let [startAddr, endAddr] = hash.split("-");
    let startNode = this.findNode(startAddr);
    if (startNode.length == 0) { return; }
    endAddr = endAddr || startAddr;
    let endNode = this.findNode(endAddr);
    let range = rangy.createRange();
    range.selectNodeContents(startNode.get(0));
    range.setEndAfter(endNode.get(0));
    let sel = rangy.getSelection();
    sel.setSingleRange(range);
    this.scrollTo(startNode);
  }

  scrollTo(node) {
    $('html, body').animate({
      scrollTop: $(node).offset().top - window.innerHeight / 4
    }, 750);
  }

  handleLocationChange(e) {
    e.preventDefault();
    this.selectByHash(window.location.hash);
    return false;
  }

  handleSelection() {
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

  showSelectionMenu() {
    // calculate menu position
    // display the menu
  }

  wordNodesToHash(nodes) {
    let firstNode = nodes[0], lastNode = nodes[ nodes.length - 1 ];
    let start = $(firstNode).data("addr"), end = $(lastNode).data("addr");
    if (start === end) {
      return `#${start}`;
    } else {
      return `#${start}-${end}`;
    }
  }
}

PermaScript.setup = function(canon) {
  new PermaScript(canon).setup();
}
