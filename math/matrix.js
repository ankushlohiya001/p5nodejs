class Matrix{
  
  static new(row, col){
    return new Matrix(row, col);
  }

  static newIdentity(size){
    const mat = new Matrix(size, size);
    for(let diag=0;diag<size;diag++){
      mat.set(diag, diag, 1)
    }
    return mat;
  }

  static transpose(mat){
    let tran=Matrix.new(mat.cols, mat.rows);
    Matrix.map(tran, function(row, col){
      return mat.get(col, row);
    });
    return tran;
  }

  static indexOf(mat, row, col){
    return row * mat.cols + col;
  }

  static map(mat, func){
    for(let row=0; row < mat.rows; row++){
      for(let col=0; col < mat.cols; col++){
        mat.set(row, col, func(row, col, mat.get(row, col)));
      }
    }
  }

  static resizeTo(mat, rows, cols){
    const crntSize=mat.rows*mat.cols;
    const data=Matrix.new(rows, cols);

    Matrix.map(data, function(row, col){
      let val=0;
      if(row*col < crntSize){
        val = mat.get(row, col);
      }
      return val
    });

    return data;
  }

  static add(matA, matB){
    matA = matA.copy();
    matA.add(matB)
    return matA
  }

  static sub(matA, matB){
    matA = matA.copy();
    matA.sub(matB)
    return matA
  }

  static scale(matA, factor){
    matA = matA.copy();
    matA.scale(factor)
    return matA
  }

  static mult(matA, matB){
    if(matA.cols !== matB.rows) return;

    const mat=Matrix.new(matA.rows, matB.cols);

    Matrix.map(mat, function(row, col){
      let sum=0;
      for(let ele=0;ele < matA.cols; ele++){
        sum += matA.get(row, ele) * matB.get(ele, col);
      }
      return sum
    })

    return mat;
  }

  constructor(row, col){
    let array = new Float64Array(row * col);
    this.rows = row;
    this.cols = col;

    Object.defineProperties(this,{
      getByIndex:{
        value(index){
          if(typeof index === "number") return array[index];
        },
        enumerable:false,
        editable:false
      },
      setByIndex:{
        value(index, val){
          if(typeof index === "number") array[index] = val;
        },
        enumerable:false,
        editable:false
      }
    })
  }

  _overflowed(row, col){
    return row >= this.rows || col >= this.cols;
  }
  
  _sameShape(mat){
    return this.rows === mat.rows && this.cols === mat.cols;
  }

  set(row, col, value){
    if(this._overflowed(row, col)) return;
    this.setByIndex(Matrix.indexOf(this, row, col), value);
  }

  get(row, col){
    if(this._overflowed(row, col)) return;
    return this.getByIndex(Matrix.indexOf(this, row, col));
  }

  add(mat){
    if(!this._sameShape(mat)) return;
    Matrix.map(this, function(row, col, value){
      return value + mat.get(row, col);
    });
  }

  sub(mat){
    if(!this._sameShape(mat)) return;
    Matrix.map(this, function(row, col, value){
      return value - mat.get(row, col);
    });
  }

  scale(factor){
    Matrix.map(this, function(row, col, value){
      return value + factor;
    });
  }

  copy(){
    return Matrix.resizeTo(this, this.rows, this.cols);
  }

}

module.exports=Matrix;
///////////////////////
////////////////////////////////////////
////// drafts


  
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
  
//   determ(){
//     if(this.rows!==this.cols) return;
//     function reper(mat){
//       if(mat.rows==1) return mat[0];
//       if(mat.rows==2) return mat[0]*mat[3]-mat[1]*mat[2];
//       let sum=0;
//       for(let i=0;i<mat.cols;i++){
//         sum+=mat[i]*reper(Matrix2d.slicer(mat,0,i))*Math.pow(-1,i);
//       }
//       return sum;
//     }
//     return reper(this);
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