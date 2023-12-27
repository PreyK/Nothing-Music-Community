var Observable = require("FuseJS/Observable");
var PlaylistPlayer = require("PlaylistPlayer");
var PLAYING_STATE = require("js/PlayingState");
var Timer = require("FuseJS/Timer");


var playingState = Observable(PLAYING_STATE.STOPPED);
PlaylistPlayer.statusChanged = function(status){
    debug_log("STATUS SHANGE");
	playingState.value = PLAYING_STATE.parse(status);
    debug_log(status);
    debug_log(playingState.value);
};

var currentTrackId = Observable();
var currentTrack = Observable();

var currentPlaylist = [];

var duration = Observable(0.0);
var progress = Observable(0.0);

var displayDuration = Observable("dur");
var displayProgress = Observable("prog");

var bars = Observable();
var SampleRate = 150;

var PlayPos = Observable(0);

PlayPos.onValueChanged(module, function(x) {
	var playhead = PlayPos.value*SampleRate;
	bars.forEach(function(bar) {
		if(bar.idx < playhead) {
			bar.isPlayed.value = true;
		}else{
			bar.isPlayed.value = false;
		}
	 });
});



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function SeekControl(params) {
	debug_log("seek to "+params["value"]/100);
	seek(params["value"]/100);
	//debug_log("seek "+params["value"]);
}

function BarSeek(idx){
	var pos = (idx/SampleRate);
	debug_log("seek to "+pos);
	seek(pos);
}

function createBar(idx) {
    return {
        idx: idx,
        isPlayed:Observable(false),
        height:getRandomInt(50),
        clicked: function() {
            //debug_log(idx);
			//BarSeek(idx);
            //debug_log({ idx: idx });
        }
    };
}

function CreateBars() {
	bars.clear();
	for (var i = 1; i <= SampleRate; i++) {
	    bars.add(createBar(i));
	}
}

function setDuration(dur) {
	duration.value = dur;
	displayDuration.value = formatTime(duration.value-progress.value);
}

function setProgress(prog) {
	progress.value = prog;
	displayProgress.value = formatTime(prog);

	PlayPos.value = progress.value/duration.value;
}

function setProgressNorm(prog) {
	setProgress(prog * duration.value);
}

var timer = null;
function deleteTimer(){
	if (timer !== null)
		Timer.delete(timer);
}

var isInteracting = false;
function setIsInteracting(val) {
	isInteracting = val;
}

function createNewTimer(){
	deleteTimer();
	timer = Timer.create(function(){
		if (!isInteracting) {
			setDuration(PlaylistPlayer.duration);
			setProgress(PlaylistPlayer.progress);
		}
	}, 100, true);
}

playingState.addSubscriber(function() {
	if (playingState.value === PLAYING_STATE.PLAYING) {
		createNewTimer();
	} else {
		deleteTimer();
	}
});

function setCurrentTrackToUnoTrackId(unoTrackId){
	var jsTrack =  currentPlaylist.filter(function(x){
		return x.id === unoTrackId;
	});
	if (jsTrack.length > 0)
		currentTrackId.value = jsTrack[0].id;
}

//var SongName = Observable("Song Name");
//var Artist = Observable("Unknown Artist");
PlaylistPlayer.currentTrackChanged = function(){
	debug_log("TRACK CHANGED");
	//currentTrack
	debug_log("TRACK: "+JSON.stringify(PlaylistPlayer.currentTrack));
	var newTrack = PlaylistPlayer.currentTrack;
	if(newTrack){
		//Artist.value = (newTrack.artist?newTrack.artist:"Unknown Artist").toUpperCase();
		//SongName.value = (newTrack.name?newTrack.name:"UNKNOWN").toUpperCase();
	}

	
	
    /*
	var newCurrentTrack = PlaylistPlayer.currentTrack;
	if (newCurrentTrack) {
		currentTrackId.value = newCurrentTrack.id;
		setCurrentTrackToUnoTrackId(newCurrentTrack.id);
	}
    */
};

function playNext(){
	PlaylistPlayer.next();
}

function playPrevious(){
	PlaylistPlayer.previous();
}

function trackToUnoTrack(track){
	return {
		id : track.id,
		name : track.title,
		artist : track.artist,
		url : track.stream_url + "?client_id=" + Config.clientId,
		artworkUrl : track.artwork_500 + "?client_id=" + Config.clientId,
		duration : track.duration / 1000.0
	};
}

function setCurrentPlaylist(pl){
	currentPlaylist = [];
	var trackList = [];
	pl.forEach(function(x){
		currentPlaylist.push(x);
		trackList.push(trackToUnoTrack(x));
	});
	PlaylistPlayer.setPlaylist(trackList);
}

var isPlaying = playingState.map(function(x){ return x === PLAYING_STATE.PLAYING; });
var isPaused = playingState.map(function(x){ return x === PLAYING_STATE.PAUSED; });
var isStopped = playingState.map(function(x){ return x === PLAYING_STATE.STOPPED; });
var isLoading = playingState.map(function(x){ return x === PLAYING_STATE.LOADING; });

var hasPrevious = Observable(false);
var hasNext = Observable(false);

PlaylistPlayer.hasNextChanged = function(n){
	hasNext.value = n;
};

PlaylistPlayer.hasPreviousChanged = function(p){
	hasPrevious.value = p;
};

function TogglePlaying(){
    debug_log(playingState.value);
    debug_log(isPlaying.value);
    if(isPlaying.value){
        
        debug_log("we should pause");
        pause();
    }else{
        debug_log("we should resume");
        resume();
    }
}

function seek(progress){
	PlaylistPlayer.seek(progress);
}

function resume(){
	PlaylistPlayer.resume();
}

function pause(){
	PlaylistPlayer.pause();
}

function play(t){
	if (t){
		PlaylistPlayer.play(t);
        currentTrack.value = t;
		isLoading.value = true; // so we don't have to wait for the round trip
	} else {
		if (currentTrack.value) {
			PlaylistPlayer.play((currentTrack.value));
		}
	}

	
}

function stop(){
	PlaylistPlayer.stop();
}

function setCurrentTrackAndPlayIfDifferent(track){
	var t = trackToUnoTrack(track);
	var currentId = currentTrackId.value ? (currentTrack.value ? currentTrack.value.id : false) : false;
	if (t.id !== currentId){
		play(t);
		currentTrackId.value = track.id;
	}
}


function formatTime(durationInSeconds) {

    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    
    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    return formattedTime;
  }



module.exports = {
	setCurrentPlaylist : setCurrentPlaylist,
	setCurrentTrackAndPlayIfDifferent : setCurrentTrackAndPlayIfDifferent,

	currentTrack : currentTrack,
	currentTrackId : currentTrackId,

	hasPrevious : hasPrevious,
	hasNext : hasNext,

	playingState : playingState,

	resume : resume,
	playNext : playNext,
	playPrevious : playPrevious,
	pause : pause,
	stop : stop,
	seek : seek,
	play : play,
	//Artist: Artist,
	//SongName : SongName,

	isPlaying : isPlaying,
	isPaused : isPaused,
	isStopped : isStopped,
	isLoading : isLoading,
	
	duration : duration,
	progress : progress,
	displayDuration : displayDuration,
	displayProgress : displayProgress,
	bars:bars,
	CreateBars:CreateBars,
	SeekControl:SeekControl,

	setDuration: setDuration,
	setProgress: setProgress,
	setProgressNorm : setProgressNorm,

	setIsInteracting : setIsInteracting,
    TogglePlaying:TogglePlaying

};