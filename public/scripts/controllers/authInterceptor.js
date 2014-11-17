angular.module('MagicEight')
    .factory('authInterceptor', function($rootScope, $q, $window, $location) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($window.sessionStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                } else {
                    var path = $location.path();
                    if (path !== '/') {
                        if (path !== '/register') {
                            $location.path('/login');
                        }
                    }
                }
                return config;
            },
            response: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                }
                return response || $q.when(response);
            }
        };
    });

angular.module('MagicEight')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptor');
    });
