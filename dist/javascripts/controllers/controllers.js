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

angular.module("app")
.controller("QuestionDetailsController", ["QuestionService", "$scope", "$rootScope", "$state", "$stateParams", "$stamplay", function(QuestionService, $scope, $rootScope, $state, $stateParams, $stamplay) {
    $scope.tab = "question";
    $scope.loading = true;

    if(!$stateParams.id) $state.go("Home");


    function renderQuestion(question) {
        $scope.loading = false;

        $scope.question = question;
        $scope.comments = question.actions.comments;

        if(question.solution_id !== undefined && question.solution_id.length > 0){
            $scope.solution = question.solution_id[0];
            $scope.voteTotal = calcVotes($scope.solution);
        } else {
            $scope.no_solution = true;
        }
        setTimeout(function() {
            Prism.highlightAll();
        }, 500)
    }

    function calcVotes(solution) {
        return  solution.actions.votes.users_upvote.length - solution.actions.votes.users_downvote.length;
    }

    QuestionService.getQuestionDetails($stateParams.id).then(function(question) {

        QuestionService.updateViewCount(question);

        renderQuestion(question);

        
    })

    $scope.updateQuestion = function() {
        $scope.loading = true;
        $scope.hide_question = !$scope.hide_question;
        QuestionService.updateQuestion($scope.question)
        .then(function(res) {
            renderQuestion(res);
        })
    }

    $scope.deleteSolution = function() {
        $scope.loading = true;
        QuestionService.deleteSolution($scope.solution, $scope.question._id)
        .then(function(res) {
            $scope.no_solution = true;
            $scope.loading = false;
            $scope.solution = {};
        })
    }

    $scope.addOrUpdateSolution = function(solution) {        
        $scope.hide_solution = false;
        $scope.loading = true;
        if(solution.hasOwnProperty("_id")) {
            QuestionService.updateSolution(solution, $scope.question._id)
            .then(function(res) {
                $scope.question = res;
                $scope.solution = res.solution_id[0];
                $scope.voteTotal = $scope.solution.actions.votes.users_upvote.length - $scope.solution.actions.votes.users_downvote.length;
                $scope.no_solution = false;
                $scope.loading = false;
            })
        } else {
            QuestionService.addSolution(solution, $scope.question._id)
            .then(function(res) {
                $scope.question = res;
                $scope.solution = res.solution_id[0];
                $scope.voteTotal = $scope.solution.actions.votes.users_upvote.length - $scope.solution.actions.votes.users_downvote.length;
                $scope.no_solution = false;
                $scope.loading = false;
            })

        }
    }



    $scope.upvote = function(question) {
        $stamplay.Object("solution").upVote(question._id)
        .then(function(res) {
            $scope.voteTotal = calcVotes(res);
            $scope.$apply();
        })
    }

    $scope.downvote = function(question) {
        $stamplay.Object("solution").downVote(question._id)
        .then(function(res) {
            $scope.voteTotal = calcVotes(res);
            $scope.$apply();
        })
    }

    $scope.addComment = function(question, comment) {
        $stamplay.Object("question").comment(question._id, comment)
        .then(function(res) {
            $scope.comments = res.actions.comments;
            $scope.show_comment = false;
            $scope.comment = "";
            $scope.$apply();
            setTimeout(function() {
                Prism.highlightAll();
            }, 500)
        })
    }



    $scope.tinymceOptions = {
        plugins :  ['codesample fullscreen preview'],
        toolbar1: 'insertfile undo redo | styleselect | codesample fullscreen | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
        theme: "modern",
        content_css : ".././dist/css/lib/prism.min.css",
        min_height: 200,
        inline:true
    };


}])

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
