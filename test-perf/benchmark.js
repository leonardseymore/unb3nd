/**
 * @fileOverview Benchmarking bed
 * @author <a href="mailto:leonardseymore@gmail.com">Leonard Seymore</a>

 */

"use strict";

/**
 * VECTOR2 IN HIGH PERFORMANCE MATHS
 */

/**
 * @class Observable value that can be bound to
 * @constructor
 * @extend Observable

 */
function ObservableValue(defaultValue) {

  /**
   * Value that can be watched
   * @field
   * @type Object
   * @default undefined

   */
  this.value = defaultValue;

  /**
   * Sets the value and dispaches a "change" event if the value changed
   * @function
   * @param {Object} value The value to use
   * @returns {void}

   */
  this.setValue = function (value) {
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
 * @param {String} name Name of the benchmark
 * @param {Function} func The function to execute
 * @param {Array} args The arguments to use

 */
function Benchmark(name, func, args) {

  /**
   * Descriptive name of the benchmark
   * @field
   * @type String
   * @default undefined

   */
  this.name = name;

  /**
   * Bindable last result
   * @field
   * @type Object
   * @default undefined

   */
  this.lastResult = new ObservableValue(0);

  /**
   * Actual benchmark code to run
   * @field
   * @type Function
   * @default undefined

   */
  this.func = func;

  /**
   * Arguments to pass into the function
   * @field
   * @type Array
   * @default undefined

   */
  this.args = args;

  /**
   * Kicks off the process and sets the lastResult field
   * @function
   * @returns {Number} Operations per interval

   */
  this.runExec = function () {
    var startTime = getTime();
    var timeElapsed = 0;
    var ops = 0;
    while (timeElapsed < 1000) {
      this.func.apply(undefined, this.args);
      ops += 1;
      timeElapsed = getTime() - startTime;
    } // while
    this.lastResult.setValue(ops);
    return ops;
  }
}

/**
 * @class A group of related benchmarks
 * @constructor
 * @param {String} name Name of the benchmark group
 * @param {Array} benchmarks The benchmarks belonging to this group

 */
function BenchmarkGroup(name, benchmarks) {

  /**
   * Descriptive name of the benchmark
   * @field
   * @type String
   * @default undefined

   */
  this.name = name;

  /**
   * Arguments to pass into the function
   * @field
   * @type Array
   * @default undefined

   */
  this.benchmarks = benchmarks;

  /**
   * Bindable last result
   * @field
   * @type Object
   * @default undefined

   */
  this.min = new ObservableValue(0);

  /**
   * Bindable last result
   * @field
   * @type Object
   * @default undefined

   */
  this.max = new ObservableValue(0);

  /**
   * Runs all benchmarks in this group
   * @function
   * @returns {void}

   */
  this.runBenchmarks = function () {
    var benchmarks = this.benchmarks;
    var i = benchmarks.length;

    var max = 0;
    while (i--) {
      var benchmark = benchmarks[i];
      var ops = benchmark.runExec();
      if (ops > max) {
        max = ops;
      } // if
    } // for
    this.max.setValue(max);
  }
}

/**
 * Generate a GUI for the supplied benchmarks
 * @param {Array} benchmarks The set of benchmarks to generate a GUI for
 */
function generateBenchmarksUI(benchmarkGroup, title) {
  // HEADER
  var tblBenchmarks = document.createElement("table");
  document.getElementsByTagName("body")[0].appendChild(tblBenchmarks);
  var caption = document.createElement("caption");
  tblBenchmarks.appendChild(caption);
  caption.appendChild(document.createTextNode(benchmarkGroup.name));

  var thead = document.createElement("thead");
  tblBenchmarks.appendChild(thead);

  var thOperation = document.createElement("th");
  thead.appendChild(thOperation);
  thOperation.appendChild(document.createTextNode("Operation"));

  var thPerf = document.createElement("th");
  thead.appendChild(thPerf);
  thPerf.appendChild(document.createTextNode("Performance"));

  var thResult = document.createElement("th");
  thead.appendChild(thResult);
  thResult.appendChild(document.createTextNode("Result"));

  // BODY
  var tbody = document.createElement("tbody");
  tblBenchmarks.appendChild(tbody);
  var benchmarks = benchmarkGroup.benchmarks;
  var numBenchmarks = benchmarks.length;
  for (var i = 0; i < numBenchmarks; i++) {
    (function () {
      var benchmark = benchmarks[i];
      var tr = document.createElement("tr");
      tbody.appendChild(tr);

      var tdOperation = document.createElement("td");
      tr.appendChild(tdOperation);
      tdOperation.appendChild(
        document.createTextNode(benchmark.name)
      );

      var tdPerf = document.createElement("td");
      tr.appendChild(tdPerf);
      var meter = document.createElement("meter");
      tdPerf.appendChild(meter);
      //bind("change", meter, "min", benchmarkGroup.min, "value");
      bind("change", meter, "max", benchmarkGroup.max, "value");
      bind("change", meter, "value", benchmark.lastResult, "value");

      var tdResult = document.createElement("td");
      tr.appendChild(tdResult);
      var tdExecData = document.createTextNode();
      tdResult.appendChild(tdExecData);
      bind("change", tdExecData, "data", benchmark.lastResult, "value");
    })();
  } // for

  // FOOT
  var tfoot = document.createElement("tfoot");
  tblBenchmarks.appendChild(tfoot);
  var tdControls = document.createElement("td");
  tdControls.colSpan = 3;
  tfoot.appendChild(tdControls);

  var btnRunBenchmarks = document.createElement("button");
  tdControls.appendChild(btnRunBenchmarks);
  btnRunBenchmarks.appendChild(document.createTextNode("Run Benchmarks"));
  btnRunBenchmarks.onclick = function () {
    benchmarkGroup.runBenchmarks();
  };
}

/**
 * Create UI for each benchmark
 */
document.onreadystatechange = function () {
  if (document.readyState == "complete") {
    generateBenchmarksUI(new BenchmarkGroup("2-Dimensional Vector Operations",
      [
        new Benchmark("Create", math.v2.create),
        new Benchmark("Create Template", math.v2.create, math.v2.create()),
        new Benchmark("Add", math.v2.add, [math.v2.create(), math.v2.create()]),
        new Benchmark("Add Mutate", math.v2.addMutate, [math.v2.create(), math.v2.create()]),
        new Benchmark("Sub", math.v2.sub, [math.v2.create(), math.v2.create()]),
        new Benchmark("Sub Mutate", math.v2.subMutate, [math.v2.create(), math.v2.create()]),
        new Benchmark("Inverse", math.v2.inverse, [math.v2.create()]),
        new Benchmark("Inverse Mutate", math.v2.inverseMutate, [math.v2.create()]),
        new Benchmark("Scalar Multiply", math.v2.multScalar, [math.v2.create(), 0]),
        new Benchmark("Scalar Multiply Mutate", math.v2.multScalarMutate, [math.v2.create(), 0]),
        new Benchmark("Dot Product", math.v2.dotProduct, [math.v2.create(), math.v2.create()]),
        new Benchmark("Vector Product", math.v2.vectorProduct, [math.v2.create(), math.v2.create()]),
        new Benchmark("Get Magnitude", math.v2.getMagnitude, [math.v2.create()]),
        new Benchmark("Get Magnitude Squared", math.v2.getDistanceSquare, [math.v2.create(), math.v2.create()]),
        new Benchmark("Normalize", math.v2.normalize, [math.v2.create()]),
        new Benchmark("Normalize Mutate", math.v2.normalizeMutate, [math.v2.create()]),
        new Benchmark("Zero Mutate", math.v2.zeroMutate, [math.v2.create()]),
        new Benchmark("Get Angle", math.v2.getAngle, [math.v2.create(), math.v2.create()]),
        new Benchmark("Get Distance", math.v2.getDistance, [math.v2.create(), math.v2.create()]),
        new Benchmark("Get Distance Squared", math.v2.getDistanceSquare, [math.v2.create(), math.v2.create()]),
        new Benchmark("Is Within", math.v2.isWithin, [math.v2.create(), math.v2.create(), 0]),
        new Benchmark("Is Within Strict", math.v2.isWithinStrict, [math.v2.create(), math.v2.create(), 0])
      ]
    ));

    generateBenchmarksUI(new BenchmarkGroup("3-Dimensional Vector Operations",
      [
        new Benchmark("Create", math.v3.create),
        new Benchmark("Create Template", math.v3.create, math.v3.create()),
        new Benchmark("Add", math.v3.add, [math.v3.create(), math.v3.create()]),
        new Benchmark("Add Mutate", math.v3.addMutate, [math.v3.create(), math.v3.create()]),
        new Benchmark("Sub", math.v3.sub, [math.v3.create(), math.v3.create()]),
        new Benchmark("Sub Mutate", math.v3.subMutate, [math.v3.create(), math.v3.create()]),
        new Benchmark("Inverse", math.v3.inverse, [math.v3.create()]),
        new Benchmark("Inverse Mutate", math.v3.inverseMutate, [math.v3.create()]),
        new Benchmark("Scalar Multiply", math.v3.multScalar, [math.v3.create(), 0]),
        new Benchmark("Scalar Multiply Mutate", math.v3.multScalarMutate, [math.v3.create(), 0]),
        new Benchmark("Dot Product", math.v3.dotProduct, [math.v3.create(), math.v3.create()]),
        new Benchmark("Vector Product", math.v3.vectorProduct, [math.v3.create(), math.v3.create()]),
        new Benchmark("Get Magnitude", math.v3.getMagnitude, [math.v3.create()]),
        new Benchmark("Get Magnitude Squared", math.v3.getDistanceSquare, [math.v3.create(), math.v3.create()]),
        new Benchmark("Normalize", math.v3.normalize, [math.v3.create()]),
        new Benchmark("Normalize Mutate", math.v3.normalizeMutate, [math.v3.create()]),
        new Benchmark("Zero Mutate", math.v3.zeroMutate, [math.v3.create()]),
        new Benchmark("Get Angle", math.v3.getAngle, [math.v3.create(), math.v3.create()]),
        new Benchmark("Get Distance", math.v3.getDistance, [math.v3.create(), math.v3.create()]),
        new Benchmark("Get Distance Squared", math.v3.getDistanceSquare, [math.v3.create(), math.v3.create()]),
        new Benchmark("Is Within", math.v3.isWithin, [math.v3.create(), math.v3.create(), 0]),
        new Benchmark("Is Within Strict", math.v3.isWithinStrict, [math.v3.create(), math.v3.create(), 0])
      ]
    ));

    generateBenchmarksUI(new BenchmarkGroup("2-Dimensional Matrix Operations",
      [
        new Benchmark("Create", math.m2.create),
        new Benchmark("Create Identity", math.m2.createIdentity),
        new Benchmark("Create Rotation", math.m2.createRotation, [0]),
        new Benchmark("Get Determinant", math.m2.getDeterminant, [math.m2.create()]),
        new Benchmark("Is Invertable", math.m2.isInvertable, [math.m2.create()]),
        new Benchmark("Is Singular", math.m2.isSingular, [math.m2.create()]),
        new Benchmark("Get Inverse (Invertable)", math.m2.getInverse, [math.m2.createIdentity()]),
        new Benchmark("Get Inverse (Singular)", math.m2.getInverse, [math.m2.create()]),
        new Benchmark("Multiply Vector", math.m2.multVector, [math.m2.create(), math.v2.create()]),
        new Benchmark("Multiply Vector Mutate", math.m2.multVectorMutate, [math.m2.create(), math.v2.create()]),
        new Benchmark("Multiply", math.m2.mult, [math.m2.create(), math.m2.create()]),
        new Benchmark("Add", math.m2.add, [math.m2.create(), math.m2.create()]),
        new Benchmark("Add Mutate", math.m2.addMutate, [math.m2.create(), math.m2.create()]),
        new Benchmark("Get Entry", math.m2.getEntry, [math.m2.create(), 0, 0]),
        new Benchmark("Equals", math.m2.equals, [math.m2.create(), math.m2.create()])
      ]
    ));

    generateBenchmarksUI(new BenchmarkGroup("3-Dimensional Matrix Operations",
      [
        new Benchmark("Create", math.m3.create),
        new Benchmark("Create Identity", math.m3.createIdentity),
        new Benchmark("Create Rotation Z", math.m3.createRotationZ, [0]),
        new Benchmark("Create Transform 2", math.m3.createTransform2, [0, 0, 0]),
        new Benchmark("Get Determinant", math.m3.getDeterminant, [math.m3.create()]),
        new Benchmark("Is Invertable", math.m3.isInvertable, [math.m3.create()]),
        new Benchmark("Is Singular", math.m3.isSingular, [math.m3.create()]),
        new Benchmark("Get Inverse (Invertable)", math.m3.getInverse, [math.m3.createIdentity()]),
        new Benchmark("Get Inverse (Singular)", math.m3.getInverse, [math.m3.create()]),
        new Benchmark("Multiply Vector", math.m3.multVector, [math.m3.create(), math.v3.create()]),
        new Benchmark("Multiply Vector 2", math.m3.multVector2, [math.m3.create(), math.v2.create()]),
        new Benchmark("Multiply Vector Mutate", math.m3.multVectorMutate, [math.m3.create(), math.v3.create()]),
        new Benchmark("Multiply Vector 2 Mutate", math.m3.multVectorMutate, [math.m3.create(), math.v2.create()]),
        new Benchmark("Multiply", math.m3.mult, [math.m3.create(), math.m3.create()]),
        new Benchmark("Add", math.m3.add, [math.m3.create(), math.m3.create()]),
        new Benchmark("Add Mutate", math.m3.addMutate, [math.m3.create(), math.m3.create()]),
        new Benchmark("Get Entry", math.m3.getEntry, [math.m3.create(), 0, 0, 0]),
        new Benchmark("Equals", math.m3.equals, [math.m3.create(), math.m3.create()])
      ]
    ));
  } // if
};