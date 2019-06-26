// import { isFunction } from 'lodas
const isFunction = object => !!(object && object.constructor && object.call && object.apply);

const GeoLocation = () => navigator.geolocation;

const addTimeout = (geo, time) => {
  let id;
  return {
    create: (geoId, error) => {
      id = setTimeout(() => {
        geo.clearWatch(geoId);
        if (isFunction(error)) error('Timed out');
      }, time);
    },
    remove: () => {
      clearTimeout(id);
    },
  };
};

const geoSuccess = (callback, clearTimeout) => ({ coords: { latitude, longitude } }) => {
  if (isFunction(callback)) callback(latitude, longitude);
  if (isFunction(clearTimeout)) clearTimeout();
};

const geoFail = (error, clearTimeout) => err => {
  if (isFunction(error)) error(err);
  if (isFunction(clearTimeout)) clearTimeout();
};

export default wait => {
  let fail, geoId, geoLoc, remove, success, timeout;

  geoLoc = GeoLocation();

  if (!geoLoc) return;

  if (wait) {
    timeout = addTimeout(geoLoc, wait);
    remove = timeout.remove;
  }

  return (callback, error) => {
    success = geoSuccess(callback, remove);
    fail = geoFail(error, remove);
    geoId = geoLoc.watchPosition(success, fail);
    if (timeout) timeout.create(geoId, error);
  };
};
