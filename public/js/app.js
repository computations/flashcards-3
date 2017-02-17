var flashcard = angular.module('flashcards',['ngAnimate']);

flashcard.controller('flashcardController', 
	function ($scope){

		//flashcard numbers
		$scope.rectHeight = 200; 
		$scope.rectWidth = 400; 
		$scope.xpos = 150; 
		$scope.ypos = 100; 
		$scope.deg = 0; 
		$scope.degString = "rotateX(" + $scope.deg + "deg" + ")"; 

		//Calculate flip image's coordinates
		$scope.flipXpos = numToCSS($scope.xpos + 
			$scope.rectWidth);
		$scope.flipYpos = numToCSS($scope.ypos - 100); 
		$scope.flipHeight = numToCSS(100); 
		$scope.flipWidth = numToCSS(100); 
		$scope.flip = false; 

		//Text/info on card coordinates
		$scope.textXpos = numToCSS($scope.xpos + 25); 
		$scope.textYpos = numToCSS($scope.ypos + 25); 

		//Make number values to text for CSS (flashcard)
		$scope.rectHeight = numToCSS($scope.rectHeight); 
		$scope.rectWidth = numToCSS($scope.rectWidth); 
		$scope.xpos = numToCSS($scope.xpos); 
		$scope.ypos = numToCSS($scope.ypos); 	

		$scope.flashcardInfo = [" ","Milk", ": an opaque white " +
		"fluid rich in fat and protein, secreted by " +
		"female mammals for the nourishment of their young.", 
		"verb: draw milk from (a cow or another animal), either " +
		"by hand or mechanically.", "verb2: exploit or defraud " +
		"(someone), typically by taking regular small amounts of "+
		"money over a period of time."]

		$scope.flashcardTextCounter = 1; 

		//CSS values for flashcard
		$scope.rectStyle = function(){
			if($scope.flip){
				$("#rectangle").addClass("@keyframes flip"); 
			}
			return {
         			left: $scope.xpos, 
          			top: $scope.ypos, 
          			height: $scope.rectHeight, 
          			width: $scope.rectWidth,
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
			document.getElementById("flashcardText").innerHTML = $scope.flashcardInfo[$scope.flashcardTextCounter]
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

			//set flip to true
			$scope.flip = true; 
			$scope.rectStyle(); //call for card changes
		}

}); 

flashcard.directive('animateFlip', ['$animateCss', 
	function($animateCss) {
		return {
			link: function(scope, elem, attrs){
				elem.on('click', function(){
					var self = angular.element(this);
					$animate.addClass(self, 'flip', function(){
						self.removeClass('flip'); 
					})
				})
			}
		}
	}]); 

//Convert number into CSS compatible string
function numToCSS(num){
	return num.toString() + 'px'; 
}
