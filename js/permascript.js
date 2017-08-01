class PermaScript {
  constructor(canonName) {
    this.canonName = canonName;
  }

  setup() {
    $(".modal").modal();
    $("#load-progress").show(500);
    this.selectionMenu = $("#selection-menu");
    let canonUrl = `/canon/${this.canonName}.txt`;
    $.get(canonUrl, this.receiveCanon.bind(this), "text");
    $(window).on("hashchange", this.handleLocationChange.bind(this));
    $("body")
      .on("keydown", this.handleKeydown.bind(this));
    $("#lines")
      .on("mouseup", this.adjustSelection.bind(this))
      .on("contextmenu", this.showContextMenu.bind(this));
    $("a").on("click", this.preventDefault);
    $("a[href='#quote']").on("click", function(event) {
      this.hideSelectionMenu();
      this.facebookQuote();
    }.bind(this));
    $("a[href='#worksheet']").on("click", function(event) {
      this.hideSelectionMenu();
    }.bind(this));
  }

  preventDefault(event) { event.preventDefault(); }

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
      lines.append($(`<div class="line" data-lineno="${index}"><span data-addr="${index}"class="line-text">${wordedLine}</span>\n</div>`));
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

  showSelectionMenu() {
    let wordNodes = this.getSelectedWordNodes();
    if (wordNodes.length == 0) { return; }
    let offset = $(wordNodes[0]).offset();
    for(let node of wordNodes) {
      let nodeRight = $(node).offset().left + $(node).width();
      if (offset.left < nodeRight) {
        offset.left = nodeRight;
      }
    }
    offset.left += 10;
    this.selectionMenu.show().offset(offset);
  }

  hideSelectionMenu() {
    this.selectionMenu.hide();
  }

  handleKeydown(event) {
    if (this.selectionMenu.is(":visible") && event.key == "Escape") {
      event.preventDefault();
      this.hideSelectionMenu();
      return false;
    }
  }

  facebookQuote() {
    FB.ui({
      method: 'share',
      quote: this.getSelectedText(),
      href: window.location.toString()
    }, function(response){ });
  }

  getSelectedText() {
    return rangy.getSelection().toString();
  }

  scrollTo(node) {
    $('html, body').animate({
      scrollTop: $(node).offset().top - window.innerHeight / 4
    }, 750);
  }

  handleLocationChange(event) {
    event.preventDefault();
    this.selectByHash(window.location.hash);
    return false;
  }

  getSelectedWordNodes() {
    let sel = rangy.getSelection();
    if (sel.rangeCount != 1) {
      return;
    }
    let range = sel.getRangeAt(0);
    let result = range.getNodes([Node.ELEMENT_NODE], function(node) {
      return $(node).hasClass("word");
    });
    if (result.length === 0) {
      result = range.getNodes([Node.TEXT_NODE]).map(function(textNode){
        return $(textNode).closest(".word");
      }).filter(function(node) {
        return node;
      });
    }
    return result;
  }

  adjustSelection(event) {
    let wordNodes = this.getSelectedWordNodes();
    if (wordNodes.length == 0) {
      this.hideSelectionMenu();
      return;
    }
    let newHash = this.wordNodesToHash(wordNodes);
    window.location.hash = newHash;
  }

  showContextMenu(event) {
    event.preventDefault();
    let sel = rangy.getSelection();
    if (sel.rangeCount === 1 && !sel.getRangeAt(0).collapsed) {
      this.showSelectionMenu();
    }
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

window.PermaScript = PermaScript;
