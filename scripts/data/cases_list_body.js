var people     = [null, 'Hank Jones', 'Robert Salford'];
var groups     = [null, '@O&G L2'];
var subtypes   = ['alarm issue', 'production issue', 'comm issue'];
var devices    = ['Lufko Walrus', 'Manchild Fritz', 'Adept Node'];
var types      = ['Well support'];
var reporters  = ['Brian', 'Shahid', 'Rajesh'];
var statuses   = ['closed', 'resolved', 'open', 'active'];
var priorities = [1,2,3,4,5];

function randomize (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generate (num) {
  var i;
  var values = [];

  for (i = 0; i < num; i++) {
    values.push({
      status:                   randomize(statuses),
      priority:                 randomize(priorities),
      created_date:             new Date(),
      updated_date:             new Date(),
      reporter:                 randomize(reporters),
      subtype:                  randomize(subtypes),
      assigned_group:           randomize(groups),
      assigned_person:          randomize(people),
      type:                     randomize(types),
      device:                   randomize(devices)
    });
  }

  return values;
}

module.exports = generate;
