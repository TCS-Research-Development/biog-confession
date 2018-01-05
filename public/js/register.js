var app = angular.module("myApp",['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
.when("/", {
        templateUrl : "public/views/home.html",
        controller:"homectrl"
    })
    .when("/login", {
        templateUrl : "public/views/login.html",
        controller:"regCtrl"
    })
    .when("/register", {
        templateUrl : "public/views/register.html",
        controller:"signup"
    })
    // .when("/adminhome", {
    //     templateUrl : "public/views/sample.html",
    // })
    .when("/userhome", {
        templateUrl : "public/views/file-upload.html",
        controller:"uploadctrl"
    })
    .when("/adminhome",{
        templateUrl:"public/views/target.html",
        controller:"showctrl"

    })
});

app.controller('homectrl', function($scope,$location){
  $scope.goto = function(path){
    $location.path("/login");
  };
});
// app.controller('uploadctrl', function($scope,$location){
//   $scope.goto = function(path){
//     $location.path("/login");
//   };
// });


app.controller('regCtrl', function($scope,$http,$location){

$scope.loginUser = function(){
       $http({
    method: 'GET',
    url: 'http://localhost:8000/Get'
  }).then(function successCallback(response) {
    
        console.log("Entered in successCallback ");
        console.log(JSON.stringify(response.data));
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.statusText);

// $scope.birdsapi = response.data.data;
//       for (var i=0;i<($scope.birdsapi.Data).length;i++){
//       if (($scope.userName == $scope.birdsapi.Data[i].email) && ($scope.pwd == $scope.birdsapi.Data[i].pwd) ){

//       $location.path("/target")
//     }

    if(($scope.userName==="admin")&&($scope.pwd=="admin")){
        $location.path("/adminhome")
    }
    else
    {
        $scope.birdsapi = response.data.data;
      for (var i=0;i<($scope.birdsapi.Data).length;i++){
      if (($scope.userName == $scope.birdsapi.Data[i].email) && ($scope.pwd == $scope.birdsapi.Data[i].pwd) ){

      $location.path("/userhome")
    }
    }
        
  }
        }, function errorCallback(response) {
        console.log("Entered in errorCallback ");
        console.log(response.xhrStatus);
        console.log(response.status);
        console.log(response.statusText);
});

}
    $scope.signUp = function(){
        $location.path("/register")
    }
});

app.controller('signup', function($scope,$http,$location){
$scope.login = function(firstname,lastname,pwd,confirmpwd,email,phone)
{
   var body = {
        
            firstname: $scope.firstname,
            lastname : $scope.lastname,
            pwd : $scope.pwd,
            confirmpwd : $scope.confirmpwd,
            email:$scope.email,
            phone:$scope.phone
	};
   $http({
    method: 'POST',
    url: 'http://localhost:8000/Post',
    data:body,
    headers:{'Content-Type': 'application/json'},
  }).then(function successCallback(response) {
        console.log("Entered in successCallback ");
        console.log(JSON.stringify(response.data));
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.statusText);
        alert('Success');
        }, function errorCallback(response) {
        console.log("Entered in errorCallback ");
        console.log(response.xhrStatus);
        console.log(response.status);
        console.log(response.statusText);
}); 
   }

});


app.controller('showctrl', function($scope,$http,$location){
 $http({
    method: 'GET',
    url: 'http://localhost:8000/show'
  }).then(function successCallback(response) {
        console.log("Entered in successCallback ");
        // console.log(JSON.stringify(response.data));
        console.log(response.status);
        console.log(response.statusText);
        console.log(response.statusText);
        // $scope.name = response.data;
       // $scope.username=response.data.Data[0].username;
        console.log(response.data.Data);
        $scope.username=response.data.Data;
        // alert('File uploaded successfully');
        // $scope.box_file_path=response.data.Data[0].box_file_path;
        // $scope.file_created_at=results.dat.Data[0].file_created_at;
        // $scope.username=response.data.Data[1].username;
        //console.log(response.data.Data[1].username);
        //console.log('length of the ffile is'+response.data.Data[0].length);
        console.log('hello');
     }, function errorCallback(response) {
        console.log("Entered in errorCallback ");
        console.log(response.xhrStatus);
        console.log(response.status);
        console.log(response.statusText);
});   
// });


   
      $scope.myFunc = function(event) {
//var message = $scope.username;
     var userId=[0,1,2,3,4,5,6,7,8,9];
console.log(userId);
// /

var array=$scope.username.map(function (username) {
  return username.box_file_path;
});
console.log(array);

for(i=0;i<=20;i++)
{
    if(userId.indexOf[i]==array.indexOf[i])
    {
        console.log('hello Divya Pothu');
        console.log(i);
         console.log(array[i]);
        var fdata=array[i];
        var cdata='['+fdata+']';
        console.log('json arranged data'+cdata);
        
  //     }
  // }
           $http({
    method: 'POST',
    url: 'http://localhost:8000/download',
    // data:array,
    data:cdata,
    headers:{'Content-Type': 'application/json'},
  }).then(function successCallback(response) {
        console.log("Entered in successCallback ");
        console.log('how are you');

       

});
}
}
}

});

    


