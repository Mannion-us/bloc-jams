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
 
//     return template;
       return $(template);
 };


//  var albumTitle = document.getElementsByClassName('album-view-title')[0];
//  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
//  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
//  var albumImage = document.getElementsByClassName('album-cover-art')[0];
//  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];


  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  var setCurrentAlbum = function(album) {

//    albumTitle.firstChild.nodeValue = album.title;
//    albumArtist.firstChild.nodeValue = album.artist;
//    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
//    albumImage.setAttribute('src', album.albumArtUrl);

     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

//    albumSongList.innerHTML = '';
     $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
//        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
    }
};
//  the following function helps us define a parent of a node/element for later use //
var findParentByClassName = function(element, targetClass) { //take an element, call it's parent//
    if (element) {
        var currentParent = element.parentElement;  //take that parent element and call it's class name//
        while (currentParent.className != targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;  //compare || reset as new parent  //
        }
        return currentParent; //if compare matches return it as found parentByClassName     //
    }
};    
//  the following function helps us find an element with the .song-item-number class for later use  //
var getSongItem = function(element) { //given any element we'll pass it into findParentByClassName() with a class name  //
    switch (element.className) {  //the return element will be the .song-item-number element  //
        case 'album-song-button':  //each case takes the passed element and compares it to a specific ClassName to analyze// 
        case 'ion-play':  //once compared and determined the return value should be the .song-item-number for that inputed//
        case 'ion-pause': //element/node. //
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

//Function to handle "clicks" where we will be passing in "elements"/"nodes" //
var clickHandler = function(targetElement) {

    var songItem = getSongItem(targetElement);  

    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
    else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    }
    else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }

};

// Elements to which we'll be adding listeners


var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

//  Pause button template
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;




//  This is an attempt to create a funciton to resolve setCurrentAlbum problem with playButtonTemplate not recieving the events triggered.

var fix = function() {songListContainer.addEventListener('mouseover', function(event) {
              // #1
              //console.log(event.target);
              // Only target individual song rows during event delegation
              if (event.target.parentElement.className === 'album-view-song-item') {
              // Change the content from the number to the play button's HTML
                event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;

              var songItem = getSongItem(event.target);

              if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                  songItem.innerHTML = playButtonTemplate;
                  }

                }
              });

              for (var i = 0; i < songRows.length; i++) {
                  songRows[i].addEventListener('mouseleave', function(event) {
                    //console.log(event.target);
                    // Revert the content back to the number
                    // Selects first child element, which is the song-item-number element
                    //this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
                    // #1
                    var songItem = getSongItem(event.target);
                    var songItemNumber = songItem.getAttribute('data-song-number');
                    // #2
                    if  (songItemNumber !== currentlyPlayingSong) {
                        songItem.innerHTML = songItemNumber;
                    }

                  });
                  //Event Listener for the Song Row "clicks"  //
                  songRows[i].addEventListener('click', function(event) {
                       // Event handler call
                    clickHandler(event.target);
                  });
              }
};




window.onload = function() {
  setCurrentAlbum(albumPicasso);

  fix();

  var albums = [albumPicasso, albumMarconi, albumPresley];

  var index = 1;

  $albumImage.click(function() {
        setCurrentAlbum(albums[index]);
        fix();
        index++;
        if(index == albums.length){
      index=0;
        }
    });

//This function is used solely for identification purposes

//  var readConsoleLog = function()  {
//    songListContainer.addEventListener("mouseover", function(event)  {
//      console.log(event);
//      console.log(event.target);
//      console.log(event.target.parentElement.className);
//      var parent = event.target.parentElement.className;
//      console.log(parent);
//      });
//};
//  readConsoleLog();
};
