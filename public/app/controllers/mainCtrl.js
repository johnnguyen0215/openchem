angular.module('mainCtrl', [])
.controller('mainController', function($rootScope, $sce, $location, Auth, Admin, Search) {
	var vm = this;
	vm.currentTopicName = "Welcome to UCI OpenChem";
	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	vm.logoutClass = "logoutBtn";

	vm.embedUrl = $sce.trustAsResourceUrl("https://www.youtube.com/embed/6JGQH-olv3M");

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
				if (vm.user.admin){
					vm.logoutClass="logoutBtn2";
					vm.isAdmin = true;
				}
				else{
					vm.logoutCLass="logoutBtn";
					vm.isAdmin = false;
				}
			});
	});

	vm.search = function(){
		vm.topicData = '';
		Search.getItems(vm.searchQuery)
			.success(function(data){
				vm.topicData = data;
			    if (vm.topicData == ''){
					vm.searchMessage = "No results were found";
				}
				else{
					vm.searchMessage = '';
				}
			});
		vm.searchQuery = '';
	}

	vm.parseEmbed = function(url){
		var timeIndex = url.indexOf('t=');
		if (timeIndex != -1){
			var idIndex = url.indexOf('&v');
			vm.startTime = url.substring(timeIndex+2,idIndex);
		}

	}


	vm.setTopic = function(topic){
		vm.topic = topic;
		vm.currentTopicName = vm.topic.topicName;
		vm.currentChemTextName = vm.currentChemTextUrl = vm.currentChemTextType = vm.currentProblemName = vm.currentProblemUrl = vm.currentProblemType = '';
		vm.parseEmbed(vm.topic.videoUrl);
		if (vm.startTime){
			vm.embedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+topic.videoId+'?start='+vm.startTime);
		}
		else{
			vm.embedUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/'+topic.videoId);
		}
		if (vm.topic.chemText.length > 0){
			vm.currentChemTextName = vm.topic.chemText[0].name;
			vm.currentChemTextType = vm.topic.chemText[0].type;
			if (vm.currentChemTextType == "pdf"){
				var chemTextPdf = new PDFObject({url: vm.topic.chemText[0].url}).embed("chemTextPdf");
			}
			else if(vm.currentChemTextType == "link"){
				vm.currentChemTextUrl = $sce.trustAsResourceUrl(vm.topic.chemText[0].url);
			}
		}
		if (vm.topic.practiceProblems.length > 0){
			vm.currentProblemName = vm.topic.practiceProblems[0].name;
			vm.currentProblemType = vm.topic.chemText[0].type;
			if (vm.currentProblemType == "pdf"){
				var problemTextPdf = new PDFObject({url: vm.topic.practiceProblems[0].url}).embed("problemPdf");
			}
			else if (vm.currentProblemType == "link"){
				vm.currentProblemUrl = $sce.trustAsResourceUrl(vm.topic.practiceProblems[0].url);
			}
		}	
	}

	vm.changeChemText = function(chemText){
		vm.currentChemTextName = chemText.name;
		vm.currentChemTextType = chemText.type;
		if (vm.currentChemTextType == "pdf"){
			var chemTextPdf = new PDFObject({url: chemText.url}).embed("chemTextPdf");
		}
		vm.currentChemTextUrl = $sce.trustAsResourceUrl(chemText.url); 
	}

	vm.changeProblem = function(problem){
		vm.currentProblemName = problem.name;
		vm.currentProblemType = problem.type;
		if (vm.currentProblemType == "pdf"){
			var problemPdf = new PDFObject({url: problem.url}).embed("problemPdf");
		}
		vm.currentProblemUrl = $sce.trustAsResourceUrl(problem.url);
	}


	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;			
				// if a user successfully logs in, redirect to users page
				if (data.success)			
					$location.path('/');
				else 
					vm.error = data.message;
				
			});
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';
		vm.isAdmin = false;
		$location.path('/login');
	};

	vm.createSample = function() {
		Auth.createSampleUser();
	};

});
