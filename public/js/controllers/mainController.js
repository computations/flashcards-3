//mainController.js
app.controller('mainController', ['$scope', '$sce', '$http', 'isLegitCard',
 function ($scope, $sce, $http, isLegitCard) {

 	$scope.onload = function(){
 		$scope.onloadVar *=1 //toggle directive on load (load all cards from server dynamically)
 	}

   	$scope.toCard = function(cardID){
   		//send deck id to flashcard controller
   		isLegitCard.sendDeck(cardID); 

   	}; 

}]);