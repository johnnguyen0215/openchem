angular.module('adminCtrl', ['adminService', 'authService'])
.controller('adminController', function($routeParams, $location, Admin, Auth) {

	var vm = this;

	
	Admin.getUploadDirectory()
		.success(function(data){
			vm.files = data;
		});

	vm.chemTextFileName = vm.problemFileName = "File Dropdown";


	vm.videoUrlModel = ''; // Stores the url 

	vm.keyword = ''; // Stores the keyword being input

	vm.chemTextObj = {'name': '', 'url':'', 'type':''};

	vm.practiceProbObj = {'name': '', 'url':'', 'type':''};

	vm.message = ''; // stores the message to be displayed upon submission

	vm.chemTextMsg = '';

	vm.problemsMsg = '';

	vm.alertmsg; // Used to change styling of the message

	vm.topicData = {
		'topicName': '',
		'videoId': '',
		'videoUrl': '',
		'videoDescription': '',
		'keywords': [],
		'chemText': [],
		'practiceProblems': []
	};

	if ($routeParams.topic_id){
		vm.type = 'Update';
		Admin.get($routeParams.topic_id)
			.success(function(data){
				vm.topicData = data;
				vm.processing = false;
			});
	}
	else{
		vm.type = 'Upload';
	}


	vm.fieldColors = {'nameColor': 'blackHighlight', 'uploadVideoColor': 'blackHighlight', 'keywordsColor': 'blackHighlight',
	'videoDescColor': 'blackHighlight'};

	vm.changeChemTextFile = function(fileName){
		vm.chemTextObj.url = "./uploads/"+ fileName;
		vm.chemTextFileName = fileName;
	}

	vm.changeProblemFile = function(fileName){
		vm.practiceProbObj.url = "./uploads/"+ fileName;
		vm.problemFileName = fileName;
	}

	vm.parseId = function(url){
		vm.topicData.videoId = url.split('v=')[1];
		var ampersandPosition = vm.topicData.videoId.indexOf('&');
		if(ampersandPosition != -1) {
		  vm.topicData.videoId = vm.topicData.videoId.substring(0, ampersandPosition);
		}
	}
	
	vm.inputVideoUrl = function(){
		vm.topicData.videoUrl = vm.videoUrlModel;
		vm.parseId(vm.videoUrlModel);
		vm.videoUrlModel = '';
	}

	vm.inputKeyword = function(){
        if (!($.inArray(vm.keyword, vm.topicData.keywords) > -1)){
            vm.topicData.keywords.push(vm.keyword);   
        }
        vm.keyword = '';
	}

	vm.deleteKeyword = function(keyword){
        var index = vm.topicData.keywords.indexOf(keyword);
        if (index > -1){
            vm.topicData.keywords.splice(index, 1);
        }
	}

	vm.isPdf = function(url){
		if (url.indexOf('.pdf') > -1){
			return true;
		}
		return false;
	}

	vm.inputChemTextObj = function(){
		if (!vm.chemTextObj.name || !vm.chemTextObj.url){
			vm.chemTextMsg = "Please input a value in both fields.";
		}
		else{
			if (vm.isPdf(vm.chemTextObj.url)){
				vm.chemTextObj.type = "pdf";
			}
			else {
				vm.chemTextObj.type = "link";
			}
			vm.topicData.chemText.push(vm.chemTextObj);
			vm.chemTextObj = {};
			vm.chemTextMsg = '';
		}
	}

	vm.deleteChemTextObj = function(chemTextObject){
		var index = vm.topicData.chemText.indexOf(chemTextObject);
		if (index > -1){
			vm.topicData.chemText.splice(index,1);
		}
	}

	vm.inputPracticeProbObj = function(){
		if (!vm.practiceProbObj.name || !vm.practiceProbObj.url){
			vm.problemsMsg = "Please input a value in both fields.";
		}
		else{
			if (vm.isPdf(vm.chemTextObj.url)){
				vm.chemTextObj.type = "pdf";
			}
			else {
				vm.chemTextObj.type = "link";
			}
			vm.topicData.practiceProblems.push(vm.practiceProbObj);
			vm.practiceProbObj = {};
			vm.problemsMsg = '';
		}
	}

	vm.deletePracticeProbObj = function(practiceProb){
		var index = vm.topicData.practiceProblems.indexOf(practiceProb);
		if (index > -1){
			vm.topicData.practiceProblems.splice(index,1);
		}
	}

	vm.checkCompletion = function(){
		var numOfIncomplete = 0;
		if (vm.topicData.topicName == ''){
			vm.fieldColors['nameColor'] = 'redHighlight'; numOfIncomplete++;	
		}
		else{
			vm.fieldColors['nameColor'] = 'blackHighlight';
		}
		if (vm.topicData.videoId == ''){
			vm.fieldColors['uploadVideoColor'] = 'redHighlight'; numOfIncomplete++;
		}
		else{
			vm.fieldColors['uploadVideoColor'] = 'blackHighlight';
		}

		if (vm.topicData.keywords.length == 0){
			vm.fieldColors['keywordsColor'] = 'redHighlight'; numOfIncomplete++;
		}
		else{
			vm.fieldColors['keywordsColor'] = 'blackHighlight';
		}

		if (vm.topicData.videoDescription == ''){
			vm.fieldColors['videoDescColor'] = 'redHighlight'; numOfIncomplete++;
		}
		else{
			vm.fieldColors['videoDescColor'] = 'blackHighlight';
		}

		return numOfIncomplete;
	}
	
	vm.uploadTopic = function(){
		vm.processing = true;
		vm.message = '';
		var complete = vm.checkCompletion();
		if (complete != 0){
			vm.alertmsg = "alert alert-danger";
			vm.message = "Please input a value in the highlighted fields";
		}
		else{

			Admin.create(vm.topicData)
				.success(function(data){
					vm.topicData = {
						'topicName': '',
						'videoId': '',
						'videoUrl': '',
						'videoDescription': '',
						'keywords': [],
						'chemText': [],
						'practiceProbUrls': []
					};
					vm.message = data.message;
				});
			vm.alertmsg = "alert alert-info";
			vm.keyword = '';
			vm.videoUrlModel = '';
		}
	}

	vm.updateTopic = function(){
		vm.processing = true;
		vm.message = '';
		var complete = vm.checkCompletion();
		if (complete != 0){
			vm.alertmsg = "alert alert-danger";
			vm.message = "Please specify a value in the highlighted fields";
		}
		else{
			Admin.update($routeParams.topic_id, vm.topicData)
				.success(function(data){
					vm.processing = false;
					vm.topicData = {};
					$location.path('/admin/all-topics');
					vm.message = data.message;
				});
			vm.alertmsg = "alert alert-info";
			vm.keyword = '';
			vm.videoUrlModel = '';
		}
	}

	vm.init = function(){
		vm.loggedIn = Auth.isLoggedIn();
		if (!vm.loggedIn){
			$location.path('/login');
		}
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
					$location.path('/');
				}
			});
	}

	vm.init();
	
})
.controller('topicEditController', function($location, Admin, Auth) {

	var vm = this;

	vm.type = 'Edit';

	vm.processing = true;

	Admin.all()

		.success(function(data){
			vm.topics = data;
			vm.processing = false;
		})

	vm.deleteTopic = function(topicId){
		vm.processing = true;
		Admin.delete(topicId).
			success(function(data){
				vm.message = data.message;

				Admin.all()
					.success(function(data) {
						vm.topics = data;
						vm.processing = false;
					});

			});

	}

	vm.uploadTopic = function(){
		alert("hello world");
	}
	

	vm.init = function(){
		vm.loggedIn = Auth.isLoggedIn();
		if (!vm.loggedIn){
			$location.path('/login');
		}
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
					$location.path('/');
				}
			});
	}

	vm.init();
});