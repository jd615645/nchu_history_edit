var step = 1;
var socket = io.connect();

// window.alumnus = [];
// window.campus = [];
// window.history = [];
// window.industry = [];
// window.principal = [];

var alumnus = [],
    campus = [],
    history = [],
    industry = [],
    principal = [];

$( window ).load(function() {
  $('#loading').hide();
});

$('.ui.accordion').accordion();

$('#edit_list .four').on('click', 'a', function() {
  $('#edit_list .four a.active').removeClass('active');
  $(this).addClass('active');
  var which = $(this).attr('id');
  showContext(which);
  switch(which) {
    case 'alumnus':
      showAlumnus();
      break;
    case 'campus':
      showCampus();
      break;
    case 'history':
      showHistory();
      break;
    case 'industry':
      showIndustry();
      break;
    case 'principal':
      showPrincipal();
      break;
  }
});

$('.message .close').on('click', function() {
  $(this).closest('.message')
         .fadeOut();
});

$('#context').on('click', 'i.icon.edit', function() {
  var which = $(this).attr('value');
  $('#edit-' + which).modal('show');
});
$('#context').on('click', 'i.icon.add', function() {
  var which = $(this).attr('value');
  $('#add-' + which).modal('show');
});

$('#add-alumnus .button').click(function() {
  var item = $('#add-alumnus input[name="item"]').val(),
      name = $('#add-alumnus input[name="name"]').val(),
      title = $('#add-alumnus input[name="title"]').val(),
      url = $('#add-alumnus input[name="url"]').val();
  if (item != '' && name != '' && title != '' && url != '') {
    var selector = 'alumnus year[th="' + item +'"]';
    var newData = '<element url="' + url + '" title="' + title + '" name="' + name + '" ></element>';
    socket.emit('save', {'selector': selector, 'newData': newData});;
  }
  else {
    console.log('有空位喔');
  }
});

function showAlumnus() {
  for (var i = 1997; i < alumnus.length; i++) {
    var html = '<h3>' + i + '第' + dec2chinesenum(i-1996) + '屆</h3><table class="ui celled table"><thead><tr><th style="width: 10%">姓名</th><th>內容</th><th style="width: 25%">圖片連結</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
    $.each(alumnus[i], function(key, val) {
      html += '<tr><td>' + val.name + '</td><td>' + val.title + '</td><td>' + val.url + '</td><td><i class="edit icon" value="alumnus"></i></td></tr>';
    });
    html += '</tbody></table>';
    $('#context').append($.parseHTML(html));
  };
}
function showCampus() {
  // console.log(campus);
  for(x in campus) {
    var html = '<h3>' + x + '</h3><table class="ui celled table"><thead><tr><th style="width: 10%">標題</th><th style="width: 25%">圖片連結</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
    for(y in campus[x]) {
      $.each(campus[x][y], function(key, val) {
        html += '<tr><td>' + val.name + '</td><td>' + val.url + '</td><td><i class="edit icon" value="campus"></i></td></tr>';
      });
    }
    html += '</tbody></table>';
    $('#context').append($.parseHTML(html));
  }
}
function showHistory() {
  // console.log(history);
  $.each(history, function(ik, iv) {
    var html = '<h3>' + ik + '</h3><table class="ui celled table"><thead><tr><th>日期</th><th style="width: 10%">標題</th><th style="width: 20%">圖片連結</th><th>內文</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
    try {
      $.each(history[ik], function(jk, jv) {
        html += '<tr><td>' + jv.date + '</td><td>' + jv.title + '</td><td>' + jv.url + '</td><td>' + jv.text + '</td><td><i class="edit icon" value="history"></i></td></tr>';
      });
      html += '</tbody></table>';
      $('#context').append($.parseHTML(html));
    }
    catch(e) {
      // console.log(e);
    }
  });
}
function showIndustry() {
  var html;
  for(x in industry) {
    html = '<h3>' + x + '</h3><hr>';
    $('#context').append($.parseHTML(html));
    for(y in industry[x]) {
      html = '<h3>' + y + '</h3><table class="ui celled table"><thead><tr><th style="width: 8%">年度</th><th style="width: 30%">獎項</th><th style="width: 20%">系所</th><th style="width: 10%">得獎人</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
      $.each(industry[x][y], function(key, val) {
        html += '<tr><td>' + val.year + '</td><td>' + val.award + '</td><td>' + val.dep + '</td><td>' + val.name + '</td><td><i class="edit icon" value="industry"></i></td></tr>';
      });
      html += '</tbody></table>';
      $('#context').append($.parseHTML(html));
    }
  }
}
function showPrincipal() {
  var html = '<table class="ui celled table"><thead><tr><th>標題</th><th style="width: 10%">姓名</th><th>圖片連結</th><th>內文</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
  $.each(principal, function(session , data) {
    html += '<tr><td>' + data.title + '</td><td>' + data.name + '</td><td>' + data.url + '</td><td>' + data.text + '</td><td><i class="edit icon" value="principal"></i></td></tr>';
  });
  html += '</tbody></table>';
  $('#context').append($.parseHTML(html));
}

function showContext(which) {
  var $contextBlock = $('#context');
  var contextTitle = [];
  var html ,title;
  $contextBlock.empty();
  switch(which) {
    case 'alumnus':
      title = '傑出校友';
      break;
    case 'campus':
      title = '校園環境';
      break;
    case 'history':
      title = '大事紀要';
      break;
    case 'industry':
      title = '校內外表現';
      break;
    case 'principal':
      title = '歷代校長';
      break;
  }
  html = $.parseHTML('<h2>'+ title +'<i class="add square icon" value="' + which + '"' + '></i></h2><hr>');
  $contextBlock.append(html);
}

$.ajax({
  url: './data/data.xml',
  type: 'GET',
  dataType: 'xml',
  timeout: 1000,
  success: function(data) {
    xml = data;
    readHistory($(xml).find('history'));
    readPrincipal($(xml).find('principal'));
    readCampus($(xml).find('campus'));
    readAlumnus($(xml).find('alumnus'));
    readIndustry($(xml).find('industry'));
    $('#edit_list .four a:first-child').click();
  }
})

// 讀取xml History Tag
function readHistory(data) {
  data.find('year').each(function(yr) {
    var year = $(this).attr('yr');
    history[year] = [];
    $(this).find('element').each(function() {
      var date = $(this).attr('date'),
          title = $(this).attr('title'),
          url = $(this).attr('url'),
          text = $(this).text();
      history[year].push(new historyData(date, title, url, text));
    });
  });
}
function historyData(date, title, url, text) {
  this.date = date;
  this.title = title;
  this.url = url;
  this.text = text;
}
// 讀取xml Principal Tag
function readPrincipal(data) {
  data.find('element').each(function(i) {
    var title = $(this).attr('title'),
        name = $(this).attr('name'),
        url = $(this).attr('url');
        text = $(this).text();
    principal[i] = new principalData(title, name, url, text);
  });
}
function principalData(title, name, url, text) {
  this.title = title;
  this.name = name;
  this.url = url;
  this.text = text;
}
// 讀取xml Alumnus Tag
function readAlumnus(data) {
  data.find('year').each(function(yr) {
    var th = $(this).attr('th').substr(0, 4);
    alumnus[th] = [];
    $(this).find('element').each(function() {
      var name = $(this).attr('name'),
          title = $(this).attr('title'),
          url = $(this).attr('url');
      alumnus[th].push(new alumnusData(name, title, url));
    });
  });
  // console.log(alumnus);
}
function alumnusData(name, title, url) {
  this.name = name;
  this.title = title;
  this.url = url;
}
// 讀取xml Industry Tag
function readIndustry(data) {
  var school = ['out_school', 'in_school'];
  $.each(school, function(key, val) {
    industry[val] = [];
    data.find(val + ' award').each(function(i) {
      type = $(this).attr('name');
      industry[val][type] = [];
      $(this).find('element').each(function(i) {
        var year = $(this).attr('year'),
            name = $(this).attr('name'),
            dep = $(this).attr('dep'),
            award = $(this).attr('award');
        industry[val][type].push(new industryData(year, name, dep, award));
      });
    });
  });
  // console.log(industry);
}
function industryData(year, name, dep, award) {
  this.year = year;
  this.name = name;
  this.dep = dep;
  this.award = award;
}
// 讀取xml Campus Tag
function readCampus(data) {
  data.find('scene').each(function() {
    var type = $(this).attr('name');
    campus[type] = [];
    $(this).find('category').each(function() {
      var categoryName = $(this).attr('name');
      campus[type][categoryName] = [];
      $(this).find('element').each(function(i) {
        var name = $(this).attr('name'),
            url = $(this).attr('url');
        campus[type][categoryName].push(new campusData(name, url));
      });
    });
  });
  data.find('ecology').each(function() {
    var type = $(this).attr('name');
    campus[type] = [];
    $(this).find('category').each(function() {
      var categoryName = $(this).attr('name');
      campus[type][categoryName] = [];
      $(this).find('element').each(function(i) {
        var name = $(this).attr('name'),
            url = $(this).attr('url');campus
        campus[type][categoryName].push(new campusData(name, url));
      });
    });
  });
  data.find('forest').each(function() {
    var type = $(this).attr('name');
    campus[type] = [];
    var categoryName = '林場映像';
    campus[type][categoryName] = [];
    $(this).find('element').each(function(i) {
      var name = $(this).attr('name'),
          url = $(this).attr('url');
      campus[type][categoryName].push(new campusData(name, url));
    });
  });
  // console.log(campus);
}
function campusData(name, url) {
  this.name = name;
  this.url = url;
}

function parseXml(xml) {
  var dom = null;
  if (window.DOMParser) {
    try {
      dom = (new DOMParser()).parseFromString(xml, "text/xml");
    }
    catch (e) { dom = null; }
  }
  else if (window.ActiveXObject) {
    try {
      dom = new ActiveXObject('Microsoft.XMLDOM');
      dom.async = false;
      if (!dom.loadXML(xml)) // parse error ..

        window.alert(dom.parseError.reason + dom.parseError.srcText);
    }
    catch (e) { dom = null; }
  }
  else { alert("cannot parse xml string!"); }
  return dom;
}

function xml2string(xmlObject) {
	if (window.ActiveXObject) { // for IE
		return xmlObject.xml;
	} else {
		return (new XMLSerializer()).serializeToString(xmlObject);
	}
}

// 數字轉中文
function dec2chinesenum(num) {
  var chinesenum = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  var tens = parseInt(num/10);
  var digits = parseInt(num%10);
  return (chinesenum[tens]=='一' ? '' : chinesenum[tens]) + (tens!=0 ? '十' : '') + chinesenum[digits];
}

$('.ui.modal').modal();
