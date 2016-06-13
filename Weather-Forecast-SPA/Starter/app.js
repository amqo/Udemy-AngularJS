// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// ROUTES
weatherApp.config(($routeProvider) => {

  $routeProvider

  .when('/', {
    templateUrl: 'pages/home.html',
    controller: 'homeController'
  })

  .when('/forecast', {
    templateUrl: 'pages/forecast.html',
    controller: 'forecastController'
  })

  .when('/forecast/:cnt', {
    templateUrl: 'pages/forecast.html',
    controller: 'forecastController'
  });

});

// SERVICES
weatherApp.service('cityService', function() {
  this.city = "Barcelona";
});


// CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService',
  function($scope, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', () => {
      cityService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams',
  'cityService', function($scope, $resource, $routeParams, cityService) {

    $scope.cnt = $routeParams.cnt || 4;

    $scope.city = cityService.city;

    $scope.weatherAPI = $resource(
      "http://api.openweathermap.org/data/2.5/forecast",
      { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }}
    );

    $scope.weatherResult = $scope.weatherAPI.get({
      q: $scope.city, mode: "json", units: "metric",
      cnt: $scope.cnt, APPID: WEATHER_API_APPID
    });

    $scope.roundTemperature = (temp) => temp.toFixed(1);
    $scope.convertToDate = (dt) => new Date(dt * 1000);
}]);
