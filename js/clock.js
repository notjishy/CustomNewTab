// check what hour format is saved on load, and set to saved setting
var hourFormat; var clockOn;
chrome.storage.local.get(['hourFormat'], function(result) {
  if (result.hourFormat) {
    hourFormat = result.hourFormat;

    if (result.hourFormat == 24) {
      document.getElementById("hour-switch").setAttribute('data-theme', '24');
      document.getElementById("hour-toggle-icon").innerHTML = "check_circle";
    }
  } else {
    hourFormat = 12;
  }
});

// run clock
function clock(initialStartClock) {
  if (initialStartClock) { clockOn = true; initialStartClock--; }

  if (clockOn) {
    setTimeout(function() {
      refreshClock();
      clock();
    }, 500);
  }
}

// refresh clock values
function refreshClock(){
  console.log('clock refreshed');

  var date = new Date();
  var hours = date.getHours();
  var mins = date.getMinutes();
  var secs = date.getSeconds();
  var day = date.getDay();
  var month = date.getMonth() + 1;
  var daym = date.getDate();
  var year = date.getFullYear();

  hours = ("0" + hours).slice(-2);
  mins = ("0" + mins).slice(-2);
  secs = ("0" + secs).slice(-2);

  if (hourFormat == 12) {
    var amPm = (hours < 12) ? "AM" : "PM";

    hours = (hours > 12) ? hours - 12 : hours;
    if (hours == 00) { hours = 12 }

    document.getElementById("time").innerHTML = hours + ":" + mins + "." + secs + " " + amPm;
  } else {
    document.getElementById("time").innerHTML = hours + ":" + mins + "." + secs;
  }

  const days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
  day = days[day];

  document.getElementById("day").innerHTML = day;

  month = ("0" + month).slice(-2);
  daym = ("0" + daym).slice(-2);

  document.getElementById("date").innerHTML = year + "/" + month + "/" + daym;
}

// toggle clock
function toggleClock(){
  var currentData = document.getElementById("clock-switch").getAttribute('data-theme');
  if (currentData === "off" || currentData === null) {
    document.getElementById("clock-switch").setAttribute('data-theme', 'on');
    document.getElementById("clock-toggle-icon").innerHTML = "check_circle";

    chrome.storage.local.set({
      showClock: true
    }, function() {
      console.log('Enabled clock');
    });

    document.getElementById("clock-wrapper").style.display = "inline";

    clockOn = true;
    clock(clockOn);
  } else {
    document.getElementById("clock-switch").setAttribute('data-theme', 'off');
    document.getElementById("clock-toggle-icon").innerHTML = "cancel";

    chrome.storage.local.set({
      showClock: false
    }, function() {
      console.log('Disabled clock');
    });

    document.getElementById("clock-wrapper").style.display = "none";

    clockOn = false;
  }
}

// toggle clock hour format setting
function toggleClockFormat(){
  var currentData = document.getElementById("hour-switch").getAttribute('data-theme');
  if (currentData != "24") {
    document.getElementById("hour-switch").setAttribute('data-theme', '24');
    document.getElementById("hour-toggle-icon").innerHTML = "check_circle";

    chrome.storage.local.set({
      hourFormat: 24
    }, function() {
      console.log('Clock hour format changed to 24 hours');
    });

    hourFormat = 24;
  } else {
    document.getElementById("hour-switch").removeAttribute('data-theme');
    document.getElementById("hour-toggle-icon").innerHTML = "cancel";

    chrome.storage.local.set({
      hourFormat: 12
    }, function() {
      console.log('Clock hour format changed to 12 hours');
    });

    hourFormat = 12;
  }
}
