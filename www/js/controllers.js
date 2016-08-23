angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

  .controller('listExampleCtrl', ['ListFactory', '$scope', '$ionicModal',
    function(ListFactory, $scope, $ionicModal) {

      // Load the add / change dialog from the given template URL
      $ionicModal.fromTemplateUrl('templates/add-change-dialog.html', function(modal) {
        $scope.addDialog = modal;
      }, {
        scope: $scope,
        animation: 'slide-in-up'
      });


      $scope.showAddChangeDialog = function(action) {
        $scope.action = action;
        $scope.addDialog.show();
      };

      $scope.leaveAddChangeDialog = function() {
        // Remove dialog 
        $scope.addDialog.remove();
        // Reload modal template to have cleared form
        $ionicModal.fromTemplateUrl('templates/add-change-dialog.html', function(modal) {
          $scope.addDialog = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });
      };

      $scope.leftButtons = [];
      var addButton = {};
      addButton.type = "button-clear";
      addButton.content = '<i class="button button-icon button-clear ion-plus-circled"></i>';
      addButton.tap = function(e) {
        $scope.showAddChangeDialog('add');
      }
      $scope.leftButtons.push(addButton);

      // Define item buttons
      
      $scope.listCanSwipe = true

      // Get list from storage
      $scope.list = ListFactory.getList();

      // Used to cache the empty form for Edit Dialog
      $scope.saveEmpty = function(form) {
        $scope.form = angular.copy(form);
      }

      $scope.addItem = function(form) {
        var newItem = {};
        // Add values from form to object
        newItem.description = form.description.$modelValue;
        newItem.useAsDefault = form.useAsDefault.$modelValue;
        // If this is the first item it will be the default item
        if ($scope.list.length == 0) {
          newItem.useAsDefault = true;
        } else {
          // Remove old default entry from list 
          if (newItem.useAsDefault) {
            removeDefault();
          }
        }
        // Save new list in scope and factory
        $scope.list.push(newItem);
        ListFactory.setList($scope.list);
        // Close dialog
        $scope.leaveAddChangeDialog();
      };

      $scope.removeItem = function(item) {
        // Search & Destroy item from list
        $scope.list.splice($scope.list.indexOf(item), 1);
        // If this item was the Default we set first item in list to default
        if (item.useAsDefault == true && $scope.list.length != 0) {
          $scope.list[0].useAsDefault = true;
        }
        // Save list in factory
        ListFactory.setList($scope.list);
      }

      $scope.makeDefault = function(item) {
        removeDefault();
        var newDefaultIndex = $scope.list.indexOf(item);
        $scope.list[newDefaultIndex].useAsDefault = true;
        ListFactory.setList($scope.list);
      }

      function removeDefault() {
        //Remove existing default
        for (var i = 0; i < $scope.list.length; i++) {
          if ($scope.list[i].useAsDefault == true) {
            $scope.list[i].useAsDefault = false;
          }
        }
      }

      $scope.showEditItem = function(item) {

        // Remember edit item to change it later
        $scope.tmpEditItem = item;

        // Preset form values
        $scope.form.description.$setViewValue(item.description);
        $scope.form.useAsDefault.$setViewValue(item.useAsDefault);
        // Open dialog
        $scope.showAddChangeDialog('change');
      };

      $scope.editItem = function(form) {

        var item = {};
        item.description = form.description.$modelValue;
        item.useAsDefault = form.useAsDefault.$modelValue;

        var editIndex = ListFactory.getList().indexOf($scope.tmpEditItem);
        $scope.list[editIndex] = item;
        // Set first item to default
        if ($scope.tmpEditItem.useAsDefault == true && item.useAsDefault == false) {
          $scope.list[0].useAsDefault = true;
        }

        ListFactory.setList($scope.list);
        if (item.useAsDefault) {
          $scope.makeDefault(item);
        }

        $scope.leaveAddChangeDialog();
      }

    }
  ])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
