module.exports = function (npm_package) {
  var packageManifest = {};

  try {
    packageManifest = require(npm_package);
  }
  catch (e) {
    console.log('shoot', e);
    console.trace()
  }

  return Object.keys(packageManifest.dependencies || {}) || [];
};
