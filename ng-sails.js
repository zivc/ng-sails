angular.module('ngSails', []).factory('$sails', ['$q',
	function($q) {
		var $sails = function(model, scope, params, prefix) {
			if (!io) throw "Can't see socket.io in the global scope?";
			this.prefix = '/'+prefix+'/' || '/';
			this.model = model || '';
			this.scope = scope || {};
			this.params = {
				limit:30,
				skip:0,
				sort:'id desc'
			}
			if (params) angular.extend(this.params,params);
			this.data = {};
			this.hardFetch(true);
		};

		$sails.prototype.responseHandler = function(response) {
			switch (response.verb) {
				case "created":
					if (this.params.sort === "id desc" && this.params.skip === 0) {
						this.scope[this.model].data.unshift(response.data);
						if (this.scope[this.model].data.length > ~~this.params.limit) {
							this.scope[this.model].data = this.scope[this.model].slice(0,Math.max(this.params.limit,0));
						}
					}
					break;
				case "updated":
					this.scope[this.model].data.forEach(function(object) {
						if (object.id == response.id) {
							angular.extend(object,response.data);
						}
					}.bind(this));
					break;
				case "destroyed":
					var update = false;
					this.scope[this.model].data.forEach(function(object,key) {
						if (object.id == response.id) {
							this.scope[this.model].data.splice(key,1);
							update = true;
						}
					}.bind(this));
					if (update) this.hardFetch();
					break;
			}
			this.scope.$apply();
			return this;
		};

		$sails.prototype.crud = function(method, object, id) {
			var q = $q.defer();
			object = object || {};
			method = (typeof method == "string" ? method : 'get').toLowerCase();
			io.socket[method](this.prefix+this.model+(id ? '/'+id : ''), object, function(data,response) {
				var verb = false;
				switch (method) {
					case "post":
						verb = "created";
						break;
					case "put":
						verb = "updated";
						break;
					case "delete":
						verb = "destroyed"
						break;
				}
				if (verb) this.responseHandler({verb:verb, id:data.id, data:data});
				if (response.status == 200) {
					q.resolve(data);
				} else {
					q.reject(data);
				}
			}.bind(this));
			return q.promise;
		}

		$sails.prototype.hardFetch = function(subscribe) {
			io.socket.request(this.prefix+this.model, this.params, function(response) {
				response.reverse();
				this.scope[this.model].data = response;
				if (subscribe) this.subscribe();
				this.scope.$apply();
			}.bind(this));
			return this;
		};

		$sails.prototype.subscribe = function() {
			io.socket.on(this.model, this.responseHandler.bind(this));
			return this;
		};

		$sails.prototype.create = function(object) {
			return this.crud('post', object);
		};

		$sails.prototype.update = function(id, object) {
			return this.crud('put', object, id);
		};

		$sails.prototype.destroy = function(id, object) {
			return this.crud('delete', object, id);
		};

		$sails.prototype.retrieve = function(id, object) {
			return this.crud('get', object, id);
		};
		return $sails;
	}
]);