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
var app = angular.module('app',['ngAnimate', 'ngFileUpload', 'ngRoute', 'ngSanitize']);

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
            url: 'http://localhost:3000/cards/'
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

app.controller('mainController', ['$scope', 'Upload', function ($scope, Upload) {


}]);

