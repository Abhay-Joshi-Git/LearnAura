define({
  initialize: function() {
    // create a semi-random grid of features to be clustered
    this.render();
    var self=this;
    this.sandbox.on("zoomctrl.zoomin", function(){
      self.zoomIn();
    });
    this.sandbox.on("zoomctrl.zoomout", function(){
      self.zoomOut();
    });


  },
  map: {},
  render:function(){
    console.log("render called");
    var OpenLayers = this.sandbox.OpenLayers;
    map = new OpenLayers.Map('map');
    map.events.register('zoomend', this, function() {
      console.log("zoom end");
      this.sandbox.emit("map.zoomchange", map.getZoom());
    });

      var layer = new OpenLayers.Layer.Vector("WFS", {
          strategies: [new OpenLayers.Strategy.BBOX()],
          protocol: new OpenLayers.Protocol.WFS({
              url:  "http://demo.opengeo.org/geoserver/wfs",
              featureType: "tasmania_roads",
              featureNS: "http://www.openplans.org/topp"
          }),
          styleMap: new OpenLayers.StyleMap({
              strokeWidth: 3,
              strokeColor: "#333333"
          })
//          ,
//          filter: new OpenLayers.Filter.Logical({
//              type: OpenLayers.Filter.Logical.OR,
//              filters: [
//                  new OpenLayers.Filter.Comparison({
//                      type: OpenLayers.Filter.Comparison.EQUAL_TO,
//                      property: "TYPE",
//                      value: "highway"
//                  }),
//                  new OpenLayers.Filter.Comparison({
//                      type: OpenLayers.Filter.Comparison.EQUAL_TO,
//                      property: "TYPE",
//                      value: "road"
//                  })
//              ]
//          })
      })


    var select = new OpenLayers.Control.SelectFeature(
      layer, {hover: true}
    );
    map.addControl(select);
    select.activate();
    layer.events.on({"featureselected": this.display});
    map.addLayers([new OpenLayers.Layer.WMS(
        "Natural Earth",
        "http://demo.opengeo.org/geoserver/wms",
        {layers: "topp:naturalearth"}
    ), layer]);
    map.setCenter(new OpenLayers.LonLat(0, 0), 2);
  },
  display:function(event){
    var f = event.feature;
    var $el = $("#output");
    $el.text("Cluster Details===>" +  "X-cordinate:  "+ f.geometry.x+ "  Y-cordinate:  "+ f.geometry.y);
  },
  zoomIn: function() {
    //zoomIn
    map.zoomIn();
  },
  zoomOut: function() {
    //zoomOut
    map.zoomOut();
  }
});
