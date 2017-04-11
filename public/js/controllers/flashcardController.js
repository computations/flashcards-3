//flashcard.js

app.controller('flashcardController', ['$scope', 'Upload', '$http', function ($scope, Upload, $http) {
    $scope.cards = [];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true";
    $scope.deck = [$scope.cards];

    $scope.newSide = function(med, Url){
        if(Url=="Enter text here"){
            Url=""
        }

        $scope.cards.push({
            media: med, 
            url: Url 
        }) 
    };

    //Do file upload stuff here
    $scope.uploadFiles = function(file, errFiles){

        if(file){
            //upload user file to server using ng-file-upload
            var urlPrefix = "http://localhost:3000/"

            Upload.upload({
                url: 'http://localhost:3000/upload',
                method: 'POST', 
                file: file

            }).success(function(response,status){
               
                $scope.newSide(response.media_type, urlPrefix + response.url)

            }).error(function(err){
                //error
                Logger.log("Error occurred while sending " +
                 "file to server: " + err)
            }); 
        }
    };


    $scope.addNewCard = function(){
       console.log($scope.cards)
        $http({
            method: 'POST',
            url: 'http://localhost:3000/card/',
            body: $scope.cards[0] //An array of the card's sides, 
                                    //each side is json
        }).then(function(res){
            console.log(res)

        }, function(error){
            console.log(error)
        });
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
    }
}]);

