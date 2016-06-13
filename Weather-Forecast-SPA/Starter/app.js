// MODULE
var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']);

// ROUTES
weatherApp.config(function($routeProvider) {

  $routeProvider

  .when('/', {
    templateUrl: 'pages/home.html',
    controller: 'homeController'
  })

  .when('/forecast', {
    templateUrl: 'pages/forecast.html',
    controller: 'forecastController'
  });

});

// SERVICES
weatherApp.service('cityService', function() {
  this.city = "Barcelona, B";
});


// CONTROLLERS
weatherApp.controller('homeController', ['$scope', 'cityService',
  function($scope, cityService) {
    $scope.city = cityService.city;
    $scope.$watch('city', function() {
      cityService.city = $scope.city;
    });
}]);

weatherApp.controller('forecastController', ['$scope', '$resource', 'cityService',
  function($scope, $resource, cityService) {
    $scope.city = cityService.city;

    $scope.weatherAPI = $resource(
      "http://api.openweathermap.org/data/2.5/forecast",
      { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }}
    );

    $scope.weatherResult = $scope.weatherAPI.get({
      q: $scope.city, mode: "json", units: "metric",
      cnt: 2, APPID: WEATHER_API_APPID
    });

    console.log($scope.weatherResult);
}]);
