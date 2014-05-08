define({
	require: {
		paths: {
			openlayers: 'bower_components/openlayers/OpenLayers.debug'
		},
		shim: {
			openlayers: {
				exports: 'OpenLayers'
			}
		}
	},
	initialize: function(app) {
		OpenLayers = require('openlayers');
		app.sandbox.OpenLayers = OpenLayers;	
	}
});
