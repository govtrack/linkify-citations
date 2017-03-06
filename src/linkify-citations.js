// Load minified citation.js
var Citation = require('citation');

var whitespaceRegex = /^\s*$/;
var citationOptions = {links: true};
var UNORDERED_NODE_SNAPSHOT_TYPE = 6;

var linkify = function(document, element, allowed_sources, allowed_link_types) {
  var snapshot = document.evaluate("//*[local-name(.) != 'script' and local-name(.) != 'style' and local-name(.) != 'a']/text()", element, null, UNORDERED_NODE_SNAPSHOT_TYPE, null);
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
      var url = getLinkFromCitation(citations[j], allowed_sources, allowed_link_types);
      if (url) {
        var a = document.createElement("a");
        a.setAttribute("class", "citation");
        a.setAttribute("href", url.url);
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

var default_allowed_link_types = ["landing", "pdf", "html"];

var getLinkFromCitation = function(citation, allowed_sources, allowed_link_types) {
  // Get the links for the citation.
  var links = citation[citation.type].links;
  var link_sources = Object.keys(links);

  // Filter out types that aren't in allowed_sources, if allowed_sources was given.
  if (typeof allowed_sources != "undefined") {
    link_sources = link_sources.filter(function(key) {
      return allowed_sources.indexOf(key) != -1;
    });
  }

  // Are there any links?
  if (link_sources.length == 0)
    return null;

  // Sort the links. If allowed_sources was given, sort by the order in which they
  // occur in allowed_sources so that we can find the most preferred source. If
  // allowed_sources is not given, then allow all sources but sort authoritative
  // sources first.
  var preferred_link = link_sources.sort(function(a, b) {
    if (typeof allowed_sources === "undefined")
      // The user didn't specify a preference, so just prefer authoritative sources.
      // Taking advantage of arithmetic operator coercion of false and true to 0 and 1.
      return links[b].source.authoritative - links[a].source.authoritative;
    else
      // Sort by the preference order.
      return allowed_sources.indexOf(a) - allowed_sources.indexOf(b);
  });

  // Choose the link for the source that appears earliest in the allowed_sources.
  var link = links[preferred_link[0]];

  // Choose the best rendition type out of the ones white-listed by allowed_link_types,
  // using default_link_types if allowed_link_types is not provided.
  if (typeof allowed_link_types === "undefined")
    allowed_link_types = default_allowed_link_types;
  var link_types = Object.keys(link).filter(function(key) {
    return allowed_link_types.indexOf(key) != -1;
  });
  if (link_types.length == 0)
    return null;
  var preferred_link_type = link_types.sort(function(a, b) {
    return allowed_link_types.indexOf(a) - allowed_link_types.indexOf(b);
  });

  // Return the URL for the link type that appears earliest in the allowed_link_types list.
  return {
    url: link[preferred_link_type[0]], // the link target
    format: preferred_link_type[0], // "pdf", "landing" etc.
    source: link.source, // source information
    note: link.note // note about the link
  };
}

if (typeof window === 'undefined') {
  module.exports = {
    getLinkFromCitation: getLinkFromCitation,
    linkify: linkify
  };
} else {
  window.document.addEventListener("DOMContentLoaded", function() {
    linkify(window.document, window.document.body, window.linkify_sources, window.linkify_link_types);
  });
}
