var file_viewer = undefined;
var file_input, file_name;
var step = 1;
var history = [],
    principal = [],
    campus = [],
    alumnus = [],
    industry = [];


$( window ).load(function() {
  init();
});
$('.message').hide();
$('.ui.accordion').accordion();

$('#edit_list .four').on('click', 'a', function() {
  $('#edit_list .four a.active').removeClass('active');
  $(this).addClass('active');
});

$('.message .close').on('click', function() {
  $(this).closest('.message')
         .fadeOut();
});

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
    $(this).find('element').each(function() {
      var date = $(this).attr('date'),
          title = $(this).attr('title'),
          url = $(this).attr('url'),
          text = $(this).text();
      history[year] = new historyData(date, title, url, text);
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
    $(this).find('element').each(function() {
      var name = $(this).attr('name'),
          title = $(this).attr('title'),
          url = $(this).attr('url');
      alumnus[th] = new alumnusData(name, title, url);
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
        categor[categoryName].push(new campusData(name, url));
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
        categor[categoryName].push(new campusData(name, url));
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
      categor[categoryName].push(new campusData(name, url));
    });
    campus[type] = categor;
  });
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
  else
    alert("cannot parse xml string!");
  return dom;
}