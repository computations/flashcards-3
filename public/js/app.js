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

var flashcard = angular.module('flashcards',['ngAnimate']);

flashcard.controller('flashcardController', function ($scope) {
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
    $scope.currentCard = {};
    $scope.cardCounter = -1;
    $scope.isCardRevealed = false;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;

    $scope.flipCard = function() {
        $scope.isCardRevealed = !$scope.isCardRevealed;
        if($scope.isCardRevealed) {
            $scope.generateCard();

        } else {
            $scope.currentCard = {};

        }
        /*



         */
    }

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
});
