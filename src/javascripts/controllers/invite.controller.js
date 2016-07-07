angular.module("app").controller("SlackInviteController", ["$scope", "$stamplay", function($scope, $stamplay) {
    $scope.request_invite = function() {
    	$stamplay.Object('invite').save({"email" : $scope.email})
    	.then(function (response) {
            alert("Check you email for an invite soon.")

        }, function(err){
           
        });
        $scope.email = "";
    }
}])
