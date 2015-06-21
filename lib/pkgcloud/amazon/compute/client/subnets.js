/*
 * keys.js: Implementation of AWS Subnets Client.
 *
 * (C) 2015 Matt Summers
 *
 */

var errs  = require('errs');

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

//
// ### function addSubnet (options, callback)
// #### @options {Object} Subnet details
// ####     @vpcId {string} The ID of the VPC.
// ####     @cidr  {string} The network range for the subnet
// ####     @zone  {string} **Optional** The availability zone for the subnet
// #### @callback {function} Continuation to respond to when complete.
//
// Adds an EC2 Subnet with the specified `options`.
//
exports.addSubnet = function (options, callback) {
  if (!options || !options.cidr || !options.vpcId) {
    return errs.handle(
      errs.create({ message: '`cidr` and `vpcId` are required options.' }),
      callback
    );
  }

  var requestOpts = {
    CidrBlock: options.cidr,
    VpcId: options.vpcId
  };

  if (options.zone) {
    requestOpts.AvailabilityZone = options.zone;
  }

  this.ec2.createSubnet(requestOpts, function (err) {
    return err
      ? callback(err)
      : callback(null, true);
  });
};
