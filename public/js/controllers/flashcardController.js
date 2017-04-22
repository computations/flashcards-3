//flashcard.js

app.controller('flashcardController', ['$scope', 'Upload', '$http','ngDialog', 'isLegitCard',
 function ($scope, Upload, $http, ngDialog, isLegitCard) {

    $scope.addmenu = true;
    $scope.deletemenu = true;
    $scope.editmenu = true;
    $scope.modifymenu = true;
    $scope.textmenu = true;
    $scope.videomenu = true;
    $scope.cards = [];
    $scope.currentCard = "";
    $scope.currentCard.url = 'about:blank'
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true";
    $scope.deck = [$scope.cards];

    $scope.toggleMenu = function (add, del, edit, modify) {
        $scope.addmenu = add;
        $scope.deletemenu = del;
        $scope.editmenu = edit;
        $scope.modifymenu = modify;
        $scope.textmenu=true;
        $scope.videomenu=true;
    };

    $scope.toggleAddMenu = function(text, video) {
        $scope.textmenu=text;
        $scope.videomenu=video;
    };

    $scope.newSide = function(med, Url, tex){
        $scope.cards.push({
            type: med, 
            url: Url,
            text: tex
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

                $scope.newSide(response.media_type, urlPrefix + response.url, "")
                
            }).error(function(err){
                //error
                Logger.log("Error occurred while sending " +
                 "file to server: " + err)
            }); 
        }
    };


    $scope.addNewCard = function(){
        var deckID = isLegitCard.getDeck()
        if(deckID==0){
            //A new Deck obj to be created
            //Dialog Box HTML
           var html = "<div>"
           html += ""
           html += "<h3>Name of Card</h3>"
           html += "<input type='text' ng-model='cardTitle'><br>"
           html += "<h4>Short Description of Card</h4>"
           html += "<input type='text' ng-model='cardDescription'><br>"
           html += "<h3>Name of New Deck</h3>"
           html += "<input type='text' ng-model='deckTitle'><br>"
           html += "<h4>Short Description of Deck</h4>"
           html += "<input type='text' ng-model='deckDescription'><br>"
           html += "</div>"
           html += "<p>"
           html += "<button ng-click='cancel()'>Cancel</button>"
           html += "<button ng-click='confirm()'>Confirm</button>"
           html += "</p>"

           var card = $scope.cards 

           //Prompt the user to name the card
           ngDialog.open({
                    template: html,
                    plain: true, 
                    width: 400,
                    height: 400,
                    className: 'ngdialog-theme-plain',
                    controller:  ['$scope', function($scope){

                        //Make a new deck with card in it
                        $scope.confirm = function(){
                            //Send the card with the title and description
                            $http({
                                method: 'POST',
                                url: 'http://localhost:3000/card/',
                                data:{'media': card} //An array of the card's sides, 
                                                        //each side is json
                            }).then(function(res){

                            }, function(error){
                                Logger.log(error)
                            });

                            //close the dialog box
                            ngDialog.close()
                        }

                        $scope.cancel = function(){
                            ngDialog.close()
                        }
                    }]
            }); 
        }
        else{
            //Deck is already created, append card 

           //Dialog Box HTML
           var html = "<div>"
           html += ""
           html += "<h1>Name of Card</h1>"
           html += "<input type='text' ng-model='cardTitle'><br>"
           html += "<h2>Short Description of Card</h2>"
           html += "<input type='text' ng-model='cardDescription'><br>"
           html += "</div>"
           html += "<p>"
           html += "<button ng-click='cancel()'>Cancel</button>"
           html += "<button ng-click='confirm()'>Confirm</button>"
           html += "</p>"

           var card = $scope.cards 

           //Prompt the user to name the card
           ngDialog.open({
                    template: html,
                    plain: true, 
                    width: 400,
                    height: 400,
                    className: 'ngdialog-theme-plain',
                    controller:  ['$scope', function($scope){

                        $scope.confirm = function(){
                            //Send the card with the title and description
                            $http({
                                method: 'POST',
                                url: 'http://localhost:3000/card/',
                                data:{'media': card} //An array of the card's sides, 
                                                        //each side is json
                            }).then(function(res){

                            }, function(error){
                                Logger.log(error)
                            });

                            //close the dialog box
                            ngDialog.close()
                        }

                        $scope.cancel = function(){
                            ngDialog.close()
                        }
                    }]
     
            }); 
        }

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

    $scope.transformServerObjToCard = function(serverCards){
        for(var i=0; i<serverCards.media.length; ++i){
            //type, url, text
            $scope.newSide(serverCards.media[i].type, serverCards.media[i].url,
                serverCards.media[i].text)
        }
    }

    $scope.getCard = function(){
        var cardID = isLegitCard.getCard()
        if(cardID == {} || cardID == 0 || cardID == undefined){
            //nope, new card
            return; 
        }
        else{
            //Get the card data from the server
            $http({
                method: 'GET',
                url: 'http://localhost:3000/card/' + cardID
            }).then(function(success){
                $scope.transformServerObjToCard(success.data)
            }, function(error){
                    Logger.log(error)
            });
        }

    }

    //Do these on load
    $scope.onload = function(){
        //see if it is a card that is already created
        $scope.getCard();  
    }

    //call it on load
    $scope.onload(); 

}]);

