class Matrix {
  static new(row, col) {
    return new Matrix(row, col);
  }

  static fromArray(arr) {
    let mat = Matrix.new(arr.length, arr[0].length);
    return mat.map((_, row, col) => arr[row][col]);
  }

  static newIdentity(size) {
    const mat = new Matrix(size, size);
    for (let diag = 0; diag < size; diag++) {
      mat.set(diag, diag, 1)
    }
    return mat;
  }

  static transpose(mat) {
    let tran = Matrix.new(mat.cols, mat.rows);
    return tran.map(function(value, row, col) {
      return mat.get(col, row);
    });
  }

  static indexOf(mat, row, col) {
    return row * mat.cols + col;
  }

  static map(mat, func) {
    return mat.map(func);
  }

  static resizeTo(mat, rows, cols) {
    const data = Matrix.new(rows, cols);

    return data.map(function(value, row, col) {
      let val = 0;
      if (row < mat.rows && col < mat.cols) {
        val = mat.get(row, col);
      }
      return val
    });
  }

  static add(matA, matB) {
    matA = matA.copy();
    matA.add(matB)
    return matA;
  }

  static sub(matA, matB) {
    matA = matA.copy();
    matA.sub(matB)
    return matA;
  }

  static scale(matA, factor) {
    matA = matA.copy();
    matA.scale(factor)
    return matA;
  }

  static mult(matA, matB) {
    if (matA.cols !== matB.rows) {
      throw "can't operate because col_1 != row_2";
      return;
    }

    const mat = Matrix.new(matA.rows, matB.cols);

    return mat.map(function(value, row, col) {
      let sum = 0;
      for (let ele = 0; ele < matA.cols; ele++) {
        sum += matA.get(row, ele) * matB.get(ele, col);
      }
      return sum;
    });
  }

  constructor(row, col) {
    this.array = new Float64Array(row * col);
    this.rows = row;
    this.cols = col;
  }

  _overflowed(row, col) {
    return row >= this.rows || col >= this.cols;
  }

  _sameShape(mat) {
    const isIt = this.rows === mat.rows && this.cols === mat.cols;
    if (!isIt) console.warn("can't operate because of different shape. ie r1,c1 != r2,c2");
    return isIt;
  }

  isSquare(){
    return this.rows === this.cols;
  }

  set(row, col, value) {
    if (this._overflowed(row, col)) return;
    this.array[Matrix.indexOf(this, row, col)] = value;
  }

  get(row, col) {
    if (this._overflowed(row, col)) return;
    return this.array[Matrix.indexOf(this, row, col)];
  }

  add(mat) {
    if (!this._sameShape(mat)) return this;
    return this.map(function(value, row, col) {
      return value + mat.get(row, col);
    });
  }

  sub(mat) {
    if (!this._sameShape(mat)) return this;
    return this.map(function(value, row, col) {
      return value - mat.get(row, col);
    });
  }

  scale(factor) {
    return this.map(function(value, row, col) {
      return value * factor;
    });
  }

  copy() {
    return Matrix.resizeTo(this, this.rows, this.cols);
  }

  map(func) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.set(row, col, func(this.get(row, col), row, col));
      }
    }
    return this;
  }

  row(row){
    const rMat = new Matrix(1, this.cols);
    return rMat.map((_v, _r, col) => this.get(row, col));
  }

  col(col){
    const cMat = new Matrix(this.rows, 1);
    return cMat.map((_v, row, _c) => this.get(row, col));
  }

//dropRow(row){
//  for(let r = 0; r < this.rows; r ++){
//    if(r == row) continue;
//  }
//}

  slice(f_r, f_c, t_r, t_c){
    let mat = new Matrix(t_r - f_r, t_c - f_c);
    return mat.map((_v, r, c)=> this.get(f_r + r, f_c + c));
  }

  drop(row, col){
    let mat = new Matrix(this.rows - 1, this.cols - 1);
    return mat.map((_v, r, c)=>{
      if(r >= row) r ++; 
      if(c >= col) c ++;
      return this.get(r, c);
    });
  }

  determ(){
    if(!this.isSquare()) throw "can't operate becuase it's not square matrix.";
    if(this.rows === 1) return this.get(0, 0);
    let det = 0;
    for(let c = 0; c < this.cols; c ++){
      det += Math.pow(-1, c) * this.get(0, c) * this.drop(0, c).determ();
    }
    return det;
  }

  minors(){
    if(!this.isSquare()) throw "can't operate becuase it's not square matrix.";
    const mat = new Matrix(this.rows, this.cols);
    return mat.map((_v, r, c)=> this.drop(r, c).determ());
  }

  cofactors(){
    return this.minors().map((v, r, c) => {
      const ind = Matrix.indexOf(this, r, c);
      return v * Math.pow(-1, ind);
    });
  }

  adjoint(){
    return Matrix.transpose(this.cofactors());
  }

  inverse(){
    const det = this.determ();
    if(det == 0) throw "mat with determ = 0 not calculated!!";
    return this.adjoint().scale(1/det);
  }
}

module.exports = Matrix;
///////////////////////
////////////////////////////////////////
////// drafts
// 1-k 2   3
// 4   5-k 6
// 7   8   9-k
//(1-k)((5-k)(9-k) - 48) -2(4(9-k)-42) + 3 (32 - (5-k)7)
//(1-k)(5-k)(9-k) - 48(1-k) -8(9-k)+84+96 -21(5-k)


// static ignore(mat, r, c){
//   let pk=Matrix.new(mat.rows - 1, mat.cols - 1);

//   Map(pk, function(row, col, value){
//     return mat.get(row >= r ? row+1 : row, col >= c ? col+1 : col);
//   });
//   return pk;
// }
//   toString(){
//     let max=-Infinity;
//     for(let i=0;i<this.length;i++){
//       let len=String(this[i]).length;
//       if(len>max) max=len;
//     }
//     let str=`┌─${" ".repeat(this.cols*(2+max))}─┐\n`;
//     for(let row=0;row<this.rows;row++){
//       str+=`│ `;
//       for(let col=0;col<this.cols;col++){
//         str+=` \x1b[33m${String(this.get(row,col)).padStart(max)}\x1b[0m `;
//       }
//       str+=" │\n";
//     }
//     str+=`└─${" ".repeat(this.cols*(2+max))}─┘\n`;
//     return str;
//   }

//   slice(row,col,rown,coln){
//     rown=rown || this.rows-1;
//     coln=coln || this.cols-1;
//     let slice=new Matrix2d(rown-row+1, coln-col+1);
//     for(let r=row;r<=rown;r++){
//       for(let c=col;c<=coln;c++){
//         slice.set(r-row,c-col, this.get(r,c));
//       }    
//     }
//     return slice;
//   }

//   minorsMatrix(){
//     let mat=new Matrix2d(this.rows, this.cols);
//     for(let i=0;i<this.length;i++){
//       mat.setByIndex(i, Matrix2d.slicer(this,...Matrix2d.loc(this,i)).determ());
//     }
//     return mat;
//   }

//   cofactorMatrix(){
//     let miner=this.minorsMatrix();
//     for(let i=0;i<miner.length;i++){
//       miner[i]*=Math.pow(-1,i);
//     }
//     return miner;
//   }

//   adjoint(){
//     return Matrix2d.transpose(this.cofactorMatrix());
//   }

//   inverse(){
//     let det=this.determ();
//     if(det==0) return;
//     return Matrix2d.mult(this.adjoint(), 1/det);
//   }
// }
