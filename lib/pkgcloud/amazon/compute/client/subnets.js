/*
 * keys.js: Implementation of AWS Subnets Client.
 *
 * (C) 2015 Matt Summers
 *
 */

//
// ### function listSubnets (options, callback)
// #### @options {Object} **Optional** Filter parameters when listing subnets
// #### @callback {function} Continuation to respond to when complete.
//
// Lists all EC2 Subnets matching the specified `options`.
//
exports.listSubnets = function (options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  var self = this,
    requestOpts = {};

  options = options || {};

  if (options.subnetIds && options.subnetIds instanceof Array) {
    requestOpts.SubnetIds = options.subnetIds;
  }
  else if (options.subnetIds && typeof options.subnetIds === 'string') {
    requestOpts.SubnetIds = [ options.subnetIds ];
  }

  self.ec2.describeSubnets(requestOpts, function(err, data) {
    return err
      ? callback(err)
      : callback(err, data.Subnets);
  });
};
