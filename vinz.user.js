// ==UserScript==
// @name        vinz
// @namespace   vinz
// @description vinz
// @include     https://review.openstack.org/#/c/*
// @version     1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
//

function gerritGet (url, func){
  $.get( url, function( data ) {
  })
  .fail(function(data) {
    var ret = jQuery.parseJSON(data.responseText.slice(4));
    func(ret);
  });
}


$( document ).ready(function() {
  // Handler for .ready() called.
  var token;

  // Cleanup Gerrit
  $( "#gerrit_header" ).remove();
  $( "#gerrit_ui").remove();
  $( "#toggleci").remove();

  // bootstrap
  $( "head" ).prepend('<meta charset="utf-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"> <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->');
  $( "head" ).append('<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">');
  $( "head" ).append('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>');

  // Get auth Token
  $.get("/", function (data) {
    idx = data.search('xGerritAuth');
    var token = data.slice(idx + 13, idx + 13 + 32);

    var window_url    = window.location.href;
    var change_number = window_url.split('/')[5];
    gerritGet("changes/" + change_number +  "/detail?O=404", function (data) {
      $( "body" ).append("<h1/>").text("Change #"+ data._number + " " + data.subject + " -- " + data.owner.name);

      $( "<p>").text("Files changed:").appendTo( "body" );

      // Create list of files that have been changed
      var get_url = "changes/" + data._number + "/revisions/" + data.current_revision + "/files";
      gerritGet( get_url, function (data) {
        var items = [];
        $.each( data, function( index ) {
          items.push( "<li id='" + index + "'>" + index + "</li>" );
        });
        $( "<ul/>", {
          "class": "files-modified-list",
          html: items.join( "" )
        }).appendTo( "body" );
      });
    });
    $( "body" ).after( "<p>Press here to +1: <input type='button' id='vote'></p>" );
    $( "#vote" ).click(function() {
      var review = {"labels":{"Code-Review":1,"Workflow":0},"strict_labels":true,"drafts":"KEEP","comments":{},"message":"test"};
      $.ajax({
              type:"POST",
              beforeSend: function (request)
              {
                  request.setRequestHeader("X-Gerrit-Auth", token);
              },
              url: "changes/330860/revisions/ac2c4ea7ec7158f68813390324a1731a3e7043e5/review",
              data: JSON.stringify(review),
              async: false,
              dataType: "json",
              contentType: 'application/json; charset=utf-8',
      });
    });

  }).fail(function(data) {
    console.log("Failed " + data);
  });
});

// overload this to disable the hideci.js trickery
window.onload = undefined