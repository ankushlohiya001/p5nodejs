const Matrix = require("./matrix");
const assert = require("assert");
// test matrix
const rows = 3, cols = 2;
const matA = new Matrix(rows, cols);
assert.equal(matA.array.constructor, Float64Array, "array prop should be instance of Float64Array");
assert.equal(matA.array.length, rows * cols, "array length should be equal to row X col");
assert.equal(matA.rows, rows, "row prop must be set.");
assert.equal(matA.cols, cols, "col prop must be set.");

const matB = Matrix.fromArray([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

assert.deepEqual(matB.array, new Float64Array([1, 2, 3, 4, 5, 6, 7, 8, 9]), "array is not being assigned..");
assert.deepEqual(Matrix.transpose(matB).array, new Float64Array([1, 4, 7, 2, 5, 8, 3, 6, 9]), "array is not being assigned..");

assert.deepEqual(matB.minors().array, new Float64Array([-3, -6, -3, -6, -12, -6, -3, -6, -3]), "wrong minor impl..");
assert.deepEqual(matB.cofactors().array, new Float64Array([-3, 6, -3, 6, -12, 6, -3, 6, -3]), "wrong cofactors impl..");

assert.deepEqual(matB.adjoint().array, new Float64Array([-3, 6, -3, 6, -12, 6, -3, 6, -3]), "wrong cofactors impl..");


