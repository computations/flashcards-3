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

var flashcard = angular.module('flashcards',['ngAnimate', 'ngFileUpload', 'ngRoute']);

flashcard.config(function($routeProvider) {
    $routeProvider
    // route for the home page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })
        // route for the cards page
        .when('/card', {
            templateUrl : 'pages/card.html',
            controller  : 'flashcardController'
        })
        // route for the abouts page
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller : 'aboutController'
        })
        // route for the contact page
        .when('/contact', {
            templateUrl : 'pages/contact.html',
            controller  : 'contactController'
        })
        .when('/signin', {
            templateUrl : 'pages/admin.html',
            controller  : 'adminController'
        });
});

flashcard.controller('flashcardController', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.cards = [
        {
            title: "Good Morning",
            icon: "",
            imageUrl: "",
            description: ""
        },
        {
            title: "",
            icon:"",
            imageUrl:"http://www.lifeprint.com/asl101/gifs-animated/no-one.gif",
            description:""
        },
        {
            title: "Greeting",
            icon:"",
            imageUrl:"",
            description:"A greeting to an aquaintance typically stated in the morning"
        }
    ];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true"
    if($scope.textVal){
        console.log($scope.textVal)
    }

    $scope.usrText = function(text,title){
        console.log(text)
        $scope.cards.push({
            title: title,
            icon:"",
            imageUrl:"",
            description:text
        }) 
    }

    //Do file upload stuff here
    $scope.uploadFiles = function(file, errFiles){

        if(file){
            /* UNCOMMENT WHEN SERVER SIDE IS DONE
            //upload user file to server using ng-file-upload
            $upload.upload({
                url: '../../server.js',
                method: 'POST', 
                file: file

            }).success(function(response,status){
                //success get img url? 
                var imgUrl = response
            }).error(function(err){
                //error
                console.log("Error occurred while sending " +
                 "file to server: " + err)
            }); 
            */

            //Add new img to preview card//test only
            $scope.cards.push({
                title: "User File",
                icon:"",
                imageUrl:"http://www.rd.com/wp-content/uploads/sites/2/2016/04/01-cat-wants-to-tell-you-laptop.jpg",
                description:""
            }) 
        }
    }

    $scope.flipCard = function() {
        $scope.isCardRevealed = !$scope.isCardRevealed;
        $scope.generateCard();
        // if($scope.isCardRevealed) {
        //    $scope.generateCard();
        //
        // } else {
        //     $scope.generateCard();
        // }
        /*



         */
    };

    $scope.generateCard = function() {
        var saveCounter = $scope.cardCounter;

        //Show new text
        //Check if loop is needed
        if( (saveCounter) < ($scope.cards.length-1)){
            saveCounter+=1;

        }
        else{//loop it
            saveCounter = 0;
        }

        $scope.cardCounter = saveCounter;
        $scope.currentCard = $scope.cards[$scope.cardCounter];
    }
}]);

flashcard.controller('mainController', function ($scope) {
    $scope.message = "Testing routes";
});

flashcard.controller('contactController', function($scope) {
    Logger.log("activated controller contact");
    $scope.message = 'info needs to be given';
});

flashcard.controller('aboutController', function($scope) {
    $scope.message = 'info needs to be given';
});

flashcard.controller('adminController', function($scope) {
    $scope.username="";
    $scope.password="";
});
