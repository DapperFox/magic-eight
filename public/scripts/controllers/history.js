'use strict';

angular.module('MagicEight')
    .controller('HistoryCtrl', function ($scope, $http) {
        $http.get('/v1/foretell/record').
            success( function (data, status, headers, config) {
            console.log(data);
            $scope.responses = data;
        });
        $scope.editItem = function (id) {
            console.log(id);
        };

        $scope.deleteItem = function (id) {
            console.log(id);
        };
    });
