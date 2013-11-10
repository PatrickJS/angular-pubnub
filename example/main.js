// App Module
angular.module('PubNubChat',[
  'ngPubNub',
  'directives',
  'filters',
  'controllers',
]);

// Directives Module
angular.module('directives', [])
  .directive('coolFade', function() {
    return {
      compile: function(element) {
        //console.log('compiling');
        $(element).css('opacity', 0);
        return function(scope, element, attrs) {
         // console.log('animating');
          $(element).animate({ opacity : 1.0 }, 1000 );
        };
      }
    };
  });

// Filter Module
angular.module('filters', ['md5'])
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  })
  .filter('gravatar', function(md5) {
    return function(text) {
      return (text) ? md5.createHash(text.toLowerCase()) : '';
    };
  });

// Controllers Module
angular.module('controllers', [])
  .controller('MainCtrl', function($scope, PubNub) {
    $scope.messages = [];
    $scope.realtimeStatus = "Connecting...";
    $scope.channel = "pubnub_chat";
    $scope.limit = 20;

    // publish a chat message
    $scope.publish = function() {
      PubNub.publish({
        channel: $scope.channel,
        message: $scope.message
      },
      function callback() {
        // toggle the progress bar
        $('#progress_bar').slideToggle();

        // reset the message text
        $scope.message.text = "";
      });
    };

    // gets the messages history
    $scope.history = function() {
      PubNub.history({
        channel: $scope.channel,
        limit: $scope.limit
      },
      function callback(messages) {
        // Shows All Messages
        $scope.messages = messages;
      });
    };

   // we'll leave these ones as is so that pubnub can
   // automagically trigger the events
    PubNub.subscribe({
        channel: $scope.channel,
        restore: false,
        disconnect: function() {
          $scope.$apply(function() {
            $scope.realtimeStatus = 'Disconnected';
          });
        },
        reconnect: function() {
          $scope.$apply(function() {
            $scope.realtimeStatus = 'Connected';
          });
        },
        connect: function() {
          $scope.$apply(function() {

            $scope.realtimeStatus = 'Connected';
            // hide the progress bar
            $('#progress_bar').slideToggle();
            // load the message history from PubNub
            $scope.history();
          });
        }
      },
      function callback(message) {
        // toggle the progress_bar
        $('#progress_bar').slideToggle();
        $scope.messages.push(message);
      }
    );

  });
