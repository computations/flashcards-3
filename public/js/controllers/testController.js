//testController.js

app.controller('testController', function($scope) {
    //modify this function will be called when user hits submit
    //when input is given pull something up
    $scope.startTest = function (field) {
        if (field == undefined) {
            Logger.log("found an empty field")
        } else {
            Logger.log("Submit button was hit");
            Logger.log(field);
        }

    }
});