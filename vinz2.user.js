// ==UserScript==
// @name        vinz2
// @namespace   vinz2
// @description vinz2
// @include     https://review.openstack.org/#/c/164357*
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
//

function gerritGet (url, func){
  var ret;
  $.get( get_url, function( data ) {
  })
  .fail(function(data) {
    ret = jQuery.parseJSON(data.responseText.slice(4));
    func(ret);
  });
}



//alert("hello world from vim");
$( "#gerrit_header" ).remove();
var get_url = "https://review.openstack.org/changes/330250/revisions/09ee4176e7394e0c29ca3fe948033d8ebae230ec/files";
$( document ).ready(function() {
    // Handler for .ready() called.
    console.log('sup2');
    $("#gerrit_ui").remove();
    $("#toggleci").remove();
    $( "body" ).add("<p>").text("Files changed: ");

  gerritGet( get_url, function (data) {
    var items = [];
    $.each( data, function( index ) {
      items.push( "<li id='" + index + "'>" + index + "</li>" );
    });
    $( "<ul/>", {
      "class": "files-modified-list",
      html: items.join( "" )
    }).appendTo( "body" );
        //console.log( "Load was performed." );
  });


});
$( "body" ).html("");
