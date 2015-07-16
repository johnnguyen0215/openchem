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
		User.get(vm.userId)
			.success(function(data){
				vm.user = data;
				vm.loadUserGroups();
				vm.loadLeaderGroups();
			})
	}
	
	vm.loadUserGroups = function(){
		Group.getGroups("userGroups", vm.user)
			.success(function(data){
				vm.userGroups = data;
				if (vm.userGroups){
					vm.currentGroup = vm.userGroups[0];
				}
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
						vm.groupObj = {
							name: "",
							leaders: [],
							members: [],
							discussionTopics: []
						}
						vm.loadUser();
					}
				})
		}
	}


	vm.addMember = function(){
		User.inviteUser(vm.memberName, {sentBy:vm.user.username, groupName: vm.currentGroup.name})
			.success(function(data){
			})

		vm.memberName = '';
	}

	vm.updateGroup = function(group){
		vm.processing = true;
		User.updateUserGroups({group.name})
			.success(function(data){
			})
		Group.updateGroup(group._id)
			.success(function(data){
				vm.editMessage = data.message;
				vm.loadUser();
				vm.processing = false;
			})
	}

	vm.deleteGroup = function(group){
		vm.processing = true;
		User.deleteFromUsers(group.name)
			.success(function(data){
			})
		User.decrementGroupsCreated(vm.userId)
			.success(function(data){
			})
		Group.deleteGroup(group._id)
			.success(function(data){
				vm.editMessage = data.message;
				vm.loadUser();
				vm.processing = false;
			});
	}

	vm.changeGroup = function(group){
		vm.currentGroup = group;
	}


})