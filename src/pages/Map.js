import { useRef, useEffect } from "react";
import WebMap from "@arcgis/core/WebMap";
import Search from "@arcgis/core/widgets/Search";
import * as intl from "@arcgis/core/intl";
import SceneView from "@arcgis/core/views/SceneView";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import OpenLocationCode from "../utils/openlocationcode";
import Point from "@arcgis/core/geometry/Point";
import * as geodesicUtils from "@arcgis/core/geometry/support/geodesicUtils";
import Slider from "@arcgis/core/widgets/Slider";
import * as locator from "@arcgis/core/rest/locator";
import esriConfig from "@arcgis/core/config";
import { fChineseCode } from "../utils/formatCode";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

export default function Map() {

  const mapDiv = useRef(null);

  // 将默认语言设置为中文
  intl.setLocale("zh-CN");
  
  useEffect(() => {
    if (mapDiv.current) {
      
      esriConfig.apiKey = "AAPK63ef5479bcc34ed297bd3d8154f85cc0Mh0j1zHzb2w7lKAHURewuqchvZzFK-IpYku_b9f9JR8O19HFkQf2vo1Pf-X_ZBNo";
      
      // 创建地图本图
      const webmap = new WebMap({
        portalItem: {
          // 调用ArcGIS online的底图
          id: "5f913b7ecc3c474e872f532cd7a643a5"
        }
        // basemap: basemap
      });

      // 创建地图的显示，可在此调整地图参数
      const view = new SceneView({
        container: mapDiv.current,
        map: webmap,
        zoom: 5,
        center: [103.864558043276, 30.763701]
      });

      // 记录放大缩小的比例
      let zoomLevel = 0;
      reactiveUtils.watch(
        () => view.zoom,
        (zoom) => {
          zoomLevel = zoom
          document.getElementById("location").innerHTML = "Zoom level: " + zoomLevel;
        });

      // 创建点击定位功能
      const serviceUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

      // 引入与显示搜索组件
      const searchWidget = new Search({
        view: view
      });

      view.ui.add(searchWidget, {
        position: "top-right",
        index: 2
      });

      let alphabets = OpenLocationCode.getAlphabet();   // 获取原格子代码
      let clickLatLng = {};   // 存储点击处的经纬度

      // 新建一个图层以绘制网格
      const graphicsLayer = new GraphicsLayer();
      webmap.add(graphicsLayer);

      // 点击地图后开始划分格子以及定位
      view.on("click", function(evt) {
        const params = {
          location: evt.mapPoint
        };

        locator.locationToAddress(serviceUrl, params)
          .then(function(response) { // Show the address found
            const address = response.address;
            showAddress(address, evt.mapPoint);
          }, function(err) { // Show no address found
            showAddress("No address found.", evt.mapPoint);
          });

        // 经纬度赋值
        clickLatLng.lat = evt.mapPoint.latitude;
        clickLatLng.lng = evt.mapPoint.longitude;

        // 清除之前绘制的方格
        if(graphicsLayer) {
          graphicsLayer.removeAll();
        }
        
        //根据zoom比例更改code长度
        let codeLen = 0;
        if (zoomLevel < 6) {
          codeLen = 2;
        } 
        else if (zoomLevel <= 9) {
          codeLen = 4;
        }
        else if (zoomLevel <= 14) {
          codeLen = 6;
        }
        else if (zoomLevel <= 18) {
          codeLen = 8;
        }
        else {
          codeLen = 10;
        }
        
        // 通过api得到字母版plus code
        var currentCode = OpenLocationCode.encode(clickLatLng.lat, clickLatLng.lng, codeLen);
        var code = currentCode.replace('+', '').replace(/0/g, '').toLocaleUpperCase('en-US');
        // 通过api得到plus code覆盖区域
        var codeArea = OpenLocationCode.decode(currentCode);

        // 根据覆盖区域得到点击处所在方格
        const polygon = {
          type: "polygon",
          rings: [
            [codeArea.longitudeLo, codeArea.latitudeLo],
            [codeArea.longitudeLo, codeArea.latitudeHi],
            [codeArea.longitudeHi, codeArea.latitudeHi],
            [codeArea.longitudeHi, codeArea.latitudeLo]
          ]
        };

        // 方格渲染参数
        const simpleFillSymbol = {
          type: "simple-fill",
          color: [227, 139, 79, 0.8],  // 橙色，0.8透明度
          outline: {
              color: [255, 255, 255],
              width: 1
          }
      };

        // 绘制方格
        const polygonGraphic = new Graphic({
          geometry: polygon,
          symbol: simpleFillSymbol,
        });

        // 将方格加入图层
        graphicsLayer.add(polygonGraphic);

        function showAddress(address, pt) {
          const longAndLat = Math.round(pt.longitude * 100000)/100000 + ", " + Math.round(pt.latitude * 100000)/100000;
          view.popup.open({
            title: "<strong>代码：" + fChineseCode(code, alphabets) + "</strong>",
            content: "<strong>地址：</strong>" + address + "<br><strong>经纬度：</strong>" + longAndLat,
            location: pt
          });
        };
      })
    }
    
  }, []);

  return <>
    <div className="mapDiv" ref={mapDiv}></div>
    <div id="location"></div>
  </>;
}