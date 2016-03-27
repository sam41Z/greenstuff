/**
 * Created by samuel on 26.03.16.
 */

var Table = function(label) {
    this.label = label;
    this.container = document.getElementById(label);
    clearElement(this.container);
    this.bodies = new Array(setup.types.length);

    var header = document.createElement('h2');
    header.appendChild(document.createTextNode(strings.content_titles[
        label]));
    this.container.appendChild(header);

    var table = document.createElement('table');
    table.className = 'list';

    for (var t = 0; t < setup.types.length; t++) {
        var tHead = document.createElement('thead');
        var tBody = document.createElement('tbody');
        table.appendChild(tHead);
        table.appendChild(tBody);
        this.drawTableHeader(tHead, setup.types[t]);
        this.bodies[t] = tBody;
        new Bar(this, tBody);
    }
    this.container.appendChild(table);
};

Table.prototype.drawTableHeader = function(tHead, type) {
    var typeHeader = document.createElement('tr');
    typeHeader.classNamen = 'type_header';
    var typeCell = document.createElement('td');
    typeCell.className = 'type_' + type;
    typeCell.colSpan = '100%';

    var title = document.createElement('h3');
    title.appendChild(document.createTextNode(strings.types[type]));
    typeCell.appendChild(title);
    typeHeader.appendChild(typeCell);

    var tableHeader = document.createElement('tr');
    tableHeader.className = 'table_header';
    tableHeader.appendChild(document.createElement('td'));
    for (var i = 0; i < strings.months.length; i++) {
        var cell = document.createElement('td');
        cell.colSpan = '2';
        cell.appendChild(document.createTextNode(strings.months[i]));
        if (i == date.getMonth()) {
            cell.className = 'current';
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
    updateBars();
};