var Observable = require("FuseJS/Observable");


var bars = Observable();
var SampleRate = 150;

var PlayPos = 30;



function getIsPlayed(idx){
    return idx<PlayPos;
}

function createBar(idx) {
    return {
        idx: idx,
        isPlayed:getIsPlayed(idx),
        height:getRandomInt(50),
        clicked: function() {
            debug_log(idx);
            //debug_log({ idx: idx });
        }
    };
}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


for (var i = 1; i <= SampleRate; i++) {
    bars.add(createBar(i));
}


module.exports = { bars: bars };