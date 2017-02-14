var flashcard = angular.module('flashcards',[]);

flashcard.controller('flashcardController', 
	function ($scope){

		//flashcard numbers
		$scope.rectHeight = 200; 
		$scope.rectWidth = 400; 
		$scope.xpos = 150; 
		$scope.ypos = 100; 

		//Calculate flip image's coordinates
		$scope.flipXpos = numToCSS($scope.xpos + 
			$scope.rectWidth);
		$scope.flipYpos = numToCSS($scope.ypos - 100); 
		$scope.flipHeight = numToCSS(100); 
		$scope.flipWidth = numToCSS(100); 

		//Text/info on card coordinates
		$scope.textXpos = numToCSS($scope.xpos + 50); 
		$scope.textYpos = numToCSS($scope.ypos + 50); 

		//Make number values to text for CSS (flashcard)
		$scope.rectHeight = numToCSS($scope.rectHeight); 
		$scope.rectWidth = numToCSS($scope.rectWidth); 
		$scope.xpos = numToCSS($scope.xpos); 
		$scope.ypos = numToCSS($scope.ypos); 	

		$scope.flashcardInfo = [" ","Milk", ": an opaque white " +
		"fluid rich in fat and protein, secreted by " +
		"female mammals for the nourishment of their young."]

		$scope.flashcardTextCounter = 1; 

		//CSS values for flashcard
		$scope.rectStyle = function(){
			return {
         			left: $scope.xpos, 
          			top: $scope.ypos, 
          			height: $scope.rectHeight, 
          			width: $scope.rectWidth
			}
		}

		//CSS values for flip card image
		$scope.flipImageStyle = function(){
			return {
					left: $scope.flipXpos,
					top: $scope.flipYpos, 
					width: $scope.flipWidth,
					height: $scope.flipHeight
			}
		}

		$scope.textStyle = function(){
			document.getElementById("flashcardText").innerHTML =
			$scope.flashcardInfo[$scope.flashcardTextCounter];

			return {
					left: $scope.textXpos,
					top: $scope.textYpos
			}
		}

		//if flip image is clicked 
		$scope.flipClick = function(){

			//Blank out the text at a certain time
				//during animation flip
			var saveCounter = $scope.flashcardTextCounter;
			$scope.flashcardTextCounter = 0; 


			//Show new text 
				//Check if loop is needed 
			if( (saveCounter) < ($scope.flashcardInfo.length-1)){
				saveCounter+=1; 

			}
			else{//loop it
				saveCounter = 1; 
			}

			$scope.flashcardTextCounter=saveCounter; 
			$scope.flashcardInfo[$scope.flashcardTextCounter];
			console.log("clicked flip"); 
		}

}); 

//Convert number into CSS compatible string
function numToCSS(num){
	return num.toString() + 'px'; 
}