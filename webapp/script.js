// the data to be displayed
var data;
var types;

// current date
var date = new Date()
var days_of_month = new Date(date.getFullYear(), date.getMonth() - 1, 0).getDate();
// current index
var index = date.getMonth() * 2 + ((date.getDay <= 15) ? 0 : 1);

// codes for classes
var season = 3;
var house = 2;
var store = 1;
var not = 0;

// css classes for the four jahr classes
var jahr_classes = new Array();
jahr_classes[season] = "season";
jahr_classes[house] = "house";
jahr_classes[store] = "store";
jahr_classes[not] = "not";

// the different type in datas list
var classes = ["vegetables", "fruits"];

// all available languages
var languages;
// current language
var language;

var regions;
var region;

// all strings
var strings;

//current position of the bar
var bar_pos = 0;
// flag whether bar is dragged at the moment
var dragged = false;

// function loaden when the file is loaded
$(function() {
    loadSetup();
});

$(window).resize(function() {
    drawBars();
});

var completed = 3;

var rows = new Array();
var bodies = new Array();

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
    $.getJSON("languages/" + language).done(function(json) {
        strings = json;
        $("title").text(strings.title);
        fileLoaded();
    }).fail(function(jqxhr, textStatus, error) {
        console.log("error");
    });

    $.getJSON("regions/" + region).done(function(json) {
        data.setData(json);
        fileLoaded();
    }).fail(function(jqxhr, textStatus, error) {
        console.log("error");
    });

    $.getJSON("types.json").done(function(json) {
        data.setTypes(json);
        fileLoaded();
    }).fail(function(jqxhr, textStatus, error) {
        console.log("error");
    });
}

function loadSetup() {
    $.getJSON("setup.json", function(data) {
        languages = data.languages;
        //local storage
        setupLanguage();
        //local storage
        regions = data.regions;
        region = data.regions[0].file;

        loadFiles();
    });
}

var seasonTable;
var houseTable;
var storeTable;
var notTable;

function createLists() {
    seasonTable = new Table("season", season);
    houseTable = new Table("house", house);
    storeTable = new Table("store", store);
    notTable = new Table("not", not);
}

function updateLists() {
    var startTime = new Date().getTime();
    seasonTable.updateBodies();
    houseTable.updateBodies();
    storeTable.updateBodies();
    notTable.updateBodies();
    drawBars();
    console.log(new Date().getTime() - startTime);
}

function drawBar(parent) {
    var all = $(parent + " .current");
    all.each(function(i) {
        var bar = $(parent + " .current_bar").eq(i)
        if (dragged) {
            bar.addClass("bar_hovered");
        } else {
            bar.removeClass("bar_hovered");
        }
        if (!bar.length) {
            bar = $(document.createElement("div")).addClass(
                "current_bar");
            $(parent).prepend(bar);
        }
        var current = all.eq(i);
        var top = current.offset().top - $(parent).offset().top;
        var left;
        if (bar_pos > 0) {
            left = bar_pos;
        } else {
            left = current.offset().left + (current.width() - bar.width()) /
                days_of_month * date.getDate();
        }
        var header_height = current.outerHeight();
        var margin_top = header_height + $(parent + " .type_header").height();
        var height = $(parent + " .list").eq(i).height();

        bar.css("margin-top", header_height + top - 1).css("left", left +
            1).css("height", height - margin_top - 2);
        addDraggable(bar);
    });
}

function drawBars() {
    drawBar("#season");
    drawBar("#house");
    drawBar("#store");
    drawBar("#not");
}

function drawHeader() {
    drawNav();
    drawLegend();
}

function drawLegend() {
    $("li.season").text(strings.legend.season);
    $("li.house").text(strings.legend.house);
    $("li.store").text(strings.legend.store);
    $("li.not").text(strings.legend.not);
}

function drawNav() {
    var list = "";
    var selected = "";
    for (var i = 0; i < languages.length; i++) {

        if (language == languages[i].file) {
            selected = "class=\"dropdown_selected\""
        } else {
            selected = "";
        }
        list += "<li><a href=\"#\" " + selected + " onclick=\"setLanguage('" +
            languages[i].file + "')\">" + languages[i].name + "</a></li>";
    }
    $("#language_selection").empty();
    $("#language_selection").append(list);

    list = "";
    selected = "";
    for (var i = 0; i < regions.length; i++) {

        if (region == regions[i].file) {
            selected = "class=\"dropdown_selected\""
        } else {
            selected = "";
        }
        list += "<li><a href=\"#\" " + selected + " onclick=\"setRegion('" +
            regions[i].file + "')\">" + strings.region_names[regions[i].name] +
            "</a></li>";
    }
    $("#region_selection").empty();
    $("#region_selection").append(list);
}

function addDraggable(bar) {
    var left = bar.parent().offset().left + $(".name").outerWidth() - 1;
    var right = bar.parent().offset().left + bar.parent().width() - bar.outerWidth() -
        1;
    var width = right - left + 1;
    bar.draggable({
        axis: "x",
        cursor: "move",
        start: function() {
            dragged = true;
        },
        drag: function(event, ui) {
            if (ui.offset.left < left) {
                ui.position.left = left;
            }
            if (ui.offset.left > right) {
                ui.position.left = right;
            }
            bar_pos = ui.position.left;
            var new_index = Math.floor((bar_pos - left) * 24 /
                width);
            if (new_index != index) {
                index = new_index;
                setTimeout(function() {
                    if (index == new_index) {
                        updateLists();
                    }
                }, 150);
            }
            drawBars();
        },
        stop: function() {
            dragged = false;
            drawBars();
        }
    });
}

function compareProd(a, b) {
    a = getName(a).toLowerCase();
    a = a.replace(/ä/g, 'a');
    a = a.replace(/ö/g, 'o');
    a = a.replace(/ü/g, 'u');

    b = getName(b).toLowerCase();
    b = b.replace(/ä/g, 'a');
    b = b.replace(/ö/g, 'o');
    b = b.replace(/ü/g, 'u');
    return (a > b) ? 1 : -1;
}

function getName(item) {
    return strings.food_names[item.name];
}

function getType(name) {
    return types[name];
}

function setupLanguage() {
    language = languages[0].file;
    //localStorage.clear();
    if (localStorage.language) {
        language = localStorage.language;
    } else {
        var language_code = window.navigator.language;
        for (var i = 0; i < languages.length; i++) {

            if (languages[i].file == language_code + ".json") {
                language = languages[i].file;
                break;
            }
        }
    }
}

function setLanguage(lang) {
    language = lang;
    localStorage.language = language;
    loadFiles();
}

function setupRegions() {
    region = regions[0].file;
    if (localStorage.region) {
        region = localStorage.region;
    }
}

function setRegion(reg) {
    region = reg;
    localStorage.region = region;
    loadFiles();
}

var Data = function() {
    this.data = data;
    this.type_keys = ["vegetables", "fruits"];
};

Data.prototype.setData = function(data) {
    this.data = data;
    this.data.sort(function(a, b) {
        a = getName(a).toLowerCase();
        a = a.replace(/ä/g, 'a');
        a = a.replace(/ö/g, 'o');
        a = a.replace(/ü/g, 'u');

        b = getName(b).toLowerCase();
        b = b.replace(/ä/g, 'a');
        b = b.replace(/ö/g, 'o');
        b = b.replace(/ü/g, 'u');
        return (a > b) ? 1 : -1;
    });
    this.createRows();
};

Data.prototype.setTypes = function(types) {
    this.types = types;
};

Data.prototype.isValid = function(index, month, clazz, type) {
    return this.data[index].jahr[month] == clazz && this.types[this.data[
        index].name] == type;
};

Data.prototype.createRows = function() {
    this.rows = new Array(this.data.length);
    for (var i = 0; i < this.data.length; i++) {
        var row = document.createElement("tr");
        var nameCell = document.createElement("td");
        nameCell.className = "name";
        nameCell.appendChild(document.createTextNode(getName(this.data[i])));
        row.appendChild(nameCell);
        for (var j = 0; j < this.data[i].jahr.length; j++) {
            var cell = document.createElement("td");
            var div = document.createElement("div");
            div.className = "overview_elem " + jahr_classes[this.data[i].jahr[j]];
            cell.appendChild(div);
            row.appendChild(cell);
        }
        this.rows[i] = row;
    }
};

var Table = function(id, code) {
    this.code = code;
    this.container = document.getElementById(id);
    this.bodies = new Array(data.type_keys.length);

    var header = document.createElement("h2");
    header.appendChild(document.createTextNode(strings.content_titles[
        jahr_classes[code]]));
    this.container.appendChild(header);

    var table = document.createElement("table");
    table.className = "list";

    for (var t = 0; t < data.type_keys.length; t++) {
        var tHead = document.createElement("thead");
        var tBody = document.createElement("tbody");
        table.appendChild(tHead);
        table.appendChild(tBody);
        this.drawTableHeader(tHead, classes[t]);
        this.bodies[t] = tBody;
    }
    this.container.appendChild(table);
};

Table.prototype.drawTableHeader = function(tHead, type) {
    var typeHeader = document.createElement("tr");
    typeHeader.classNamen = "type_header";
    var typeCell = document.createElement("td");
    typeCell.className = "type_" + type;
    typeCell.colSpan = "100%";

    var title = document.createElement("h3");
    title.appendChild(document.createTextNode(strings.types[type]))
    typeCell.appendChild(title);
    typeHeader.appendChild(typeCell);

    var tableHeader = document.createElement("tr");
    tableHeader.className = "table_header";
    tableHeader.appendChild(document.createElement("td"));
    for (var i = 0; i < strings.months.length; i++) {
        var cell = document.createElement("td");
        cell.colSpan = "2";
        cell.appendChild(document.createTextNode(strings.months[i]));
        if (i == date.getMonth()) {
            cell.className = "current";
        }
        tableHeader.appendChild(cell);
    }
    tHead.appendChild(typeHeader);
    tHead.appendChild(tableHeader);
};

Table.prototype.updateBodies = function() {
    for (var t = 0; t < data.type_keys.length; t++) {
        while (this.bodies[t].firstChild) {
            this.bodies[t].removeChild(this.bodies[t].firstChild);
        }
        var frag = document.createDocumentFragment();
        for (var i = 0; i < data.data.length; i++) {
            if (data.isValid(i, index, this.code, t)) {
                frag.appendChild(data.rows[i]);
            }
        }
        this.bodies[t].appendChild(frag);
    }
};