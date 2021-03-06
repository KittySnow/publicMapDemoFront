var map;
var pointsArr = null;
(function(){
    minemap.domainUrl = '//192.168.1.203:82';
    minemap.spriteUrl = '//192.168.1.203:82/minemapapi/v1.3/sprite/sprite';
    minemap.serviceUrl = '//192.168.1.203:82/service';
    minemap.accessToken = 'abcc8f7bf4134076b97b671300ca0baa';
    minemap.solution = 4638;
	// minemap.accessToken = '8ec9583eadfe44d89fa5bb2967ec6a8b';
	// minemap.solution = 4973;
    // minemap.domainUrl = 'https://datahive.minedata.cn';
	// minemap.fontsUrl = 'https://minedata.cn/minemapapi/v1.3/fonts';
	// minemap.spriteUrl = 'https://minedata.cn/minemapapi/v1.3/sprite/sprite';
	// map = new minemap.Map({
	//     container: 'map',
	//     style: 'https://minedata.cn/service/solu/style/id/4973',
	//     center: [121.528021,31.226196],
	//     zoom: 16,
	//     pitch: 60,
	//     minZoom: 15,
	//     maxZoom: 17
    // });
    map = new minemap.Map({
        container: 'map',
        style: "//192.168.1.203:82/service/solu/style/id/4638",
        center: [121.49094,31.21398],
        zoom: 16,
        pitch: 60,
        maxZoom:17,
        minZoom:9
    });
    map.addControl(new minemap.Navigation(),"bottom-right");
    map.on("click", function (e) {

        var lngLat = e.lngLat;
        var point = e.point;
        var features = map.queryRenderedFeatures(e);
        console.log(features);
        /**
         * 这个获取经纬度有两种方式，lngLat是我们的基本返回对象，用户可以用
         * 1 lngLat.lng 获取经度     lngLat.lat 获取纬度
         * 2 lngLat.toArray()   获取一个数组 [经度，纬度]
         */
        document.getElementById("info").innerHTML = ("经纬度坐标：" + lngLat.toArray() + "  像素点坐标：x-" + point.x + ",y-" + point.y);

    })
     map.repaint = true;

    /*获取坐标信息*/
    getJson('../data/points.json', function(data) {
        pointsArr = JSON.parse(data);
    });

    /*添加地图*/
     map.on("load", function () {
         map.on('click', function (e) {
             var features = map.queryRenderedFeatures(e.point);
             console.log('0', features, e.lngLat);
         });
         // map.setPaintProperty('ecc9ec7ed1aa41a7ad65476d85b1a929', 'background-opacity', 0);
         initCollada();
     });
})();
$(function(){
	getJson('../data/points.json', function(data) {
	    pointsArr = JSON.parse(data);
	});
})
function initCollada(){
    var geojson = {
        "type": "FeatureCollection",
        "features": []
    }

    for(var i = 0; i < pointsArr.length; i++) {
        geojson["features"].push(pointsArr[i]);
    };

    showLoading();
    setTimeOut();

    window.threebox = new Threebox(map);
    threebox.setupDefaultLights();
    window.symbols = threebox.addSymbolLayer({
        id: "trucks1",
        source: geojson,
        modelName: {generator: feature => (feature.properties['name'])},    // will look for an .obj and .mtl file with this name
        modelDirectory: "http://192.168.1.203:82/DAE/",    // 可以写url或者具体访问路径，写url需要写跨域
        rotation: {generator: feature => (new THREE.Euler(Math.PI / 2, 0, feature.properties['heading'] * Math.PI / 180 + Math.PI / 2, "ZXY"))},
        scale: {property: 'size'},
        scaleWithMapProjection: true,
        key: {property: "id"}
    });
}
function showLoading(str){
	$('.loading_bx').show();
}
function setTimeOut(){
	setTimeout(hideLoading,10000);
}
function hideLoading(){
	$('.loading_bx').hide();
}
function getJson(url, callback) {
    var xmlhttp = null;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (xmlhttp != null) {
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    callback.call(null, xmlhttp.responseText);
                }
                else {
                    alert("Problem retrieving data:" + xmlhttp.statusText);
                }
            }
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.send(null);
    }
    else {
        alert("Your browser does not support XMLHTTP.");
    }
}