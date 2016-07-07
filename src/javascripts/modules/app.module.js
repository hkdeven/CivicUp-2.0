angular.module("app", ["ui.router","ngAnimate", "ngSanitize", "angularMoment",  "algoliasearch", "ui.tinymce"])

.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state("Home", {
            url: "/",
            templateUrl: "dist/templates/home.html",
            controller: "HomeController"
        })
        .state("New Request", {
            url: "/new",
            templateUrl: "dist/templates/new.html",
            controller: "CreateQuestionController"
        })
        .state("Question Details", {
            url: "/details/:id",
            templateUrl: "dist/templates/details.html",
            controller: "QuestionDetailsController"
        })
    $urlRouterProvider.otherwise("/");
    // To enabled pretty urls, uncomment the line below and inside Stamplay enable pretty URLs in the HOSTING section
    // $locationProvider.html5Mode(true)
}])

.run(["$rootScope", "AccountService", function($rootScope, AccountService) {
    Stamplay.init("[Your Stamplay APP ID]");

    AccountService.currentUser().then(function(res) {
        $rootScope.currentUser = res;
        $rootScope.role = res ? res.givenRole.name : false;
    });
    
}])

.constant("algoliaConfig", {
    index : "[Your Algolia Index Name]",
    appID : "[Algolia APP ID]",
    searchOnlyKey : "[Algolia Search Only]"
})