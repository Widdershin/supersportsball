interface Vector {
  x: number,
  y: number
}

function add (a: Vector, b: Vector): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}

function add (a: Vector, b: Vector | null): Vector {
  return {
    x: a.x + b.x,
    y: a.y + b.y
  };
}


function subtract (a: Vector, b: Vector): Vector {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function isVector(n: Vector | number): n is Vector {
  return typeof n !== 'number';
}

function multiply (v: Vector, n: Vector | number): Vector {
  if (isVector(n)) {
    return {
      x: v.x * n.x,
      y: v.y * n.y
    };
  } else {
    return {
      x: v.x * n,
      y: v.y * n
    };
  }
}

function multiply (v: Vector, v: number): Vector {
  return {
    x: v.x * n,
    y: v.y * n
  };
}

function normalize (v: Vector): Vector {
  const {x, y} = v;

  const l = length(v);

  if (l === 0) {
    return {x: 0, y: 0};
  }

  return {
    x: x / l,
    y: y / l
  };
}

function length (v: Vector): number {
  const {x, y} = v;

  return Math.abs(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
}


export {
  Vector,
  add,
  subtract,
  multiply,
  length,
  normalize
}
