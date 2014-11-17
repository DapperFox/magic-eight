'use strict';

angular.module('MagicEight')
    .controller('FortuneCtrl', function ($scope, $window, $http, SessionService) {
        $http.get('/v1/foretell/custom')
            .success(function (data, status, headers, config) {
                $scope.fortunes = data;
            });
        $scope.editItem = function (id, fortune) {
            $scope.editItem = false;
            $scope.editValue = fortune;
            $scope.editID = id;
        };
        $scope.deleteItem = function (id) {
            $http.delete('/v1/foretell/' + id).
                success(function (data, status, headers, config) {
                    $scope.fortunes.forEach(function(fortune, index) {
                        if(fortune._id === data._id) {
                            $scope.fortunes.splice(index, 1);
                        }
                    });
                });
        };
        $scope.createFortune = function () {
            $http.post('/v1/foretell', {
                fortune: $scope.fortune,
                uid: $window.sessionStorage.token
            }).
            success(function (data, status, headers, config) {
                $scope.fortunes.push(data);
            });
        };
        $scope.saveEdit = function (id) {
            $http.put('/v1/foretell/' + id, { fortune: $scope.editValue }).
                success(function (data, status, headers, config) {
                    console.info(data + ' Updated');
                });
        };
    });
