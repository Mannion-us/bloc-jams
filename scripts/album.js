  var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'+
      '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'+
      '  <td class="song-item-title">' + songName + '</td>'+
      '  <td class="song-item-duration">' + songLength + '</td>'+
      '</tr>'
      ;
 
     var $row = $(template);

     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber === null)  {
            var currentlyPlayingRow = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingRow.html(currentlyPlayingSongNumber);
            //No reference to "currentSongFromAlbum" here?!?!  Why? //
            updatePlayerBarSong();
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            $('main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            //console.log('line 25' + ' ' + currentSongFromAlbum.toString());
            //console.log('line 26' + ' ' + currentAlbum.songs[songNumber - 1].toString());
            //No reference to "fixing the existing 'Template' to return original values onclick of a 'new' song"  //
            //'Fix' could include 'restoring' 'currentlyPlayingRow.html' with 'previousPlayingRow.html' 'content' as //
            //a single 'var previousPlayingRow.html = ' before line '$(this).html(pauseButtonTemplate);'.  //
            //This 'fix' needs to be implemented before "Use the Song Data to Update the Player Bar" portion of the //
            //checkpoint.
        }
        else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
            //No understanding of why this 'else if' statement is setting 'content' to 'null'... //
            //except that 'nothing' is playing if the 'currentlyPlayingSongNumber' is in fact NOT playing anything. //
            //but again a 'restore' of the 'currentlyPlayingRow.html' should be happening here.  //
        }
     };

     var onHover = function(element) {
          var songNumberRow = $(this).find('.song-item-number');
          var songNumber = parseInt(songNumberRow.attr('data-song-number'));

          if  (songNumber !== currentlyPlayingSongNumber)  {
              songNumberRow.html(playButtonTemplate);
              //Need to ask mentor about ::before selector to be used to 'restore' content onhover.  //
              //specifically in terms of offHovering one song onto another while the 'pause' icon does not //
              //reflect correctly the current status unless it is onHovered back over again.  //
          }
     };

     var offHover = function(event) {
         var songNumberRow = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberRow.attr('data-song-number'));

         if (songNumber !== currentlyPlayingSongNumber)  {
            songNumberRow.html(songNumber);
            //See note under onHover() regarding updating for 'fix' of stale icons within the 'songNumberRow.html()'. //
            //Ask Mentor about how to implement a 'fix' to stale icons on the offHover() as well as the onHover().  //
         }
         //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
};

  var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    $albumSongList.empty();

    for (i = 0; i < album.songs.length; i++) {
        var $newRow= createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }

    var fixCurrentAlbum = function() {
        var albums = [albumPicasso, albumMarconi, albumPresley];
        var albumsIndex = 1;
        for (albumIndex = 1; albumIndex < albums.length; albumIndex++){
        setCurrentAlbum(albums[albumsIndex]);
        console.log(albums[albumsIndex]);
        if(albumsIndex === albums.length){
          albumsIndex = 0;
            }}
        };

    $albumImage.click(function() {
        console.log($albumSongList);
        console.log('$albumImage clicked');
        fixCurrentAlbum();        
    });

};

var updatePlayerBarSong = function(){
    //  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    //Console log error message indicating 'currentSongFromAlbum' is null...line commented out.
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    //  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    //Console log error message indicating 'currentSongFromAlbum' is null...ling commented out.
    $('main-controls .play-pause').html(playerBarPauseButton);
};


var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var getLastSongNumber = function(index){
  return index == 0 ? currentAlbum.songs.length : index;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length){
  currentSongIndex = 0;
  };

  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberRow = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberRow = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberRow.html(pauseButtonTemplate); //$nextSongNumberCell.html//
  $lastSongNumberRow.html(lastSongNumber);
};

var previousSong = function(){
  var getLastSongNumber = function(index) {
  return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  currentlyPlayingSongNumber = currentSongIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberRow = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberRow = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $previousSongNumberRow.html(pauseButtonTemplate);
  $lastSongNumberRow.html(lastSongNumber);

};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {  
  setCurrentAlbum(albumPicasso);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
/*  console.log('The following are all the variables:');
  console.log(playButtonTemplate);
  console.log(pauseButtonTemplate);
  console.log(currentAlbum);
  console.log(currentlyPlayingSongNumber);
  console.log(currentSongFromAlbum);
  console.log(fixCurrentAlbum);
  console.log(setCurrentAlbum);
  console.log()
  console.log()
  console.log()
  console.log()
  console.log()
  console.log('And that was the entire list of variables with their current ID:Value pairing...');*/
});
