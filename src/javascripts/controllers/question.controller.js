angular.module("app").controller("CreateQuestionController", ["QuestionService", "$scope", "$rootScope", "$state", function(QuestionService, $scope, $rootScope, $state) {
    if(!$rootScope.currentUser) $state.go("Home");

    $scope.submitQuestion = function() {
        $scope.loading = true;
        QuestionService.newQuestion($scope.question)
        .then(function(question) {
            $scope.loading = false;
            $state.go("Home");
        })
    }
    

    $scope.tinymceOptions = {
        plugins :  ['codesample fullscreen preview'],
        toolbar1: 'insertfile undo redo | styleselect | codesample fullscreen | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        theme: "modern",
        content_css : ".././dist/css/lib/prism.min.css",
        min_height: 200
    };

}])
