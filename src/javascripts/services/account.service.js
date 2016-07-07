angular.module("app").factory("AccountService", ["$q", "$http", "$stamplay", function($q, $http, $stamplay) {
    return {
        login : function() {
            // SWITCH TO GITHUB
            $stamplay.User.socialLogin('github');
        },
        logout : function() {
            // SWITCH TO GITHUB
            $stamplay.User.logout();
        },
        currentUser : function() {
            var q = $q.defer();
            $stamplay.User.currentUser()
            .then(function(res) {
                if(res.hasOwnProperty("user")) {
                    var user = res.user;
                    $stamplay.User.getRole(res.user.givenRole)
                    .then(function(res) {
                        user.givenRole = res;
                        q.resolve(user);
                    })
                } else {
                    q.resolve(false);
                }

            })
            return q.promise;
        }
    }
}])
