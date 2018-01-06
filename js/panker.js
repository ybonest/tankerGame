(function(){
	/*
	 * json参数包含，x,y,color,doc(document),ctx(画布);
	 */
	var panker = function(json){
		this.keyCode = 0;
		this.x = json.x;
		this.y = json.y;
		this.color = json.color;
		this.document = json.doc;
		this.ctx = json.ctx;
		this.direction = json.direction;
		this.speed = json.speed || 2;
		this.flag = true;
		this.username = "";
		this.timer = null;
		this.lastDirection = '';  //保存上次的移动方向
		this.bulletnum = json.bulletnum;
		this.username = json.username;
		this.live = json.live;
		this.userlife = json.userlife;
		// console.log("direction:"+this.direction);
		//坦克改方向时记录上次位置
		this.lastX = json.x; 
		this.lastY = json.y;
	}
	panker.prototype = {
		constructor:panker,
		init:function(direction,flagmove){  //数据初始化
			this.drawTanker(this.x,this.y,this.ctx,this.color,this.direction);
			// this.clearPanker(this.x,this.y,this.ctx,this.lastDirection);
			if(flagmove){
				this.move(direction,this);
			}
		},
		move:function(direction,tankerUser){//移动方向以及要移动的坦克
			clearInterval(tankerUser.timer);
			tankerUser.timer = setInterval(function(){
				tankerUser.flag = false;
				if(direction.left === "left"){
					tankerUser.x = tankerUser.x-tankerUser.speed;
					tankerUser.direction = "left";
				}else if(direction.right === "right"){
					tankerUser.x = tankerUser.x+tankerUser.speed;
					tankerUser.direction = "right";
				}else if(direction.top === "top"){
					tankerUser.y = tankerUser.y-tankerUser.speed;
					tankerUser.direction = "top";
				}else if(direction.bottom === "bottom"){
					tankerUser.y = tankerUser.y+tankerUser.speed;
					tankerUser.direction = "bottom";
				}else{
					clearInterval(tankerUser.timer);
					tankerUser.flag = true;
				}
				tankerUser.drawTanker(tankerUser.x,tankerUser.y,tankerUser.ctx,tankerUser.color,tankerUser.direction);
			},16);
		},
		clearPanker:function(x,y,ctx,directionF){
			var x = x || this.x;
			var y = y || this.y;
			var ctx = ctx || this.ctx;
			var directionF = directionF || this.directionF;
			if(directionF === "top"){
				ctx.clearRect(x-3,y-18,56,62);//创建坦克时先清理坦克
			}else if(directionF === "bottom"){
				ctx.clearRect(x-3,y-5,56,62);//创建坦克时先清理坦克
			}else if(directionF === "left"){
				ctx.clearRect(x-13,y-8,62,56);
			}else if(directionF === "right"){
				ctx.clearRect(x,y-8,62,56);
			}	
			
		},
		drawTanker:function(x,y,ctx,color,direction){
			//创建坦克时先清理坦克
			this.clearPanker(x,y,ctx,direction);
			switch(direction){
				case "top":
				ctx.beginPath();
				ctx.strokeStyle=color;
				ctx.moveTo(x,y);
				ctx.lineTo(x,y+40);
				ctx.moveTo(x,y+40);
				ctx.lineTo(x+13,y+40);
				ctx.moveTo(x+13,y+40);
				ctx.lineTo(x+13,y+35);
				ctx.moveTo(x+13,y+5);
				ctx.lineTo(x+13,y);
				ctx.moveTo(x,y);
				ctx.lineTo(x+13,y);
				ctx.rect(x+10,y+5,30,30);
				ctx.moveTo(x+37,y);
				ctx.lineTo(x+37,y+5);
				ctx.moveTo(x+37,y);
				ctx.lineTo(x+50,y);
				ctx.moveTo(x+50,y);
				ctx.lineTo(x+50,y+40);
				ctx.moveTo(x+50,y+40);
				ctx.lineTo(x+37,y+40);
				ctx.moveTo(x+37,y+40);
				ctx.lineTo(x+37,y+35);
				ctx.moveTo(x+37,y+20);
				ctx.arc(x+25,y+20,12,0,2*Math.PI);
				ctx.moveTo(x+25,y+20);
				ctx.rect(x+24,y+20,2,-35);
				ctx.stroke();
				break;
				case "bottom":
				ctx.beginPath();
				ctx.strokeStyle=color;
				ctx.moveTo(x,y);
				ctx.lineTo(x,y+40);
				ctx.moveTo(x,y+40);
				ctx.lineTo(x+13,y+40);
				ctx.moveTo(x+13,y+40);
				ctx.lineTo(x+13,y+35);
				ctx.moveTo(x+13,y+5);
				ctx.lineTo(x+13,y);
				ctx.moveTo(x,y);
				ctx.lineTo(x+13,y);
				ctx.rect(x+10,y+5,30,30);
				ctx.moveTo(x+37,y);
				ctx.lineTo(x+37,y+5);
				ctx.moveTo(x+37,y);
				ctx.lineTo(x+50,y);
				ctx.moveTo(x+50,y);
				ctx.lineTo(x+50,y+40);
				ctx.moveTo(x+50,y+40);
				ctx.lineTo(x+37,y+40);
				ctx.moveTo(x+37,y+40);
				ctx.lineTo(x+37,y+35);
				ctx.moveTo(x+37,y+20);
				ctx.arc(x+25,y+20,12,0,2*Math.PI);
				ctx.moveTo(x+25,y+20);
				ctx.rect(x+24,y+20,2,35);
				ctx.stroke();
				break;
				case "right":
				var lx = 5;
				var ly = 5;
				ctx.beginPath();
				ctx.strokeStyle=color;
				ctx.moveTo(x+lx,y-ly);
				ctx.lineTo(x+40+lx,y-ly);
				ctx.moveTo(x+40+lx,y-ly);
				ctx.lineTo(x+40+lx,y+13-ly);
				ctx.moveTo(x+40+lx,y+13-ly);
				ctx.lineTo(x+35+lx,y+13-ly);
				ctx.moveTo(x+5+lx,y+13-ly);
				ctx.lineTo(x+lx,y+13-ly);
				ctx.moveTo(x+lx,y-ly);
				ctx.lineTo(x+lx,y+13-ly);
				ctx.rect(x+5+lx,y+10-ly,30,30);
				ctx.moveTo(x+lx,y+37-ly);
				ctx.lineTo(x+lx+5,y+37-ly);
				ctx.moveTo(x+lx,y+37-ly);
				ctx.lineTo(x+lx,y+50-ly);
				ctx.moveTo(x+lx,y+50-ly);
				ctx.lineTo(x+lx+40,y+50-ly);
				ctx.moveTo(x+lx+40,y+50-ly);
				ctx.lineTo(x+lx+40,y+37-ly);
				ctx.moveTo(x+40+lx,y+37-ly);
				ctx.lineTo(x+35+lx,y+37-ly);
				ctx.moveTo(x+32+lx,y+25-ly);
				ctx.arc(x+20+lx,y+25-ly,12,0,2*Math.PI);
				ctx.moveTo(x+20+lx,y+25-ly);
				ctx.rect(x+20+lx,y+24-ly,35,2);
				ctx.stroke();
				break;
				case "left":
				var lx = 5;
				var ly = 5;
				ctx.beginPath();
				ctx.strokeStyle=color;
				ctx.moveTo(x+lx,y-ly);
				ctx.lineTo(x+40+lx,y-ly);
				ctx.moveTo(x+40+lx,y-ly);
				ctx.lineTo(x+40+lx,y+13-ly);
				ctx.moveTo(x+40+lx,y+13-ly);
				ctx.lineTo(x+35+lx,y+13-ly);
				ctx.moveTo(x+5+lx,y+13-ly);
				ctx.lineTo(x+lx,y+13-ly);
				ctx.moveTo(x+lx,y-ly);
				ctx.lineTo(x+lx,y+13-ly);
				ctx.rect(x+5+lx,y+10-ly,30,30);
				ctx.moveTo(x+lx,y+37-ly);
				ctx.lineTo(x+lx+5,y+37-ly);
				ctx.moveTo(x+lx,y+37-ly);
				ctx.lineTo(x+lx,y+50-ly);
				ctx.moveTo(x+lx,y+50-ly);
				ctx.lineTo(x+lx+40,y+50-ly);
				ctx.moveTo(x+lx+40,y+50-ly);
				ctx.lineTo(x+lx+40,y+37-ly);
				ctx.moveTo(x+40+lx,y+37-ly);
				ctx.lineTo(x+35+lx,y+37-ly);
				ctx.moveTo(x+32+lx,y+25-ly);
				ctx.arc(x+20+lx,y+25-ly,12,0,2*Math.PI);
				ctx.moveTo(x+20+lx,y+25-ly);
				ctx.rect(x+20+lx,y+24-ly,-35,2);
				ctx.stroke();
				break;
			}
		}
	} 
	window.panker = panker;
})()