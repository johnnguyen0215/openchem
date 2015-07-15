angular.module('groupCtrl', ['groupService', 'userService', 'authService'])
.controller('groupController', function(Group, User, Auth) {

	var vm = this;

	// loads current user information
	Auth.getUser()
		.success(function(data){
			vm.userId = data._id;
			vm.loadUser();
		})

	vm.loadUser = function(){
		vm.processing = true;
		if (vm.userId){
			User.get(vm.userId)
				.success(function(data){
					vm.user = data;
					if (vm.user.groups.length > 0){
						vm.loadUserGroups();
					}
					if (vm.user.leader.groups.length > 0){
						vm.loadLeaderGroups();
					}
					vm.processing = false;
				})
		}
	}
	
	vm.loadUserGroups = function(){
		Group.getGroups("userGroups", vm.user)
			.success(function(data){
				vm.userGroups = data;
				vm.currentGroup = vm.userGroups[0];
			})
	}
	
	
	vm.loadLeaderGroups = function(){
		Group.getGroups("leaderGroups", vm.user)
			.success(function(data){
				vm.leaderGroups = data;
			})
	}
	


	vm.groupObj = {
		name: "",
		leaders: [],
		members: [],
		discussionTopics: []
	}

	vm.addGroup = function(){
		vm.message = '';
		// input the group object

		if (vm.user.leader.groupsCreated >= 5){
			vm.alertmsg = "alert alert-danger"
			vm.message = "Maximum number of groups created has been reached"
		}
		else{

			vm.groupObj.leaders.push(vm.user.username);

			Group.addGroup(vm.groupObj)
				.success(function(data){
					if (data.error){
						vm.alertmsg = "alert alert-danger";
						vm.message = data.error;
					}
					else{
						vm.alertmsg = "alert alert-info";
						vm.message = data.message;
						User.updateLeaderGroups({groupName: vm.groupObj.name, leaderId: vm.userId});
						vm.loadUser();
						vm.groupObj = {
							name: "",
							leaders: [],
							members: [],
							discussionTopics: []
						}
						vm.loadUserGroups();
						vm.loadLeaderGroups();
					}
				})
		}
	}


	vm.addMember = function(){
		User.inviteToGroup(vm.memberName)
			.success(function(data){
			})

		vm.memberName = '';
	}

	vm.deleteGroup = function(group){
		vm.processing = true;
		User.deleteFromUsers({groupName: group.name, leaderId: vm.userId})
			.success(function(data){
				alert("successful deletion from users groups");
			})
		Group.deleteGroup(group._id)
			.success(function(data){
				vm.deleteMessage = data.message;
				vm.loadUserGroups();
				vm.loadLeaderGroups();
				vm.processing = false;
			});
	}

	vm.changeGroup = function(group){
		vm.currentGroup = group;
	}


})