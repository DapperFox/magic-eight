/* globals angular */
'use strict';

angular.module('MagicEight')
    .controller('LoginCtrl', function ($scope, $window, $http, $location, SessionService) {
        $scope.login = function () {
            $http.post('/auth/login', {
                username: $scope.model.username,
                password: $scope.model.password
            }).
            success(function (data, status, headers, config) {
                $window.sessionStorage.token = data;
                $location.path('/');
            }).error(function (data, status, headers, config) {
                $scope.errMessage = 'Credentials Incorrect';
                $window.sessionStorage.removeItem('token');
            });
        };
    });
