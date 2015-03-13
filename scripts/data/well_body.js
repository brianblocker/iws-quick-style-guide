var names     = ['Neo', 'Well', 'Scandis', 'Forto', 'Lorum', 'Parnac', 'Lufkis', 'Blocker', 'Midland', 'OKC', 'Bull', 'Hundo', 'Ferris', 'Alameda', 'Rafael', 'San Pedro'];
var states    = ['Connected', 'Connected', 'Connected', 'Connected', 'Disconnected', 'Unknown'];
var statuses  = ['ok', 'ok', 'ok', 'ok', 'error'];
var texts     = ['2 days', '3 days', 'Unknown', '1 day', '3 months'];
var types     = ['esp', 'plunger', 'crank', 'pcp'];

function randomize (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate (num) {
  var i;
  var values = [];

  for (i = 0; i < num; i++) {
    values.push({
      status:                   'ok',
      Well_Name:                randomize(names) + ' ' + randomize(names),
      FG_Last_Received_Date:    new Date(),
      Well_State_Text:          randomize(states),
      Current_State_Time_Text:  randomize(texts),
      Lift_Type:                randomize(types),
    });
  }

  return values;
}

module.exports = generate;
