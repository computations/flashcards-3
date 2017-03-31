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
var app = angular.module('app',['ngAnimate', 'ngFileUpload', 'ngRoute']);

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

//get card from server
app.controller('appController', ['$scope','$http', 'Upload', function ($scope, Upload, $http) {
    $http({
        method: 'GET',
        url: 'localhost:3000/cards/'
    }).then(function successCallback(response){

    }, function errorCallback(response){

    }); 

}]);

