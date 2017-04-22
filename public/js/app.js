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
            controller  : 'flashcardController'
        })
        // route for the abouts page
        .when('/about', {
            templateUrl: '../html/pages/about.html',
            controller : 'aboutController'
        })
        // route for the contact page
        .when('/contact', {
            templateUrl : '../html/pages/contact.html',
            controller  : 'contactController'
        })
        .when('/signin', {
            templateUrl : '../html/pages/admin.html',
            controller  : 'adminController'
        });
});


app.controller('appController', ['$scope','$http', 'Upload', function ($scope, $http, Upload) {
   
    $scope.getAllCards = function(){
        //Gets all the cards from the server
            //Usage: Check API.md for URL needed
        $http({
            method: 'GET',
            url: 'http://localhost:3000/card/'
        }).then(function(success){
            console.log(success)
            console.log(success.data[0].media[0].url)

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
            console.log(success)
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
            console.log(success)
        }, function(error){
            console.log(error)
        });
    };

}]);

//A service to send data from main controller to flashcard controller
    //so = if a card is clicked, show its server data, otherwise blank
app.service("isLegitCard", function(){
    var card = {}; 

    return {
        getCard: function(){
            return card; 
        },
        sendCard: function(val){
            card = val 
        }
    }; 
}); 

// Stolen from: http://stackoverflow.com/questions/18157305/angularjs-compiling-dynamic-html-strings-from-database
app.directive('loadCards', function ($http, $compile) {
  return {
    restrict: 'AE',
    replace: true,
    link: function (scope, ele, attrs) {
                //Gets all the cards from the server
            //Usage: Check API.md for URL needed
        scope.$watch('onloadVar' , function(){
            console.log("onloadVar changed")
            $http({
            method: 'GET',
            url: 'http://localhost:3000/card'
        }).then(function(success){
            console.log(success.data.length)
            console.log(success.data)
            var div = ""
            for(var i=0; i<success.data.length; i++){
                var html = '<div class="col-sm-4 col-lg-4 col-md-4">';
                html += '<div class="thumbnail">';
                html += '<img src="http://placehold.it/320x150" alt="">';
                html += '<div class="caption">';
                html += '<h4><a href="#!card" ng-click="toCard(&quot;' + success.data[i]._id.toString() + '&quot;)">' + success.data[i].title + '</a>'; 
                html += '</h4>'; 
                html += '<p>' + success.data[i].description + '</p>'; 
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
