/**
 * @fileOverview Benchmarking bed
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.4
 */

"use strict";

/**
 * VECTOR2 IN MATHS
 */

function slowV2Create() {
  console.log("Starting old vector2 creation benchmark");
  var startTime = getTime();
  var i = 1000000;
  while (i--) {
    new Vector2();
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 creation took %d ms", totalTime);
  document.getElementById("lblSlowV2Create").innerText = totalTime + " ms";
}

function slowV2Add() {
  console.log("Starting old vector2 addition benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var v2 = new Vector2();
  while (i--) {
    v1.add(v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 additions took %d ms", totalTime);
  document.getElementById("lblSlowV2Add").innerText = totalTime + " ms";
}

function slowV2AddMutate() {
  console.log("Starting old vector2 addition mutate benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var v2 = new Vector2();
  while (i--) {
    v1.addMutate(v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 mutation additions took %d ms", totalTime);
  document.getElementById("lblSlowV2AddMutate").innerText = totalTime + " ms";
}

function slowV2Sub() {
  console.log("Starting old vector2 subtraction benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var v2 = new Vector2();
  while (i--) {
    v1.sub(v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 subtractions took %d ms", totalTime);
  document.getElementById("lblSlowV2Sub").innerText = totalTime + " ms";
}

function slowV2SubMutate() {
  console.log("Starting old vector2 subtraction mutate benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var v2 = new Vector2();
  while (i--) {
    v1.subMutate(v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 mutation subtractions took %d ms", totalTime);
  document.getElementById("lblSlowV2SubMutate").innerText = totalTime + " ms";
}

function slowV2Inverse() {
  console.log("Starting old vector2 inverse benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  while (i--) {
    v1.inverse();
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 inverse took %d ms", totalTime);
  document.getElementById("lblSlowV2Inverse").innerText = totalTime + " ms";
}

function slowV2InverseMutate() {
  console.log("Starting old vector2 inversion mutation benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  while (i--) {
    v1.inverseMutate();
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 mutation inversions took %d ms", totalTime);
  document.getElementById("lblSlowV2InverseMutate").innerText = totalTime + " ms";
}

function slowV2MultScalar() {
  console.log("Starting old vector2 scalar multiplication benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var s = 0;
  while (i--) {
    v1.multScalar(s);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 scalar multiplications took %d ms", totalTime);
  document.getElementById("lblSlowV2MultScalar").innerText = totalTime + " ms";
}

function slowV2MultScalarMutate() {
  console.log("Starting old vector2 mutation scalar multiplications benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var s = 0;
  while (i--) {
    v1.multScalarMutate(s);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 mutation scalar multiplications took %d ms", totalTime);
  document.getElementById("lblSlowV2MultScalarMutate").innerText = totalTime + " ms";
}

function slowV2DotProduct() {
  console.log("Starting old vector2 dot product benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = new Vector2();
  var v2 = new Vector2();
  while (i--) {
    v1.dotProduct(v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m old vector2 dot products took %d ms", totalTime);
  document.getElementById("lblSlowV2DotProduct").innerText = totalTime + " ms";
}

function slowV2Tests() {
  slowV2Create();
  slowV2Add();
  slowV2AddMutate();
  slowV2Sub();
  slowV2SubMutate();
  slowV2Inverse();
  slowV2InverseMutate();
  slowV2MultScalar();
  slowV2MultScalarMutate();
  slowV2DotProduct();
}

/**
 * VECTOR2 IN HIGH PERFORMANCE MATHS
 */

function fastV2Create() {
  console.log("Starting high performance vector2 addition benchmark");
  var startTime = getTime();
  var i = 1000000;
  while (i--) {
    math.m2.create();
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 creations took %d ms", totalTime);
  document.getElementById("lblFastV2Create").innerText = totalTime + " ms";
}

function fastV2Add() {
  console.log("Starting fast vector2 addition benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  var v2 = math.m2.create();
  while (i--) {
    math.v2.add(v1, v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 additions took %d ms", totalTime);
  document.getElementById("lblFastV2Add").innerText = totalTime + " ms";
}

function fastV2AddMutate() {
  console.log("Starting fast vector2 addition mutation benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  var v2 = math.m2.create();
  while (i--) {
    math.v2.addMutate(v1, v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 mutation additions took %d ms", totalTime);
  document.getElementById("lblFastV2AddMutate").innerText = totalTime + " ms";
}

function fastV2Sub() {
  console.log("Starting fast vector2 subtractions benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  var v2 = math.m2.create();
  while (i--) {
    math.v2.sub(v1, v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 subtractions took %d ms", totalTime);
  document.getElementById("lblFastV2Sub").innerText = totalTime + " ms";
}

function fastV2SubMutate() {
  console.log("Starting fast vector2 subtraction mutation benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  var v2 = math.m2.create();
  while (i--) {
    math.v2.subMutate(v1, v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 mutation subtractions took %d ms", totalTime);
  document.getElementById("lblFastV2SubMutate").innerText = totalTime + " ms";
}

function fastV2Inverse() {
  console.log("Starting fast vector2 inversion benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  while (i--) {
    math.v2.inverse(v1);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 inversions took %d ms", totalTime);
  document.getElementById("lblFastV2Inverse").innerText = totalTime + " ms";
}

function fastV2InverseMutate() {
  console.log("Starting fast vector2 inversion mutation benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  while (i--) {
    math.v2.inverseMutate(v1);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 mutation inversions took %d ms", totalTime);
  document.getElementById("lblFastV2InverseMutate").innerText = totalTime + " ms";
}

function fastV2MultScalar() {
  console.log("Starting fast vector2 scalar multiplication benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.v2.create();
  var s = 0;
  while (i--) {
    math.v2.multScalar(v1, s);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 scalar multiplications took %d ms", totalTime);
  document.getElementById("lblFastV2MultScalar").innerText = totalTime + " ms";
}

function fastV2MultScalarMutate() {
  console.log("Starting fast vector2 mutation scalar multiplications benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.m2.create();
  var s = 0;
  while (i--) {
    math.v2.multScalarMutate(v1, s);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 mutation scalar multiplications took %d ms", totalTime);
  document.getElementById("lblFastV2MultScalarMutate").innerText = totalTime + " ms";
}

function fastV2DotProduct() {
  console.log("Starting fast vector2 dot product benchmark");
  var startTime = getTime();
  var i = 1000000;
  var v1 = math.v2.create();
  var v2 = math.v2.create();
  while (i--) {
    math.v2.dotProduct(v1, v2);
  } // while
  var totalTime = getTime() - startTime;
  console.log("1m fast vector2 dot products took %d ms", totalTime);
  document.getElementById("lblFastV2DotProduct").innerText = totalTime + " ms";
}

function fastV2Tests() {
  fastV2Create();
  fastV2Add();
  fastV2AddMutate();
  fastV2Sub();
  fastV2SubMutate();
  fastV2Inverse();
  fastV2InverseMutate();
  fastV2MultScalar();
  fastV2MultScalarMutate();
  fastV2DotProduct();
}

function allTests() {
  slowV2Tests();
  fastV2Tests();
}