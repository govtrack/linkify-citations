var test = require('tape');
var linkify = require('../src/linkify-citations.js');
var fs = require('fs');
var domify = require('domify');
var jsdom = require('jsdom');


var testCite = {
  "type": "usc",
  "match": "5 U.S.C. 552(a)(1)(E)",
  "index": 12,
  "citation": "5 U.S.C. 552(a)(1)(E)",
  "usc": {
    "title": "5",
    "section": "552",
    "subsections": [
      "a",
      "1",
      "E"
    ],
    "id": "usc/5/552/a/1/E",
    "links": {
      "cornell_lii": {
        "landing": "https://www.law.cornell.edu/uscode/text/5/552#a_1_E",
        "note": "Link is to most current version of the US Code, as available at law.cornell.edu.",
        "source": {
          "name": "Cornell Legal Information Institute",
          "abbreviation": "Cornell LII",
          "link": "https://www.law.cornell.edu/uscode/text",
          "authoritative": false
        }
      },
      "usgpo": {
        "pdf": "http://api.fdsys.gov/link?collection=uscode&year=2014&title=5&section=552&type=usc",
        "html": "http://api.fdsys.gov/link?collection=uscode&year=2014&title=5&section=552&type=usc&link-type=html",
        "landing": "http://api.fdsys.gov/link?collection=uscode&year=2014&title=5&section=552&type=usc&link-type=contentdetail",
        "note": "2014 edition. Sub-section citation is not reflected in the link.",
        "source": {
          "name": "U.S. Government Publishing Office",
          "abbreviation": "US GPO",
          "link": "https://www.gpo.gov",
          "authoritative": true
        }
      },
      "house": {
        "note": "Link is to most current version of the US Code.",
        "html": "http://uscode.house.gov/view.xhtml?req=(title%3A5%20section%3A552%20edition%3Aprelim)",
        "source": {
          "name": "Office of the Law Revision Counsel of the United States House of Representatives",
          "abbreviation": "House OLRC",
          "link": "http://uscode.house.gov/",
          "authoritative": true
        }
      }
    }
  }
};

test('test getURLfromCitation', function(t) {
    t.plan(1);
    var URL = linkify.getURLfromCitation(testCite);
    t.equal(URL, 'http://api.fdsys.gov/link?collection=uscode&year=2014&title=5&section=552&type=usc&link-type=html');
});

test('test against mock file', function (t){
    t.plan(1);
    var html = fs.readFileSync(__dirname + '/test.html','utf8');
    var dom = jsdom.jsdom(html);
    var document = dom.defaultView.document;
    linkify.linkify(document, document.body);
    var mock = fs.readFileSync(__dirname + '/testLinked.html','utf8');
    t.equal(dom.defaultView.document.documentElement.innerHTML, mock);
    t.end();
})
