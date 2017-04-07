//flashcard.js

app.controller('flashcardController', ['$scope', 'Upload', function ($scope, Upload) {
    $scope.cards = [
        {
            title: "Good Morning",
            icon: "",
            imageUrl: "",
            videoUrl: "",
            description: ""
        },
        {
            title: "",
            icon:"",
            imageUrl:"http://www.lifeprint.com/asl101/gifs-animated/no-one.gif",
            videoUrl: "",
            description:""
        },
        {
            title: "Greeting",
            icon:"",
            imageUrl:"",
            videoUrl: "",
            description:"A greeting to an aquaintance typically stated in the morning"
        }
    ];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true";
    $scope.deck = [$scope.cards];

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
                Logger.log(response.media_type)
                if(response.media_type == "video"){
                    Logger.log(urlPrefix + response.url)
                    //Add new img to preview card//test only
                    $scope.cards.push({
                        title: "",
                        icon:"",
                        imageUrl: "",
                        videoUrl: urlPrefix + response.url,
                        description:""
                    }) 
                }
                else if(response.media_type == "image"){
                    //Add new img to preview card//test only
                    $scope.cards.push({
                        title: "",
                        icon:"",
                        imageUrl: urlPrefix + response.url,
                        videoUrl: "",
                        description:""
                    }) 
                }
                else{
                    Logger.log("Media type is not supported.")
                }


            }).error(function(err){
                //error
                console.log("Error occurred while sending " +
                 "file to server: " + err)
            }); 
        }
    };


    $scope.addNewCard = function(){
        //Inject HTML into DIV object, show all cards on home page

        var div = ""
        for(var i=0; i<$scope.cards.length; i++){
            var html = '<div class="col-sm-4 col-lg-4 col-md-4">';
            html += '<div class="thumbnail">';
            html += '<img src="http://placehold.it/320x150" alt="">';
            html += '<div class="caption">';
            html += '<h4><a href="#!card">' + $scope.cards[i].title + '</a>'; 
            html += '</h4>'; 
            html += '<p>Test cards generated</p>'; 
            html += '</div>'; 
            html += '</div>'; 
            html += '</div>'; 

            div += html; 
        }
        $scope.deckHTML = div; 

  
    };

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

