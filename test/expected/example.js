(function(module) {
  try {
    module = angular.module('templates');
  } catch (e) {
    module = angular.module('templates', []);
  }
  module.run(['$cacheFactory', function($cacheFactory) {
    $cacheFactory('templates').put('fixtures/example.json',
      {"languages":["de","es","es-ES","sv"],"countries":{"ch-de":"de","de":"de","es":"es-ES","mx":"es","se":"sv","uk":"en","us":"en"}});
  }]);
})();
