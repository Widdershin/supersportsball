import { run } from '@cycle/run';
import { makeDOMDriver, h, DOMSource, VNode } from '@cycle/dom';
import { timeDriver, TimeSource } from '@cycle/time';
import xs, { Stream } from 'xstream';

const TILE_SIZE = 48; // px

interface ISources {
  DOM: DOMSource;
  Time: TimeSource;
}

interface ISinks {
  DOM: Stream<VNode>;
}

// we want a world, a 2d platformer, with solid tiles and players that can jump and move around
//
// let's start by defining the level

interface Tile {
  solid: boolean;
  position: Vector;
}

type Level = Tile[][];

interface Vector {
  x: number;
  y: number;
}

interface Player {
  id: string;
  name: string;
  position: Vector;
  velocity: Vector;
  color: string;
}

interface Ball {
  position: Vector;
  velocity: Vector;
}

interface GameState {
  level: Level;
  players: Player[];
  ball: Ball;
}

const level = `
*****************************
*                           *
*                           *
*          ******           *
*                           *
******                 ******
*                           *
*          ******           *
*                           *
*    *****        *****     *
*                           *
* 1           o          2  *
*****************************
`;

function loadLevel(levelString: string): GameState {
  const players: Player[] = [];
  let ball: Ball = { position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } };

  const level = levelString.split('\n').map((line, row) =>
    line.split('').map((character, column) => {
      const position = { y: row * TILE_SIZE, x: column * TILE_SIZE };

      if (character === '1') {
        players.push({
          id: Math.random().toString(),
          name: 'Player 1',
          position,
          velocity: { x: 0, y: 0 },
          color: 'blue'
        });
      }

      if (character === '2') {
        players.push({
          id: Math.random().toString(),
          name: 'Player 2',
          position,
          velocity: { x: 0, y: 0 },
          color: 'red'
        });
      }

      if (character === 'o') {
        ball = {
          position,
          velocity: { x: 0, y: 0 }
        };
      }

      return {
        position,
        solid: character === '*'
      };
    })
  );

  return {
    level,
    players,
    ball
  };
}

function flatten<T>(array: T[][]): T[] {
  return array.reduce((acc, val) => acc.concat(val), []);
}

function renderTile(tile: Tile): VNode {
  return h('rect', {
    attrs: {
      x: tile.position.x,
      y: tile.position.y,

      width: TILE_SIZE,
      height: TILE_SIZE,

      fill: tile.solid ? 'black' : 'white'
    }
  });
}

function renderPlayer(player: Player): VNode {
  return h('rect', {
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

function renderBall(ball: Ball): VNode {
  return h('circle', {
    attrs: {
      cx: ball.position.x,
      cy: ball.position.y,

      r: TILE_SIZE / 3,

      fill: 'gray'
    }
  });
}

function view(state: GameState): VNode {
  return h(
    'svg',
    { attrs: { width: window.innerWidth, height: window.innerHeight } },
    [
      ...flatten(state.level.map(row => row.map(renderTile))),
      ...state.players.map(renderPlayer),
      renderBall(state.ball)
    ]
  );
}

function main(sources: ISources): ISinks {
  const initialState = loadLevel(level);

  const state$ = xs.of(initialState);

  return {
    DOM: state$.map(view)
  };
}

const drivers = {
  DOM: makeDOMDriver(document.body),
  Time: timeDriver
};

run(main, drivers);
