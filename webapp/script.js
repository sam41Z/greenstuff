// page setup
var setup;

// the data to be displayed
var data;

// current date
var date = new Date()
var days_of_month = new Date(date.getFullYear(), date.getMonth() - 1, 0).getDate();
// current index
var index = date.getMonth() * 2 + ((date.getDay <= 15) ? 0 : 1);

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
    $.getJSON("languages/" + setup.languageFile).done(function(json) {
        strings = json;
        $("title").text(strings.title);
        fileLoaded();
    }).fail(function(jqxhr, textStatus, error) {
        console.log("error");
    });

    $.getJSON("regions/" + setup.regionFile).done(function(json) {
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

function updateLists() {
    var startTime = new Date().getTime();
    seasonTable.updateBodies();
    houseTable.updateBodies();
    storeTable.updateBodies();
    notTable.updateBodies();
    // drawBars();
    console.log(new Date().getTime() - startTime);
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
    var langSelection = document.getElementById("language_selection");
    clearElement(langSelection);
    for (var i = 0; i < setup.languages.length; i++) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.appendChild(document.createTextNode(setup.languages[i].name));
        link.href = "#";
        if (setup.languageFile == setup.languages[i].file) {
            link.className = "dropdown_selected";
        }
        link.onclick = function(j) {
            return function() {
                setup.setLanguage(setup.languages[j].file);
            };
        }(i);
        item.appendChild(link);
        langSelection.appendChild(item);
    }

    var regSelection = document.getElementById("region_selection");
    clearElement(regSelection);
    for (var i = 0; i < setup.regions.length; i++) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        link.appendChild(document.createTextNode(strings.region_names[setup.regions[
            i].name]));
        link.href = "#";
        if (setup.region == setup.regions[i].file) {
            link.className = "dropdown_selected";
        }
        link.onclick = function(j) {
            return function() {
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


var Setup = function(data) {
    this.languages = data.languages;
    this.setupLanguage();

    this.regions = data.regions;
    this.setupRegions();

    this.labels = data.labels;
    this.types = data.types;
};

Setup.prototype.setupLanguage = function() {
    this.languageFile = this.languages[0].file;
    //localStorage.clear();
    if (localStorage.languageFile) {
        this.languageFile = localStorage.languageFile;
    } else {
        var language_code = window.navigator.language;
        for (var i = 0; i < this.languages.length; i++) {
            if (this.languages[i].file == language_code + ".json") {
                this.languageFile = this.languages[i].file;
                break;
            }
        }
    }
};

Setup.prototype.setLanguage = function(lang) {
    console.log("set lang " + lang);
    this.languageFile = lang;
    localStorage.languageFile = this.languageFile;
    loadFiles();
};

Setup.prototype.setupRegions = function() {
    this.regionFile = this.regions[0].file;
    if (localStorage.regionFile) {
        this.regionFile = localStorage.regionFile;
    }
};

Setup.prototype.setRegion = function(reg) {
    this.regionFile = reg;
    localStorage.regionFile = this.regionFile;
    loadFiles();
};

var Data = function() {
    this.data = data;
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

Data.prototype.isValid = function(index, month, label, type) {
    return setup.labels[this.data[index].jahr[month]] == label &&
        data.types[
            this.data[
                index].name] == type;
};

Data.prototype.createRows = function() {
    this.rows = new Array(this.data.length);
    for (var i = 0; i < this.data.length; i++) {
        var row = document.createElement("tr");
        var nameCell = document.createElement("td");
        nameCell.className = "name";
        nameCell.appendChild(document.createTextNode(getName(this.data[
            i])));
        row.appendChild(nameCell);
        for (var j = 0; j < this.data[i].jahr.length; j++) {
            var cell = document.createElement("td");
            var div = document.createElement("div");
            div.className = "overview_elem " + setup.labels[this.data[
                i].jahr[
                j]];
            cell.appendChild(div);
            row.appendChild(cell);
        }
        this.rows[i] = row;
    }
};

var Table = function(label) {
    this.label = label;
    this.container = document.getElementById(label);
    clearElement(this.container);
    this.bodies = new Array(setup.types.length);

    var header = document.createElement("h2");
    header.appendChild(document.createTextNode(strings.content_titles[
        label]));
    this.container.appendChild(header);

    var table = document.createElement("table");
    table.className = "list";

    for (var t = 0; t < setup.types.length; t++) {
        var tHead = document.createElement("thead");
        var tBody = document.createElement("tbody");
        table.appendChild(tHead);
        table.appendChild(tBody);
        this.drawTableHeader(tHead, setup.types[t]);
        this.bodies[t] = tBody;
    }
    this.container.appendChild(table);
    this.bars = new Bars(this);
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
    for (var t = 0; t < setup.types.length; t++) {
        clearElement(this.bodies[t]);
        var frag = document.createDocumentFragment();
        for (var i = 0; i < data.data.length; i++) {
            if (data.isValid(i, index, this.label, t)) {
                frag.appendChild(data.rows[i]);
            }
        }
        this.bodies[t].appendChild(frag);
    }
    this.bars.updateBars();
};

var Bars = function(table) {
    this.table = table;
    this.bars = new Array(table.bodies.length);

    for (var t = 0; t < this.table.bodies.length; t++) {
        this.bars[t] = document.createElement("div");
        this.bars[t].className = "current_bar";
        this.table.container.appendChild(this.bars[t]);
        this.addDraggable(this.bars[t]);
    }
};

Bars.prototype.addDraggable = function(domBar) {
    var bar = $(domBar);
    var left = bar.parent().offset().left + $(".name").outerWidth() - 1;
    var right = bar.parent().offset().left + bar.parent().width() - bar
        .outerWidth() -
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
            var new_index = Math.floor((bar_pos - left) *
                24 /
                width);
            if (new_index != index) {
                index = new_index;
                setTimeout(function() {
                    if (index == new_index) {
                        updateLists();
                    }
                }, 150);
            }
            updateBars();
        },
        stop: function() {
            dragged = false;
            updateBars();
        }
    });
}

Bars.prototype.updateBars = function() {
    for (var t = 0; t < this.table.bodies.length; t++) {
        var bar = this.bars[t];
        var body = this.table.bodies[t];
        bar.style.marginTop = body.marginTop;
        bar.style.height = body.height;
    }
};

function updateBars() { 
    seasonTable.bars.updateBars();
    houseTable.bars.updateBars();
    storeTable.bars.updateBars();
    notTable.bars.updateBars();

}