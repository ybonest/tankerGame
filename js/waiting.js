$(function() {
	console.log($('#forUserName').val());
	if($('#forUserName').val() === ''){
		location.href = '../main.php';
		return;
	}
	(function(){
		var timer = null; //定时器
		function changZ(arg){
			if(arg !== 'failed' && arg.indexOf('error')===-1 && arg !== ''&& arg !== 'wrong'){
				var json = JSON.parse(arg);
				for(var i=0;i<json.length;i++){
					if(json[i].username === $('#forUserName').val() && json[i].userstatus === '2'){
						// $('.begin').css('display','none');
						clearInterval(timer);
						djTime();
						return;
					}
					$('li').eq(json[i]['serialNum']).children('.zz').fadeOut().siblings('.waiting').css('display','none');
					$('li').eq(json[i]['serialNum']).children('p').val(json[i]['username']);
				}
			}
		}
		
		function refresh(arg){
			console.log(arg);
			if(arg !== 'failed' && arg.indexOf('error')===-1&& arg !== '' && arg !== 'wrong'){
				var json = JSON.parse(arg);
				$('li').eq(json['serialNum']).children('.zz').fadeOut().siblings('.waiting').css('display','none');
				if(json['master'] === $('#forUserName').val()&&json['userstatus'] !== '2'){
					$('li').eq(json['serialNum']).children('.begin').css('display','block');
				}
			}
		}
		
		var arg1 = {url:'../php/watingServer.php',sendarg:'username='+$('#forUserName').val()+'&requestflag=init'};
		getResult(arg1,refresh);
		
		var arg2 = {url:'../php/watingServer.php',sendarg:'username='+$('#forUserName').val()+'&requestflag=changB'};
		var timerCount = 0;
		
		timer = setInterval(function(){ //此处添加用户状态检查，等用户状态变为进入游戏状态后，跳转到游戏界面
			getResult(arg2,changZ);
			timerCount += 2;
			if(timerCount >=2400){  //超过120s清除定时器,游戏自动开始并更改房间状态
				clearInterval(timer);
				var arg3 = {url:'../php/watingServer.php',sendarg:'username='+$('#forUserName').val()
							+'&requestflag=changSTT'};
				getResult(arg3,changeStutus);
			}
		},1000);
		
		//修改房间状态，（暂未完成）
		// function changeStatusOfRoom(arg){ 
		// 	if(arg !== 'failed' && arg.indexOf('error')===-1&& arg !== '' && arg !== 'wrong'){
		// 		//状态修改成功，倒计时五秒进入游戏
		// 		$('.djtime').css({'display':'block','font-size':'50px'}).html('游戏即将开始！');
		// 		setTimeout(function(){
		// 			djTime();
		// 		},2000);
		// 	}
		// }

		//倒计时5s
		function djTime(){
			
			var timer = null,count = 5;
			$('.djtime').css({'display':'block','font-size':'50px'}).html('游戏即将开始！');
			timer = setInterval(function(){
				if(count === 0){
					//进入游戏界面
					clearInterval(timer);
					location.href='../php/mysqlMoveService.php?username='+$('#forUserName').val();
				}
				$('.djtime').css({'font-size':'120px','display':'block'});
				$('.djtime').html(count);
				count--;
			},1000);
		}
		//如果是房主，执行如下函数
		var flagCC = true;
		$('.begin').on('click',function(){
			//判断当前用户
			var arg4 = {url:'../php/watingServer.php',sendarg:'username='+$('#forUserName').val()
							+'&requestflag=checkS'};
			getResult(arg4,checkSSS);
			if(flagCC){
				return;
			}
			clearInterval(timer);
			//更改房间状态为游戏开始状态
			var arg3 = {url:'../php/watingServer.php',sendarg:'username='+$('#forUserName').val()
							+'&requestflag=changSTT'};
			getResult(arg3,changeStutus);
			//更改同房间用户游戏状态
			//弹出倒计时框
			
		});
		function checkSSS(arg){
			if(arg === 'success'){
				flagCC = false;
			}else if(arg === 'failed'){
				$('.djtime').css({'font-size':'50px'}).html('游戏人数不足请耐心等待！').fadeIn(function(){
					setTimeout(function(){
						$('.djtime').fadeOut();
					},2000)
				});
			}
		}
		function changeStutus(arg){
			//arg 返回成功，则弹出倒计时
			if(arg === 'success'){
				//清除用户查询定时器
				clearInterval(timer);
				djTime();
			}
		}
	})();
});