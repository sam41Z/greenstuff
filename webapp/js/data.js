/**
 * Created by samuel on 26.03.16.
 */

var Data = function () {
    this.data = data;
};

Data.prototype.setData = function (data) {
    this.data = data;
    this.data.sort(function (a, b) {
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

Data.prototype.setTypes = function (types) {
    this.types = types;
};

Data.prototype.isValid = function (index, month, label, type) {
    return setup.labels[this.data[index].jahr[month]] == label &&
        data.types[
            this.data[
                index].name] == type;
};

Data.prototype.createRows = function () {
    this.rows = new Array(this.data.length);
    for (var i = 0; i < this.data.length; i++) {
        var row = document.createElement('tr');
        var nameCell = document.createElement('td');
        nameCell.className = 'name';
        nameCell.appendChild(document.createTextNode(getName(this.data[
            i])));
        row.appendChild(nameCell);
        for (var j = 0; j < this.data[i].jahr.length; j++) {
            var cell = document.createElement('td');
            var div = document.createElement('div');
            div.className = 'overview_elem ' + setup.labels[this.data[i].jahr[j]];
            cell.appendChild(div);
            row.appendChild(cell);
        }
        this.rows[i] = row;
    }
};