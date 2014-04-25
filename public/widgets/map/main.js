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
              url: "http://demo.opengeo.org/geoserver/wfs"
              ,
              featureType: "tasmania_roads",//"states",
              featureNS: "http://www.openplans.org/topp"
          }),
          styleMap: new OpenLayers.StyleMap({
              strokeWidth: 4,
              strokeColor: "#333333"
          })
      })


    var select = new OpenLayers.Control.SelectFeature(
      layer, {hover: true}
    );
    map.addControl(select);
    select.activate();
    layer.events.on({"featureselected": this.display});

      var road = new OpenLayers.Layer.Bing({
          key: 'AhZVxIDQ6M8CC6ebk4vYhR7CkaT4KCk6rSdB8nGAThS7uDbBIfL0GJ-DVpa73Crq',
          type: "road"
      });

      var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
      var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
      var position       = new OpenLayers.LonLat(147, -42).transform( fromProjection, toProjection);

    map.addLayers([road, layer]);
    map.setCenter(position, 4);

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


//AhZVxIDQ6M8CC6ebk4vYhR7CkaT4KCk6rSdB8nGAThS7uDbBIfL0GJ-DVpa73Crq
//?service=wfs&version=1.1.0&request=GetFeature&typename=usa:states&featureid=states.39
/*
new OpenLayers.Layer.WMS(
 "Natural Earth",
 "http://demo.opengeo.org/geoserver/wms",
 {layers: "topp:naturalearth"}
 )
*
* */
