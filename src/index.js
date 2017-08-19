"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var run_1 = require("@cycle/run");
var dom_1 = require("@cycle/dom");
var time_1 = require("@cycle/time");
var xstream_1 = require("xstream");
var TILE_SIZE = 48; // px
var level = "\n*****************************\n*                           *\n*                           *\n*          ******           *\n*                           *\n******                 ******\n*                           *\n*          ******           *\n*                           *\n*    *****        *****     *\n*                           *\n* 1           o          2  *\n*****************************\n";
function loadLevel(levelString) {
    var players = [];
    var ball = { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } };
    var level = levelString.split('\n').map(function (line, row) {
        return line.split('').map(function (character, column) {
            var position = { y: row * TILE_SIZE, x: column * TILE_SIZE };
            if (character === '1') {
                players.push({
                    id: Math.random().toString(),
                    name: 'Player 1',
                    position: position,
                    velocity: { x: 0, y: 0 },
                    color: 'blue'
                });
            }
            if (character === '2') {
                players.push({
                    id: Math.random().toString(),
                    name: 'Player 2',
                    position: position,
                    velocity: { x: 0, y: 0 },
                    color: 'red'
                });
            }
            if (character === 'o') {
                ball = {
                    position: position,
                    velocity: { x: 0, y: 0 }
                };
            }
            return {
                position: position,
                solid: character === '*'
            };
        });
    });
    return {
        level: level,
        players: players,
        ball: ball
    };
}
function flatten(array) {
    return array.reduce(function (acc, val) { return acc.concat(val); }, []);
}
function renderTile(tile) {
    return dom_1.h('rect', {
        attrs: {
            x: tile.position.x,
            y: tile.position.y,
            width: TILE_SIZE,
            height: TILE_SIZE,
            fill: tile.solid ? 'black' : 'white'
        }
    });
}
function renderPlayer(player) {
    return dom_1.h('rect', {
        attrs: {
            x: player.position.x,
            y: player.position.y,
            width: TILE_SIZE / 1.5,
            height: TILE_SIZE * 0.9,
            rx: 10,
            ry: 10,
            fill: player.color
        }
    });
}
function renderBall(ball) {
    return dom_1.h('circle', {
        attrs: {
            cx: ball.position.x,
            cy: ball.position.y,
            r: TILE_SIZE / 3,
            fill: 'gray'
        }
    });
}
function view(state) {
    return dom_1.h('svg', { attrs: { width: window.innerWidth, height: window.innerHeight } }, flatten(state.level.map(function (row) { return row.map(renderTile); })).concat(state.players.map(renderPlayer), [
        renderBall(state.ball)
    ]));
}
function main(sources) {
    var initialState = loadLevel(level);
    var state$ = xstream_1.default.of(initialState);
    return {
        DOM: state$.map(view)
    };
}
var drivers = {
    DOM: dom_1.makeDOMDriver(document.body),
    Time: time_1.timeDriver
};
run_1.run(main, drivers);
