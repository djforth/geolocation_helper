
var _ = require('lodash');

var Geo = require("../src/geo");

const checkCalls = require("@djforth/morse-jasmine/check_calls")
  , checkMulti = require("@djforth/morse-jasmine/check_multiple_calls")
  , getMod     = require("@djforth/morse-jasmine/get_module")(Geo)
  , spyManager = require("@djforth/morse-jasmine/spy_manager")()
  , stubs      = require("@djforth/morse-jasmine/stub_inner")(Geo)
  , stub_chain = require("@djforth/morse-jasmine/stub_chain_methods");

describe('Geo', function() {
  afterEach(function() {
    stub_chain.removeAll();
    spyManager.removeAll();
    stubs.revertAll();
  });

  describe('addTimeout', function() {
    let addTimeout, timeout;
    beforeEach(function() {
      addTimeout = getMod('addTimeout')
      spyManager.addSpy(["error", "clearWatch"]);
      let geolocation = {
        clearWatch: spyManager.getSpy("clearWatch")
      };
      jasmine.clock().install();
      timeout = addTimeout(geolocation, 100);
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should return create & remove functions', function() {
      expect(_.isFunction(timeout.create)).toBeTruthy();
      expect(_.isFunction(timeout.remove)).toBeTruthy();
    });

    it('should set timeout', function() {
      let error = spyManager.getSpy("error")
      timeout.create("id", error);
      expect(error).not.toHaveBeenCalled();
      jasmine.clock().tick(101);

      expect(error).toHaveBeenCalledWith('Timed out');
      expect(spyManager.getSpy("clearWatch")).toHaveBeenCalledWith('id');

    });

    it('should clear timeout', function() {
      let error = spyManager.getSpy("error")
      timeout.create("id", error);
      expect(error).not.toHaveBeenCalled();
      timeout.remove()
      jasmine.clock().tick(101);
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('geoSuccess', function() {
    let geoSuccess, pos, success;
    beforeEach(function() {
      geoSuccess = getMod('geoSuccess')
      spyManager.addSpy(["callback", "clearTimeout"]);

      pos = {
        coords: {
          latitude: 1
          , longitude: 2
        }
      };
      success = geoSuccess(
        spyManager.getSpy("callback")
      , spyManager.getSpy("clearTimeout")
      );

      success(pos);
    });

    let calls = {
      "callback":[()=> spyManager.getSpy("callback")
      , ()=>[1, 2, pos]
      ]
    , "clearTimeout":[()=> spyManager.getSpy("clearTimeout")
      ]
    };

    checkMulti(calls);
  });

  describe('geoFail', function() {
    let geoFail, pos, error;
    beforeEach(function() {
      geoFail = getMod('geoFail')
      spyManager.addSpy(["error", "clearTimeout"]);

      pos = {
        coords: {
          latitude: 1
          , longitude: 2
        }
      };
      error = geoFail(
        spyManager.getSpy("error")
      , spyManager.getSpy("clearTimeout")
      );

      error("Fail");
    });

    let calls = {
      "error":[()=> spyManager.getSpy("error")
      , ()=>["Fail"]
      ]
    , "clearTimeout":[()=> spyManager.getSpy("clearTimeout")
      ]
    };

    checkMulti(calls);
  });

  describe('constructor', function() {
    beforeEach(function() {
      stubs.addSpy(["geoFail", "geolocation", "geoSuccess", "addTimeout"]);
      spyManager.addSpy([
        {title:"timeout", opts:["create", "remove"]}
        , {title:"geo_loc", opts:["watchPosition"]}
        , "callback"
        , "error"
        , "fail"
        , "success"
      ]);

      stubs.getSpy("addTimeout").and.returnValue(spyManager.getSpy("timeout"));
      stubs.getSpy("geoFail").and.returnValue(spyManager.getSpy("fail"));
      stubs.getSpy("geoSuccess").and.returnValue(spyManager.getSpy("success"));
    });

    describe('when no geolocation available', function() {
      let geo;
      beforeEach(function() {
        stubs.getSpy("geolocation").and.returnValue(undefined);
        geo = Geo();
      });

      it('should return undefined if no geolocations', function() {
        expect(geo).toBeUndefined();
      });

      checkCalls(()=>stubs.getSpy('geolocation')
        , 'geolocation'
      );
    });

    describe('when geolocation available and timeout added', function() {
      let geo;
      beforeEach(function() {
        stubs.getSpy("geolocation").and.returnValue(spyManager.getSpy("geo_loc"));
        geo = Geo(100);
      });

      let calls = {
        "geolocation":[()=> stubs.getSpy("geolocation")
        ]
      , "addTimeout":[()=> stubs.getSpy("addTimeout"), [100]
        ]
      };

      checkMulti(calls);

      describe('call geolocation', function() {
        let cb, err, to;
        beforeEach(function() {
          cb  = spyManager.getSpy("callback");
          err = spyManager.getSpy("error");
          to  = spyManager.getSpy("timeout");
          spyManager.getSpy("geo_loc").watchPosition.and.returnValue(1)
          geo(cb, err);
        });

        let calls = {
        "geoSuccess":[()=> stubs.getSpy("geoSuccess")
        , ()=>[cb, to.remove]
        ]
      , "geoFail":[()=> stubs.getSpy("geoFail")
        , ()=>[err, to.remove]
        ]
      , "geo_loc.watchPosition":[()=> spyManager.getSpy("geo_loc").watchPosition
        , ()=>[spyManager.getSpy("success"), spyManager.getSpy("fail")]
        ]
      , "timeout.create":[()=> spyManager.getSpy("timeout").create
        , ()=>[1, spyManager.getSpy("error")]
        ]
      };

      checkMulti(calls);
      });
    });

    describe('when geolocation available and  without timeout', function() {
      let geo;
      beforeEach(function() {
        stubs.getSpy("geolocation").and.returnValue(spyManager.getSpy("geo_loc"));
        geo = Geo();
      });

      let calls = {
        "geolocation":[()=> stubs.getSpy("geolocation")
        ]
      };
      checkMulti(calls);

      it('should not call addTimeout', function() {
        var time = stubs.getSpy("addTimeout");
        expect(time).not.toHaveBeenCalled()
      });

      describe('call geolocation', function() {
        let cb, err, to;
        beforeEach(function() {
          cb  = spyManager.getSpy("callback");
          err = spyManager.getSpy("error");
          to  = spyManager.getSpy("timeout");
          spyManager.getSpy("geo_loc").watchPosition.and.returnValue(1)
          geo(cb, err);
        });

        let calls = {
          "geoSuccess":[()=> stubs.getSpy("geoSuccess")
          , ()=>[cb, undefined]
          ]
        , "geoFail":[()=> stubs.getSpy("geoFail")
          , ()=>[err, undefined]
          ]
        , "geo_loc.watchPosition":[()=> spyManager.getSpy("geo_loc").watchPosition
          , ()=>[spyManager.getSpy("success"), spyManager.getSpy("fail")]
          ]
        };

        checkMulti(calls);

        it('should not call timeout.create', function() {
          var time = spyManager.getSpy("timeout").create;
          expect(time).not.toHaveBeenCalled()
        });
      });
    });


  });
});