//mainController.js
app.controller('mainController', ['$scope',
 function ($scope) {

   	$scope.toCard = function(cardID){
   		Logger.log("ID:",cardID)

   		//send card clicked data to flashcard controller
   		isLegitCard.setCard(cardID); 

   	}

}]);