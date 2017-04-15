//mainController.js
app.controller('mainController', ['$scope','$http', 'Upload', '$sce', function ($scope, $http, Upload, $sce) {

    $scope.clicked = function(){
	    //Gets all the cards from the server
	        //Usage: Check API.md for URL needed
	    $http({
	        method: 'GET',
	        url: 'http://localhost:3000/card'
	    }).then(function(success){
	        console.log(success)
	        console.log(success.data[0].media[0].url)
	        console.log(success.data.length)

	        var div = ""
	        for(var i=0; i<success.data.length; i++){
	            var html = '<div class="col-sm-4 col-lg-4 col-md-4">';
	            html += '<div class="thumbnail">';
	            html += '<img src="http://placehold.it/320x150" alt="">';
	            html += '<div class="caption">';
	            html += '<h4><a href="#!card">' + "Card Title" + '</a>'; 
	            html += '</h4>'; 
	            html += '<p>' + "Description" + '</p>'; 
	            html += '</div>'; 
	            html += '</div>'; 
	            html += '</div>'; 
	            div += html; 
	        }
	        $scope.cardHTML = $sce.trustAsHtml(div); 
	        //return div; 

	    }, function(error){
	        console.log(error)
	    });
   	}

}]);