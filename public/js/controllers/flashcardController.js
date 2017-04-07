//flashcard.js

app.controller('flashcardController', ['$scope', 'Upload', function ($scope, Upload) {
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
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true"

    $scope.newSide = function(text,title,imgUrl){
        if(text=="Enter text here"){
            text=""
        }
        $scope.cards.push({
            title: title,
            icon:"",
            imageUrl:imgUrl,
            description:text
        }) 
    }

    //Do file upload stuff here
    $scope.uploadFiles = function(file, errFiles){

        if(file){
            /* UNCOMMENT WHEN SERVER SIDE IS DONE */
            //upload user file to server using ng-file-upload
            var imgUrl = ""
            Upload.upload({
                url: 'http://localhost:3000/upload',
                method: 'POST', 
                file: file

            }).success(function(response,status){
                //success get img url? 
                imgUrl = response.url
                console.log(response.message)
            }).error(function(err){
                //error
                console.log("Error occurred while sending " +
                 "file to server: " + err)
            }); 
            

            //Add new img to preview card//test only
            $scope.cards.push({
                title: "User File",
                icon:"",
                imageUrl: imgUrl,
                description:""
            }) 
        }
    }

    $scope.flipCard = function() {
        $scope.isCardRevealed = !$scope.isCardRevealed;
        $scope.generateCard();
        // if($scope.isCardRevealed) {
        //    $scope.generateCard();
        //
        // } else {
        //     $scope.generateCard();
        // }
        /*



         */
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

