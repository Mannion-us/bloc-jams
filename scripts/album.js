var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};
 
var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };

var albumPresley = {
    title: 'Elvis',
    artist: 'Elvis Presley',
    label: 'RCA Victor',
    year: '1956',
    albumArtUrl: 'assets/images/album_covers/rca-ep-1382.jpg',
    songs: [
        { title: 'Rip It Up', duration: 'XX:XX' },
        { title: 'Love Me', duration: 'XX:XX' },
        { title: 'When My Blue Moon Turns to Gold Again', duration: 'XX:XX'},
        { title: 'Long Tall Sally', duration: 'XX:XX' },
        { title: 'First in Line', duration: 'XX:XX'},
        { title: 'Paralyzed', duration: 'XX:XX'},
        { title: 'So Glad You\'re Mine', duration: 'XX:XX'},
        { title: 'Old Shep', duration: 'XX:XX'},
        { title: 'Ready Teddy', duration: 'XX:XX'},
        { title: 'Anyplace is Paradise', duration: 'XX:XX'},
        { title: 'How\'s the World Treating You', duration: 'XX:XX'},
        { title: 'How Do You Think I Feel', duration: 'XX:XX'}
    ]
};

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
        var songNumber = $(this).attr('data-song-number');
        if (currentlyPlayingSong === null)  {
            var currentlyPlayingRow = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingRow.html(currentlyPlayingSong);
        }
        if (currentlyPlayingSong !== songNumber) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSong = songNumber;
        }
        else if (currentlyPlayingSong === songNumber) {
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
     };
  
     var onHover = function(element) {
          var songNumberRow = $(this).find('.song-item-number');
          var songNumber = songNumberRow.attr('data-song-number');

          if  (songNumber !== currentlyPlayingSong)  {
              songNumberRow.html(playButtonTemplate);
          }
     };

     var offHover = function(event) {
         var songNumberRow = $(this).find('.song-item-number');
         var songNumber = songNumberRow.attr('data-song-number');

         if (songNumber !== currentlyPlayingSong)  {
            songNumberRow.html(songNumber);
         }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;     
 };

var setCurrentAlbum = function(album) {

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
          albumsIndex=0;
            }}
        };

    $albumImage.click(function() {
        console.log($albumSongList);
        console.log('$albumImage clicked');
        fixCurrentAlbum();        
    });

};





var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;
 $(document).ready(function() {  
  setCurrentAlbum(albumPicasso);
});
