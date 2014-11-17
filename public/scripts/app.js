'use strict';

angular.module('MagicEight', ['ngRoute']).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/views/main.html',
                controller: 'MainCtrl'
            }).
            when('/login', {
                templateUrl: '/views/login.html',
                controller: 'LoginCtrl'
            }).
            when('/register', {
                templateUrl: '/views/register.html',
                controller: 'RegisterCtrl'
            }).
            when('/fortune', {
                templateUrl: '/views/fortune.html',
                controller: 'FortuneCtrl'
            }).
            when('/history', {
                templateUrl: '/views/history.html',
                controller: 'HistoryCtrl'
            });
    });