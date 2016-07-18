var file_viewer = undefined;
var file_input, file_name;
var step = 1;
window.alumnus = [];
window.campus = [];
window.history = [];
window.industry = [];
window.principal = [];

$( window ).load(function() {
  init();
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
      // showCampus();
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
  $('#edit-content').modal('show');
});
$('#context').on('click', 'i.icon.add', function() {
  $('#add-content').modal('show');
});

function showAlumnus() {
  for (var i = 1997; i < alumnus.length; i++) {
    var html = '<h3>' + i + '</h3><table class="ui celled table"><thead><tr><th style="width: 10%">姓名</th><th>內容</th><th style="width: 25%">圖片連結</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
    $.each(alumnus[i], function(key, val) {
      html += '<tr><td>' + val.name + '</td><td>' + val.title + '</td><td>' + val.url + '</td><td><i class="edit icon"></i></td></tr>';
    });
    html += '</tbody></table>';
    $('#context').append($.parseHTML(html));
  };
}
// function showCampus() {
//   var type = ['校景變遷', '校園生態', '林場映像'];
//   console.log(campus);
//   $.each(type, function(ik, iv) {
//     // console.log(campus[val]);
//     $.each(campus[iv], function(jk, jv) {
//     });
//   });
// }
function showHistory() {
  // console.log(history);
  $.each(history, function(ik, iv) {
    var html = '<h3>' + ik + '</h3><table class="ui celled table"><thead><tr><th>日期</th><th style="width: 10%">標題</th><th style="width: 20%">圖片連結</th><th>內文</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
    try {
      $.each(history[ik], function(jk, jv) {
        html += '<tr><td>' + jv.date + '</td><td>' + jv.title + '</td><td>' + jv.url + '</td><td>' + jv.text + '</td><td><i class="edit icon"></i></td></tr>';
      });
      html += '</tbody></table>';
      $('#context').append($.parseHTML(html));
    }
    catch(e) {
      console.log(e);
    }
  });
}
function showIndustry() {
  var type = ['in_school', 'out_school'];
  $.each(type, function(ik, iv) {
    $.each(industry[iv], function(jk, jv) {
      console.log(jk);
    });
  });
  // console.log(industry['in_school']);
}
function showPrincipal() {
  var html = '<table class="ui celled table"><thead><tr><th>標題</th><th style="width: 10%">姓名</th><th>圖片連結</th><th>內文</th><th style="width: 7%">編輯</th></tr></thead><tbody>';
  $.each(principal, function(session , data) {
    html += '<tr><td>' + data.title + '</td><td>' + data.name + '</td><td>' + data.url + '</td><td>' + data.text + '</td><td><i class="edit icon"></i></td></tr>';
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
  html = $.parseHTML('<h2>'+ title +'<i class="add square icon"></i></h2><hr>');
  $contextBlock.append(html);
}

function FileViewer(args) {
  for (var p in args)
    this[p] = args[p];

  this.reader = new FileReader();

  this.reader.onloadend = (function(self) {
    return function() {
          self.loaded();
        }
  })(this);
}
FileViewer.prototype.load = function() {
  this.file = this.controller.files[0];
  this.reader.readAsText(this.file);
}
FileViewer.prototype.loaded = function() {
  file_name = this.file.name;
  file_input = this.reader.result;
  if(file_name != 'data.xml') {
    // show massage
    $('.message').fadeIn();
  }
  else {
    // notify
    $('.message').fadeOut();
    $('.openfile').fadeOut();
    // add step
    $('#steps .step:first-child').removeClass('active');
    $('#steps .step:nth-child(2)').removeClass('disabled').addClass('active');
    step = 2;

    xml = parseXml(file_input);
    readHistory($(xml).find('history'));
    readPrincipal($(xml).find('principal'));
    readCampus($(xml).find('campus'));
    readAlumnus($(xml).find('alumnus'));
    readIndustry($(xml).find('industry'));

    $('#edit_list').fadeIn();
    $('#edit_list .four a:first-child').click();
  }
}

function init() {
  file_viewer = new FileViewer(
    {
      controller: document.getElementById('file_selector'),
      view_name: document.getElementById('show_filename'),
    }
  );
}

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
function readIndustry(data) {
  var school = ['out_school', 'in_school'];
  $.each(school, function(key, val) {
    industry[val] = [];
    data.find(val + ' award').each(function(i) {
      type = $(this).attr('name');
      industry[val][type] = [];
      $(this).find('element').each(function(i) {
        var year = $(this).attr('year'),
            name = $(this).attr('naem'),
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
function readCampus(data) {
  data.find('scene').each(function() {
    var type = $(this).attr('name');
    campus[type] = [];
    var categor = [];
    $(this).find('category').each(function() {
      var categoryName = $(this).attr('name');
      categor[categoryName] = [];
      $(this).find('element').each(function(i) {
        var name = $(this).attr('name'),
            url = $(this).attr('url');
        campus[type].push(new campusData(name, url));
      });
      campus[type] = categor;
    });
  });
  data.find('ecology').each(function() {
    var type = $(this).attr('name');
    campus[type] = [];
    var categor = [];
    $(this).find('category').each(function() {
      var categoryName = $(this).attr('name');
      categor[categoryName] = [];
      $(this).find('element').each(function(i) {
        var name = $(this).attr('name'),
            url = $(this).attr('url');
        campus[type].push(new campusData(name, url));
      });
      campus[type] = categor;
    });
  });
  data.find('forest').each(function() {
    var type = $(this).attr('name');
    campus[type] = [];
    var categor = [];
    var categoryName = '林場映像';
    categor[categoryName] = [];
    $(this).find('element').each(function(i) {
      var name = $(this).attr('name'),
          url = $(this).attr('url');
      campus[type].push(new campusData(name, url));
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
$('.ui.modal').modal();