// App Module
angular.module('PubNubChat',[
  'angular-pubnub',
  'directives',
  'controllers'
]);

// Directives Module
angular.module('directives', [])
  .directive('coolFade', function() {
    return {
      compile: function(elm) {
        //console.log('compiling');
        $(elm).css('opacity', 0);
        return function(scope, elm, attrs) {
         // console.log('animating');
          $(elm).animate({ opacity : 1.0 }, 1000 );
        };
      }
    };
  });

// Controllers Module
angular.module('controllers', [])
  .controller('MainCtrl', function($scope, $PubNub) {
    $scope.messages = [];
    $scope.realtimeStatus = "Connecting...";
    $scope.channel = "pubnub_chat";
    $scope.limit = 20;

    //publish a chat message
    $scope.publish = function(){
      $PubNub.publish({
          channel : $scope.channel,
          message : $scope.message
      }, function() {
        // toggle the progress bar
        $('#progress_bar').slideToggle();

        // reset the message text
        $scope.message.text = "";
      })
    }

    //gets the messages history
    $scope.history = function(){
        PUBNUB.history( {
            channel : $scope.channel,
            limit   : $scope.limit
        }, function(messages) {
            // Shows All Messages
            $scope.$apply(function(){
                $scope.messages = messages;

            });
        } );
     }


   //we'll leave these ones as is so that pubnub can
   //automagically trigger the events
   PUBNUB.subscribe({
        channel    : $scope.channel,
        restore    : false,

        callback   : function(message) {

            //toggle the progress_bar
            $('#progress_bar').slideToggle();

            $scope.$apply(function(){
                $scope.messages.push(message);

            });
        },

        disconnect : function() {
            $scope.$apply(function(){
                $scope.realtimeStatus = 'Disconnected';
            });
        },

        reconnect  : function() {
            $scope.$apply(function(){
                $scope.realtimeStatus = 'Connected';
            });
        },

        connect    : function() {
            $scope.$apply(function(){
                $scope.realtimeStatus = 'Connected';
                //hide the progress bar
                $('#progress_bar').slideToggle();
                //load the message history from PubNub
                $scope.history();
            });

        }
    })
  });
