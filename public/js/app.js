//app.js
var Logger = (function () {
    var Logger = {
        log: function (message) {
            if (window.console && typeof console.log === "function") {
                console.log(message);
            }
        }
    };

    return Logger;
}());

//app controller is the main controller for site (routes)
var app = angular.module('app',['ngAnimate', 'ngFileUpload', 'ngRoute', 'ngSanitize', 'ngDialog']);
var admin = true //student vs admin view

if (admin) {
    app.config(function($routeProvider) {
        $routeProvider
        // route for the home page
            .when('/', {
                templateUrl : '../html/pages/home.html',
                controller  : 'mainController'
            })
            // route for the cards page
            .when('/card', {
                templateUrl : '../html/pages/card.html',
                controller  : 'flashcardController',
                resolve     : 'flashcardController.resolve'
            })
            // route for the abouts page
            .when('/about', {
                templateUrl: '../html/pages/about.html',
                controller : 'aboutController'
            })
            // route for the contact page
            .when('/test', {
                templateUrl : '../html/pages/test.html',
                controller  : 'testController'
            })
            .when('/signin', {
                templateUrl : '../html/pages/admin.html',
                controller  : 'adminController'
            })
            .when('/viewCardsInDeck', {
                templateUrl : '../html/pages/viewCards.html',
                controller : 'viewCardController'
            })
            .when('/cardQuiz', {
                templateUrl : '../html/pages/cardQuiz.html',
                controller : 'viewCardController'            
            });
    });
} else {
    app.config(function($routeProvider) {
        $routeProvider
        // route for the home page
            .when('/', {
                templateUrl : '../html/pages/home.html',
                controller  : 'mainController'
            })
            // route for the cards page
            .when('/card', {
                templateUrl : '../html/pages/card.html',
                controller  : 'flashcardController',
                resolve     : 'flashcardController.resolve'
            })
            // route for the abouts page
            .when('/about', {
                templateUrl: '../html/pages/about.html',
                controller : 'aboutController'
            })
            // route for the contact page
            .when('/test', {
                templateUrl : '../html/pages/test.html',
                controller  : 'testController'
            })
            .when('/signin', {
                templateUrl : '../html/pages/admin.html',
                controller  : 'adminController'
            })
            .when('/viewCardsInDeck', {
                templateUrl : '../html/pages/cardQuiz.html',
                controller : 'quizController'
            });
    });
}

app.controller('appController', ['$scope','$http', 'Upload', function ($scope, $http, Upload) {
   
    $scope.getAllCards = function(){
        //Gets all the cards from the server
            //Usage: Check API.md for URL needed
        $http({
            method: 'GET',
            url: 'http://localhost:3000/card/'
        }).then(function(success){
        }, function(error){
            console.log(error)
        });
   }

    $scope.getCard = function(cardID){
            //Gets all the cards from the server
        //Usage: Check API.md for URL needed
        card_url = 'http://localhost:3000/card/' + cardID
        $http({
            method: 'GET',
            url: card_url
        }).then(function(success){

        }, function(error){
            console.log(error)
        });
   }

    //Give card to server
    $scope.sendCard = function(){
        //make a cardID here? 
        card_url = 'http://localhost:3000/card/' + cardID
        $http({
            method: 'POST',
            url: card_url
        }).then(function(success){

        }, function(error){
            console.log(error)
        });
    };

}]);

//A service to send data from main controller to flashcard controller
    //so = if a card is clicked, show its server data, otherwise blank
app.service("isLegitCard", function(){
    var card = {}; 
    var deck = {}; 

    return {
        getCard: function(){
            return card; 
        },
        sendCard: function(val){
            card = val 
        },
        getDeck: function(){
            return deck; 
        },
        sendDeck: function(val){
            deck = val
        }
    }; 
}); 



app.directive('loadCards', function ($http, $compile, isLegitCard) {
  return {
    restrict: 'AE',
    replace: true,
    link: function (scope, ele, attrs) {
        //Get Deck ID
        var deckID = isLegitCard.getDeck()
        if(deckID == 0){
            //Making a new deck, server won't respond
            return; 
        }

        //Dynamically show all cards in this deck
        scope.$watch('onloadVar' , function(){
            $http({
            method: 'GET',
            url: 'http://localhost:3000/deck/' + deckID
        }).then(function(success){

            var div = ""
            //Loop through the cards in the deck
            for(var i=0; i<success.data[0].media.length; i++){
                var html = '<div class="col-sm-4 col-lg-4 col-md-4">';
                html += '<div class="thumbnail">';

                //find an image side on the card to view 
                if(success.data[0].media[i].url){
                    html += '<img src="' + success.data[0].media[i].url + '" alt="http://placehold.it/320x150">';
                }
                else{
                    //replace image with default
                    html += '<img src="http://placehold.it/320x150" alt="">'; 
                }

                html += '<div class="caption">';
                html += '<h4><a href="#!card" ng-click="toCard(&quot;' + success.data[0].media[i]._id.toString() + '&quot;)">' + success.data.media[i].title + '</a>'; 
                html += '</h4>'; 
                html += '<p>' + success.data[0].media[i].description + '</p>'; 
                html += '</div>'; 
                html += '</div>'; 
                html += '</div>'; 
                div += html; 
            }
            html = div 

            ele.html((typeof(html) === 'string') ? html : html.data);
            $compile(ele.contents())(scope);

            }, function(error){
                console.log(error)
            });
        });
        

      }
    }
  })

app.directive('loadDecks', function ($http, $compile) {
  return {
    restrict: 'AE',
    replace: true,
    link: function (scope, ele, attrs) {
                //Gets all the cards from the server
            //Usage: Check API.md for URL needed
        scope.$watch('onloadDeckVar' , function(){
            $http({
            method: 'GET',
            url: 'http://localhost:3000/deck'
        }).then(function(success){

            var div = ""
            for(var i=0; i<success.data.length; i++){
                var html = '<div class="col-sm-4 col-lg-4 col-md-4">';
                html += '<div class="thumbnail">';

                //Use stored image in deck
                if(success.data[i].imageUrl && success.data[i].imageUrl!=""){
                    html += '<img src="' + success.data[i].imageUrl + '" alt="">'
                }
                else{
                    //replace image with default
                    html += '<img src="http://placehold.it/320x150" alt="">'; 
                }
                
                html += '<div class="caption">';
                html += '<h4><a href="#!viewCardsInDeck" ng-click="toCard(&quot;' + success.data[i]._id.toString() + '&quot;)">' + success.data[i].title + '</a>'; 
                html += '</h4>'; 
                html += '<p>' + success.data[i].desc + '</p>'; 
                html += '</div>'; 
                html += '</div>'; 
                html += '</div>'; 
                div += html; 
            }
            html = div 

            ele.html((typeof(html) === 'string') ? html : html.data);
            $compile(ele.contents())(scope);

            }, function(error){
                console.log(error)
            });
        });
        

      }
    }
});

//http://stackoverflow.com/questions/27549134/angularjs-ng-src-condition-if-not-found-via-url
app.directive('errSrc', function () {
  return {
        link: function(scope, element, attrs){
            element.bind('error', function(){
                if(attrs.src!=attrs.errSrc){
                    attrs.$set('src', attrs.errSrc)
                }
            })
        }
    }
});



