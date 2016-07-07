angular.module("app")
.controller("HomeController", ["$scope", "$state", "$stamplay", "QuestionService",  function($scope, $state, $stamplay, QuestionService) {

  $scope.per_page = "10";
  $scope.sortby = "-dt_create"

  function renderQuestions(res) {
    $scope.loading = false;

      $scope.questionCollection = res.data;
      $scope.pagination = res.pagination;
      $scope.pages = [];
      var page = res.pagination.page;
      var total = res.pagination.total_pages;
      var start,
      stop = total < 5 ? total : 5;

      if(page <= 2 && page > 0 || total < 5) {
        start = 1;
      } else if(page >= 3 && page <= total - 2) {
        start = page - 2;
      } else {
        start = total - 4;
      }

      var b = 0;
      for(var i = start; b < stop; i += 1) {
        $scope.pages.push(i);
        b += 1;
      }
  }

  $scope.getQuestions = function(page, per_page, sortby) {
    $scope.loading = true;
    QuestionService.getQuestions(page, per_page, sortby).then(function(res) {
      renderQuestions(res);
    });
  }

  $scope.searchQuestions = function(page, per_page, sortby, question_query) {
    $scope.loading = true;
    QuestionService.searchQuestions(page, per_page, sortby, question_query).then(function(res) {
       renderQuestions(res)
    })
  }

  $scope.paginate = function(page, per_page, sortby, question_query) {
    $scope.pagination.page = page;
    if(question_query.length > 0) {

      $scope.searchQuestions(page, per_page, sortby, question_query);
    } else {
      $scope.getQuestions(page, per_page, sortby);
    }
  }

  $scope.getQuestions(1, $scope.per_page, $scope.sortby);

}]);
