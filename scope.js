class Scope{
  constructor(element){
    this.element = element;
    if (!element) throw Error("Scope: No element provided");
    this.buffer = [0];
    this.bufferLength = element.width;
    this.bufferHeight = element.height;
    this.needle = 0;
  }
  add(delta){
    const nextNeedle = (this.needle + 1) % this.bufferLength;
    this.buffer[nextNeedle] = this.buffer[this.needle] + delta;
    this.needle = nextNeedle;
    this.draw();
  }
  
  greatestMagnitude(){
    let greatest = 0;
    for (let i = 0; i < this.buffer.length; i++){
      let magnitude = Math.abs(this.buffer[i]);
      if (magnitude > greatest) greatest = magnitude;
    }
    return greatest;
  }

  draw(){
    let ctx = this.element.getContext("2d");
    let scale = 1 / this.greatestMagnitude();
    ctx.clearRect(0, 0, this.bufferLength, this.bufferHeight);
    ctx.lineWidth = 1;
    
    ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.moveTo(0, this.bufferHeight/2);
    ctx.lineTo(this.bufferLength, this.bufferHeight/2);
    ctx.stroke();

    ctx.strokeStyle = "#aaa";  
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.moveTo(0, this.bufferHeight);
    for (let i = 0; i <= this.buffer.length; i++){
      let x = i;

      let y = this.bufferHeight - (this.buffer[i] * scale + 1) * this.bufferHeight / 2;
      y = Math.floor(y);
      if (i==0) ctx.moveTo(x,y);
      
      ctx.lineTo(x, y);
      
      if (i==this.needle){
        ctx.stroke();
        ctx.moveTo(x,y)
      }
    }
    ctx.stroke();
  }

}