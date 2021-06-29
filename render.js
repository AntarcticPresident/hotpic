XLSX = require('xlsx')
let workbook = XLSX.readFile('./1.xlsx')

const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
data.sort((obj1, obj2) => {
  return 0 - obj1['年票房（万）'] + obj2['年票房（万）']
})

var myIcon = new BMapGL.Icon("http://api.map.baidu.com/img/markers.png", new BMapGL.Size(23, 25), {
  offset: new BMapGL.Size(10, 25),
  imageOffset: new BMapGL.Size(0, 0)
})
// 构造覆盖物方法
function ComplexCustomOverlay (point, index) {
  this._point = point
  this._index = index
}

ComplexCustomOverlay.prototype = new BMapGL.Overlay()
ComplexCustomOverlay.prototype.initialize = function (map) {
  this._map = map
  var span = this._span = document.createElement("span")
  // 设置样式
  $(span).css({
    'position': 'absolute',
    'zIndex': BMapGL.Overlay.getZIndex(this._point.lat),
    'display': 'block',
    'width': '26px',
    'color': '#FFF',
    'text-align': 'center',
    'point-events': 'none',
    'font-size': 12
  })
  // 设置数字
  this._span.innerHTML = this._index
  map.getPanes().labelPane.appendChild(span)
  return span
}
ComplexCustomOverlay.prototype.draw = function () {
  var map = this._map
  var pixel = map.pointToOverlayPixel(this._point)
  // 设置自定义覆盖物span与marker的位置
  this._span.style.left = pixel.x - 14 + 'px'
  this._span.style.top = pixel.y - 23 + 'px'
}

// 创建地图实例 
var map = new BMapGL.Map("container")

// 创建点坐标
var point = new BMapGL.Point(120.3894158413208, 36.072492097137015)

// 初始化地图，设置中心点坐标和地图级别
map.centerAndZoom(point, 12)
map.enableScrollWheelZoom(true)

//创建地址解析器实例
var myGeo = new BMapGL.Geocoder()
// 将地址解析结果显示在地图上，并调整地图视野
for (let i in data) {
  let cinema = data[i]
  myGeo.getPoint(cinema["地址"], function (point) {
    if (point) {
      var opts = {
        width: 280,     // 信息窗口宽度
        height: 120,     // 信息窗口高度
        title: cinema['影城名'], // 信息窗口标题
        offset: new BMapGL.Size(0, -14)
      }
      var infoWindow = new BMapGL.InfoWindow("票房总量：" + cinema["年票房（万）"] + "<br>影厅数：" + cinema["影厅数"] + "<br>座位数：" + cinema["座位数"] + "<br>地址：" + cinema["地址"], opts)

      marker = new BMapGL.Marker(point)
      map.addOverlay(marker)

      var myCompOverlay = new ComplexCustomOverlay(point, Number(i) + 1)
      map.addOverlay(myCompOverlay)

      marker.addEventListener("mouseover", function () {
        map.openInfoWindow(infoWindow, point) //开启信息窗口
      })
      marker.addEventListener("mouseout", function () {
        map.closeInfoWindow(infoWindow, point) //关闭信息窗口
      })
    } else {
      alert('您选择的地址没有解析到结果！')
    }
  }, '青岛市')
}