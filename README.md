ng-sails
========
**ng-sails** is a simple module for AngularJS that just binds your local `$scope` model to a sailsjs model.

Installation
------------

Include `ng-sails.js` (or `bower install ng-sails`) file into your project and don't forget to add the `ngSails` module to your modules dependencies.

In your controller, require `$sails` and then bind the models together like so:

    $scope.model = new $sails('model', $scope, {
        limit:30,
        skip:0,
        sort:"id desc"
    });

This will establish a socket.io socket and update `$scope.model` whenever CRUD events are fired over the socket from sails.

The third parameter is the same as the [waterline queries](https://github.com/balderdashy/waterline-docs/blob/master/query.md).

Your actual sails model will now exist inside `$scope.model.data`. Modifying any of the `$scope.model.params` values will re-establish socket connections with those new values so be mindful when binding the model directly to an `input[type="text"]`.

Pagination
----------
A quick and easy way to enable pagination is to modify the `params` object of the model returned in your angular scope.

Maintainer
----------
Ash Taylor, [ashley.taylor@sungard.com](mailto:ashley.taylor@sungard.com)
