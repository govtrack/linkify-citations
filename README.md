# linkify citations

Scans the DOM for legal citations, finds them, and turns them into HTML links.

## Usage

```html
<script src="https://s3.amazonaws.com/linkify-citations/linkify.min.js"></script>
```

## Advanced Usage

You can control which websites you allow linking to and which page types (web pages, PDFs, and raw HTML) you allow links to by setting optional variables ahead of the script load. The variables specify the allowed websites (`linkify_sources`, see the `id` attribute in the [modules at citation/links](https://github.com/unitedstates/citation/tree/master/links)) and the allowed page types (`linkify_link_types`) in preference order, from most preferred to least preferred.

```html
<script>
var linkify_sources = ["usgpo", "house", "nara", "libraryofcongress", "dc_council", "cornell_lii", "legislink", "govtrack", "courtlistener", "vadecoded"];
var linkify_link_types = ["landing", "pdf", "html"];
</script>
<script src="https://s3.amazonaws.com/linkify-citations/linkify.min.js"></script>
```

You can also customize how the links are inserted into the document by defining `linkify_create_link_node` before the main script tag:

```html
<script>
var linkify_create_link_node = function(link, citation, text, document) {
  var a = document.createElement("a");
  a.setAttribute("class", "citation");
  a.setAttribute("href", link.url);
  a.setAttribute("title", link.source.name + (link.note ? (". " + link.note) : ""));
  a.appendChild(document.createTextNode(text));
  return a;
}
</script>
```

## Development/deployment

Pull requests merged into `master` will automatically be deployed to the S3 bucket. To test things out, you might want to try [rawgit](https://rawgit.com).

### Dependencies

None! Everything is self-contained. Under the hood, a lot of the heavy lifting is done by [citation.js](https://github.com/unitedstates/citation) ([demo](https://theunitedstates.io/citation/)).
