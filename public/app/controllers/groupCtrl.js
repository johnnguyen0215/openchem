angular.module('groupCtrl', ['groupService', 'userService', 'authService'])
.controller('groupController', function(Group, User, Auth) {

	var vm = this;


	Auth.getUser()
		.success(function(data){
			vm.user = data;
		})

	vm.alertmsg = "alert alert-info"

	vm.groupObj = {
		name: "",
		leaders: [],
		members: [],
		discussionTopics: []
	}

	vm.addGroup = function(){
		vm.groupObj.leaders.push(vm.user.username);
		vm.groupObj.members.push(vm.user.username);
		Group.addGroup(vm.groupObj)
			.success(function(data){
				alert("success");
				vm.message = data.message;
			})
		vm.groupObj = {
			name: "",
			leaders: [],
			members: [],
			discussionTopics: []
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