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
    var projWGS84 = new OpenLayers.Projection("EPSG:4326");
    var proj900913 = new OpenLayers.Projection("EPSG:900913");
    var left, right, top, bottom;
    var min_rad, max_rad;
    min_rad = 1;
    max_rad = 10;

    var max_pop, min_pop;
    max_pop = min_pop = 0;

    var interpolateRadius = function(min, max, val){
      var diff = max - min;
      var value;
      var shift = (max_rad - min_rad);//90 = 100 -10
      //for diff we have diff of 90
      //for val - min how much would be the additional val
      if(val > min){
        var value = ((( (val - min) * shift)/diff) + min_rad);
        if (value > max_rad){
          return max_rad;
        }
        return value;
      }

      return min;

    }
    var layer = new OpenLayers.Layer.Vector("WFS", {
      strategies: [
        new OpenLayers.Strategy.BBOX()
//          ,
//          new OpenLayers.Strategy.Cluster()
      ],
      protocol: new OpenLayers.Protocol.WFS({
          url: "http://demo.opengeo.org/geoserver/wfs",
          featureType: "ne_10m_populated_places",//"placenames_capital",
          featureNS: "http://openstreemap.org",
          maxFeatures : 2000
      }),
      styleMap: new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({
          pointRadius: "${radius}",
          fillColor: "green",
          strokeWidth: 1,
          strokeColor: "#333333"
        }, {
          context: {
            radius: function(feature) {
              var pix = min_rad;
              if((feature.attributes.GN_POP <= max_pop) &&
                (feature.attributes.GN_POP >= min_pop )){
                pix = interpolateRadius(min_pop, max_pop, feature.attributes.GN_POP);
              }
              return pix;
            }
          }
        }),
        "select": {
          fillColor: "green",//Hover Color
          strokeColor: "black" //border Color
        }
      })
    });
    var road = new OpenLayers.Layer.Bing({
        key: 'AhZVxIDQ6M8CC6ebk4vYhR7CkaT4KCk6rSdB8nGAThS7uDbBIfL0GJ-DVpa73Crq',
        type: "road"
    });
    map.events.register('moveend', this, function () {
      var viewportBounds = map.calculateBounds(map.getCenter(), map.getResolution());
      left = viewportBounds.left;
      right = viewportBounds.right;
      top  = viewportBounds.top;
      bottom = viewportBounds.bottom;
      max_pop = min_pop = 0;
      layer.features.forEach(function(feature){
        if (isFeatureInBounds(feature.attributes.LONGITUDE, feature.attributes.LATITUDE)){
          if (feature.attributes.GN_POP > max_pop){
            max_pop = feature.attributes.GN_POP;
          }
          else if(feature.attributes.GN_POP < min_pop){
            min_pop = feature.attributes.GN_POP;
          }

        }
      })
      layer.features.forEach(function(feature){
        layer.drawFeature(feature);
      })

    });
    var isFeatureInBounds = function(featureLon, featureLat){

      var point1 = new OpenLayers.LonLat(featureLon, featureLat);
      var point2 =  point1.transform(projWGS84, proj900913);

      return (((left < point2.lon) && (point2.lon < right)) && ((top > point2.lat) && (point2.lat > bottom)))

    }


    map.addLayers([road, layer]);
  }
});
