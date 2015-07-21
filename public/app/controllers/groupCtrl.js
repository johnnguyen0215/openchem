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
				if (vm.user.leader.isLeader){
					vm.loadLeaderGroups();
				}
			})
	}
	
	// loads the groups in the user's groups array
	vm.loadUserGroups = function(){
		Group.getGroups({groups: vm.user.groups})
			.success(function(data){
				vm.userGroups = data;
				if (vm.userGroups){
					vm.currentGroup = vm.userGroups[0];
				}
			})
	}
	
	//loads the groups in the user's leader group array
	vm.loadLeaderGroups = function(){
		Group.getGroups({groups: vm.user.leader.groups})
			.success(function(data){
				vm.leaderGroups = data;
			})
	}

	// template group object to be filled out in the dom
	vm.groupObj = {
		name: "",
		leaders: [],
		members: [],
		discussionTopics: []
	}


	// adds a group
	vm.addGroup = function(){
		vm.message = '';

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

	// invites a member to specific group chosen through the dom
	vm.inviteMember = function(){
		var invite = {to:vm.memberEmail, from:vm.user.email, groupName: vm.currentGroup.name, groupId: vm.currentGroup._id}
		User.inviteUser(invite)
			.success(function(data){
				if (data.error){
					vm.inviteClass = "alert alert-danger";
					vm.inviteMessage = data.message;
				}
				else{
					vm.inviteClass = "alert alert-info";
					vm.inviteMessage = data.message;
					vm.user.leader.invitesSent.push(invite)
					User.update(vm.user._id, vm.user);
					vm.loadUser();
				}
			})
		vm.memberEmail = '';
	}

	// updates the group fields in the edit panel
	vm.updateGroup = function(groupData){
		vm.processing = true;

		Group.updateGroup(groupData._id, groupData)
			.success(function(data){
				vm.editMessage = data.message;
				vm.loadUser();
				vm.processing = false;
			})
	}
	
	// Deletes a group in the edit panel
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

	// Changes the current group viewed under the 'Your Groups' section
	vm.changeGroup = function(group){
		vm.currentGroup = group;
	}

	// Accept an invite in the group invites section
	// First deletes from the sender's pending invites
	// Then deletes from the user's group invites
	// Then pushes the user into the specified group's member array
	vm.acceptInvite = function(invite){
		User.deleteSenderInvite(invite)
			.success(function(data){
			})
		Group.addGroupMember(vm.user.username, invite)
			.success(function(data){
				alert("successfully added group member");
				if (data.error){
					vm.groupInviteClass = "alert alert-danger";
				}
				else{
					vm.groupInviteClass = "alert alert-info";
					var index = vm.user.groupInvites.indexOf(invite);
					if (index > -1){
						vm.user.groupInvites.splice(index);
					}
					vm.user.groups.push(invite.groupId);
					User.update(vm.user._id, vm.user);
					vm.loadUser();
				}
				vm.groupInviteMessage = data.message;
			})
	}

	// Decline an invite in the group invites section
	// First deletes from the sender's pending invites
	// Then deletes from the user's group invites
	vm.declineInvite = function(invite){

	}

})