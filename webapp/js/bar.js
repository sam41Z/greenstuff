/**
 *
 * Created by samuel on 26.03.16.
 */


var Bar = function(table, body) {
    this.body = body;
    this.bar = document.createElement('div');
    this.bar.className = 'current_bar';
    table.container.appendChild(this.bar);
    this.addDraggable();
    bars.push(this);
};

var scrollOffset;

Bar.prototype.addDraggable = function() {
    var $bar = $(this.bar);
    $bar.draggable({
        axis: 'x',
        cursor: 'move',
        start: function(event, ui) {
            dragged = true;
            scrollOffset = ui.helper.offset().top - $(document)
                    .scrollTop();
        },
        drag: function(event, ui) {
            if (ui.offset.left < barLeft) {
                ui.position.left = barLeft;
            }
            if (ui.offset.left > barRight) {
                ui.position.left = barRight;
            }
            bar_pos = ui.position.left;
            var new_index = Math.floor((bar_pos - barLeft) * 24 /
                (barRight - barLeft + 1));
            if (new_index != index) {
                index = new_index;
                setTimeout(function() {
                    if (index == new_index && !updatingLists) {
                        updateLists();
                        $(document).scrollTop(ui.helper
                        .offset().top -
                        scrollOffset);
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
};

