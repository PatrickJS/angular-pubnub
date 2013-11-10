(function(module, angular) {
'use strict';


module.provider('PubNub', function() {
  this.$get = function($window, $timeout) {
    var pubnub = $window.PUBNUB;

    var asyncAngularify = function(callback) {
      return function(args) {
        args = arguments;
        $timeout(function () {
          callback.apply(pubnub, args);
        }, 0);
      };
    };
    return {
      subscribe: function(args, callback) {
        callback = callback || args['callback'];
        args['callback'] = undefined;
        pubnub.subscribe(args, asyncAngularify(callback));
      },
      publish: function(args, callback) {
        callback = callback || args['callback'];
        args['callback'] = undefined;
        if (callback) {
          pubnub.publish(args, asyncAngularify(callback));
        } else {
          pubnub.publish(args);
        }
      },
      unsubscribe: function(channel) {
        pubnub.unsubscribe(channel);
      },
      history: function(args, callback) {
        callback = callback || args['callback'];
        args['callback'] = undefined;
        if (callback) {
          pubnub.history(args, asyncAngularify(callback));
        } else {
          pubnub.history(args);
        }
      }

    }; // end return
  }; // end $get
}); // end provider

}(angular.module('ngPubNub', []), angular));
