//mainController.js
app.controller('mainController', ['$scope', '$sce', '$http',
 function ($scope, $sce, $http) {

 	$scope.onload = function(){
 		$scope.onloadVar *=1 //toggle directive on load (load all cards from server dynamically)
 	}

   	$scope.toCard = function(cardID){
   		Logger.log("ID:")
   		Logger.log(cardID)

   		//send card clicked data to flashcard controller
   		//isLegitCard.setCard(cardID); 

   	}; 
   	$scope.addDiv = function(){
   		$http({
            method: 'GET',
            url: 'http://localhost:3000/card'
        }).then(function(success){
        	console.log(success.data)

            var div = ""
            for(var i=0; i<success.data.length; i++){
                var html = '<div class="col-sm-4 col-lg-4 col-md-4">';
                html += '<div class="thumbnail">';
                html += '<img src="http://placehold.it/320x150" alt="">';
                html += '<div class="caption">';
                html += '<h4><a href="#!card" ng-click="clicked(3)">' + success.data[i]._id + '</a>'; 
                html += '</h4>'; 
                html += '<p>' + "Description" + '</p>'; 
                html += '</div>'; 
                html += '</div>'; 
                html += '</div>'; 
                div += html; 
            }
            html = div 

           // ele.html((typeof(html) === 'string') ? html : html.data);
            //$compile(ele.contents())(scope);
            $scope.html = $sce.trustAsHtml(html)
        }, function(error){
            console.log(error)
        });
   	}

}]);