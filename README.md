ng-sails
========
**ng-sails** is a simple module for AngularJS that just binds your local `$scope` model to a sailsjs model via socket.io

This is a work in progress.

Installation
------------

Include `ng-sails.js` (or `npm install ng-sails`) file into your project and don't forget to add the `ngSails` module to your angular apps dependencies.

In your controller, require `$sails` and then bind the models together like so:

    $scope.model = new $sails('model', $scope, {
        limit:30,
        skip:0,
        sort:"id desc"
    });

`$scope.model` will now be populated with an ng-sails object. The object prototype contains CRUD methods. The `$scope.model.data` object contains your current data and will update in real time when things change on the server.

The third parameter is the same as the [waterline queries](https://github.com/balderdashy/waterline-docs/blob/master/query.md).

Modifying any of the `$scope.model.params` values will reload the information with those new query values so be mindful when binding the model directly to an `input[type="text"]`.

You can now use full CRUD methods on the model after it has been bound

    $scope.model.create({name:"Ash"});

The other CRUD methods require an ID to be the first parameter

	$scope.model.update(1, {name:"Ash"});

The methods are `create`, `retrieve`, `update` and `destroy`.

CRUD methods return promises instead of itself so you can't chain them unfortunately.

Pagination
----------
A quick and easy way to enable pagination is to modify the `params` object of the model returned in your angular scope.

    $scope.model.params.skip = 30;

This will load the next set of results.

Bugs
----------
There is currently no way to remove named sockets with the current version of `sails.io.js`

Maintainer
----------
Ash Taylor, [a@zi.vc](mailto:a@zi.vc)
