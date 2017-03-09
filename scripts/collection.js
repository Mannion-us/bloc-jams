var buildCollectionItemTemplate = function(album) {
	var template =
		'<div class="collection-album-container column fourth">'
	+ '  <a href="album.html"><img src=" ' + album.albumArtUrl + ' "/></a>'
	+ '  <div class="collection-album-info caption">'
	+ '    <p>'
	+ '      <a class="album-name" href="album.html"> ' + album.title + ' </a>'
	+ '      <br/>'
	+ '      <a href="album.html"> ' + album.artist + ' </a>'
	+ '      <br/>' + album.songs.length
	+ '       songs'
	+ '      <br/>'
	+ '    </p>'
	+ '  </div>'
	+ '</div>'
	;
	return $(template);
};
$(window).load(function() {
     var $collectionContainer = $('.album-covers');
	$collectionContainer.empty(); 
	for (var i = 0; i < albums.length; i++) {
		$collectionContainer.append(buildCollectionItemTemplate(albums[i]));
	}
}
);
