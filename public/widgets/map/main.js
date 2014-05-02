define({
  initialize: function() {
    this.render();
    var self=this;
  },
  map: {},
  render:function(){
      console.log("render called");
      var OpenLayers = this.sandbox.OpenLayers;
      var map = new OpenLayers.Map('map');
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
      });
      var road = new OpenLayers.Layer.Bing({
          key: 'AhZVxIDQ6M8CC6ebk4vYhR7CkaT4KCk6rSdB8nGAThS7uDbBIfL0GJ-DVpa73Crq',
          type: "road"
      });
      map.addLayers([road, layer]);
  }
});
