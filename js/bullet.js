	(function(){
		var bullet = function(obj){
			this.x = obj.x || 0;
			this.y = obj.y || 0;
			this.direction = obj.direction || "top";
			this.owener = obj.owener;
			this.status = obj.status; //子弹状态
			this.ctx = obj.ctx;
			this.timer = null;
			this.flag = true;
			this.speed = obj.speed || 4;
			this.panker = obj.panker;
			this.bulletname = obj.bulletname;
			this.init();
		}
		bullet.prototype = {
			constructor:bullet,
			init:function(){
				// if(this.direction == 'right'){
				// 	var x = this.x + 50;
				// 	var y = this.y + 18;
				// }else if(this.direction == 'left'){
				// 	var x = this.x;
				// 	var y = this.y +18;
				// }else if(this.direction == 'top'){
				// 	var x = this.x + 23;
				// 	var y = this.y - 17;
				// }else if(this.direction == 'bottom'){
				// 	var x = this.x + 23;
				// 	var y = this.y + 56;
				// }
				this.drawBullet(this.x,this.y,this.ctx,this.direction);
				this.move(this.direction,this);
				
			},
			move:function(direction,bulletU){
				clearInterval(bulletU.timer);
				bulletU.timer = setInterval(function(){
				bulletU.flag = false;
					if(direction === "left"){
						bulletU.x = bulletU.x - bulletU.speed;
					}else if(direction === "right"){
						bulletU.x = bulletU.x + bulletU.speed;
					}else if(direction === "top"){
						bulletU.y = bulletU.y - bulletU.speed;
					}else if(direction === "bottom"){
						bulletU.y = bulletU.y + bulletU.speed;
					}else{
						clearInterval(bulletU.timer);
						bulletU.flag = true;
					}
				bulletU.drawBullet(bulletU.x,bulletU.y,bulletU.ctx,direction);
				bulletU.clearBullet();
			},16);
			},
			clearBullet:function(){
				var x = this.x;
				var y = this.y;
				var ctx = this.ctx;
				var direction = this.direction;
				if(direction === "left"){
					ctx.clearRect(x,y-1,12,6);
				}else if(direction === "right"){
					ctx.clearRect(x-12,y-1,12,6);
				}else if(direction === "top"){
					ctx.clearRect(x-1,y+12,6,12);
				}else if(direction === "bottom"){
					ctx.clearRect(x-1,y-24,6,12);
				}
			},
			drawBullet:function(x,y,ctx,direction){
				switch(direction){
					case "top":
						ctx.beginPath();
						ctx.strokeStyle='blue';
						ctx.moveTo(x,y);
						ctx.rect(x,y,4,12);
						ctx.stroke();
					break;
					case "bottom":
						ctx.beginPath();
						ctx.strokeStyle='blue';
						ctx.moveTo(x,y);
						ctx.rect(x,y,4,-12);
						ctx.stroke();
					break;
					case "right":
						ctx.beginPath();
						ctx.strokeStyle='blue';
						ctx.moveTo(x,y);
						ctx.rect(x,y,12,4);
						ctx.stroke();
					break;
					case "left":
						ctx.beginPath();
						ctx.strokeStyle='blue';
						ctx.moveTo(x,y);
						ctx.rect(x,y,-12,4);
						ctx.stroke();
					break;
				}
			}
		}
		window.bullet = bullet;
	})();
