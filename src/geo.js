const _ = {
  isFunction: require('lodash/isFunction')
};

function addTimeout(geo, time){
  let id;
  return {
    create: function(geo_id, error){
      id = setTimeout(function(){
        geo.clearWatch(geo_id);
        if (_.isFunction(error)) error('Timed out');
      }, time);
    }
    , remove: function(){
      clearTimeout(id);
    }
  };
}

function geoSuccess(callback, clearTimeout){
  return function(pos){
    let lng, lat;
    lat = pos.coords.latitude;
    lng = pos.coords.longitude;
    if (_.isFunction(callback)) callback(lat, lng, pos);
    if (_.isFunction(clearTimeout)) clearTimeout();
  };
}

function geoFail(error, clearTimeout){
  return function(err){
    if (_.isFunction(error)) error(err);
    if (_.isFunction(clearTimeout)) clearTimeout();
  };
}

function geolocation(){
  return navigator.geolocation;
}

module.exports = function(wait){
  let fail
    , geo_id
    , geo_loc
    , remove
    , success
    , timeout;

  geo_loc = geolocation();

  if (!geo_loc) return;

  if (wait){
    timeout = addTimeout(wait);
    remove  = timeout.remove;
  }

  return function(callback, error){
    success = geoSuccess(callback, remove);
    fail    = geoFail(error, remove);
    geo_id  = geo_loc.watchPosition(success, fail);

    if (timeout) timeout.create(geo_id, error);
  };
};
