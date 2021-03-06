//flashcard.js

app.controller('flashcardController', ['$scope', 'Upload', '$http','ngDialog', 'isLegitCard',
 function ($scope, Upload, $http, ngDialog, isLegitCard) {

    $scope.addmenu = true;
    $scope.deletemenu = true;
    $scope.editmenu = true;
    $scope.modifymenu = true;
    $scope.textmenu = true;
    $scope.videomenu = true;
    $scope.textfield ="";
    $scope.dataLoaded=false;
    $scope.cards = [];
    $scope.currentCard = $scope.cards[0];
    $scope.cardCounter = 0;
    $scope.isCardRevealed = true;
    $scope.title="";
    $scope.description="";

    //will be used to trigger whether or not card back will be displayed
    $scope.clickBack = true;
    $scope.textVal = "true";
    $scope.deck = [$scope.cards];

    $scope.toggleMenu = function (add, del, edit, modify) {
        $scope.addmenu = add;

        if ($scope.currentCard != undefined) {
            $scope.deletemenu = del;
            $scope.editmenu = edit;
        }

        $scope.modifymenu = modify;
        $scope.textmenu=true;
        $scope.videomenu=true;
        if ($scope.editmenu==false) {
            $scope.toggleEdit();
        }
        if ($scope.deletemenu==false) {
            $scope.deleteSide();
        }

    };

    $scope.toggleAddMenu = function(text, video) {
        $scope.textmenu=text;
        $scope.videomenu=video;
    };

    $scope.newSide = function(med, Url, tex){
        $scope.resetMenu();
        $scope.field="";


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
            var urlPrefix = "/"

            Upload.upload({
                url: '/upload',
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
        $scope.resetMenu();
        var deckID = isLegitCard.getDeck()

        if ($scope.newcard) {
            if (deckID == 0) {
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
                html += "<button style=\"margin-top:1em; margin-right:0.5em;\" class=\"btn btn-basic\" ng-click='confirm()'>Confirm</button>"
                html += "<button style=\"margin-top:1em; margin-left:0.5em;\" class=\"btn btn-basic\" ng-click='cancel()'>Cancel</button>"
                html += "</p>"

                var card = $scope.cards

                //Prompt the user to name the card
                ngDialog.open({
                    template: html,
                    plain: true,
                    width: 400,
                    height: 400,
                    className: 'ngdialog-theme-plain',
                    controller: ['$scope', function ($scope) {

                        //Make a new deck with card in it
                        $scope.confirm = function () {
                            //Send the card with the title and description
                            $http({
                                method: 'POST',
                                url: '/card/',
                                data: {
                                    media: card,
                                    title: $scope.cardTitle,
                                    description: $scope.cardDescription
                                }, //An array of the card's sides,
                               
                                //each side is json
                            }).then(function (res) {
                                var cardID = res.data;
                                //get an image from the card for the deck to use
                                var img_url = "http://placehold.it/320x150"; 
                                for(var c=0; c<card.length; ++c){
                                    if(card[c].url){
                                        //card has an image, give to the deck
                                        img_url = card[c].url; 
                                    }
                                }

                                $http({
                                    method: 'POST',
                                    url: '/deck/',
                                    data: {
                                        title: $scope.deckTitle,
                                        desc: $scope.deckDescription,
                                        imgUrl: img_url,
                                        cards: [cardID]
                                    }
                                }).then(function(response){
    
                                }, function(deckError){
                                    Logger.log("Deck POST error: ", deckError)
                                }); 


                            }, function (error) {
                                Logger.log(error)
                            });

                            //close the dialog box
                            ngDialog.close()
                        }

                        $scope.cancel = function () {
                            ngDialog.close()
                        }
                    }]
                });
            }
            else {
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
                html += "<button style=\"margin-top:1em; margin-right:0.5em;\" class=\"btn btn-basic\" ng-click='confirm()'>Confirm</button>"
                html += "<button style=\"margin-top:1em; margin-left:0.5em;\" class=\"btn btn-basic\" ng-click='cancel()'>Cancel</button>"
                html += "</p>"

                var card = $scope.cards;

                //Prompt the user to name the card
                ngDialog.open({
                    template: html,
                    plain: true,
                    width: 400,
                    height: 400,
                    className: 'ngdialog-theme-plain',
                    controller: ['$scope', function ($scope) {

                        $scope.confirm = function () {
                            //Send the card with the title and description
                            $http({
                                method: 'POST',
                                url: '/card/',
                                data: 
                                {
                                    media: card, //An array of the card's sides,
                                    title: $scope.cardTitle,
                                    description: $scope.cardDescription
                                }
                                //each side is json
                            }).then(function (res) {
                                var cardIDArr = [res.data]; 

                                var deckID = isLegitCard.getDeck(); 

                                $http({
                                    method: 'POST',
                                    url: '/deck/' + deckID,
                                    data: {'cards': cardIDArr}
                                }).then(function(response){
                                }, function(errors){
                                    Logger.log(errors)
                                }); 

                            }, function (error) {
                                Logger.log(error)
                            });

                            //close the dialog box
                            ngDialog.close()
                        }

                        $scope.cancel = function () {
                            ngDialog.close()
                        }
                    }]

                });
            }
        } else {
            //updating a card previously made

            var html = "<div>"
            html += ""
            html += "<h1>Name of Card</h1>"
            html += "<input type='text' ng-model='cardTitle'><br>"
            html += "<h2>Short Description of Card</h2>"
            html += "<input type='text' ng-model='cardDescription'><br>"
            html += "</div>"
            html += "<p>"
            html += "<button style=\"margin-top:1em; margin-right:0.5em;\" class=\"btn btn-basic\" ng-click='confirm()'>Confirm</button>"
            html += "<button style=\"margin-top:1em; margin-left:0.5em;\" class=\"btn btn-basic\" ng-click='cancel()'>Cancel</button>"
            html += "</p>"

            var card = $scope.cards;
            var title = $scope.title;
            var description = $scope.description;
            var cardID = isLegitCard.getCard()
            //Prompt the user to name the card
            ngDialog.open({
                template: html,
                plain: true,
                width: 400,
                height: 400,
                className: 'ngdialog-theme-plain',
                controller: ['$scope', function ($scope) {
                    $scope.cardTitle = title;
                    $scope.cardDescription = description;

                    $scope.confirm = function () {
                        //Send the card with the title and description
                        $http({
                            method: 'POST',
                            url: '/card/' + cardID,
                            data: {
                                media: card,
                                title: $scope.cardTitle,
                                description: $scope.cardDescription
                            } //An array of the card's sides,
                            
                            //each side is json
                        }).then(function (res) {

                        }, function (error) {
                            Logger.log(error)
                        });

                        //close the dialog box
                        ngDialog.close()
                    }

                    $scope.cancel = function () {
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
    };

    $scope.transformServerObjToCard = function(serverCards){
        for(var i=0; i<serverCards.media.length; ++i){
            //type, url, text
            $scope.newSide(serverCards.media[i].type, serverCards.media[i].url,
                serverCards.media[i].text)
        }
    };

    $scope.getCard = function() {
        var cardID = isLegitCard.getCard();
        if (cardID == {} || cardID == 0 || cardID == undefined) {
            //nope, new card
           $scope.newcard = true;
            $scope.currentCard = $scope.cards[0];
            $scope.dataLoaded = true;
            return;
        }
        else {

            //Get the card data from the server
            $http({
                method: 'GET',
                url: '/card/' + cardID
            }).then(function (success) {
                $scope.title = success.data.title;
                $scope.description = success.data.description;
                $scope.transformServerObjToCard(success.data)
                $scope.newcard = false;
                $scope.currentCard = $scope.cards[0];
                $scope.dataLoaded = true;
            }, function (error) {
                Logger.log(error)
            });

        }

    }


    //Do these on load
    $scope.onload = function(){
        //see if it is a card that is already created
        $scope.getCard();

        //Pop off first element (it was there for error loading messages 404)




    };

    $scope.resetMenu = function() {
        $scope.addmenu = true;
        $scope.deletemenu = true;
        $scope.editmenu = true;
        $scope.modifymenu = true;
        $scope.textmenu=true;
        $scope.videomenu=true;
    };

    $scope.toggleEdit = function() {
        if ($scope.currentCard.type == "text") {
            $scope.textfield = $scope.currentCard.text;
            $scope.textmenu = false;
        } else {
            $scope.videomenu = false;
        }
    };

    $scope.updateText = function(tex) {
        $scope.currentCard.text=tex;
        $scope.resetMenu();
    };

    $scope.updateVideo = function(file, errFiles) {
        if(file){
            //upload user file to server using ng-file-upload
            var urlPrefix = "/";

            Upload.upload({
                url: '/upload',
                method: 'POST',
                file: file

            }).success(function(response,status){
                $scope.resetMenu();
                $scope.currentCard.type = response.media_type;
                $scope.currentCard.url=urlPrefix + response.url;

            }).error(function(err){
                //error
                Logger.log("Error occurred while sending " +
                    "file to server: " + err)
            });
        }
    };

     $scope.deleteSide = function() {
         var html = "<div>"
         html += ""
         html += "<h1>Delete this card?</h1>"
         html += "<button style=\"margin-top:1em; margin-right:0.5em;\" class=\"btn btn-success\" ng-click='confirm()'>Yes</button>"
         html += "<button style=\"margin-top:1em; margin-left:0.5em;\" class=\"btn btn-danger\" ng-click='cancel()'>No</button>"

         var card = $scope.cards;
         var index = $scope.cardCounter;
         //Prompt the user to name the card
         ngDialog.open({
             template: html,
             plain: true,
             width: 400,
             height: 200,
             className: 'ngdialog-theme-plain',
             controller:  ['$scope', function($scope){

                 $scope.confirm = function(){
                    card.splice(index, 1);
                    ngDialog.close()
                 }

                 $scope.cancel = function(){
                     ngDialog.close()
                 }
             }]

         });
         $scope.generateCard();
         $scope.cards = card;
     };
    //call it on load
    $scope.onload();


}]);

