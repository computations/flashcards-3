//quizController.js

app.controller('quizController', ['$scope', 'Upload', '$http','ngDialog', 'isLegitCard',
 function ($scope, Upload, $http, ngDialog, isLegitCard) {

    $scope.cards = [];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true";
    $scope.deck = [$scope.cards];

    $scope.newSide = function(med, Url, tex){
        $scope.resetMenu();
        $scope.field="";

        $scope.cards.push({
            type: med, 
            url: Url,
            text: tex
        }) 
    };


    $scope.flipCard = function() {
        $scope.isCardRevealed = !$scope.isCardRevealed;
        $scope.generateCard();
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
    };

    $scope.transformServerObjToCard = function(serverCards){
        for(var i=0; i<serverCards.media.length; ++i){
            //type, url, text
            $scope.newSide(serverCards.media[i].type, serverCards.media[i].url,
                serverCards.media[i].text)
        }
    };

    $scope.getCard = function() {
        var cardID = isLegitCard.getCard();
        if (cardID == {}) {
            var cardID = isLegitCard.getCard()
            if (cardID == {} || cardID == 0 || cardID == undefined) {
                //nope, new card
                return;
            }
            else {
                //Get the card data from the server
                $http({
                    method: 'GET',
                    url: 'http://localhost:3000/card/' + cardID
                }).then(function (success) {
                    $scope.transformServerObjToCard(success.data)
                }, function (error) {
                    Logger.log(error)
                });
            }

        }
    };

    //Do these on load
    $scope.onload = function(){
        //see if it is a card that is already created
        $scope.getCard();

        //Pop off first element (it was there for error loading messages 404)
        if($scope.cards.length>0){
            $scope.cards.pop()
        }
        $scope.currentCard = $scope.cards[0];

        //Static content for testing
        $scope.cards = [
        {
        	type: "",
        	url: "",
        	text: ""
        }]; 
        //Generate first questions
        $scope.question1 = " Is this working?"
    	$scope.question2 = " Is this working?"
    	$scope.question3 = " Is this working?"
    	$scope.question4 = " Is this working?"
    };

    //call it on load
    $scope.onload();

    $scope.nextCard = function(){
    	$scope.question1 = " Is this working?"
    	$scope.question2 = " Is this working?"
    	$scope.question3 = " Is this working?"
    	$scope.question4 = " Is this working?"
    }




}]);

