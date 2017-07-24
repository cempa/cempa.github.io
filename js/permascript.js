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
      let wordedLine = line.replace(/([A-Za-zæþðÆÞĐǽáéíóúýǼÁÉÍÓÚÝċĊġĠǣāēīōūȳǢĀĒĪŌŪȲ-]+)/g, '<span class="word">$1</span>')
      lines.append($(`<div id="line-${index}" class="line"><span class="line-text">${wordedLine}</span></div>`));
    }
    this.setPermahash(window.location.hash);
    window.location = window.location;
  };

  normalizeLine(line) {
    return line.trim();
  }

  nonEmptyLine(line) {
    return line.length > 0;
  }

  setPermahash(hash) {
    let [address, lineNo] = /^#(\d+)/.exec(hash);
    $(".line.selected").removeClass("selected");
    $(`#line-${lineNo}`).addClass("selected");
  }

  handleLocationChange() {
    this.setPermahash(window.location.hash);
  }

  adjustSelection() {
    let sel = rangy.getSelection();
    if (sel.rangeCount != 1) {
      return;
    }
    let range = sel.getRangeAt(0);
    var nodes = range.getNodes([Node.ELEMENT_NODE], function(node) {
      return $(node).hasClass("word");
    });
    if (nodes.length > 0) {
      range.setStartBefore(nodes[0]);
      range.setEndAfter(nodes[ nodes.length - 1 ]);
    }
    sel.setSingleRange(range);
  }
}
