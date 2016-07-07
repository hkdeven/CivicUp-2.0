angular.module("app").factory("QuestionService", ["$q", "$http", "$stamplay", "algolia", "algoliaConfig", "$rootScope", function($q, $http, $stamplay, algolia, algoliaConfig, $rootScope) {
    var client = algolia.Client(algoliaConfig.appID, algoliaConfig.searchOnlyKey);
    var index = client.initIndex(algoliaConfig.index);
    return {
        newQuestion : function(details) {
            var q = $q.defer();
            $stamplay.Object("question").save(details)
            .then(function(res) {
                q.resolve();
            })
            return q.promise;
        },
        getQuestions : function(page, per_page, sortby, search) {
            var q = $q.defer();
            var query = {
                page : page ? page : 1,
                per_page: per_page || 10, 
                populate_owner : true,
                populate : true,
                sort : search ? false : sortby,
                select : "title,actions,owner,views,owner.identities,solution_id,solution_id.actions.votes,solution_id.owner"
            };

            if(search) {
                where = JSON.stringify({ _id  : { $in :  search.hits  } })
                query.where = where;
            }

            if(search) {
                query.per_page = search.hitsPerPage;
            }

            $stamplay.Object("question").get(query)
            .then(function(res) {

                if(search) {
                    res.pagination.total_elements = search.nbHits;
                    res.pagination.total_pages = search.nbPages;
                    res.pagination.page = search.page + 1;
                }

                q.resolve(res);

            })

            return q.promise;
        },
        searchQuestions : function(page, per_page, sortby, query) {

            var q = $q.defer();

            index.search(query, {
                attributesToRetrieve: 'objectID',
                attributesToHighlight : "",
                hitsPerPage : per_page,
                page : page - 1
            }).then(function(results) {

                results.hits = results.hits.map(function(question) {
                    return question.objectID;
                })

                q.resolve(this.getQuestions(1, per_page, sortby, results))

            }.bind(this), function(err) {

                q.reject();

            });

            return q.promise;
        },
        getQuestionDetails : function(id) {

            var q = $q.defer();

            Stamplay.Object("question").get({
                "_id" : id,
                populate_owner : true
            }).then(function(res) {
                var question = res.data[0];
                var solution = question.solution_id ? question.solution_id[0] : false;
                
                if(!solution) return q.resolve(question);

                $stamplay.Object("solution").get({
                    _id : solution,
                    populate_owner : true
                })
                .then(function(response) {
                    question.solution_id[0] = response.data[0];
                    q.resolve(question)
                })
                

            }, function(err) {
                q.reject(err);
            })
            return q.promise;
        },
        addSolution : function(solution, id) {
            var q = $q.defer();
            $stamplay.Object("solution").save(solution)
            .then(function(res) {
                var result = res;
                $stamplay.Object("question").patch(id, { "solution_id" : [result._id] })
                .then(function(res) {
                    q.resolve(this.getQuestionDetails(res._id));
                }.bind(this))
            }.bind(this))

            return q.promise;
        },
        updateViewCount : function(question) {
            question.views = question.views ? question.views + 1 : 1;
            $stamplay.Object("question").patch(question._id, { views : question.views });
        },
        updateQuestion : function(question) {

            var q = $q.defer();
            var update = {
                body : question.body,
                title : question.title
            }

            $stamplay.Object("question").patch(question._id, update)
            .then(function(res) {
                q.resolve(this.getQuestionDetails(res._id))
            }.bind(this))
            return q.promise;   
        },

        deleteSolution : function(solution, id) {
            var q = $q.defer();

            $stamplay.Object("solution").remove(solution._id)
            .then(function(res) {
               $stamplay.Object("question").patch(id, { solution_id : []})
               .then(function(res) {
                   q.resolve(res);
               })
           })
            return q.promise;   
        },

        updateSolution : function(solution, question) {
            var q = $q.defer();
            $stamplay.Object("solution").patch(solution._id, {
                description : solution.description
            })
            .then(function(res) {
                q.resolve(this.getQuestionDetails(question))
            }.bind(this))
            return q.promise;   
        }
    }
}]);
