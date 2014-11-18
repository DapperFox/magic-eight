'use strict';

angular.module('MagicEight')
    .controller('NavCtrl', function($scope, $window, $http, $location) {
        if($window.sessionStorage.token) {
            $http.get('/auth/user').
            success(function (data, status, headers, config) {
                $scope.loginText = data;
                $scope.loginLink = 'user';
                $scope.loggedIn = true;
            });
        }
        else {
            $scope.loginText = 'Login';
            $scope.loginLink = 'login';
            $scope.loggedIn = false;
        }
        $scope.logout = function() {
            $window.sessionStorage.removeItem('token');
            $location.path('/');
            $scope.loginText = 'Login';
            $scope.loginLink = 'login';
            $scope.loggedIn = false;
        }
    });
