angular.module('starter.controllers')

.controller('mapCtrl', function($scope, $ionicLoading) {
  $scope.onError = null;

  var posOptions = {
    timeout: 10000,
    enableHighAccuracy: false
  };

  $scope.onSuccess = function(position) {
    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var geocoder = new google.maps.Geocoder;

    geocoder.geocode({'location': pos}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          $scope.ride.origin = results[1].formatted_address;
          $scope.originIsSetted = "active";
          $scope.$apply();
        } else {
          console.info('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });

    $ionicLoading.hide();
  };

  $scope.onError = function(error) {
    console.error('It was not possible to get the current location due to: ' + error);
    $ionicLoading.hide();
  };

  $scope.getCurrentLocation = function() {
    $ionicLoading.show({template: 'Obtendo sua posição atual...'});
    navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError, posOptions);
  };

  $scope.disableTap = function($event) {
    $event.target.select();
    container = document.getElementsByClassName('pac-container');
    angular.element(container).attr('data-tap-disabled', 'true');
    angular.element(container).on("click", function() {
      document.getElementById('searchBar').blur();
    });
  };

  $scope.calculateDistance = function () {
    if(!$scope.ride.origin || !$scope.ride.destination) return;

    var distanceService = new google.maps.DistanceMatrixService();

    distanceService.getDistanceMatrix({
      origins: [$scope.ride.origin],
      destinations: [$scope.ride.destination],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC
    },
    function(response, status) {
      if (status == google.maps.DistanceMatrixStatus.OK) {
        $scope.ride.route_distance = response.rows[0].elements[0].distance.text;
        $scope.ride.route_time = response.rows[0].elements[0].duration.text;
      }
    })
  };

  $scope.$watchGroup(['ride.origin', 'ride.destination'], function() {
    $scope.calculateDistance();
  });

});
