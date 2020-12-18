'use strict';

(() => {
  class Puzzle{
    constructor(canvas,level){
      this.canvas = canvas;
      this.level = level;
      this.ctx = this.canvas.getContext('2d');
      this.img = document.createElement('img');
      this.tiles = [
          [0,1,2,3],
          [4,5,6,7],
          [8,9,10,11],
          [12,13,14,15],
      ];
      this.UDLR = [
        [0,-1],
        [0,1],
        [-1,0],
        [1,0],
      ];
      this.isWined = false;
      this.img.src = 'img/puzzle.png';
      this.img.addEventListener('load', () => {
        this.render();
      });
      this.canvas.addEventListener('click',e => {
          if(this.isWined === true ){
              return;
          }
        const rect = this.canvas.getBoundingClientRect();
        const col = Math.floor((e.clientX - rect.left)/70);
        const row = Math.floor((e.clientY - rect.top)/70);
        this.swapTiles(col,row);
        this.render();

        if (this.isWin() === true){
            this.isWined = true;
            this.renderGameClear();
        }
      });
      do{
        this.shuffle(this.level);
      }while(this.isWin() === true);
    }

    shuffle(n){
        let blank_col = 3;
        let blank_row = 3;
        for(let i=0;i<n;i++){
            let d_Col;
            let d_Row;
            do {
              const dir = Math.floor(Math.random() * 4);
              d_Col = blank_col + this.UDLR[dir][0];
              d_Row = blank_row + this.UDLR[dir][1];
            }while(this.isOutside(d_Col,d_Row) === true);

            [
              this.tiles[blank_row][blank_col],
              this.tiles[d_Row][d_Col],
            ] = [
                this.tiles[d_Row][d_Col],
                this.tiles[blank_row][blank_col],
              ];
              [blank_col, blank_row] = [d_Col, d_Row];
        }
    }


    swapTiles(col,row){
        if (this.tiles[row][col]===15){
           return;
        }

        for(let i=0;i<4;i++){
            const d_Col = col + this.UDLR[i][0];
            const d_Row = row + this.UDLR[i][1];

            if(this.isOutside(d_Col,d_Row) === true){
                continue;
            }
            if (this.tiles[d_Row][d_Col] === 15){
                [
                  this.tiles[row][col],
                  this.tiles[d_Row][d_Col],
                ] = [
                    this.tiles[d_Row][d_Col],
                    this.tiles[row][col],
                ];
                break;  
            }
        }
    }

    isOutside(d_Col,d_Row){
        return(d_Col < 0 || d_Col > 3 || d_Row < 0 || d_Row > 3);
    }


    isWin(){
        let i = 0;
        for(let row=0;row<4;row++){
            for(let col=0;col<4;col++){
                if(this.tiles[row][col]!== i++){
                  return false;
            }
          }
        }
        return true;
    }

    renderGameClear(){
        this.ctx.fillStyle = 'rgba(0,0,0,0.4)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.font = '28px Arial';
        this.ctx.fillStyle = '#7fffd4';
        this.ctx.fillText('YOU WIN!!!', 80, 150);
    }


    render() {
        for (let row = 0; row < 4; row++){
            for (let col = 0;col< 4; col++){
                this.renderTile(this.tiles[row][col],col,row)
            }
        }
    }
    renderTile(n,col,row){
        this.ctx.drawImage(
            this.img,
            (n%4)*70,Math.floor(n/4)*70,70,70,
            col*70,row*70,70,70
        );
    }
  }
  const canvas = document.querySelector('canvas');
  if (typeof canvas.getContext === 'undefined'){
      return;
  }

  new Puzzle(canvas,30);
})();