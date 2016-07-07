angular.module("app").controller("AccountController", ["AccountService", "$window", "$document", "$scope", "$rootScope", "$stateParams", function(AccountService, $window, $document, $scope, $rootScope, $stateParams) {

  $scope.login = function() {
    AccountService.login();
  }

  $scope.logout = function() {
    AccountService.logout();
  }

  // Toggle Header on scroll
  angular.element($window).bind("scroll", function() {
    if($window.scrollY < 4) {
      $scope.show = true;
    } else {
      $scope.show = false;
    }
    $scope.$apply()
  });

  $rootScope.$on('$viewContentLoading', 
    function(event, viewConfig){ 

      // Set view state for view filtering
      $scope.state = viewConfig.view.self.name;

      // Scroll to top on state change
      $document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
    });


}])
