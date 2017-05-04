//quizController.js

app.controller('quizController', ['$scope', 'Upload', '$http','ngDialog', 'isLegitCard',
 function ($scope, Upload, $http, ngDialog, isLegitCard) {

    $scope.cards = [];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;
    $scope.deck = []; 
    $scope.cardCount = 0; //number of card we are on in deck
    $scope.cardsShown = [] //cards the user has already seen
    $scope.testingThisCard = 0;
    $scope.index = 0; 
    $scope.rightAnswerRadio; 
    $scope.seenLast = 'card'

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
    				text: data[i].media[j].text,
    				id: data[i]._id
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
        if (deckID == {} || deckID==0) {
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
                    url: '/deck/' + deckID
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

        $scope.currentCard = $scope.cards[0];

        //Generate first questions
        $scope.question1 = " "
    	$scope.question2 = " "
    	$scope.question3 = " "
    	$scope.question4 = " "
    };

    //call it on load
    $scope.onload();

    $scope.getCardFromDeckViaIndex = function(index){
    	var card = []
		for(var i=0; i<$scope.deck[index].length; ++i){
			var cardSide = {
				type: $scope.deck[index][i].type,
				url: $scope.deck[index][i].url,
				text: $scope.deck[index][i].text
			}
			card.push(cardSide)
    	}
    	return card; 
    }

    $scope.shuffleArray = function(array){
    	var currentIndex = 0
    	var randomIndex = Math.floor(Math.random()*(array.length))

    	while(currentIndex<array.length){
    		temp = array[currentIndex]
	    	array[currentIndex] = array[randomIndex]
	    	array[randomIndex] = temp 
	    	currentIndex+=1
	    	randomIndex = Math.floor(Math.random()*(array.length))
    	}
    	return array 
    }

    $scope.shuffleAnswers = function(card, mediaArr){
    	var noAnswer = {
    		type: "",
    		url: "",
    		text: " "
    	}
    	var answers = [noAnswer,noAnswer,noAnswer,noAnswer, noAnswer]
    	var places = [0,1,2,3]
    	var rand = Math.floor(Math.random()*(places.length))
    	answers[places[rand]] = card;
    	answers[4]=places[rand] //save index of where real answer is
    	places.splice(rand,1)

    	var media = $scope.shuffleArray(mediaArr)

    	var notAllSlotsFilled = true 
    	for(var k=0; k<media.length; ++k){
	    	rand = Math.floor(Math.random()*(places.length))
	    	answers[places[rand]] = media[k]
	    	places.splice(rand,1)
    	}
    	return answers
    }

    $scope.nextCard = function(){
    	//show new full card 
		$scope.cards = []
		for(var i=0; i<$scope.deck[$scope.index].length; ++i){
			$scope.newSide($scope.deck[$scope.index][i].type,$scope.deck[$scope.index][i].url,
				$scope.deck[$scope.index][i].text) 

		}
	    $scope.currentCard = $scope.cards[0];
	    $scope.seenLast = 'card'
	    $scope.cardsShown.push($scope.deck[$scope.index])
    }

    //find the sides that both cards have
    $scope.matchMedia = function(mediaType, cardNotToUseIndex){
    	var mediaThatMatchesSides = [] //[[1,2], [,4,2]] //sides that match
		for(var i=0; i<$scope.cardsShown.length; ++i){
			//card
			if(i!=cardNotToUseIndex){
				for(var j=0; j<$scope.cardsShown[i].length; ++j){
					//sides of that card
					if(mediaType == $scope.cardsShown[i][j].type){
						//side that matches media type
						mediaThatMatchesSides.push($scope.cardsShown[i][j]) //[cardIndex, sideIndex]
					}
				}
			}
		}
		return mediaThatMatchesSides
    }

    $scope.ReviewLastCard = function(){
    	$scope.cards = []
		for(var i=0; i<$scope.testingThisCard.length; ++i){
			$scope.newSide($scope.testingThisCard[i].type,$scope.testingThisCard[i].url,
				$scope.testingThisCard[i].text)
		}
		//clear the radio buttons
	   	$scope.question1 = " " 
		$scope.question2 = " " 
	   	$scope.question3 = " " 
	    $scope.question4 = " " 
	    $scope.currentCard = $scope.cards[0]

    }

    $scope.giveQuiz = function(){
    	console.log("Giving Quiz")
    	var index = $scope.index 
		//Pick a random side on the first card to show
		var randIndex = Math.floor(Math.random()*($scope.deck[index].length))
		//Pick another random side on the card for an answer
 		var anotherRandIndex = Math.floor(Math.random()*($scope.deck[index].length))
		while(randIndex==anotherRandIndex){ //make sure they arent the same
			anotherRandIndex = Math.floor(Math.random()*($scope.deck[index].length))
		}
		//Get the media type from the card at the 2nd rand index
    	$scope.testingThisCard = $scope.getCardFromDeckViaIndex(index)

    	//Update so user can view one side on flashcard GUI
    	$scope.cards = []
    	$scope.newSide($scope.testingThisCard[randIndex].type, $scope.testingThisCard[randIndex].url,
    		$scope.testingThisCard[randIndex].text)

    	var mediaType = $scope.testingThisCard[anotherRandIndex].type

		//Find other cards to fill the other question slots with that same media
		var matchedMedia = $scope.matchMedia(mediaType,index)
		//Set the questions
		//Make the answer in a random location
		var answers = $scope.shuffleAnswers($scope.testingThisCard[anotherRandIndex], matchedMedia); 
		$scope.question1 = " " + answers[0].text 
		$scope.question2 = " " + answers[1].text 
	   	$scope.question3 = " " + answers[2].text 
	    $scope.question4 = " " + answers[3].text 

	    //which radio button is right 1,2,3, or 4
	    $scope.rightAnswerRadio = (answers[4] + 1)
	    $scope.rightAnswerRadio = "r" + $scope.rightAnswerRadio.toString()

	    $scope.index +=1 //first quiz finished, new card will be accessed
	    $scope.seenLast = 'quiz'
    }

    //user clicks for next card
    $scope.clickNextCard = function(){
    	//first card is shown
    	if($scope.cardCount==0){
    		$scope.cardsShown.push($scope.deck[0])
    		$scope.index = 1 //first card seen onto second
    	}

    	$scope.cardCount += 1

    	console.log("seen last: ", $scope.seenLast)
    	console.log("cardCount: ", $scope.cardCount)
    	
  
  		//View the two beginning cards 
    	if($scope.cardCount<2){
    		$scope.cards = []
	    	var index = $scope.cardCount 
	    	//error checking
			if(index<0){
	    		$scope.cardCount = 0
	    		index = 0
	    	}

	    	//show the first two cards fully, before a quiz
	    	for(var i=0; i<$scope.deck[index].length; ++i){
    			$scope.newSide($scope.deck[index][i].type,$scope.deck[index][i].url,
    				$scope.deck[index][i].text)
    		}
    		$scope.cardsShown.push($scope.deck[index])
    		$scope.seenLast = 'card'

    	}
    	else if($scope.seenLast == 'review'){
    		$scope.nextCard()
    	}
    	else if($scope.seenLast == 'card'){//quiz on last card
    		$scope.giveQuiz()
    	}
    	else if($scope.seenLast == 'quiz'){//view a new card
    		//Quiz was given and answer is submitted 
	    	if($scope.radio){ //submitted a quiz answer
	    		if($scope.radio==$scope.rightAnswerRadio){
	    			//continue onto next card
	    			$scope.nextCard()
	    			console.log("right!")
	    		}
	    		else{
	    			//review quizzed card 
	    			$scope.ReviewLastCard()
	    			$scope.seenLast = 'review'
	    			console.log("wrong")
	    		}
	    	}
    	}
    	else{
    		console.log("Unknown state.")
    	}
    }

}]);

