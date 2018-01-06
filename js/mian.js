window.onload = function(){
			var canvas = document.getElementById("myCanvas");
			canvas.width = document.scrollingElement.clientWidth;
			canvas.height = document.scrollingElement.clientHeight;

			// var minHeight = 622;
			// var minWidth = 1366; 
			var ctx = canvas.getContext("2d");
			var username = $('#forUsername').val();
			// ctx.fillStyle="orange";
			// ctx.fillRect(0,0,canvas.width,canvas.height);
			// ctx.fillRect(0,0,minWidth,minHeight);

			//坦克方向
			var directionKey = {left:"up",right:"up",top:"up",bottom:"up"}
			//空格键一次按下一次弹起触发一次子弹事件
			var bulletKey = {down:'no',up:'no'}
			//存放子弹
			var bulletArray = new Array();	//己方子弹信息
			var bulletArrayOfDi = new Array();	//己方子弹信息
			var bulletNameArr = new Array(); //子弹名称
			var overBullet = new Array();  //越界子弹
			var users = new Array();  //敌方
			//备份坦克方向，待之后重新画坦克时使用
			var backupDirKey = {}; 
			cloneObject(directionKey,backupDirKey);
			var pankerUser = null;	

			//初始化坦克
			(function(){
				var arg = {
					url:"../php/mysqlMoveService.php",
					arg:{username:username,forwhat:'getUserInfo'},
					method:'post',
					cbfn:getUserInfo
				}
				getNewResult(arg); //获取坦克基本信息
				function getUserInfo(arg1){
					if(arg1 === '用户不存在'){
						alert(arg1);
					}else if(arg1 !== 'failed' && arg1 !== '' && arg1.indexOf('error') === -1 && arg1.indexOf('<b>') === -1){
						var json = JSON.parse(arg1);

						//设置页面信息显示
						$('#bulletnum').text('子弹数量：'+json[0]['bulletnum']);
						$('#killNum').text('杀敌数量：'+json[0]['killNum']);
						$('#xueliang').text('生命值：'+json[0]['live']);

						//x,y必须是整形
						var x = parseInt(json[0].posX),y = parseInt(json[0].posY),
							direction = json[0].direction,
							bulletnum = json[0].bulletnum,
							username = json[0].username,
							live = json[0].live,
							userlife = json[0].userlife;

						pankerUser = new panker({
							x:x,
							y:y,
							direction:direction,
							color:'red',
							ctx:ctx,
							bulletnum:bulletnum,
							username:username,
							live:live,
							userlife:userlife
						});
						
						pankerUser.init(directionKey,true);
						init(pankerUser);
						pankerUser.clearPanker();
					}
				}
			})();

			//初始化坦克
			// var pankerUser = new panker({x:300,y:400,ctx:ctx,color:'red',direction:"right"});
			// pankerUser.init(directionKey,true);
			
			/*
			 *关于回调函数的思考：不同的函数希望使用函数内的一些变量，此时就可以使用回调，
			 *函数以参数方式传入拥有变量的函数，然后把响应参数传入该函数，并调用
			 */

			//根据keycode的值判断当前键按下或弹起，弹起时为up，落下时存放上下状态
			
			
			var changeKeyStatus = function(json){
				changeKeyStatus.flagKS = false;
				var keyCode = json.keyCode || 0;
				var upOrDown = json.upOrDown || "up";
				switch(keyCode){
					case 37:
						if(upOrDown === "down"){
							for(var key in directionKey){
								key === "left" ? directionKey[key] = "left" : directionKey[key] = "up";
							}
						}else{
							directionKey["left"] = "up";
						}
						break;
					case 38:
						if(upOrDown === "down"){
							for(var key in directionKey){
								key === "top" ? directionKey[key] = "top" : directionKey[key] = "up";
							}
						}else{
							directionKey["top"] = "up";
						}
						break;
					case 39:
						if(upOrDown === "down"){
							for(var key in directionKey){
								key === "right" ? directionKey[key] = "right" : directionKey[key] = "up";
							}
						}else{
							directionKey["right"] = "up";
						}
						break;
					case 40:
						if(upOrDown === "down"){
							for(var key in directionKey){
								key === "bottom" ? directionKey[key] = "bottom" : directionKey[key] = "up";
							}
						}else{
							directionKey["bottom"] = "up";
						}
						break;
					case 32:
						if(upOrDown === "down"){
							bulletKey["down"] = 'yes';								
						}else{
							bulletKey["up"] = 'yes';
						}
						break;
				}
				changeKeyStatus.flagKS = true;
			}
			changeKeyStatus.flagKS = true; //为本函数增加调用属性，防止函数在同一事件被多次调用

			//页面内容初始化
			function init(pankerUser){
				//按键坦克移动总控代码
				var forTankerMoveEvent = function(obj){
					//备份坦克方向数据(此处犯了一个错误，对象赋值是引用赋值，因此无法直接用等于号备份,因此该处定义了一个对象的copy方法)
					// backupDirKey = directionKey;
					cloneObject(directionKey,backupDirKey);
					
					//初始化参数
					var callback = obj.callback;
					var flagDownUp = obj.flagDownUp;
					var keyCode = obj.keyCode;

					if(callback.flagKS){  //回调修改按键方向
						obj.callback({keyCode:keyCode,upOrDown:"down"});
					}else{
						return;
					}

					var flagCLD = false;// 标记是否修改坦克lastDirkey;
					//遍历查看当前方向是否发生改变	
					for(var key in directionKey){
						if(directionKey[key] !== backupDirKey[key]){
							flagCLD = true;
						}
					}

					if(pankerUser.flag){ //flag 保证move函数同时只能被调用一次，只有本次调用完成flag变true，然后才可以下一次调用
						if(flagCLD&&obj.flagDownUp){
							//每次按键，修改坦克初始化状态
							pankerUser.init(directionKey,true);
							//记录位置，并清理
							pankerUser.lastDirection = pankerUser.direction;
							pankerUser.clearPanker(pankerUser.x,pankerUser.y,ctx,pankerUser.lastDirection);
							pankerUser.lastDirection = pankerUser.direction;
							obj.flagDownUp = false;
						}
						// pankerUser.clearPanker(pankerUser.x,pankerUser.y,ctx,pankerUser.direction);
					}
				}

				//绑定事件并传入回调函数
				var keyEvent = function(callback){
					var keyCode = 0;
					var flagDownUp = true; //记录坦克两组数据位置

					//键按下事件绑定
					document.onkeydown = function(event){
						event = event || window.event;
						keyCode = event.keyCode;
						if(keyCode === 32){
							bulletKey = {down:'no',up:'no'};
						}
						if (callback.name === "changeKeyStatus") {  //如果回调是方向函数执行以下代码
							forTankerMoveEvent({flagDownUp:flagDownUp,callback:callback,keyCode:keyCode});
						}
					}

					//键弹起事件绑定
					document.onkeyup = function(event){
						event = event || window.event;
						var keyCode = event.keyCode;
						callback({keyCode:keyCode,upOrDown:"up"});
						flagDownUp = true;
						if(keyCode === 32 && bulletKey.down === 'yes' && bulletKey.up === 'yes'){
							forBulletController(pankerUser,username);
						}
					}
			
				}

				//调用按键事件
				keyEvent(changeKeyStatus);
				// var getUserName = function(datas,panker){ //通过其它方式获取用户信息，此方法废弃
				// 	//pankerUser.username = datas;   此处错误，getUserName，在ajax请求中当作回掉函数使用，pankerUser获取不到，考虑可能是因为ajax为异步请求，
													//因此可能pankerUser被使用时可能还未进行初始化
				// 	panker.username = datas;
				// 	console.log(datas);
				// 	// console.log("ddd");
				// }

				//初始化其他用户
				var flagOver = true;
				var anotherUser = function(datas){

					//清除坦克
					for(var i=0;i<users.length;i++){
						var pankerT = users[i];
						var directionF = pankerT.direction;
						var x = pankerT.x;
						var y = pankerT.y;
						// pankerT.clearPanker(pankerT.x,pankerT.x,ctx,);
						if(directionF === "top"){
							ctx.clearRect(x-3,y-18,56,62);
						}else if(directionF === "bottom"){
							ctx.clearRect(x-3,y-5,56,62);
						}else if(directionF === "left"){
							ctx.clearRect(x-13,y-8,62,56);
						}else if(directionF === "right"){
							ctx.clearRect(x,y-8,62,56);
						}	
					}

					//bug 描述与处理方式：ajax异步请求，在本程序中同时发起了多起ajax请求，导致了数据返回存在错乱现象
					//表现为方法一的ajax请求返回的数据，进入了方法二
					//出现原因：初始化ajax创建->xmlHttp = new XMLHttpRequest();时 xmlHttp写成了全局变量，因此当方法二的ajax
					//请求发起后，覆盖了原本的xmlHttp，但是由于ajax是异步请求，方法一的ajax请求未执行完，因此当数据返回时
					//此时的xmlHttp代表的是方法二的请求，因此方法一的数据返回存入了方法二的回调函数，所以导致数据错乱。
					//解决方式1：xmlHttp = new XMLHttpRequest()声明为局部变量，保证每次ajax请求都会重新创建一次new  XMLHttpRequest()
					//解决方式2：将第方法二的当做方法一的回调函数，在方法一请求完成返回数据后再进行下一次请求。
					if(datas === "用户不存在"||datas === ""||datas === "none" || datas.indexOf('<b>') !== -1){
						fnGetUsersInfo();
						return;
					}

					
					var jsonA = JSON.parse(datas);
					var json = jsonA.usersInfo; //坦克信息
					var jsonB = jsonA.bltInfo;  //子弹信息
					// bulletArray.slice(0,bulletArray.length);
					// bulletArray.push(jsonB);
					if(jsonB !== '0'){
						dealBullet(jsonB);  //画子弹
					}
					var countFlag = 0;
					if(json !== '0'){   //画坦克
						//当前房间只剩一人，并且是当前用户，判定用户胜利
						if(json.length === 1 && json[0]["username"] === username){
							
							//发出删除请求
							var obj = {
								method:'post',
								url:'../php/bulletServer.php',
								cbfn:gameover,
								arg:{username:username,forWhat:'forGameOver'}
							}	
							getNewResult(obj);
							function gameover(arg){
								$('#bulletnum').text('子弹数量：'+json[0]['bulletnum']);
								$('#killNum').text('杀敌数量：'+json[0]['killNum']);
								$('#xueliang').text('生命值：'+json[0]['live']);
								//弹出胜利框
								$('.zhezhao').text('Congratulate,You Win!').fadeIn("slow",function(){
									setTimeout(function(){
										location.href = '../main.php';
									},1500);
								});
							}
							return;		
						}


						for(var i=0;i<json.length;i++){
							var usernameIn = json[i]["username"];
							if(usernameIn === username){
								var ppPanker = json[i]
								$('#bulletnum').text('子弹数量：'+ppPanker['bulletnum']);
								$('#killNum').text('杀敌数量：'+ppPanker['killNum']);
								$('#xueliang').text('生命值：'+ppPanker['live']);
								if(ppPanker['live'] === '1'){
									$('#xueliang').css({color:'red',fontWeight:600});
								}
								countFlag++;
								continue;
							}
							var x =  parseInt(json[i]['posX']);
							var y = parseInt(json[i]["posY"]);
							var direction = json[i]["direction"];
							var live = json[i]["live"];
							// json[i] = new panker({x:x,y:y,ctx:ctx,live:live,username:usernameIn,color:'black',direction:direction});
							// json[i].init(direction,false);
							// users[i] = json[i];
							users[users.length]= new panker({x:x,y:y,ctx:ctx,live:live,username:usernameIn,color:'black',direction:direction});
							users[users.length-1].init(direction,false);
							// users[i] = json[i];
						}
						if(countFlag === 0){
							if(!flagOver){
								return;
							}
							$('#xueliang').text('生命值：0').css('color','red');
							document.onkeydown = function(){}
							document.onkeyup = function(){}
							pankerUser.clearPanker();
							// $('.zhezhao').css('display','block');
							flagOver = false;
							$('.zhezhao').fadeIn("slow",function(){
									location.href = '../main.php';
								});	 
							// setTimeout(function(){
							// 	window.location.href = '../main.php';
							// },2000);
						}
					}
					
					
					// users.splice(0,users.length);
					// cloneObject(json,users);
					// for(var i=0;i<lastJson.length;i++){
					// 	var lx =  parseInt(lastJson[i]['posX']);
					// 	var ly = parseInt(lastJson[i]["posY"]);
					// 	var ldirection = lastJson[i]["direction"];
					// 	lastJson[i].clearPanker(lx,ly,ctx,ldirection);
					// }
					//bug：暂无策略：此处原准备使用深copy备份其他用户数据，但导致了堆栈溢出
					//（Uncaught RangeError: Maximum call stack size exceeded）
					// cloneObject(json,lastJson);
					fnGetUsersInfo();
				}

				function dealBullet(arr){
					for(var i=0,len = arr.length; i < len; i++){   //画子弹
						forOhters(arr[i]);
					}
				}

				//调用ajax方法推送数据，并接受对应的数据
				var sendarg1 = "x="+pankerUser.x+"&y="+pankerUser.y+"&direction="+pankerUser.direction;
				// var arg1 = {sendarg:sendarg1,url:"../php/gameService.php"}
				var arg1 = {sendarg:sendarg1,url:"../php/mysqlGameService.php"};
				// getResult(arg1,getUserName,pankerUser);

				//bug以及解决思路：定时器使用无法保证当前数据处理完后再进行下一次请求，而且定时器和ajax都是异步请求，异步嵌套异步
				//性能有一定影响，因此考虑使用递归

				// setInterval(function(){
				// 	if(pankerUser.username!=null){
				// 		var sendarg = "x="+pankerUser.x+"&y="+pankerUser.y+"&username="+pankerUser.username+"&direction="+pankerUser.direction;;
				// 		// var arg = {sendarg:sendarg,url:"../php/moveSerivce.php"}
				// 		var arg = {sendarg:sendarg,url:"../php/mysqlMoveService.php"}
				// 		// console.log(sendarg);
				// 		getResult(arg,anotherUser);
				// 	}
				// },100);
				//获取其他用户信息
				fnGetUsersInfo();
				function fnGetUsersInfo(){
					//请求其他用户信息
					if(pankerUser.username!=null){
						var sendarg = "x="+pankerUser.x+"&y="+pankerUser.y+"&username="+pankerUser.username+"&direction="+pankerUser.direction+"&bulletNameArr="+JSON.stringify(bulletNameArr);
						var arg = {sendarg:sendarg,url:"../php/mysqlMoveService.php"}
						getResult(arg,anotherUser);


						//bug解决思路：此处开始时考虑在次进行递归，但是由于ajax请求是异步调用，
						//因此直接在这进行fnGetUsersInfo的递归调用时，此句代码不会等待ajax数据调用完成，导致fnGetUsersInfo
						//方法不断被调用，不断发出ajax请求，因此导致堆栈溢出
						//（Uncaught RangeError: Maximum call stack size exceeded），
						//所以该处fnGetUsersInfo的调用放在了，anotherUser方法体内，这样类似于回调，因此问题解决
							// fnGetUsersInfo();
					}
				}
			}
			// 更新子弹移动
			// dealBulletMove();
			// function dealBulletMove(){
			// 	ListenerMove(bulletMoveFn);
			// 	function ListenerMove(callback){
			// 		// var lock = false;
			// 		var timer = setInterval(function(){
			// 			// bulletArray.length == 0 ? (callback.lock = false) : (callback.lock = true); //锁，数组大于0，执行子弹处理事件
			// 			if(callback.lock){
			// 				callback();  //进入方法闭锁
			// 			}
			// 		},50);
			// 	}

			// 	function bulletMoveFn(){
			// 		bulletMoveFn.lock = false;  //锁住方法
			// 		//发起ajax请求
			// 		var obj = {
			// 			method:'post',
			// 			url:'../php/bulletServer.php',
			// 			cbfn:bullerMoveForBack,
			// 			arg:{username:username,bulletArray:JSON.stringify(bulletArray),forWhat:'dealBullet'}
			// 		}	
			// 		getNewResult(obj);

			// 	}
			// 	bulletMoveFn.lock = true; //定义方法锁

			// 	function bullerMoveForBack(arg){
			// 		//返回子弹表，处理当前用bulletArray
			// 		bulletMoveFn.lock = true;  //解锁
			// 	}
				
			// };

			//获取子弹移动信息
			// (function(){
			// 	getMoveInfo();
			// 	function getMoveInfo(){
			// 		var obj = {
			// 			method:'post',
			// 			url:'../php/bulletServer.php',
			// 			cbfn:moveInfoBack,
			// 			arg:{username:username,forWhat:'getMoveInfo'}
			// 		}	
			// 		getNewResult(obj);					
			// 	}
			// 	//请求回调函数
			// 	function moveInfoBack(arg){
			// 		console.log(arg);
			// 		if(arg !== 'failed' && arg !== '' && arg.indexOf('error') === -1 && arg.indexOf('<b>') === -1 ){
			// 			var json = JSON.parse(arg);
			// 			var others = json.others;
			// 			if(others !== '0'){
			// 				for(var i=0,len = others.length;i<len;i++){
			// 					forOhters(others[i]);
			// 				}
			// 			}
			// 		}
			// 		getMoveInfo();
			// 	}
			// 	//移动信息记录
				function forOhters(bulletO){
					var direction = bulletO.direction;
					var lx = parseInt(bulletO.bulletX);
					var ly = parseInt(bulletO.bulletY);
					if(direction == 'right'){
						// var x = lx + 70;
						// var y = ly + 18;
						var x = lx;
						var y = ly;
					}else if(direction == 'left'){
						// var x = lx-20;
						// var y = ly +18;
						var x = lx;
						var y = ly;
					}else if(direction == 'top'){
						// var x = lx + 23;
						// var y = ly - 37;
						var x = lx;
						var y = ly;
					}else if(direction == 'bottom'){
						// var x = lx + 23;
						var x = lx;
						// var y = ly + 76;
						var y = ly;
					}
					var username = bulletO.username;
					var bulletname = bulletO.bulletname;

					bulletNameArr.push(bulletname);

					//创建子弹
					(function(){
						var arg = {
							x:x,
							y:y,
							direction:direction,
							ctx:ctx,
							owener:username,
							// panker:panker,
							bulletname:bulletname
						}
						var bulletA = new bullet(arg);
						bulletArrayOfDi.push({bulletA});   //将创建的子弹存入数组，越界删除
					})();
				}
			// })();
			var needDeleteBut = new Array();
			deleteBulletID();
			function deleteBulletID(){
				//bulletNameArr长度大于8后，进行一次子弹删除操作
				setInterval(function(){
					needDeleteBut.splice(0,needDeleteBut.length);
					if(bulletNameArr.length >= 8){
						for(var i=0,len = bulletNameArr.length;i<len;i++){
							var btlA = bulletArrayOfDi[i];
							if(parseInt(btlA.x) < 0 || parseInt(btlA.y) < 0 || parseInt(btlA.x) > 1366 || parseInt(btlA.y) > 622){
								needDeleteBut.push(bulletNameArr.splice(i,1));
								bulletArrayOfDi.splice(i,1);
								len = len - 1;
							}
						}
					}
					if(bulletArray.length>0){
						for(var j=0,lenJ=bulletArray.length; j<lenJ; j++){
							var btlB = bulletArray[j];
							if(parseInt(btlB.x) < 0 || parseInt(btlB.y) < 0 || parseInt(btlB.x) > 1366 || parseInt(btlB.y) > 622){
									needDeleteBut.push(btlB.bulletname);
									bulletArray.splice(j,1);
									lenJ = lenJ - 1;
							}
						}
					}
					if(needDeleteBut.length>0){ //有需要删除的子弹，对子弹进行删除
						var obj = {
							method:'post',
							url:'../php/bulletServer.php',
							cbfn:deleteBullet,
							arg:{username:username,needDeleteBut:JSON.stringify(needDeleteBut),forWhat:'deleteBullet'}
						}	
						// var method = obj.method,url = obj.url,cbfn = obj.cbfn,arg = obj.arg;
						//$username,$roomnum,$x,$y,$direction
						getNewResult(obj);
					}
				},1000);
			}


			function deleteBullet(arg){
				console.log(arg);
			}

			
			//子弹处理函数
			function forBulletController(panker,username){
				if(panker.direction == 'right'){
					var x = panker.x + 70;
					var y = panker.y + 18;
				}else if(panker.direction == 'left'){
					var x = panker.x-20;
					var y = panker.y +18;
				}else if(panker.direction == 'top'){
					var x = panker.x + 23;
					var y = panker.y - 37;
				}else if(panker.direction == 'bottom'){
					var x = panker.x + 23;
					var y = panker.y + 76;
				}
				var direction = panker.direction;
				//创建子弹
				function bullerInfo(bulletname){
					var arg = {
						x:x,
						y:y,
						direction:direction,
						ctx:ctx,
						owener:panker.username,
						panker:panker,
						bulletname:bulletname
					}
					var bulletA = new bullet(arg);
					bulletArray.push(bulletA);
				}
				//处理ajax请求，子弹数量-1
				var obj = {
					method:'post',
					url:'../php/bulletServer.php',
					cbfn:getBulletName,
					arg:{username:username,direction:direction,x:x,y:y,forWhat:'insertBullet'}
				}	
				// var method = obj.method,url = obj.url,cbfn = obj.cbfn,arg = obj.arg;
				//$username,$roomnum,$x,$y,$direction
				getNewResult(obj);

				function getBulletName(arg){
					if(arg !== 'failed' && arg !== '' && arg.indexOf('error') === -1 && arg.indexOf('<b>') === -1){
						if(arg === 'noBullet'){
							//无子弹，发出警告
							$('#bulletnum').css({'color':'red',fontWeight:700}).stop().animate({fontSize:18,marginLeft:5,marginTop:-2},400,function(){
								$(this).stop().animate({fontSize:16,marginLeft:10,marginTop:0},400,function(){
									$(this).css({'color':'black',fontWeight:400});
								});
							});
						}else{ //有子弹，创建子弹
							var json = JSON.parse(arg);
							var bulletname = json['bulletname'];
							var bulletnum = json['bulletnum'];
							bullerInfo(bulletname);
							//更改显示子弹数量
							$('#bulletnum').text('子弹数量：'+bulletnum);
						}
					}
				}
			}

			var pzbult = null;
			function pzfun(panker){
				var x = panker.x;
				var y = panker.y;
				for (var i = bulletArray.length - 1; i >= 0; i--) {
					var bx = bulletArray[i].x;
					var by = bulletArray[i].y;
					var direction = bulletArray[i].direction;
					if(direction === 'left' || direction === 'right'){
						var fx = 20;
						var fy = 25;
						var fd = 20;
					}else{
						var fx = 19;
						var fy = 25;
						var fd = 27;
					}
					if(Math.sqrt(Math.pow(x+fx - bx, 2) + Math.pow(y+fy - by, 2)) <= fd){
						if(pzbult !== null && pzbult.bulletname ===  bulletArray[i].bulletname){
							return;
						}
						ctx.clearRect(bx-10,by-10,30,30);
						pzbult = bulletArray[i];
						var bulletname = bulletArray[i].bulletname;
						//触发碰撞事件
						var obj = {
							method:'post',
							url:'../php/bulletServer.php',
							cbfn:refreshUserInfo,
							arg:{username:username,bulletname:bulletname,bpzname:panker.username,forWhat:'refreshUserInfo'}
						}
						getNewResult(obj);
					}
				}
				function refreshUserInfo(arg){
					console.log(arg);
					if(arg !== 'failed' && arg !== '' && arg.indexOf('error') === -1){
						// var json = JSON.parse(arg);
						// $('#killNum').text('杀敌数量：'+arg[0]['killNum']);
						clearInterval(pzbult.timer);
						pzbult.clearBullet();
						var index = bulletArray.indexOf(pzbult);
						bulletArray.splice(index,1);

						// if(arg === 'killed'){
						// 	users.s
						// }
					}
				}
			}
			setInterval(function(){
				for (var i = users.length - 1; i >= 0; i--) {
					pzfun(users[i]);
				}
			},16);
		}
