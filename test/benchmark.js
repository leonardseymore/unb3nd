/**
 * @fileOverview Benchmarking bed
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>
 * @since 0.0.0.4
 */

"use strict";

/**
 * VECTOR2 IN HIGH PERFORMANCE MATHS
 */

/**
 * @class Observable value that can be bound to
 * @constructor
 * @extend Observable
 * @since 0.0.0.4
 */
function ObservableValue(defaultValue) {

  /**
   * Value that can be watched
   * @field
   * @type Object
   * @default undefined
   * @since 0.0.0.4
   */
  this.value = defaultValue;

  /**
   * Sets the value and dispaches a "change" event if the value changed
   * @function
   * @param {Object} value The value to use
   * @returns {void}
   * @since 0.0.0.4
   */
  this.setValue = function(value) {
    if (this.value != value) {
      this.value = value;
      this.dispatchEvent("change");
    }
  };
}
ObservableValue.prototype = new Observable();

/**
 * @class A single benchmark descriptor
 * @constructor
 * @since 0.0.0.4
 */
function Benchmark(operation, detail, exec) {

  /**
   * Descriptive name of the benchmark
   * @field
   * @type String
   * @default undefined
   * @since 0.0.0.4
   */
  this.operation = operation;

  /**
   * Details of the benchmark
   * @field
   * @type String
   * @default undefined
   * @since 0.0.0.4
   */
  this.detail = detail;

  /**
   * Bindable last result
   * @field
   * @type Object
   * @default undefined
   * @since 0.0.0.4
   */
  this.lastResult = new ObservableValue(0);

  /**
   * Actual benchmark code to run
   * @field
   * @type Function
   * @default undefined
   * @since 0.0.0.4
   */
  this.exec = exec;

  /**
   * Kicks off the process and sets the lastResult field
   * @function
   * @returns {void}
   * @since 0.0.0.4
   */
  this.runExec = function() {
    var execTime = this.exec();
    this.lastResult.setValue(execTime);
  }
}

/**
 * Maths vector2 operations benchmarks
 */
var fastV2Benchmark = [
  new Benchmark("Create", "1m Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      while (i--) {
        math.v2.create();
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Create Template", "1m Templated Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      var template = [0, 0];
      while (i--) {
        math.v2.create(template);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Add", "1m Additions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.add(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Add Mutate", "1m Mutation Additions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.addMutate(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Sub", "1m Subtractions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.sub(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Sub Mutate", "1m Subtraction Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.subMutate(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Invert", "1m Inversions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.inverse(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Invert Mutate", "1m Inversion Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.inverseMutate(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Scalar Multiply", "1m Scalar Multiplications", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var s = 0;
      while (i--) {
        math.v2.multScalar(v1, s);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Scalar Multiply Mutate", "1m Scalar Multiplication Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var s = 0;
      while (i--) {
        math.v2.multScalarMutate(v1, s);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Dot Product", "1m Dot Products", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.dotProduct(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Vector Product", "1m Vector Products", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.vectorProduct(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Magnitude", "1m Get Magnitudes", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.getMagnitude(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Magnitude Squared", "1m Get Magnitudes Squared", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.getMagnitudeSquare(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Normalize", "1m Normalizations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.normalize(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Normalize Mutate", "1m Mutation Normalizations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.normalizeMutate(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Zero Mutate", "1m Zero Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      while (i--) {
        math.v2.zeroMutate(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Angle", "1m Get Angles", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.getAngle(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Distance", "1m Get Distances", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.getDistance(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Distance Squared", "1m Get Distances Squared", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      while (i--) {
        math.v2.getDistanceSquare(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Is Within", "1m Is Withins", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      var distance = 0;
      while (i--) {
        math.v2.isWithin(v1, v2, distance);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Is Strictly Within", "1m Is Strictly Withins", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v2.create();
      var v2 = math.v2.create();
      var distance = 0;
      while (i--) {
        math.v2.isWithinStrict(v1, v2, distance);
      } // while
      return getTime() - startTime + " ms";
    }
  )
];

/**
 * Maths vector3 operations benchmarks
 */
var fastV3Benchmark = [
  new Benchmark("Create", "1m Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      while (i--) {
        math.v3.create();
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Create Template", "1m Templated Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      var template = [0, 0, 0];
      while (i--) {
        math.v3.create(template);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Add", "1m Additions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.add(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Add Mutate", "1m Mutation Additions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.addMutate(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Sub", "1m Subtractions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.sub(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Sub Mutate", "1m Subtraction Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.subMutate(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Invert", "1m Inversions", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.inverse(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Invert Mutate", "1m Inversion Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.inverseMutate(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Scalar Multiply", "1m Scalar Multiplications", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var s = 0;
      while (i--) {
        math.v3.multScalar(v1, s);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Scalar Multiply Mutate", "1m Scalar Multiplication Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var s = 0;
      while (i--) {
        math.v3.multScalarMutate(v1, s);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Dot Product", "1m Dot Products", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.dotProduct(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Vector Product", "1m Vector Products", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.vectorProduct(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Magnitude", "1m Get Magnitudes", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.getMagnitude(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Magnitude Squared", "1m Get Magnitudes Squared", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.getMagnitudeSquare(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Normalize", "1m Normalizations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.normalize(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Normalize Mutate", "1m Mutation Normalizations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.normalizeMutate(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Zero Mutate", "1m Zero Mutations", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      while (i--) {
        math.v3.zeroMutate(v1);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Angle", "1m Get Angles", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.getAngle(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Distance", "1m Get Distances", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.getDistance(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Distance Squared", "1m Get Distances Squared", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      while (i--) {
        math.v3.getDistanceSquare(v1, v2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Is Within", "1m Is Withins", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      var distance = 0;
      while (i--) {
        math.v3.isWithin(v1, v2, distance);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Is Strictly Within", "1m Is Strictly Withins", function() {
      var startTime = getTime();
      var i = 1000000;
      var v1 = math.v3.create();
      var v2 = math.v3.create();
      var distance = 0;
      while (i--) {
        math.v3.isWithinStrict(v1, v2, distance);
      } // while
      return getTime() - startTime + " ms";
    }
  )
];

/**
 * Maths matrix2 operations benchmarks
 */
var fastM2Benchmark = [
  new Benchmark("Create", "1m Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      while (i--) {
        math.m2.create();
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Create Template", "1m Templated Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      var template = [0, 0, 0, 0];
      while (i--) {
        math.m2.create(template);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Create Identity", "1m Identity Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      while (i--) {
        math.m2.createIdentity();
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Create Rotation", "1m Rotation Creations", function() {
      var startTime = getTime();
      var i = 1000000;
      var theta = 0;
      while (i--) {
        math.m2.createRotation(theta);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Determinant", "1m Get Determinants", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      while (i--) {
        math.m2.getDeterminant(m);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Is Invertable", "1m Is Invertables", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      while (i--) {
        math.m2.isInvertable(m);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Is Singular", "1m Is Singular", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      while (i--) {
        math.m2.isSingular(m);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Inverse (Singular)", "1m Get Inverses", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      if (!math.m2.isSingular(m)) {
        return "Error: Benchmark requires Singular Matrix";
      } // if

      while (i--) {
        math.m2.getInverse(m);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Inverse (Invertable)", "1m Get Inverses", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.createIdentity();
      if (!math.m2.isInvertable(m)) {
        return "Error: Benchmark requires Invertable Matrix";
      } // if

      while (i--) {
        math.m2.getInverse(m);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Multiply Vector", "1m Vector Multiplications", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      var v = math.v2.create();
      while (i--) {
        math.m2.multVector(m ,v);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Multiply Vector Mutate", "1m Vector Mutation Multiplications", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      var v = math.v2.create();
      while (i--) {
        math.m2.multVectorMutate(m ,v);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Multiply Matrix", "1m Matrix Multiplications", function() {
      var startTime = getTime();
      var i = 1000000;
      var m1 = math.m2.create();
      var m2 = math.m2.create();
      while (i--) {
        math.m2.mult(m1 ,m2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Add", "1m Additions", function() {
      var startTime = getTime();
      var i = 1000000;
      var m1 = math.m2.create();
      var m2 = math.m2.create();
      while (i--) {
        math.m2.add(m1 ,m2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Add Mutate", "1m Mutation Additions", function() {
      var startTime = getTime();
      var i = 1000000;
      var m1 = math.m2.create();
      var m2 = math.m2.create();
      while (i--) {
        math.m2.addMutate(m1 ,m2);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Get Entry", "1m Get Entries", function() {
      var startTime = getTime();
      var i = 1000000;
      var m = math.m2.create();
      while (i--) {
        math.m2.getEntry(0, 0);
      } // while
      return getTime() - startTime + " ms";
    }
  ),
  new Benchmark("Equals", "1m Equals", function() {
      var startTime = getTime();
      var i = 1000000;
      var m1 = math.m2.create();
      var m2 = math.m2.create();
      while (i--) {
        math.m2.equals(m1, m2);
      } // while
      return getTime() - startTime + " ms";
    }
  )
];

/**
 * Run a specific set of benchmarks
 * @param {Array} benchmarks The set of benchmarks to run
 */
function runBenchmarks(benchmarks) {
  var i = benchmarks.length;
  while (i--) {
    var benchmark = benchmarks[i];
    benchmark.runExec();
  } // for
}

/**
 * Generate a GUI for the supplied benchmarks
 * @param {Array} benchmarks The set of benchmarks to generate a GUI for
 */
function generateBenchmarksUI(benchmarks, title) {
  // HEADER
  var tblBenchmarks = document.createElement("table");
  document.getElementsByTagName("body")[0].appendChild(tblBenchmarks);
  var caption = document.createElement("caption");
  tblBenchmarks.appendChild(caption);
  caption.appendChild(document.createTextNode(title));

  var thead = document.createElement("thead");
  tblBenchmarks.appendChild(thead);

  var thOperation = document.createElement("th");
  thead.appendChild(thOperation);
  thOperation.appendChild(document.createTextNode("Operation"));

  var thDetail = document.createElement("th");
  thead.appendChild(thDetail);
  thDetail.appendChild(document.createTextNode("Detail"));

  var thResult = document.createElement("th");
  thead.appendChild(thResult);
  thResult.appendChild(document.createTextNode("Result"));

  var thControls = document.createElement("th");
  thead.appendChild(thControls);

  var btnRunBenchmarks = document.createElement("button");
  thControls.appendChild(btnRunBenchmarks);
  btnRunBenchmarks.appendChild(document.createTextNode("Run Group"));
  btnRunBenchmarks.onclick = function() {
    runBenchmarks(benchmarks);
  };

  // BODY
  var tbody = document.createElement("tbody");
  tblBenchmarks.appendChild(tbody);
  var numBenchmarks = benchmarks.length;
  for (var i = 0; i < numBenchmarks; i++) {
    (function() {
      var benchmark = benchmarks[i];
      var tr = document.createElement("tr");
      tbody.appendChild(tr);

      var tdOperation = document.createElement("td");
      tr.appendChild(tdOperation);
      tdOperation.appendChild(
        document.createTextNode(benchmark.operation)
      );

      var tdDetail = document.createElement("td");
      tr.appendChild(tdDetail);
      tdDetail.appendChild(
        document.createTextNode(benchmark.detail)
      );

      var tdExec = document.createElement("td");
      tr.appendChild(tdExec);
      var tdExecData = document.createTextNode();
      tdExec.appendChild(tdExecData);
      bind("change", tdExecData, "data", benchmark.lastResult, "value");

      var tdRun = document.createElement("td");
      tr.appendChild(tdRun);
      var btnRun = document.createElement("button");
      btnRun.appendChild(document.createTextNode("Run"));
      tdRun.appendChild(btnRun);
      btnRun.onclick = function() {
        benchmark.runExec();
      };
    })();
  } // for
}

/**
 * Create UI for each benchmark
 */
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    generateBenchmarksUI(fastV2Benchmark, "Fast 2-Dimensional Vector Operations");
    generateBenchmarksUI(fastV3Benchmark, "Fast 3-Dimensional Vector Operations");
    generateBenchmarksUI(fastM2Benchmark, "Fast 2-Dimensional Matrix Operations");
  } // if
};