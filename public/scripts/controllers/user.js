angular.module('MagicEight')
    .controller('UserCtrl', function ($scope, $http) {
        $http.get('/auth/user').success(function (data, status, headers, config) {
            $scope.username = data;
        });
        $scope.changePassword = function () {
            $http.put('/auth/user', { currentPass: $scope.currentPass, newPass: $scope.newPass }).
            success(function (data, status, headers, config) {
                $scope.message = data;
            }).error(function (data, status, headers, config) {
                $scope.message = data;
            });
        };
    });