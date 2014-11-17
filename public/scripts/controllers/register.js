'use strict';

angular.module('MagicEight')
    .controller('RegisterCtrl', function($window, $location, $scope, $http, SessionService) {
        $scope.register = function () {
        $http.post('/auth/register', { username: $scope.model.username, password: $scope.model.password }).
            success(function (data, status, headers, config) {
                $window.sessionStorage.token = data;
                $location.path('/');
            }).error(function (data, status, headers, config) {
                $scope.errMessage = 'Error Occured';
            });
        };
    });
