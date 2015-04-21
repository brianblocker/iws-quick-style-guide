var ack_states = [true, false, false, false];
var clr_states = [true, false, false, false, false];
var criticals  = [true, false, false, false];
var codes      = ['C2080', 'AF97', 'Down'];
var messages   = ['Communication failure', 'underload fault', 'ground fault', 'motor overload'];
var wells      = [{name: 'Lufko Walrus', status: 'Running'}, {name: 'Algers Marcus', status: 'Down'}, {name: 'Sparsec Muflo', status: 'Down'}];
var cases      = [Array(), Array(2), Array(1), Array(), Array()]

function randomize (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate (num) {
  var i;
  var well;
  var critical;
  var cleared;
  var normal;
  var values = [];

  for (i = 0; i < num; i++) {
    well      = randomize(wells);
    critical  = randomize(criticals);
    cleared   = false;//randomize(clr_states) && ! critical;
    normal    = well.status === 'Running' && ! critical;

    values.push({
      acknowledged: randomize(ack_states),
      cleared:      cleared,
      created_date: new Date(),
      critical:     critical,
      code:         randomize(codes),
      normal:       normal,
      well:         well,
      message:      randomize(messages),
      cases:        randomize(cases)
    });
  }

  return values;
}

module.exports = generate;
