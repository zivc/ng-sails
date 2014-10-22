angular.module('ngSails', []).factory('$sails', [
	function() {
		var $sails = function(model, scope, params) {
			if (!io) throw "Can't see socket.io in the global scope?";
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
		$sails.prototype.hardFetch = function(subscribe) {
			io.socket.request('/'+this.model, this.params, function(response) {
				response.reverse();
				this.scope[this.model].data = response;
				if (subscribe) this.subscribe();
				this.scope.$apply();
			}.bind(this));
			return this;
		};
		$sails.prototype.subscribe = function() {
			io.socket.on(this.model, function(response) {
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
								angular.extend(object,response.data[0]);
							}
						});
						break;
					case "destroyed":
						var update = false;
						this.scope[this.model].data.forEach(function(object,key) {
							if (object.id == response.id) {
								this.scope[this.model].data.splice(key,1);
								update = true;
							}
						});
						if (update) this.hardFetch();
						break;
				}
				this.scope.$apply();
			}.bind(this));
			return this;
		};
		return $sails;
	}
]);
