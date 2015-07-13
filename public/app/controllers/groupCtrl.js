angular.module('groupCtrl', ['groupService', 'userService', 'authService'])
.controller('groupController', function(Group, User, Auth) {

	var vm = this;

	// loads current user information
	Auth.getUser()
		.success(function(data){
			vm.user = data;
			vm.loadLeaderGroups();
		})

	vm.loadLeaderGroups = function(){
		Group.getGroups(vm.user.leader.groups)
			.success(function(data){
				alert('loaded');
				vm.leaderGroups = data;
			})
	}
	/*
	if (vm.user.leader.groups.length > 0){
		alert('loading');
		vm.loadLeaderGroups();
	}*/


	vm.groupObj = {
		name: "",
		leaders: [],
		members: [],
		discussionTopics: []
	}

	vm.addGroup = function(){

		// input the group object
		if (vm.user.leader.groupsCreated >= 5){
			vm.alertmsg = "alert alert-danger"
			vm.message = "Maximum number of groups created has been reached"
		}
		else{
			vm.message = '';
			vm.groupObj.leaders.push(vm.user.username);
			vm.groupObj.members.push(vm.user.username);
			Group.addGroup(vm.groupObj)
				.success(function(data){
					if (data.error){
						vm.alertmsg = "alert alert-danger";
						vm.message = data.error;
					}
					else{
						vm.alertmsg = "alert alert-info";
						vm.message = data.message;
					}
				})

			// Update the current user's information
			alert(vm.user.leader.groups);
			alert(vm.user.leader.groupsCreated);

			vm.user.leader.groups.push(vm.groupObj.name);
			vm.user.leader.groupsCreated += 1;
			vm.user.groups.push(vm.groupObj.name);
			User.update(vm.user._id, vm.user);


			alert("updating user information");

			// reset the group object
			vm.groupObj = {
				name: "",
				leaders: [],
				members: [],
				discussionTopics: []
			}

			vm.loadLeaderGroups();

		}
	}


	vm.addMember = function(){
		User.inviteToGroup(vm.memberName)
			.success(function(data){
				alert('success');
			})

		vm.memberName = '';
	}

})