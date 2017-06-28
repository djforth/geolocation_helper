import SpyManager from '@djforth/stubs-spy-manager-jest';
import CallHelper from '@djforth/jest-call-helpers';
import Geo from 'geo';
jest.useFakeTimers();

describe('Geo', function(){
  const spies_stubs = SpyManager(Geo);
  const callHelper = CallHelper(spies_stubs);
  describe('addTimeout', function(){
    let addTimeout, timeout;
    beforeEach(function(){
      addTimeout = spies_stubs.getFn('addTimeout');

      spies_stubs.add([
        {
          spy: 'error'
        }
        , {
          spy: 'clearWatch'
        }
      ]);
      spies_stubs.make();
      let geolocation = {
        clearWatch: spies_stubs.get('clearWatch')
      };
      // jasmine.clock().install();
      timeout = addTimeout(geolocation, 100);
    });

    afterEach(()=>{
      spies_stubs.reset();
    });

    it('should return create & remove functions', function(){
      expect(timeout.create).toBeFunction();
      expect(timeout.remove).toBeFunction();
    });

    it('should set timeout', function(){
      let error = spies_stubs.get('error');
      timeout.create('id', error);
      expect(error).not.toHaveBeenCalled();
      jest.runTimersToTime(101);

      expect(error).toHaveBeenCalledWith('Timed out');
      expect(spies_stubs.get('clearWatch')).toHaveBeenCalledWith('id');
    });

    it('should clear timeout', function(){
      let error = spies_stubs.get('error');
      timeout.create('id', error);
      expect(error).not.toHaveBeenCalled();
      timeout.remove();
      jest.runTimersToTime(101);
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('geoSuccess', function(){
    let geoSuccess, success;
    let pos = {
      coords: {
        latitude: 1
        , longitude: 2
      }
    };

    beforeEach(function(){
      geoSuccess = spies_stubs.getFn('geoSuccess');

      spies_stubs.add([
        {
          spy: 'callback'
        }
        , {
          spy: 'clearTimeout'
        }
      ]);
      spies_stubs.make();


      success = geoSuccess(
        spies_stubs.get('callback')
        , spies_stubs.get('clearTimeout')
      );

      success(pos);
    });

    callHelper.add([
      ['callback', [1, 2, pos]]
      , ['clearTimeout']
    ]);

    callHelper.checkCalls();
    callHelper.reset();
  });

  describe('geoFail', function(){
    let geoFail, error;
    beforeEach(function(){
      geoFail = spies_stubs.getFn('geoFail');
      spies_stubs.add([{
          spy: 'error'
        }
        , {
          spy: 'clearTimeout'
        }
      ]);

      spies_stubs.make();

      error = geoFail(
        spies_stubs.get('error')
      , spies_stubs.get('clearTimeout')
      );

      error('Fail');
    });

    callHelper.add([
      ['error', ['Fail']]
      , ['clearTimeout']
    ]);

    callHelper.checkCalls();
    callHelper.reset();
  });

  describe('constructor', function(){
    beforeEach(function(){
      spies_stubs.add([
        {
          spy: 'timeout.create'
        }
        , {
          spy: 'timeout.remove'
        }
        , {
          spy: 'geo_loc.watchPosition'
          , callback: ()=>1
        }
        , {
          spy: 'callback'
        }
        , {
          spy: 'error'
        }
        , {
          spy: 'fail'
        }
        , {
          spy: 'success'
        }
        , {
          stub: 'addTimeout'
          , spy: 'timeout'
        }
        , {
          stub: 'geoFail'
          , spy: 'fail'
        }
        , {
          stub: 'geoSuccess'
          , spy: 'success'
        }
      ]);
    });

    describe('when no geolocation available', function(){
      let geo;
      beforeEach(function(){
        spies_stubs.add([{
          stub: 'GeoLocation'
        //   , callback: 'Erm'
        }]);
        spies_stubs.make();
        geo = Geo();
      });

      afterAll(()=>{
        spies_stubs.clearList();
      });

      it('should return undefined if no geolocations', function(){
        expect(geo).toBeUndefined();
      });

      callHelper.add([
        ['GeoLocation']
      ]);

      callHelper.checkCalls();
      callHelper.reset();
    });

    describe('when geolocation available and timeout added', function(){
      let geo;
      beforeEach(function(){
        spies_stubs.add([{
          stub: 'GeoLocation'
          , spy: 'geo_loc'
        }]);
        spies_stubs.make();

        geo = Geo(100);
      });

      afterAll(()=>{
        spies_stubs.clearList();
      });

      callHelper.add([
        ['GeoLocation']
        , ['addTimeout', [()=>spies_stubs.get('geo_loc'), 100]]
      ]);

      callHelper.checkCalls();
      callHelper.reset();

      describe('call geolocation', function(){
        let cb, err, to;
        beforeEach(function(){
          cb  = spies_stubs.get('callback');
          err = spies_stubs.get('error');
          to  = spies_stubs.get('timeout');

          geo(cb, err);
        });

        callHelper.add([
          ['geoSuccess', [()=>err, ()=>to.remove]]
          , ['geoFail', ()=>err, ()=>to.remove]]
          , ['geo_loc.watchPosition', [
            ()=>spies_stubs.get('success')
            , ()=>spies_stubs.get('fail')]
          ]
          , ['timeout.create', [1, ()=>spies_stubs.get('error')]
        ]);

        callHelper.checkCalls();
        callHelper.reset();
      });
    });

    describe('when geolocation available and  without timeout', function(){
      let geo;
      beforeEach(function(){
        spies_stubs.add([{
          stub: 'GeoLocation'
          , spy: 'geo_loc'
        }]);
        spies_stubs.make();
        geo = Geo();
      });

      callHelper.add([
        ['GeoLocation']
      ]);

      callHelper.checkCalls();
      callHelper.reset();

      it('should not call addTimeout', function(){
        let time = spies_stubs.get('addTimeout');
        expect(time).not.toHaveBeenCalled();
      });

      describe('call geolocation', function(){
        let cb, err;
        beforeEach(function(){
          cb  = spies_stubs.get('callback');
          err = spies_stubs.get('error');

          geo(cb, err);
        });

        callHelper.add([
          ['geoSuccess', [()=>err, undefined]]
          , ['geoFail', [()=>err, undefined]]
          , ['geo_loc.watchPosition', [
            ()=>spies_stubs.get('success')
            , ()=>spies_stubs.get('fail')]
          ]
        ]);

        callHelper.checkCalls();
        callHelper.reset();

        it('should not call timeout.create', function(){
          let time = spies_stubs.get('timeout').create;
          expect(time).not.toHaveBeenCalled();
        });
      });
    });
  });
});
