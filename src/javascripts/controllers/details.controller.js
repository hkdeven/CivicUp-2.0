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
