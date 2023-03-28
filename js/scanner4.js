var teamID = 6936;
var eventID = '2023ohmv'; //should be changed to the most current event
const URL = 'https://www.thebluealliance.com/api/v3/team/frc' + teamID + '/event/' + eventID + '/' + 'matches';
var key = 'GAHGTZ290bRxHnbX13UurGfvEgyUaHukRxK2ktrMg2XCNyvykH1IibGqasL3al9I';
var matchTimestamps = [];
var now = new Date();
var matchNumbers = [];
var currentMatch = null;
var currentMatchNum = 0;
var actualTime = null;
var data = null;
var fetchTimestamp = new Date();
var displayTime = null;
var fetchData = true;
var fetchInterval = 30;
var timesFetched = 0;
var color = '#3470d1';
var div = null;
var p = null;
var numbers = [];
var number_wrapper = document.getElementById('number_wrapper');
var debugMode = false;
var i = 0;
var number_wrapper = document.getElementById('number-wrapper');
function activateDebugging() {
  if (debugMode) {
    $("#debug").html("click to activate debug mode");
  } else {
    $("#debug").html("click to disable debug mode");
  }
  fetchData = true;
  debugMode = !debugMode;
}
function twoChars(num) {
  if (num < 10) {
    return "0" + num;
  } else {
    return num;
  }
}
function twelveHour(num) {
  if (num > 12) {
    return num-12;
  } else {
    return num;
  }
}
function AMPM(hours) {
  if (hours > 11) {
    return "PM";
  } else {
    return "AM";
  }
}
function timeTo(milliseconds) {
  var hoursLeft = Math.floor(milliseconds/(1000*60*60));
  var remainder = milliseconds % (1000*60*60);
  var minsLeft = Math.floor(remainder/(1000*60));
  var remainder = remainder % (1000*60);
  var secondsLeft = Math.floor(remainder/1000)-1;
  return [hoursLeft, minsLeft, secondsLeft];
}
function notZero(num, caption) {
  if(num != 0) {
    return num + " " + caption + " ";
  } else {
    return num;
  }
}
function readableTimeTo(timeLeft) {
  var caption = notZero(timeLeft[0], "h");
  var caption = caption + notZero(timeLeft[1], "m");
  var caption = caption + timeLeft[2] + " s";
  return caption;
}
function readable(timestamp) { 
  const date = new Date(timestamp * 1000);
  return twelveHour(date.getHours()) + ":" + twoChars(date.getMinutes()) + " " + AMPM(date.getHours());
}
function laterThan(timestamp) {
  const date = new Date(timestamp * 1000);
  return (date.getTime() > now.getTime());
}
function isNextMatch(data) {
  return !(currentMatchNum+1 > data.length);
}
function addMatchNumbers() {
  for (i = numbers.length; i < data.length; i++) {
    div = document.createElement('div');
    div.id = 'div' + i;
    div.classList.add('number-box');
    number_wrapper.appendChild(div);
    p = document.createElement('p');
    p.classList.add('current_number');
    p.id = 'p' + i;
    div.appendChild(p);
    p.setAttribute('style', 'color: ' + color);
    $('#p'+i).html(data[i].match_number);
    if (i == currentMatchNum) {
      p.setAttribute('style', 'color: #00e600; font-size: 35');
    }
    numbers.push(true); //it really doesn't matter what gobledygook gets pushed to the list as long as something is
  }
}
function logData(data) {
  this.data = data;
  currentMatchNum = null; //Must be reset to null or else it won't find the latest match
  matchTimestamps = []; //Also must be reset
  for (i = 0; i < data.length; i++) {
    matchTimestamps.push(data[i].predicted_time);
    if (currentMatchNum == null && laterThan(matchTimestamps[i])) {
      currentMatchNum = i;
    }
  }
  if (debugMode) {
    currentMatchNum = 3;
  }
  if (!(currentMatchNum == null)) {
    color = null;
    for (i = 0; i < 3; i++) {
      if (data[currentMatchNum].alliances.blue.team_keys[i] == 'frc' + teamID) { 
        color = '#3470d1';
      }
    }
  }
  if (color == null) {
    color = '#d62e2e';
  }
  if (debugMode || ((!(currentMatchNum == null)) && laterThan(matchTimestamps[currentMatchNum]) && matchTimestamps[currentMatchNum] != null)) { //checking whether there is still a match in the future and if there is data available on it
    $("#current_match").html(readable(matchTimestamps[currentMatchNum]));
    if (!(currentMatchNum+1 > data.length-1)) {
      $("#match_after").html(readable(matchTimestamps[currentMatchNum+1]));
      //$("#match_after").css('font-size', '50px');
    } else {
      $("#match_after").html('No later match!');
      $("#match_after").css('font-size', '30px');
    }
    $("#match-wrapper").css('display', 'block');
    $("#remaining-time-wrapper").css('width', 'auto');
    $("#countdown-wrapper").css('left', '0');
    $("#countdown-wrapper").css('transform', 'translateX(0)');
    $("#current_number").html(data[currentMatchNum].match_number); 
    if(data[currentMatchNum].actual_time == null) {
      actualTime = "unknown";
    } else {
      actualTime = new Date(data[currentMatchNum].actual_time*1000);
    }
    addMatchNumbers();
    currentMatch = new Date(data[currentMatchNum].predicted_time*1000);
    $('#json').html('times fetched: ' + timesFetched + '<br>' + 'fetching data from api every ' + fetchInterval + 's' + '<br>' + 'total matches: ' + data.length + '<br>' + 'actual time of current match: ' + actualTime + '<br>' + 'predicted time: ' + currentMatch + '<br>' + 'best of luck :)');
    $("#body").css('background-color', color);
    $("#countdown").css('color', color);
    $("#current_match").css('color', color);
    $("#match_after").css('color', color);
    $("#current_number").css('color', color);
    $("#remaining_time").css('color', color);
    $("#get-status").css('color', color);
    $("#status").css('background-color', color);
    $('number-wrapper').css('display', 'block');
    $("#time-wrapper").css('left', '0%');
    $("#time-wrapper").css('transform', 'translate(0%, -55%)');
    $("#number-wrapper").css('display', 'block');
    $("#match-wrapper").css('display', 'block');
    $("#remaining_time").css('display', 'block');
    $("#remaining-time-wrapper").css('width', '100%'); 
    $("#next-match").html("upcoming match in");
  } else {
    $("#number-wrapper").css('display', 'none');
    $("#time-wrapper").css('left', '50%');
    $("#time-wrapper").css('transform', 'translate(-50%, -55%)');
    $("#countdown-wrapper").css('left', '50%');
    $("#countdown-wrapper").css('transform', 'translateX(-50%)');
    $("#match-wrapper").css('display', 'none');
    $("#remaining_time").css('display', 'none');
    $("#remaining-time-wrapper").css('width', '100%'); 
    if(data[0].predicted_time != null) { //if that value equals null then TBA doesn't have the necessary data yet
      $("#next-match").html("Looks like you're all done with matches!");
      $("#json").html('total matches: ' + data.length + '<br>' + 'no upcoming matches!');
    } else {
      $("#next-match").html("Currently, TBA has no info on upcoming matches.  Try again later!");
      $("#json").html("Well...The Blue Alliance doesn't have any information on this tournament at the moment, which probably means the event has not begun yet.  Check back another time!");
    }   
  } 
  $("#loading").css('top', '-100%'); 
  $("#loadingText").css('opacity', '0%'); 
}
window.setInterval(function() { //using setInterval with a 0 second interval is basically a way to have an indefinitely long loop without breaking javascript
  if(now.getTime() - fetchTimestamp.getTime() > fetchInterval * 1000) { //updates every 30s or 30,000 milliseconds
    fetchTimestamp = new Date();
    fetchData = true;
  }
  if (fetchData == true) {
    timesFetched++;
    fetch(URL, {
           method: "GET",
           headers: { 'X-TBA-Auth-Key': key }
        }).then(response => response.json()).then(logData);
    fetchData = false;
  }
  now = new Date();
  currentMatch = new Date(matchTimestamps[currentMatchNum] * 1000);
  displayTime = twelveHour(now.getHours()) + ":" + twoChars(now.getMinutes()) + ":" + twoChars(now.getSeconds()) + " " + AMPM(now.getHours());
  $("#countdown").html(displayTime); 
  timeLeft = readableTimeTo(timeTo(currentMatch.getTime()-now.getTime()));
  $("#remaining_time").html(timeLeft); 
  if(currentMatch.getTime()-now.getTime() < 300000 && currentMatch.getTime()-now.getTime() > 0) {
    $("#remaining_time").css('color', 'yellow');
  } else {
    $("#remaining_time").css('color', color);
  }
})