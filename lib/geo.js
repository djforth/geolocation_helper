"use strict";

var _ = require("lodash/core");

function addTimeout(error, time) {
  var id = void 0;
  return {
    create: function create(id) {
      id = setTimeout(function () {
        navigator.geolocation.clearWatch(id);
        if (_.isFunction(error)) error("Timed out");
      }, time);
    },
    remove: function remove() {
      clearTimeout(id);
    }
  };
}

function geoSuccess(callback, clearTimeout) {
  return function (pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    if (_.isFunction(callback)) callback(lat, lng, pos);
    if (_.isFunction(clearTimeout)) clearTimeout();
  };
}

function geoFail(error, clearTimeout) {
  return function (err) {
    if (_.isFunction(error)) error(err);
    if (_.isFunction(clearTimeout)) clearTimeout();
  };
}

module.exports = function (callback, error) {
  var fail = void 0,
      geo_id = void 0,
      geo_loc = void 0,
      sucsess = void 0,
      timeout = void 0;
  geo_loc = navigator.geolocation;

  if (!geo_loc) return;

  return function (wait) {
    if (wait) {
      timeout = addTimeout(error, wait);
      success = geoSuccess(callback, timeout.remove);
      fail = geoFail(error, timeout.remove);
    } else {
      success = geoSuccess(callback);
      fail = geoFail(error);
    }

    geo_id = geoLoc.watchPosition(success, fail);

    if (timeout) timeout.create(geo_id);
  };
};