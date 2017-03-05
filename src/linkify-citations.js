// Load minified citation.js
var Citation = require('citation');

var whitespaceRegex = /^\s*$/;
var citationOptions = {links: true};

var linkify = function(document, element) {
  var snapshot = document.evaluate("//*[local-name(.) != 'script' and local-name(.) != 'style' and local-name(.) != 'a']/text()", element, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (var i = 0; i < snapshot.snapshotLength; i++) {
    var node = snapshot.snapshotItem(i);
    var originalText = node.nodeValue;
    if (whitespaceRegex.test(originalText)) {
      continue;
    }
    var citations = Citation.find(originalText, citationOptions).citations;
    if (citations.length == 0) {
      continue;
    }
    var parentNode = node.parentNode;
    var previousMatchEnd = 0;
    for (var j = 0; j < citations.length; j++) {
      parentNode.insertBefore(document.createTextNode(originalText.substring(previousMatchEnd, citations[j].index)), node);
      var url = getURLfromCitation(citations[j]);
      if (url) {
        var a = document.createElement("a");
        a.setAttribute("href", url);
        a.appendChild(document.createTextNode(citations[j].match));
        parentNode.insertBefore(a, node);
      } else {
        parentNode.insertBefore(document.createTextNode(citations[j].match), node);
      }
      var previousMatchEnd = citations[j].index + citations[j].match.length;
    }
    var lastCitation = citations[citations.length - 1];
    parentNode.insertBefore(document.createTextNode(originalText.substring(previousMatchEnd)), node);
    parentNode.removeChild(node);
  }
};

var getURLfromCitation = function(citation) {
  switch (citation.type) {
    case "usc":
      return citation.usc.links.usgpo.html;
    case "law":
      if (citation.law.links.usgpo) {
        return citation.law.links.usgpo.html || citation.law.links.usgpo.pdf;
      } else {
        return false;
      }
    case "cfr":
      return citation.cfr.links.usgpo.html;
    case "stat":
      if (citation.stat.links.usgpo) {
        return citation.stat.links.usgpo.html || citation.stat.links.usgpo.pdf;
      } else {
        return false;
      }
    case "fedreg":
      return citation.fedreg.links.usgpo.html;
    default:
      return false;
  }
};

if (typeof window === 'undefined') {
  module.exports = {
    getURLfromCitation: getURLfromCitation,
    linkify: linkify
  };
} else {
  window.document.addEventListener("DOMContentLoaded", function() {
    linkify(window.document, window.document.body);
  });
}
