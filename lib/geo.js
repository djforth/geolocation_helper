'use strict';

var _ = {
  isFunction: require('lodash/isFunction')
};

function addTimeout(geo, time) {
  var id = void 0;
  return {
    create: function create(geo_id, error) {
      id = setTimeout(function () {
        geo.clearWatch(geo_id);
        if (_.isFunction(error)) error('Timed out');
      }, time);
    },
    remove: function remove() {
      clearTimeout(id);
    }
  };
}

function geoSuccess(callback, clearTimeout) {
  return function (pos) {
    var lng = void 0,
        lat = void 0;
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
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

function geolocation() {
  return navigator.geolocation;
}

module.exports = function (wait) {
  var fail = void 0,
      geo_id = void 0,
      geo_loc = void 0,
      remove = void 0,
      success = void 0,
      timeout = void 0;

  geo_loc = geolocation();

  if (!geo_loc) return;

  if (wait) {
    timeout = addTimeout(geo_loc, wait);
    remove = timeout.remove;
  }

  return function (callback, error) {
    success = geoSuccess(callback, remove);
    fail = geoFail(error, remove);
    geo_id = geo_loc.watchPosition(success, fail);

    if (timeout) timeout.create(geo_id, error);
  };
};