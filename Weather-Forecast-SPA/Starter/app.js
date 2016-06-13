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
    controller: 'forecastController as fcastCtr'
  })

  .when('/forecast/:cnt', {
    templateUrl: 'pages/forecast.html',
    controller: 'forecastController as fcastCtr'
  });

});

// SERVICES
weatherApp.service('cityService', function() {
  this.city = "Barcelona";
});

// Using service $resource inside custom service
weatherApp.service('weatherService', ['$resource', function($resource) {

  this.GetWeather = function(city, cnt) {
    var weatherAPI = $resource(
      "http://api.openweathermap.org/data/2.5/forecast/daily",
      { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }}
    );

    return weatherAPI.get({
      q: city, mode: "json", units: "metric",
      cnt: cnt, APPID: WEATHER_API_APPID
    });
  }
}]);


// CONTROLLERS
weatherApp.controller('homeController', ['$scope', '$location', 'cityService',
  function($scope, $location, cityService) {
    $scope.city = cityService.city;

    $scope.$watch('city', () => {
      cityService.city = $scope.city;
    });

    $scope.submit = () => {
      $location.path("/forecast");
    };
}]);

weatherApp.controller('forecastController',
  ['$routeParams', 'cityService', 'weatherService',
  function($routeParams, cityService, weatherService) {

    this.cnt = $routeParams.cnt || '2';
    this.city = cityService.city;

    this.weatherResult = weatherService.GetWeather(this.city, this.cnt);

    this.roundTemperature = (temp) => temp.toFixed(1);
    this.convertToDate = (dt) => new Date(dt * 1000);
}]);

// DIRECTIVES
weatherApp.directive("weatherReport", () => {
  return {
      restrict: 'E',
      // templateUrl: 'directives/weather_report.html',
      templateUrl: () => "directives/weather_report.html?" + new Date(),
      replace: true,
      scope: {
        weatherObject: '=',
        convertToDate: '&',
        roundTemperature: '&',
        dateFormat: '@'
      }
  }
});
