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
		Group.getGroups({groups: vm.user.groups})
			.success(function(data){
				vm.userGroups = data;
				if (vm.userGroups){
					vm.currentGroup = vm.userGroups[0];
				}
			})
	}
	
	
	vm.loadLeaderGroups = function(){
		Group.getGroups({groups: vm.user.leader.groups})
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
			vm.alertmsg = "alert alert-danger";
			vm.message = "Maximum number of groups created has been reached";
		}
		else{
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
						vm.user.groups.push(data.groupId);
						vm.user.leader.groups.push(data.groupId);
						vm.user.leader.groupsCreated += 1;

						User.update(vm.user._id, vm.user)
							.success(function(data){
								vm.loadUser();
							})
						vm.groupObj = {
							name: "",
							leaders: [],
							members: [],
							discussionTopics: []
						}
					}
				})
		}
	}

//db.groups.find({name:"Hector Group"}, {_id:1}).forEach(function(doc){db.users.update({username:"john"},{$push:{groups:doc._id}})})


	vm.addMember = function(){
		User.inviteUser(vm.memberName, {sentBy:vm.user.username, groupName: vm.currentGroup.name})
			.success(function(data){
			})

		vm.memberName = '';
	}


	vm.updateGroup = function(groupData){
		vm.processing = true;

		Group.updateGroup(groupData._id, groupData)
			.success(function(data){
				vm.editMessage = data.message;
				vm.loadUser();
				vm.processing = false;
			})
	}
	
	vm.deleteGroup = function(groupId){
		vm.processing = true;

		User.deleteFromAllUsers(groupId)
			.success(function(data){
			})

		vm.user.leader.groupsCreated -= 1;
		var leaderIndex = vm.user.leader.groups.indexOf(groupId);
		if (leaderIndex > -1){
			vm.user.leader.groups.splice(leaderIndex,1);
		}
		var groupIndex = vm.user.groups.indexOf(groupId);
		if (groupIndex > -1){
			vm.user.groups.splice(groupIndex,1);
		}

		User.update(vm.user._id, vm.user)
			.success(function(data){
			})

		Group.deleteGroup(groupId)
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