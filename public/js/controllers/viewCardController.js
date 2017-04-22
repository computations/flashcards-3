//viewCardController.js
app.controller('viewCardController', ['$scope', '$sce', '$http', 'isLegitCard',
 function ($scope, $sce, $http, isLegitCard) {

 	$scope.onload = function(){
 		$scope.onloadDeckVar *=1 //toggle directive on load (load all decks from server dynamically)
 	}

   	$scope.toCard = function(cardID){
   		//Send the card data 
   		isLegitCard.sendCard(cardID); 
   	}; 

}]);