const firebaseConfig = {
  apiKey: 'AIzaSyBaun8hy8KStSJNgE7DEv1pggGn8kaSEHs',
  authDomain: 'school-project-320ec.firebaseapp.com',
  databaseURL: 'https://school-project-320ec.firebaseio.com',
  storageBucket: 'school-project-320ec.appspot.com',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 初始化 Firebase Datavase
const database = firebase.database();
const databaseRef = database.ref();
// 重複渲染資料
let resetData;
// databaseRef.once('value').then((res) => {
//   const response = res.val();
//   storageInit(response);
// });
$.LoadingOverlay('show', {
  fontawesomeColor: '#b4b4b4',
  maxSize: 60,
  background: '#2c2c2ccc',
  fontawesome: 'fas fa-spinner fa-spin',
});
databaseRef.on('value', (res) => {
  const response = res.val();
  storageInit(response);
});

// 初始化 Firebase Storage
function storageInit(data, pageStatus = false) {
  const storageRef = firebase.storage().ref('finaltest/images');
  storageRef
    .getDownloadURL()
    .then((url) => {
      document.querySelector('#renderImage').src = url;
      const status = document.querySelector('#renderStatus');
      status.textContent = '成功';
      status.classList.add('text-success');
      if (!pageStatus) {
        RealtimeData(data);
      }
    })
    .catch((error) => {
      const status = document.querySelector('#renderStatus');
      status.textContent = '失敗';
      status.classList.add('text-danger');
    });
}

// 獲得最新資料
function RealtimeData(data) {
  const finalData = Object.values(data.finalDB);
  const finalDataString = finalData[finalData.length - 1];
  console.log(finalDataString);
  filterNumPyArray(finalDataString);
}

// 將 numpy Array 過濾
function filterNumPyArray(data) {
  let filterArray = '';
  let tempValue = 0;
  for (const key in data) {
    if (parseInt(data[key]) >= 0) {
      filterArray += data[key];
      tempValue = 0;
    } else if (tempValue === 1) {
      filterArray += '';
    } else {
      filterArray += ',';
      tempValue = 1;
    }
  }
  console.log(filterArray);
  stringToArray(filterArray);
}

// 將 String 包裝成 Array
function stringToArray(data) {
  let finalArray = '';
  for (const key in data) {
    if (key === '0') {
      finalArray += '[';
    } else if (key === (data.length - 1).toString()) {
      finalArray += ']';
    } else {
      finalArray += data[key];
    }
  }
  console.log(JSON.parse(finalArray));
  sliceRenderData(JSON.parse(finalArray));
}

// 將資料切層
function sliceRenderData(data) {
  const sliceData = [];
  const num = 4800 / 80;
  for (let index = 0; index < num; index += 1) {
    sliceData.push(data.slice(80 * index, 80 * (index + 1)));
  }
  console.log(sliceData);
  toRenderData(sliceData);
}

// 轉換為渲染物件
function toRenderData(data) {
  const renderData = [];
  data.forEach((item_outer, index_outer) => {
    item_outer.forEach((item_inside, index_inside) => {
      renderData.push([index_inside, 60 - index_outer, item_inside]);
    });
  });
  console.log(renderData);
  filterRenderData(renderData);
}

// 過濾渲染物件
function filterRenderData(data) {
  const filterRender = data.filter((item, index) => {
    return item[2] < 1000 && item[2] > 200;
  });
  //   const aa = [];
  //   let prevValue = 0;
  //   for (const item of filterRender) {
  //     if (Math.abs(item[2] - prevValue) > 150) {
  //       prevValue = item[2];
  //     } else {
  //       aa.push(item);
  //       prevValue = item[2];
  //     }
  //   }
  //   let prevX = 0;
  //   const bb = [];
  //   for (const item of aa) {
  //       if(item[0] - prevX >5){
  //           prevX = item[0];
  //       }else{
  //           bb.push(item);
  //           prevX = item[0];
  //       }
  //   }
  console.log(filterRender);
  outputValue(filterRender);
}

// 輸出資料數到畫面
function outputValue(data) {
  document.querySelector('#totalData').textContent = (4800).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  document.querySelector('#vaildValue').textContent = data.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  document.querySelector('#filterValue').textContent = (4800 - data.length)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  resetData = data;
  $.LoadingOverlay('hide');
  highchart_Init(data);
}

// 初始化建模
function highchart_Init(renderData) {
  // 可選配置
  // 避免實例選項重複選染
  if (!Highcharts.charts.length) {
    Highcharts.setOptions({
      colors: Highcharts.getOptions().colors.map(function(color) {
        return {
          radialGradient: {
            cx: 0.4,
            cy: 0.3,
            r: 0.5,
          },
          stops: [
            [0, color],
            [
              1,
              Highcharts.Color(color)
                .brighten(-0.2)
                .get('rgb'),
            ],
          ],
        };
      }),
    });
  }
  // 渲染物件
  let chart = new Highcharts.Chart({
    chart: {
      renderTo: 'canvasbox',
      margin: 100,
      type: 'scatter3d',
      animation: false,
      options3d: {
        enabled: true,
        alpha: 0,
        beta: 0,
        depth: 500,
        viewDistance: 5,
        fitToPlot: false,
        frame: {
          bottom: {
            size: 1,
            color: 'rgba(0,0,0,0.02)',
          },
          back: {
            size: 1,
            color: 'rgba(0,0,0,0.04)',
          },
          side: {
            size: 1,
            color: 'rgba(0,0,0,0.06)',
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    title: {
      text: '',
      margin: 10,
    },
    tooltip: {
      enabled: true,
    },
    subtitle: {
      text: '',
    },
    plotOptions: {
      scatter: {
        width: 10,
        height: 10,
        depth: 10,
      },
    },
    yAxis: {
      min: 0,
      max: 100,
      title: null,
    },
    xAxis: {
      min: -30,
      max: 120,
      gridLineWidth: 1,
    },
    zAxis: {
      min: 0,
      max: 1000,
      showFirstLabel: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: 'Reading',
        // colorByPoint: true,
        data: renderData,
      },
    ],
  });
  // 執行渲染
  (function(H) {
    function dragStart(eStart) {
      eStart = chart.pointer.normalize(eStart);

      var posX = eStart.chartX,
        posY = eStart.chartY,
        alpha = chart.options.chart.options3d.alpha,
        beta = chart.options.chart.options3d.beta,
        sensitivity = 5, // lower is more sensitive
        handlers = [];

      function drag(e) {
        // Get e.chartX and e.chartY
        e = chart.pointer.normalize(e);

        chart.update(
          {
            chart: {
              options3d: {
                alpha: alpha + (e.chartY - posY) / sensitivity,
                beta: beta + (posX - e.chartX) / sensitivity,
              },
            },
          },
          undefined,
          undefined,
          false
        );
      }

      function unbindAll() {
        handlers.forEach(function(unbind) {
          if (unbind) {
            unbind();
          }
        });
        handlers.length = 0;
      }

      handlers.push(H.addEvent(document, 'mousemove', drag));
      handlers.push(H.addEvent(document, 'touchmove', drag));

      handlers.push(H.addEvent(document, 'mouseup', unbindAll));
      handlers.push(H.addEvent(document, 'touchend', unbindAll));
    }
    H.addEvent(chart.container, 'mousedown', dragStart);
    H.addEvent(chart.container, 'touchstart', dragStart);
  })(Highcharts);
}

// 錨點滑動
$('#toLink').on('click', function() {
  $('html,body').animate(
    {
      scrollTop: $('#canvasbox').offset().top,
    },
    1000
  );
});

// 重新整理圖表
$('#resetChart').on('click', function(e) {
  e.preventDefault();
  $('#resetBox').LoadingOverlay('show', {
    fontawesomeColor: '#b4b4b4',
    maxSize: 60,
    background: '#2c2c2c36',
    fontawesome: 'fas fa-spinner fa-spin',
  });
  highchart_Init(resetData);
  $('#resetBox').LoadingOverlay('hide');
});

// 重新整理圖片
$('#resetImage').on('click', function(e) {
  e.preventDefault();
  document.querySelector('#renderImage').src = './img/loading.gif';
  storageInit(null, true);
});
