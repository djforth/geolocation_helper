# Geolocation helper
## @djforth/geolocation_helper

A Small util for Geolocation api.

Install:
```bash
npm install --save @djforth/geolocation_helper
```

Standard set up:

```javascript
var Geo_helper = require("@djforth/geolocation_helper");

//Will return undefined if geolocation api is not avaiable
var geo = Geo_helper();

if(geo){
  geo(function(lat, lng, pos){
    //Success - Do something with data

  },
  function(err){
    //Failure - Do something with error
  });
}

```

If you wanted to add a timeout to request:

```javascript
var Geo_helper = require("@djforth/geolocation_helper");

//Will return undefined if geolocation api is not avaiable
var geo = Geo_helper(5000); //Will timeout after 5 secs

if(geo){
  geo(function(lat, lng, pos){
    //Success - Do something with data

  },
  function(err){
    //Failure - Do something with error
  });
}

```


# Bug reports

If you discover any bugs, feel free to create an issue on GitHub. Please add as much information as possible to help us fixing the possible bug. We also encourage you to help even more by forking and sending us a pull request.

https://github.com/djforth/geolocation_helper/issues

## Contribute

If you'd like to contribute, geolocation_helper is written using babel in ES6.

Please make sure any additional code should be covered in tests (Jasmine using karma).

If you need to run the test please use:

``` bash

npm test

```

or to rebuild the JS run:

``` bash

npm run build

```

## Maintainers

Adrian Stainforth (https://github.com/djforth)

# License

geolocation_helper is an open source project falling under the MIT License. By using, distributing, or contributing to this project, you accept and agree that all code within the geolocation_helper project are licensed under MIT license.

