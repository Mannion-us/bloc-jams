var getSongNumberRow = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};
var createSongRow = function(songNumber, songName, songLength) {
  var template =
      '<tr class="album-view-song-item">'+
      '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'+
      '  <td class="song-item-title">' + songName + '</td>'+
      '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'+
      '</tr>'
      ;
  var $row = $(template);
  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));
    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingRow = getSongNumberRow(currentlyPlayingSongNumber);
      currentlyPlayingRow.html(currentlyPlayingSongNumber);
      }
    if (currentlyPlayingSongNumber !== songNumber) {
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updateSeekBarWhileSongPlays();
      updatePlayerBarSong();
          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});
      }
    else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()){
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
        }
      else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
        }
      }
  };
  var onHover = function(event) {
    var songNumberRow = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberRow.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberRow.html(playButtonTemplate);
        }
    };
  var offHover = function(event) {
    var songNumberRow = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberRow.attr('data-song-number'));
    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberRow.html(songNumber);
        }
    };
  $row.find('.song-item-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;
};
var setSong = function(songNumber) {
    if (currentSoundFile) {
      currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: [ 'mp3' ],
      preload: true
    });
    setVolume(currentVolume);
    console.log(' " ' + currentSongFromAlbum.title + ' " ' + ' song is now playing.');
};
var seek = function(time) {
   if (currentSoundFile) {
       currentSoundFile.setTime(time);
   }
};
var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
    console.log('Volume has been set to ' + ' " ' + volume + ' " ');
  }
};
var setCurrentAlbum = function(album) {
  currentAlbum = album;
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);
  $albumSongList.empty();
  for (i = 0; i < album.songs.length; i++) {
    var $newRow= createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};
var fixCurrentAlbum = function() {
    console.log("fixCurrentAlbum called. albumIndex:", albumIndex);
    // Selected "Album" Name should appear in console log //
    setCurrentAlbum(albums[albumIndex]);
    console.log(' " ' + albums[albumIndex].title +' " ' + ' is the album now displayed.'); //remove this after testing...//
    albumIndex++;
    if (albumIndex === albums.length) {
      albumIndex = 0;
    }
};
var setCurrentTimeInPlayerBar = function(currentTime) {
    var $currentTimeElement = $('.seek-control .current-time');
    $currentTimeElement.text(currentTime); 
};

var setTotalTimeInPlayerBar = function(totalTime) { 
    var $totalTimeElement = $('.seek-control .total-time');
    $totalTimeElement.text(totalTime); 
};

var filterTimeCode = function(timeInSeconds){
//	console.log(timeInSeconds + ' is the input timeInSeconds for this call of the filterTimeCode function.');
	var seconds = Number.parseFloat(timeInSeconds);
//	console.log(seconds + ' seconds');
	var wholeSeconds = Math.floor(seconds);
//	console.log(wholeSeconds + ' wholeSeconds');
	var minutes = Math.floor(wholeSeconds / 60);
//	console.log(minutes + ' minutes');
	var remainingSeconds = wholeSeconds % 60;
//	console.log(remainingSeconds + ' remainingSeconds');
	var output = minutes + ':';
//	console.log(output + ' is the first half of the filterTimeCode output');
	if (remainingSeconds < 10){
		output += '0';
//			console.log(output + ' is the next half of the filterTimeCode output');
	}
	output += remainingSeconds;
//	console.log(output + ' is the final filterTimeCode output for this call');
	return output;
};
var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var currentTime = this.getTime();
            var songLength = this.getDuration();
            var seekBarFillRatio = currentTime / songLength;
            var $seekBar = $('.seek-control .seek-bar');
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
        $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
        $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
 };
var updatePlayerBarSong = function(){
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
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
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
    updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberRow = getSongNumberRow(currentlyPlayingSongNumber);
  var $lastSongNumberRow = getSongNumberRow(lastSongNumber);
  $nextSongNumberRow.html(pauseButtonTemplate);
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
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
    updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberRow = getSongNumberRow(currentlyPlayingSongNumber);
  var $lastSongNumberRow = getSongNumberRow(lastSongNumber);
  $previousSongNumberRow.html(pauseButtonTemplate);
  $lastSongNumberRow.html(lastSongNumber);
};
var togglePlayFromPlayerbar = function() {
  var $currentlyPlayingRow = getSongNumberRow(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
      $currentlyPlayingRow.html(pauseButtonTemplate);
      $(this).html(playerBarPauseButton);
      currentSoundFile.play();
    }
    else if (currentSoundFile) {
      $currentlyPlayingRow.html(playButtonTemplate);
      $(this).html(playerBarPlayButton);
      currentSoundFile.pause();
    }
};
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 25;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');
var albumIndex = 0;
var $albumImage = $('.album-cover-art');
var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumSongList = $('.album-view-song-list');
$(document).ready(function() {
  // populate albumIndex variable with the appropirate index from querystring
  setCurrentAlbum(albums[albumIndex]);
  albumIndex++;
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $playPauseButton.click(togglePlayFromPlayerbar);
  $albumImage.click(function() {
    //console.log($albumSongList);  // need to fix this so that...
    // Song List appears in console log by song names //
    console.log('$albumImage clicked');
    fixCurrentAlbum();
    });
  console.log('The following are the albums in the "fixtures.js" file collection:');
  for (var i = 0; i < albums.length; i++) {
    console.log(albums[i].title);
    //  console.log(Object.entries(albums)['name']);
    // Albums should appear in console log by album names //
    }
});
