/**
 * Set the service configuration
 *
 * @see https://atmospherejs.com/meteor/service-configuration
 * @type {String}
 */
ServiceConfiguration.configurations.upsert(
  {service: "meteor-developer"},
  {$set: _.extend(
    {service: "meteor-developer" },
    Meteor.settings.meteorDevelopers
  )}
);
