'use strict';

var Task = require('../../src/js/wysiwygCommands/task'),
    WwTaskManager = require('../../src/js/wwTaskManager'),
    WysiwygEditor = require('../../src/js/wysiwygEditor'),
    EventManager = require('../../src/js/eventManager');

describe('Task', function() {
    var wwe, sq;

    beforeEach(function(done) {
        var $container = $('<div />');

        $('body').append($container);

        wwe = new WysiwygEditor($container, null, new EventManager());

        wwe.init(function() {
            sq = wwe.getEditor();
            wwe.addManager(WwTaskManager);
            done();
        });
    });

    //we need to wait squire input event process
    afterEach(function(done) {
        setTimeout(function() {
            $('body').empty();
            done();
        });
    });

    it('add Task', function() {
        Task.exec(wwe);

        expect(sq.getHTML().replace(/<br>/g, '')).toEqual('<ul><li class="task-list-item"><div><input type="checkbox"> </div></li></ul><div></div>');
    });

    it('if already in empty task, dont do anything', function() {
        sq.setHTML('<ul><li class="task-list-item"><input type="checkbox"></li></ul>');
        Task.exec(wwe);

        expect(wwe.get$Body().find('li').length).toEqual(1);
        expect(wwe.get$Body().find('input').length).toEqual(1);
        expect(wwe.get$Body().find('li').hasClass('task-list-item')).toEqual(true);
    });

    it('add input too if there is nested task list', function() {
        var range = sq.getSelection().cloneRange();

        sq.setHTML('<ul><li><div><br></div><ul><li><input type="checkbox"></li></ul>');

        range.setStart(wwe.get$Body().find('div')[0], 0);
        range.collapse(true);

        sq.setSelection(range);

        Task.exec(wwe);

        expect(wwe.get$Body().find('input').length).toEqual(2);
        expect(wwe.get$Body().find('div').eq(0).find('input').length).toEqual(1);
    });
});
