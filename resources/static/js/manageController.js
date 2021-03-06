app.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(fd, uploadUrl){
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}//'multipart/form-data;boundary=gc0p4Jq0M2Yt08jU534c0p'}
        })
        .success(function(response){
        	console.log(response);
        })
        .error(function(response){
        	console.log(response);
        }).finally(function() {
        // called no matter success or failure
            return response;
      });
    }
}]);

app.controller('ManageController', function($scope,$http,$timeout,fileUpload,$sce,$rootScope) {

	var details = "";
	$scope.beforecomplete = true;
	$scope.welcomeNext=true;
	$scope.databaseNext=true;
	$scope.disableschema=true;
	$scope.disableschemadetails=true;
	$scope.disablecomplete=true;
	$scope.schemaOptions = ['JDO','HIBERNATE','ORACLE','MYSQL','CUSTOM JAR'];
	$scope.states = ['DEFAULT', 'PENDING', 'SUCCESS', 'FAILED'];
	$scope.text = ['Test Connection', 'Connecting', 'Connection Sucessfull', 'Connection Failed'];
	$scope.uploadText = ['Upload File', 'Uploading', 'Upload Sucessfull', 'Upload Failed'];
	$scope.btn0 = {
	        state: $scope.states[0],
	        buttonText: $scope.text[0]
	};
	
	$scope.addConfig=false;		// 1
	$scope.viewConfig=true;	// 0
	$scope.showSucess = false;
	$scope.showError = false;
	
	function displayError(msg)
	{
		$scope.showError = true;
		$scope.errorMsg = $sce.trustAsHtml(msg);
	}
	
	function displaySuccess(msg) 
	{
		$scope.showSucess = true;
		$scope.successMsg = $sce.trustAsHtml(msg);
	}
	
	function clearAll() 
	{
		$scope.disablecomplete=true;
		$scope.summary=$sce.trustAsHtml("");
		$scope.newConfigName = "";
		$scope.fileOne="";
		$scope.schemaSelect="";
	}
	
	$scope.testconnection=function() {
		
		// Change text to "Connecting"
		$scope.btn0.state=$scope.states[1];
		$scope.btn0.buttonText=$scope.text[1];
		
		if($scope.schemaSelect == 'ORACLE')
		{
			details = {
					driver:"oracle.jdbc.driver.OracleDriver",
					url:"jdbc:oracle:thin:@"+$scope.host+":"+$scope.port+":"+$scope.databaseName,
					username:$scope.userName,
					password:$scope.password
			}
		}
		else if($scope.schemaSelect == 'MYSQL')
		{			
			details = {
					driver:"com.mysql.jdbc.Driver",
					url:"jdbc:mysql://"+$scope.host+":"+$scope.port+":"+$scope.databaseName,
					username:$scope.userName,
					password:$scope.password
			}
		}		
		
		console.log(details);
	        
	        var config = {
	            headers : {
	                'Content-Type': 'application/json'
	            }
	        }

	        $http.post('/testJDBC/', details, config)
	        .success(function (response) {
	        	console.log(response);
	        	//$rootScope.disableDIV = false;
	        	
	        	if(response)
	        	{
	        		$scope.beforecomplete=false;
	        		$scope.btn0.state=$scope.states[2];
	        		$scope.btn0.buttonText=$scope.text[2];
	        	}
	        	else
	        	{
	        		$scope.beforecomplete=true;
	        		$scope.btn0.state=$scope.states[3];
	        		$scope.btn0.buttonText=$scope.text[3];
	        	}
	        	
	        })
	        .error(function (response) {
	            console.log(response);
	            
	            $scope.beforecomplete=true;
	            $scope.btn0.state=$scope.states[3];
	            $scope.btn0.buttonText=$scope.text[3];

	        }).finally(function() {
	        // called no matter success or failure
	            return response;
	      });
	}
	
	$scope.beginDataLoad=function() {
	
		$rootScope.disableDIV = true;
		$rootScope.toggle = 'disabled';
		console.log("Data Processing initiated !!!");		
			
		var data = {
			configName: $scope.newConfigName,
			databaseName: null,
			dbUserName:null,
			dbPassword:null,
			schemaName:$scope.schemaSelect,
			connection:details
        };
        
		if(details === "")
			data.connection = null;
		
        var config = {
            headers : {
                'Content-Type': 'application/json'
            }
        }

        $http.post('/startProcess/', data, config)
        .success(function (response) {
        	console.log(response);
    		$scope.selectedIndex = 0;
        	$rootScope.disableDIV = false;
    		$rootScope.toggle = 'enabled';
        	displaySuccess("Configuration created !!!");
        })
        .error(function (response) {
            console.log(response);
    		$scope.selectedIndex = 0;
            $rootScope.disableDIV = false;
    		$rootScope.toggle = 'enabled';
            displayError("Configuration not created !!!");

        }).finally(function() {
        // called no matter success or failure
        	Configuration = restGET(configList);
            return response;
      });
	
	}
	
	$scope.brosweJDO=function() {
		$timeout(function() {
			angular.element('#jdo').triggerHandler('click');
		});
	};
	
	$scope.jdoFile=function(item) {
		
		console.log(" File : "+item+"\t"+$scope.jdoFileSelected);
	};
	$scope.$watch('schemaSelect', function() {

		console.log("here -> "+$scope.schemaSelect);
		
		if($scope.schemaSelect === 'JDO' || $scope.schemaSelect === 'HIBERNATE')
		{
			$scope.btn0.state=$scope.states[0];
			$scope.btn0.buttonText=$scope.uploadText[0];
		}
		else if($scope.schemaSelect === 'ORACLE' || $scope.schemaSelect === 'MYSQL')
		{
			$scope.btn0.state=$scope.states[0];
			$scope.btn0.buttonText=$scope.text[0];
		}
		
	});
	
	$scope.$watch('selectedIndex', function(current, old){
		
		if(old != current && old > current)
		{
			if(1 == old || current == 0)
			{
				$scope.beforecomplete=true;
				$scope.disableschema=true;
				$scope.disablecomplete=true;
				clearAll();
			}
			else if(2 == old || current == 1)
			{
				$scope.beforecomplete=true;
				$scope.disablecomplete=true;
				$scope.btn0.state=$scope.states[0];
				$scope.btn0.buttonText=$scope.text[0];
			}				
		}
		else
		{
			if(0 == old && 1 == current)
			{
				$scope.beforecomplete=true;
				$scope.disableschema=false;
				$scope.btn0.state=$scope.states[0];
				$scope.btn0.buttonText=$scope.text[0];
			}
			else if(1 == old && 2 == current)
			{
				$scope.disablecomplete=false;
				
				// display summary
				var summary = "<table class='table borderless'><thead>"
				
				summary	= summary + "<tr><th>Configuration Name</th><th>"+$scope.newConfigName+"</th></tr>";
				summary	= summary + "<tr><th>Schema Type</th><th>"+$scope.schemaSelect+"</th></tr>";
				
				if($scope.schemaSelect == 'JDO' || $scope.schemaSelect == 'HIBERNATE')
				{
					summary	= summary + "<tr><th>Zip File</th><th>"+$scope.fileOne.name+"</th></tr>";
				}
				else if($scope.schemaSelect == 'ORACLE')
				{
					/**var DBdetails = "DRIVER CLASS = oracle.jdbc.driver.OracleDriver<br/>";
					DBdetails += "URL = jdbc:oracle:thin:@"+$scope.host+":"+$scope.port+":"+$scope.databaseName+"<br/>";
					DBdetails += "USERNAME = "+$scope.userName+"<br/>";
					DBdetails += "PASSWORD = "+$scope.password+"<br/>";**/
					summary	= summary + "<tr><th>RDBMS Details</th><th>"+details+"</th></tr>";
				}
				else if($scope.schemaSelect == 'MYSQL')
				{
					/**var details = "DRIVER CLASS = com.mysql.jdbc.Driver<br/>";
					details += "URL = jdbc:mysql://"+$scope.host+":"+$scope.port+":"+$scope.databaseName+"<br/>";
					details += "USERNAME = "+$scope.userName+"<br/>";
					details += "PASSWORD = "+$scope.password+"<br/>";**/
					summary	= summary + "<tr><th>RDBMS Details</th><th>"+details+"</th></tr>";
				}
				summary = summary + "</thead></table>"
				$scope.summary = $sce.trustAsHtml(summary);
			}
		}
	});
	
	$scope.$watch('newConfigName', function(name){
		console.log(" Config Name : "+name);
		
		if(typeof(name) != undefined && name != null && name != '')
		{
			var isExist = false;
			angular.forEach(Configuration, function(value, key) {
				if(!isExist && typeof(value.configName) != undefined && value.configName != null )
				{
					if(value.configName === name)
					{
						isExist = true;
					}
					console.log(key + ' : ' + value.configName);
				}
			});
			
			if(isExist)
			{
				//show error
				$scope.inValidConfigName = true;
				$scope.welcomeNext=true;
			}
			else
			{
				//enable begin button
				$scope.inValidConfigName = false;
				$scope.welcomeNext=false;
			}
		}
		else
		{
			$scope.welcomeNext=true;
		}
	});
	
	$scope.$watch('dbName', function(name){
		console.log(" DataBase Name : "+name);
		
		if(typeof(name) != undefined && name != null && name != '')
		{
			var isExist = false;
			angular.forEach(Configuration, function(value, key) {
				if(!isExist && typeof(value.databaseName) != undefined && value.databaseName != null )
				{
					if(value.databaseName === name)
					{
						isExist = true;
					}
					console.log(key + ' : ' + value.databaseName);
				}
			});
			
			if(isExist)
			{
				//show error
				$scope.inValidDBName = true;
				$scope.databaseNext=true;
			}
			else
			{
				//enable begin button
				$scope.inValidDBName = false;
				$scope.databaseNext=false;
			}
		}
		else
		{
			$scope.databaseNext=true;
		}
	});
	
	
	
    function restGET(url) 
    {
        $http({
            method : 'GET',
            url : url
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
            console.log(response.statusText);
        }).finally(function() {
        // called no matter success or failure
            return response;
      });
    } 
    
    $scope.uploadFile = function(){
    	
        var fileone = $scope.fileOne;
        
		$scope.btn0.state=$scope.states[1];
		$scope.btn0.buttonText=$scope.uploadText[1];
		
        var fd = new FormData();
        fd.append('configName',$scope.newConfigName);
        fd.append('fileOne', fileone);

        var uploadUrl = "/upload";
        //fileUpload.uploadFileToUrl(fd, uploadUrl);
        
        
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}//'multipart/form-data;boundary=gc0p4Jq0M2Yt08jU534c0p'}
        })
        .success(function(response){
        	console.log(response);
        	$rootScope.disableDIV = false;
        	$scope.beforecomplete=false;
    		$scope.btn0.state=$scope.states[2];
    		$scope.btn0.buttonText=$scope.uploadText[2];
        })
        .error(function(response){
        	console.log(response);
        	$rootScope.disableDIV = false;
        	$scope.beforecomplete=true;
    		$scope.btn0.state=$scope.states[3];
    		$scope.btn0.buttonText=$scope.uploadText[3];
        	
        }).finally(function() {
        // called no matter success or failure
            return response;
      });
        
    };
});