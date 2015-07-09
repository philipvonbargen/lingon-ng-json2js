(function(module) {
  try {
    module = angular.module('templatesCustom');
  } catch (e) {
    module = angular.module('templatesCustom', []);
  }
  module.run(['$cacheFactory', function($cacheFactory) {
    ($cacheFactory.get('templatesCustom') || $cacheFactory('templatesCustom')).put('fixtures/example.json',
      {"languages":["de","es","es-ES","sv"],"countries":{"ch-de":"de","de":"de","es":"es-ES","mx":"es","se":"sv","uk":"en","us":"en"}});
  }]);
})();
