var shutdownPeriod = [{h: 15, m: 0}, {h: 21, m: 0}];  // in UTC
var bgClasses = ['mogef-1', 'mogef-2', 'mogef-3', 'mogef-4'];

function nextEvent(now) {
  var next = new Date(now.getTime());
  var starting = new Date(now.getTime());
  var ending = new Date(now.getTime());
  $.each([starting, ending], function(i, date) {
    date.setUTCHours(shutdownPeriod[i].h || 0);
    date.setUTCMinutes(shutdownPeriod[i].m || 0);
    date.setUTCSeconds(shutdownPeriod[i].s || 0);
    date.setUTCMilliseconds(0);
  });
  if (now < starting) {
    return ['shutdown', starting];
  } else if (now < ending) {
    return ['release', ending];
  } else {
    starting.setUTCDate(starting.getUTCDate() + 1);
    return ['shutdown', starting];
  }
}

function loop() {
  var now = new Date();
  var event = nextEvent(now);
  var next = event[1];
  event = event[0];
  if (event == 'shutdown') {
    $(document.body).attr('class', null);
    $(document.body).addClass(bgClasses[now.getSeconds() % bgClasses.length]);
    var delta = (next - now) / 1000;  // in seconds
    var hours = delta / 3600 | 0;
    delta -= hours * 3600;
    var minutes = delta / 60 | 0;
    delta -= minutes * 60;
    var seconds = delta | 0;
    $.each({
      hours: hours,
      minutes: minutes,
      seconds: seconds
    }, function(name, value) {
      var $elem = $('.' + name);
      if (value) {
        $elem.show().find('>').text(value);
      } else {
        $elem.hide();
      }
    });
  }
}

loop();
setInterval(loop, 1000);
