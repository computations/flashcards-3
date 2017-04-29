//quizController.js

app.controller('quizController', ['$scope', 'Upload', '$http','ngDialog', 'isLegitCard',
 function ($scope, Upload, $http, ngDialog, isLegitCard) {

    $scope.cards = [];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;
    $scope.deck = []; 
    $scope.cardCount = 0; //number of card we are on in deck

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true";

    $scope.newSide = function(med, Url, tex){
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

    $scope.transformServerDeckToCards = function(data){
    	//data[i] -- a card
    	//data[i].media[j] -- sides of a card
    	for(var i=0; i<data.length; ++i){
    		//a card
    		var card = []
    		for(var j=0; j<data[i].media.length; ++j){
    			//sides of that card
    			var cardSide = {
    				type: data[i].media[j].type,
    				url: data[i].media[j].url,
    				text: data[i].media[j].text
    			}
    			card.push(cardSide)
    		}
    		$scope.deck.push(card);
    	}
    	//set initial card
    	for(var i=0; i<$scope.deck[0].length; ++i){
    		$scope.newSide($scope.deck[0][i].type,$scope.deck[0][i].url,
    			$scope.deck[0][i].text)
    	}
    }

    $scope.getCard = function() {
        var deckID = isLegitCard.getDeck();
        if (deckID == {}) {
        	$scope.cards = {
        		type: 'text',
        		url: '',
        		text: "An error occured, no deck id found."
        	}
        }
        else{
        	//Deck exists
      		$http({
                    method: 'GET',
                    url: 'http://localhost:3000/deck/' + deckID
                }).then(function (success) {
                    $scope.transformServerDeckToCards(success.data)
                }, function (error) {
                    Logger.log(error)
            });
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

        //Generate first questions
        $scope.question1 = " Is this working?"
    	$scope.question2 = " Is this working?"
    	$scope.question3 = " Is this working?"
    	$scope.question4 = " Is this working?"
    };

    //call it on load
    $scope.onload();

    $scope.nextCard = function(){
    	//load in next card
    	$scope.cards = []
    	var index = $scope.cardCount 
    	if(index >= $scope.deck.length){
    		//loop around
    		$scope.cardCount = 0
    		index = 0
    	}
    	for(var i=0; i<$scope.deck[index].length; ++i){
    		$scope.newSide($scope.deck[index][i].type,$scope.deck[index][i].url,
    			$scope.deck[index][i].text)
    	}
        $scope.currentCard = $scope.cards[0];

    	//Change the questions
    	$scope.question1 = " Is this working?"
    	$scope.question2 = " Is this working?"
    	$scope.question3 = " Is this working?"
    	$scope.question4 = " Is this working?"
    }

    //user clicks for next card
    $scope.clickNextCard = function(){
    	$scope.cardCount += 1
    	$scope.nextCard()
    }




}]);

