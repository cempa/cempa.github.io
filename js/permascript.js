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
  }

  receiveCanon(text, status, jqxhr) {
    $("#load-progress").hide(500);
    this.setCanon(text);
  }

  setCanon(text) {
    this.canon = text.split("\n").map(this.normalizeLine).filter(this.nonEmptyLine);
    let container = $("#permascript");
    let lineNos = $('<div class="line-nos">').appendTo(container);
    let lines = $('<div class="lines">').appendTo(container);
    for (let [index, line] of this.canon.entries()) {
      index = index + 1;
      lineNos.append($(`<div class="line-no"><a href="#${index}" id="${index}">${index}</div>`));
      lines.append($(`<div id="line-${index}" class="line">`).text(line));
    }
    window.location = window.location;
  };

  normalizeLine(line) {
    return line.trim();
  }

  nonEmptyLine(line) {
    return line.length > 0;
  }
}
