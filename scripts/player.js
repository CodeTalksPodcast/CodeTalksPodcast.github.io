var music = document.getElementById('music');
var pButton = document.getElementById('play-btn');
var curTime = document.getElementById('current-time-play');
var playhead = document.getElementById('playhead'); 
var timeline = document.getElementById('timeline');
var lis_sec = document.getElementById("podcast-sections").getElementsByTagName("li");
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// timeupdate event listener
music.addEventListener("timeupdate", timeUpdate, false);

//Makes timeline clickable
timeline.addEventListener("click", function (event) {
	moveplayhead(event);
	music.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(e) {
	return (event.pageX - timeline.offsetLeft) / timelineWidth;
}

// Makes playhead draggable 
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that mouse is moved on mouseUp only when the playhead is released 
var onplayhead = false;
// mouseDown EventListener
function mouseDown() {
	onplayhead = true;
	window.addEventListener('mousemove', moveplayhead, true);
	music.removeEventListener('timeupdate', timeUpdate, false);
}
// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(e) {
	if (onplayhead == true) {
		moveplayhead(e);
		window.removeEventListener('mousemove', moveplayhead, true);
		// change current time
		music.currentTime = duration * clickPercent(e);
		music.addEventListener('timeupdate', timeUpdate, false);
	}
	onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(e) {
	var newMargLeft = e.pageX - timeline.offsetLeft;
	if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
		playhead.style.marginLeft = newMargLeft + "px";
	}
	if (newMargLeft < 0) {
		playhead.style.marginLeft = "0px";
	}
	if (newMargLeft > timelineWidth) {
		playhead.style.marginLeft = timelineWidth + "px";
	}
}

// timeUpdate 
// Synchronizes playhead position with current point in audio 
function timeUpdate() {
	var playPercent = timelineWidth * (music.currentTime / duration);
    var ob = secondsToTime(parseInt(music.currentTime));
    curTime.innerHTML = ob.h + ":" + ob.m + ":" + ob.s;
	playhead.style.marginLeft = playPercent + "px";
	if (music.currentTime == duration) {
		pButton.innerHTML = "play";
	}
    
    for(i = 0; i<lis_sec.length; i++) {
        var currentid = lis_sec[i].id.split("-");
        var currentidtime = (parseInt(currentid[1])*60*60)+ (parseInt(currentid[2])*60)+parseInt(currentid[3]);
    
        
        if(music.currentTime >= currentidtime){
            lis_sec[i].classList.add("played");   
        } else {
            lis_sec[i].classList.remove("played"); 
        }
    }

}

//Play and Pause
function play() {
	// start music
	if (music.paused) {
		music.play();
		// remove play, add pause
		pButton.innerHTML = "pause";
	} else { // pause music
		music.pause();
		pButton.innerHTML = "play";
	}
}

// Gets audio file duration
music.addEventListener("canplaythrough", function () {
	duration = music.duration;  
}, false);


window.addEventListener("hashchange", funcRef, false);

function funcRef(){
    var time = location.hash.substring(1).split(':');
    music.currentTime = (parseInt(time[0])*60*60)+(parseInt(time[1])*60)+parseInt(time[2]);
}

function secondsToTime(secs)
{
    var hours = Math.floor(secs / (60 * 60));
   
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    
    if(seconds < 10) seconds = "0" + seconds;
    if(minutes < 10) minutes = "0" + minutes;
    
    var obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
    };
    return obj;
}