ng-sails
========
**ng-sails** is a simple module for AngularJS that just binds your local `$scope` model to a sailsjs model via socket.io

This is a work in progress.

Installation
------------

Include `ng-sails.js` (or `npm install ng-sails`) file into your project and don't forget to add the `ngSails` module to your angular apps dependencies.

In your controller, require `$sails` and then bind the simplest method of binding models together is like so:

    $scope.user = new $sails('user', $scope);

`$scope.user` will now be populated with an ng-sails array-like object. The object prototype contains CRUD methods. The `$scope.user` array contains your current data and will update in real time when things change on the server.

If you need to assign your sails model to an angular model with a different name, or perhaps you're fetching a method from within your controller - then you'll need to specify three parameters to `$sails`.

    $scope.user = new $sails('user/new', 'user', $scope);

If you wish to filter, paginate or search you can access `$scope.user.params` to fetch the current filters, but due to the way databinding works and how often people don't proxy their models, you should use `$scope.user.where()` to update the `$scope.user.params` object.

You can now also use full CRUD methods on the model after it has been bound

    $scope.user.create({name:"Ash"});

The other CRUD methods require an ID to be the first parameter

	$scope.user.update(1, {name:"Ash"});

The methods are `create`, `retrieve`, `update` and `destroy`.

CRUD methods return promises instead of itself so you can't chain them unfortunately.

Bugs
----------
There is currently no way to remove named sockets with the current version of `sails.io.js`

Maintainer
----------
Ash Taylor, [a@zi.vc](mailto:a@zi.vc)
