ng-sails
========
**ng-sails** is a simple module for AngularJS that just binds your local `$scope` model to a sailsjs model.

Installation
------------

Include `ng-sails.js` (or `npm install ng-sails`) file into your project and don't forget to add the `ngSails` module to your apps dependencies.

In your controller, require `$sails` and then bind the models together like so:

    $scope.model = new $sails('model', $scope, {
        limit:30,
        skip:0,
        sort:"id desc"
    });

This will establish a socket.io socket and update `$scope.model` whenever CRUD events are fired over the socket from sails. Changing the sort order from `"id desc"` will stop `create` events from automatically appending to the top of your model. All other events will update the model with the changes should that item exist.

The third parameter is the same as the [waterline queries](https://github.com/balderdashy/waterline-docs/blob/master/query.md).

Your actual sails model will now exist inside `$scope.model.data`. Modifying any of the `$scope.model.params` values will re-establish socket connections with those new values so be mindful when binding the model directly to an `input[type="text"]`.

You can now use full CRUD methods on the model after it has been bound

    $scope.model.create({name:"Ash"});

The other CRUD methods require an ID to be the first parameter

	$scope.model.update(1, {name:"Ash"});

The methods are `create`, `retrieve`, `update` and `destroy`.

You could always hook into the `$scope.model.crud()` method directly. It takes three parameters, the first being either `get`, `post`, `put` or `delete`, second being the object and third is the optional id. __This is subject to change to support waterline ORM in the future__.

CRUD methods return promises instead of itself so you can't chain them unfortunately.

Pagination
----------
A quick and easy way to enable pagination is to modify the `params` object of the model returned in your angular scope.

    $scope.model.params.skip = 30;

This will load the next set of results.

Bugs
----------
There is currently no way to remove named sockets with the current version of `sails.io.js`, I don't think :S

Maintainer
----------
Ash Taylor, [ashley.taylor@sungard.com](mailto:ashley.taylor@sungard.com)
