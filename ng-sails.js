angular.module('ngSails', []).factory('$sails', ['$q','$rootScope',
	function($q,$rootScope) {
		var $sails = function(sailsmodel, angularmodel, $scope) {
			if (!$scope) {
				$scope = angularmodel;
				angularmodel = sailsmodel;
			}
			if (typeof $scope[angularmodel] == "undefined") {
				var init = function(sailsmodel, angularmodel, $scope) {
					$scope[angularmodel] = [];
					$scope[angularmodel] = new $sails(sailsmodel,angularmodel,$scope);
				}
				return init(sailsmodel, angularmodel, $scope);
			}
			this.api = sailsmodel;
			this.model = angularmodel;
			this.hooks = {
				onfetch:[],
				onsubscribe:[]
			};
			this.params = {
				limit:30,
				skip:0,
				sort:'id desc'
			};
			this.scope = $scope;
			this.fetch(true);
			return this;
		};
		$sails.prototype.responseHandler = function(response) {
			this.scope[this.model] = this.scope[this.model] || [];
			switch(response.verb) {
				case "created":
					if (this.params.sort === 'id desc' && this.params.skip === 0) {
						this.scope[this.model].unshift(response.data);
						if (this.scope[this.model].length > ~~this.params.limit) this.scope[this.model] = this.scope[this.model].slice(0,Math.max(this.params.limit,0));
					}
					break;

				case "updated":
					this.scope[this.model].forEach(function(item) {
						if (item.id == response.id) angular.extend(item,response.data);
					}.bind(this));
					break;

				case "destroyed":
					var performFetch = false;
					this.scope[this.model].forEach(function(item,key) {
						if (item.id == response.id) performFetch = true;
					}.bind(this));
					if (performFetch) this.fetch(false);
					break;
			}
			this.scope.$apply();
			return this;
		};
		$sails.prototype.fetch = function(subscribe) {
			io.socket.request((this.api.substr(0,1)!=="/"?'/':'')+this.api, this.params, function(response) {
				this.scope[this.model] = response;
				this.scope.$apply();
				if (subscribe) this.subscribe();
				this.hooks.onfetch.forEach(function(hook) { hook(); });
			}.bind(this));
			return this;
		};
		$sails.prototype.subscribe = function() {
			io.socket.on(this.model, this.responseHandler.bind(this));
			this.hooks.onsubscribe.forEach(function(hook) { hook(); });
			return this;
		}
		$sails.prototype.where = function(where) {
			this.params.where = where?where:{};
			this.fetch(false);
			return this;
		};
		$sails.prototype.crud = function(method, object, id) {
			var q = $q.defer(),
				object = object || {},
				method = (typeof method === "string"?method:"get").toLowerCase();
				io.socket[method](this.api+(id?'/'+id:''),object,function(data,response) {
					var verb = false;
					switch (method) {
						case "post":
							verb = "created";
							break;
						case "put":
							verb = "updated";
							break;
						case "delete":
							verb = "destroyed";
							break;
					}
					if (verb) this.responseHandler({verb:verb, id:data.id, data:data});
					if (response.status == 200) return q.resolve(data);
					q.reject(data);
				}.bind(this));
			return q.promise;
		};
		$sails.prototype.create = function(object) { return this.crud('post', object); };
		$sails.prototype.update = function(object) { return this.crud('put', object); };
		$sails.prototype.destroy = function(object) { return this.crud('delete', object); };
		$sails.prototype.retrieve = function(object) { return this.crud('get', object); };
		return $sails;
	}
]);