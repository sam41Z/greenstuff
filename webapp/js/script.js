// page setup
var setup;

// the data to be displayed
var data;

// current date
var date = new Date()
var days_of_month = new Date(date.getFullYear(), date.getMonth() - 1, 0).getDate();
// current index
var index = date.getMonth() * 2 + ((date.getDate() <= 15) ? 0 : 1);

// all strings
var strings;

//current position of the bar
var bar_pos = 0;
var barLeft;
var barRight;
// flag whether bar is dragged at the moment
var dragged = false;

$(function () {
    loadSetup();
});

$(window).resize(function () {
    updateBars();
});

var completed = 3;

function fileLoaded() {
    completed -= 1;
    if (completed === 0) {
        createLists();
        drawHeader();
        updateLists();
    }
}

function loadFiles() {
    data = new Data();
    completed = 3;
    $.getJSON('json/languages/' + setup.languageFile).done(function (json) {
        strings = json;
        $('title').text(strings.title);
        fileLoaded();
    }).fail(function (jqxhr, textStatus, error) {
        console.log('error');
    });

    $.getJSON('json/regions/' + setup.regionFile).done(function (json) {
        data.setData(json);
        fileLoaded();
    }).fail(function (jqxhr, textStatus, error) {
        console.log('error');
    });

    $.getJSON('json/types.json').done(function (json) {
        data.setTypes(json);
        fileLoaded();
    }).fail(function (jqxhr, textStatus, error) {
        console.log('error');
    });
}

function loadSetup() {
    $.getJSON('json/setup.json', function (data) {
        setup = new Setup(data);
        loadFiles();
    });
}

var seasonTable;
var houseTable;
var storeTable;
var notTable;

function createLists() {
    seasonTable = new Table(setup.labels[3]);
    houseTable = new Table(setup.labels[2]);
    storeTable = new Table(setup.labels[1]);
    notTable = new Table(setup.labels[0]);
}

var updatingLists = false;

function updateLists() {
    updatingLists = true;
    var startTime = new Date().getTime();
    seasonTable.updateBodies();
    houseTable.updateBodies();
    storeTable.updateBodies();
    notTable.updateBodies();
    updateBars();
    console.log(new Date().getTime() - startTime);
    updatingLists = false;
}

function drawHeader() {
    drawNav();
    drawLegend();
}

function drawLegend() {
    $('li.season').text(strings.legend.season);
    $('li.house').text(strings.legend.house);
    $('li.store').text(strings.legend.store);
    $('li.not').text(strings.legend.not);
}

function drawNav() {
    $('#language_nav').html(strings.navigation.language + '<span class="caret"></span>')
    var langSelection = document.getElementById('language_selection');
    clearElement(langSelection);
    for (var i = 0; i < setup.languages.length; i++) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.appendChild(document.createTextNode(setup.languages[i].name));
        link.href = '#';
        if (setup.languageFile == setup.languages[i].file) {
            link.className = 'dropdown_selected';
        }
        link.onclick = function (j) {
            return function () {
                setup.setLanguage(setup.languages[j].file);
            };
        }(i);
        item.appendChild(link);
        langSelection.appendChild(item);
    }

    $('#region_nav').html(strings.navigation.region + '<span class="caret"></span>')
    var regSelection = document.getElementById('region_selection');
    clearElement(regSelection);
    for (var i = 0; i < setup.regions.length; i++) {
        var item = document.createElement('li');
        var link = document.createElement('a');
        link.appendChild(document.createTextNode(strings.region_names[setup.regions[
            i].name]));
        link.href = '#';
        if (setup.region == setup.regions[i].file) {
            link.className = 'dropdown_selected';
        }
        link.onclick = function (j) {
            return function () {
                setup.setRegion(setup.regions[j].file);
            };
        }(i);
        item.appendChild(link);
        regSelection.appendChild(item);
    }
}

function getName(item) {
    return strings.food_names[item.name];
}

function clearElement(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

var bars = new Array();

function updateBars() {
    updateBarsVertical();
    updateBarsHorizontal()
}

function setBarsShadow(shadow) {
    for (var i = 0; i < bars.length; i++) {
        if (shadow) $(this.bars[i].bar).addClass('bar_hovered');
        else $(this.bars[i].bar).removeClass('bar_hovered');
    }
}

function updateBarsVertical() {
    for (var i = 0; i < bars.length; i++) {
        var bar = this.bars[i];
        var $bar = $(bar.bar);
        var $body = $(bar.body);
        var top = $body.offset().top;
        var height = $body.outerHeight();
        $bar.css({
            top: top,
            height: height,
        });
    }
}

function updateBarsHorizontal() {
    for (var i = 0; i < bars.length; i++) {
        var bar = this.bars[i];
        var $bar = $(bar.bar);
        var $body = $(bar.body);
        if (bar_pos == 0) {
            computeBarBounds($body, $bar);
            var cellWidth = (barRight - barLeft) / 24;
            bar_pos = barLeft + cellWidth * index +
                (cellWidth - $bar.outerWidth()) / 2;
        }
        $bar.css({
            left: bar_pos
        });
    }
}

function computeBarBounds($body, $bar) {
    if (!barLeft || !barRight) {
        barLeft = $body.offset().left + $('.name').outerWidth() - 1;
        barRight = $body.innerWidth() + barLeft - $bar.outerWidth() - $('.name')
                .outerWidth() - 1;
    }
}



