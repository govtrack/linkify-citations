# linkify citations

Scans the DOM for legal citations, finds them, and turns them into HTML links.

## Usage

```html
<script src="https://s3.amazonaws.com/linkify-citations/linkify.min.js"></script>
```

## Advanced Usage

You can control where on the page links are inserted, which websites you allow linking to, which page types (web pages, PDFs, and raw HTML) you allow links to, and how the link `<a>` elements are created by turning off automatic linking and calling the linking function directly.

Here's a simple example assuming you are using jQuery:

```html
<script>
// disable the automatic linking of citations
auto_linkify_citations = false;

window.document.addEventListener("DOMContentLoaded", function() {
  linkify_citations(
    $("#content")[0],
    ["usgpo", "libraryofcongress"]
    );
});
</script>

// load the library
<script src="https://s3.amazonaws.com/linkify-citations/linkify.min.js"></script>
```

The arguments to `linkify_citations` are all optional. They are:

* The DOM element within which to replace links.
* An array of allowed link targets, in order of preference. The default is the complete list of targets provided by the citation library and preferring links to authoritative sources. The values in this array come from the `id` attribute of the [linker modules in the citation library](https://github.com/unitedstates/citation/tree/master/links).
* An array of allowed link page types, in order of preference. The default is `["landing", "pdf", "html"]`. See the documentation for [link rendition types](https://github.com/unitedstates/citation#include-links).
* A function that creates `<a>` elements for the inserted links (see below for example).

Here's a complete example showing the default arguments explicity:

```html
<script>
// disable the automatic linking of citations
auto_linkify_citations = false;

window.document.addEventListener("DOMContentLoaded", function() {
  linkify_citations(
    window.document.body, // where to replace links
    ["usgpo", "house", "nara", "libraryofcongress", "dc_council",
     "cornell_lii", "legislink", "govtrack", "courtlistener",
     "vadecoded"], // targets to allow, in preference order
    ["landing", "pdf", "html"], // allowed target types
    function(link, citation, text, document) { // function to create links
      var a = document.createElement("a");
      a.setAttribute("class", "citation");
      a.setAttribute("href", link.url);
      a.appendChild(document.createTextNode(text));
      return a;
    }
  );
});
</script>

// load the library
<script src="https://s3.amazonaws.com/linkify-citations/linkify.min.js"></script>
```

## Development/deployment

Pull requests merged into `master` will automatically be deployed to the S3 bucket. To test things out, you might want to try [rawgit](https://rawgit.com).

### Dependencies

None! Everything is self-contained. Under the hood, a lot of the heavy lifting is done by [citation.js](https://github.com/unitedstates/citation) ([demo](https://theunitedstates.io/citation/)).
