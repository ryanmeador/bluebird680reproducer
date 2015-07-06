var Promise = require('bluebird');
var neo4j = require('neo4j'); // COMMENT THIS LINE AND THE BUG GOES AWAY!

// setup riak client
var riak = require('riak-js')({
  host: "127.0.0.1",
  port: 8098
});

module.exports.client = Promise.promisifyAll(riak, { promisifier: function(originalFunction) {
  return function() {
    var args = [].slice.call(arguments);
    var self = this;
    return Promise.fromNode(function(callback) {
      args.push(exports.wrapRiakCb(callback));
      originalFunction.apply(self, args);
    });
  };
}});
