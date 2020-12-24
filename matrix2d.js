class Matrix2d extends Float32Array{
  static at(mat,row, col){
    return row*mat.cols+col;
  }
  static loc(mat, ind){
    let row=Math.floor(ind/mat.cols);
    let col=ind%mat.cols;
    return [row, col];
  }
  static add(matA, matB){;
    if(matA.constructor!==Matrix2d) return;
    if(!(matA.rows===matB.rows && matA.cols===matB.cols)) return;
    let added=new Matrix2d(matA.rows, matB.cols);
    for(let i=0;i<matB.length;i++){
      added.setByIndex(matB[i]+matA[i],i);
    }
    return added;
  }
  static sub(matA, matB){
    if(matA.constructor!==Matrix2d) return;
    if(!(matA.rows===matB.rows && matA.cols===matB.cols)) return;
    let subd=new Matrix2d(matA.rows, matB.cols);
    for(let i=0;i<matA.length;i++){
      subd.setByIndex(matA[i]-matB[i],i);
    }
    return subd;
  }
  static mult(matA, matB){
    if(matA.constructor!==Matrix2d) return;
    if(matB.constructor===Number){
      let multd=new Matrix2d(matA.rows, matA.cols);
      for(let i=0;i<matA.length;i++){
        multd.setByIndex(matA[i]*matB,i);
      }
      return multd;
    };
    if(matA.cols !== matB.rows) return;
    let multd=new Matrix2d(matA.rows, matB.cols);
    for(let row=0;row<matA.rows;row++){
      for(let col=0;col<matB.cols;col++){
        let sum=0;
        for(let co=0;co<matA.cols;co++){
          sum+=matA.get(row,co)*matB.get(co,col);
        }
        multd.set(sum, row, col);
      }
    }
    return multd;
  }
  static transpose(mat){
    let tran=new Matrix2d(mat.rows, mat.cols);
    for(let i=0;i<mat.length;i++){
      let [row,col]=Matrix2d.loc(mat,i);
      tran.set(mat.get(row,col),col,row);
    }
    return tran;
  }
  static slicer(mat,row,col){
    let pk=new Matrix2d(mat.rows-1,mat.cols-1);
    let err=0;
    for(let i=0;i<mat.length;i++){
      let loc=Matrix2d.loc(mat,i);
      if(loc[0]===row || loc[1]===col){err+=1;continue;}
        pk.setByIndex(mat[i],[i-err]);
    }
    return pk;
  }
  constructor(rows, cols){
    super(rows*cols);
    this.rows=rows;
    this.cols=cols;
  }
  toString(){
    let max=-Infinity;
    for(let i=0;i<this.length;i++){
      let len=String(this[i]).length;
      if(len>max) max=len;
    }
    let str=`┌─${" ".repeat(this.cols*(2+max))}─┐\n`;
    for(let row=0;row<this.rows;row++){
      str+=`│ `;
      for(let col=0;col<this.cols;col++){
        str+=` \x1b[33m${String(this.get(row,col)).padStart(max)}\x1b[0m `;
      }
      str+=" │\n";
    }
    str+=`└─${" ".repeat(this.cols*(2+max))}─┘\n`;
    return str;
  }
  get(row, col){
    return this[Matrix2d.at(this,row,col)];
  }
  set(value,row, col){
    return this[Matrix2d.at(this,row,col)]=value;
  }
  setByIndex(value,index){
    return this[index]=value;
    // console.log(this[index]);
  }
  map(fun){
    let pk=new Matrix2d(this.rows, this.cols);
    for(let i=0;i<this.length;i++){
      pk[i]=fun(...Matrix2d.loc(this,i));
    }
  }
  slice(row,col,rown,coln){
    rown=rown || this.rows-1;
    coln=coln || this.cols-1;
    let slice=new Matrix2d(rown-row+1, coln-col+1);
    for(let r=row;r<=rown;r++){
      for(let c=col;c<=coln;c++){
        slice.set(this.get(r,c),r-row,c-col);
      }    
    }
    return slice;
  }
  determ(){
    if(this.rows!==this.cols) return;
    function reper(mat){
      if(mat.rows==1) return mat[0];
      if(mat.rows==2) return mat[0]*mat[3]-mat[1]*mat[2];
      let sum=0;
      for(let i=0;i<mat.cols;i++){
        sum+=mat[i]*reper(Matrix2d.slicer(mat,0,i))*Math.pow(-1,i);
      }
      return sum;
    }
    return reper(this);
  }
  minorsMatrix(){
    let mat=new Matrix2d(this.rows, this.cols);
    for(let i=0;i<this.length;i++){
      mat.setByIndex(Matrix2d.slicer(this,...Matrix2d.loc(this,i)).determ(), i);
    }
    return mat;
  }
  cofactorMatrix(){
    let miner=this.minorsMatrix();
    for(let i=0;i<miner.length;i++){
      miner[i]*=Math.pow(-1,i);
    }
    return miner;
  }
  adjoint(){
    return Matrix2d.transpose(this.cofactorMatrix());
  }
  inverse(){
    let det=this.determ();
    if(det==0) return;
    return Matrix2d.mult(this.adjoint(), 1/det);
  }
}

module.exports=Matrix2d;
