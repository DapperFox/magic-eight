'use strict';

angular.module('MagicEight')
    .controller('MainCtrl', function ($scope, $http, $window) {
        $scope.getFortune = function () {
            $http.get('/v1/foretell').success(function (data, status, headers, config) {
                $scope.fortune = data;
                $scope.model.askedQuestion = $scope.model.question;
                $scope.model.question = '';
                if($window.sessionStorage.token) {
                    $http.post('/v1/foretell/record', {
                        uid: $window.sessionStorage.token,
                        question: $scope.model.askedQuestion,
                        answer: $scope.fortune.fortune 
                    }).success(function (data, status, headers, config) {
                            console.info('Record saved');
                        });
                }
            });
        };
    });
