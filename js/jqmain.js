$(function(){
	(function(){
		var arg1 = {url:'../php/mysqlGameService.php',sendarg:'forwhat=init'};
		getResult(arg1,firstGoIn);
		function firstGoIn(arg){
			
			if(arg !== 'failed' && arg.indexOf('error') === -1){
				var json = JSON.parse(arg);
				$('#forUserName').val(json.username);
				if(json.userstatus !== '0'){
					$('.zhezhao').css('display','block');
					$('.zhezhao').addClass('remaind');
					$('.zhezhao').html('您已经在游戏中，3秒后自动跳转到等待区!');
					var time = 3;
					var timer = setInterval(function(){
						$('.zhezhao').removeClass('remaind').addClass('Time');
						$('.zhezhao').html(time--);
						if(time === 0){
							location.href = '../html/waiting.php?username='+$('#forUserName').val()+'&playerC=isBB';
						}
					},1000);
				}
				forAll();
			}
		}
	})();
	
	function forAll(){
		var timer = null;
		var timerTh = null;
		var top = 0; 
		var heightInner = $('.inner').height();
		var twoHeigth = $('.two').height();


		function animate(){
			clearInterval(timer);
			timer = setInterval(function(){
				if(Math.abs(top)>=$('.inner ul').height()-$('.inner').height()){
					$('.inner ul').css("top",'-6px');
					top = -6;
				}
				$('.inner ul').css("top",(top--)+'px');
			},16)
		}
		function scroll() {
			return {
	  			left: window.pageXOffset || document.documentElement.scrollLeft,
	   			top: window.pageYOffset || document.documentElement.scrollTop
				}
		}
		function forUlAni(){
			if($('.inner ul').height()>heightInner){
				
				$('.inner ul li').eq(0).clone().appendTo('.inner ul');
				$('.inner ul li').eq(0).nextUntil($('.inner ul li').eq(9)).clone().appendTo('.inner ul');
				var heightUl = $('.inner ul').height();
				$('.two').hover(function(){
					clearInterval(timer);
				},function(){
					animate(top);
				});
				animate(top);
			}
		}


		$('#fangjia #roomname').blur(function(){
			if ($(this).val() == '') {
				$(this).css('color','red');
				$(this).val("roomname can't empty");
			}
		}).focus(function(){
				$(this).css('color','black');
				if($(this).val() === "roomname can't empty" || $(this).val() === 'gameroom is existed,please change a name'){
					$(this).val('');
				}
		});

		$('#fangjia #password').blur(function(){
			if ($(this).val() == '') {
				$(this).addClass('pascolor');
				$(this).attr('placeholder',"password can't empty");

			}
		}).focus(function(){
				$(this).removeClass('pascolor');
				$(this).attr('placeholder',"password");
		});

		//房间创建
		$('#fangjia #submit').on('click',function(){
			if($('#roomname').val()==''||$('#password').val()==''){
				return false;  //阻止按钮提交
				//或者使用，如下方法
				//var event = event || window.event;
					//event.preventDefault(); // 兼容标准浏览器
					//window.event.returnValue = false; // 兼容IE6~8
			}
			//回调，使用ajax传参
			// console.log($('#password').val());
			var password = document.getElementById('password').value;
			var arg1 = {url:'../php/gameroom.php',sendarg:'roomname='+$('#roomname').val()+'&password='+
							$('#password').val()+'&username='+$('#forUserName').val()};
			getResult(arg1,forCanshu);
		});

		//房间创建回调以及页面跳转
		function forCanshu(arg){
			if(arg !== '' && arg.indexOf('{') !== -1 && arg.indexOf('error') === -1){
				var json = JSON.parse(arg);
				$('#fangjia').css('display','block');
				$('.zhezhao').css('display','block');
				$('#roomname').css('color','red');
				$('#roomname').val(json.roomname);
				$('#password').val(json.password);	
			}else if(arg !== 'failed'){
				forStatusOfUser(arg);
			}else {
				console.log('something wrong');
			}
		}

		//房间创建成功后，进行后台数据处理，更新tem_user初始化表，createuser表用户状态
		function forStatusOfUser(arg){
			var arg1 = {url:'../php/mysqlGameService.php',sendarg:'playerC=CS&username='+$('#forUserName').val()+'&roomnum='+arg};
			getResult(arg1,function(arg){
				if(arg === 'success' && arg.indexOf('error') === -1 && arg !== ''){
					location.href = '../html/waiting.php?username='+$('#forUserName').val();
				}
			});
		}


		$('#createR').on('click',function(){
			$('#fangjia').css('display','block');
			$('.zhezhao').css('display','block');
		});


		// $('#createS').on('click',function(){
		// 	$('#goRoomS').css('display','block');
		// 	$('.zhezhao').css('display','block');
		// });

		$('.zhezhao').on('click',function(){
			$('.fangjia').css('display','none');	
			$('.zhezhao').css('display','none');
			$('.secret').css({'display':'none'});
			$('#goScrect').css({'display':'none'});	
			// $('.inner ul').off();
			// onmouse();
		});

		//选择随机进入房间
		$('#randomRoom').on('click',function(){
			var arg1 = {url:'../php/mysqlGameService.php',sendarg:'playerC=Sj&username='+$('#forUserName').val()};
			getResult(arg1,GoInRoom);
			function GoInRoom(arg){
				if(arg !== 'failed' && arg !== ''){
					var json = JSON.parse(arg);
					if(json.username === $('#forUserName').val()&&json.count !== '' && json.roomnum !== ''){
						location.href = '../html/waiting.php?username='+$('#forUserName').val();
					}
				}
			}
			// function goInWating(arg){

			// }
		});

		function statusScretFn(arg){
			if(arg === 'success'){
				location.href = '../html/waiting.php?username='+$('#forUserName').val();
			}else if( arg === 'wrongPsw'){
				$('#passwordG').val('');
				$('#passwordG').addClass('pascolor');
				$('#passwordG').attr('placeholder',"password is wrong");
			}else if(arg === 'roomMan'){
				alert('房间已经满员');
			}else{
				console.log(arg);
				console.log('wrong');
			}
		}

		//后续主要是点击进入房间

		function onmouse(){
			// $('.inner ul').on('mouseenter',function(){
			// 	clearInterval(timerTh);
			// }).on('mouseleave',function(){
			// 	refreshInterval();
			// });
		}
		function bindEvent(){
			onmouse();
			//为房间绑定事件，如果游戏无密码且未开始，直接进入等待界面，如果游戏有密码且未开始弹出输入密码框
			$('.inner li a').on('click',function(){
				$('.inner ul').off();	
				var statusScret = $(this).siblings('.statusScret').text();
				if(statusScret === '无密码'){
					console.log('dddYY');
					var arg1 = {url:'../php/gameroom.php',sendarg:'playerC=goST&username='+$('#forUserName').val()
						+'&roomname='+$(this).text()};
					getResult(arg1,statusScretFn);
				} else if(statusScret === '有密码'){
					//弹出框，输入密码处理
					$('.zhezhao').css('display','block');
					$('#goRoomS').css({'display':'block'});
					$('#goRoomS #roomnameG').val($(this).text());
				}
			});
		}


			//1、有密码处理，弹出框，输入密码处理，密码正确，查询房间状态，如果游戏未开始，且用户量＜6，进入
				//2、查询房间状态，如果游戏未开始，且用户量＜6，进入
			$('#goRoomS #submitG').on('click',function(){
				$password = $('#goRoomS #passwordG').val();
				if($password == ''){
					$('#goRoomS #roomnameG').addClass('pascolor');
					$('#goRoomS #roomnameG').attr('placeholder',"password can't empty");
					return;
				}
				var arg1 = {url:'../php/gameroom.php',sendarg:'playerC=goST&username='+$('#forUserName').val()
						+'&password='+$password+'&roomname='+$('#goRoomS #roomnameG').val()};
				getResult(arg1,statusScretFn);
			});
			
			$('#goRoomS #roomnameG').focus(function(){
				$(this).css('color','black');
				$('#goRoomS #roomnameG').removeClass('pascolor');
				$('#goRoomS #roomnameG').attr('placeholder',"please input password");
				if($(this).val() === "password is wrong"){
					$(this).val('');
				}
			});
		
		
		var count = 0;
		refreshInterval();
		function refreshInterval(){
			var get = {
					method:'get',
					cbfn:refreshRoom,
					url:'../php/mysqlGameService.php',
					arg: {forRefresh:'refresh'}
				};
			getNewResult(get);
			clearInterval(timerTh);
			timerTh = setInterval(function(){
				getNewResult(get);
			},5000);
		}
		//添加房间模块更新事件，每隔3s查询一下房间有没有新增
		//获取当前
		function refreshRoom(arg){
			if(arg !== 'failed' && arg.indexOf('error') === -1 && arg !== ''){
				$('ul.forappend').empty();
				if(arg === '0'){
					return;
				}
				var json = JSON.parse(arg);
				for(var i=0,len = json.length; i < len; i++){
					$('ul.forappend').append(forString(json[i]));

				}
			}
			//为新元素重新绑定事件
			bindEvent();
			forUlAni();
		}
		function forString(arg){
			return '<li class="alert alert-primary">'+
				'<span>房间：</span> '+
				'<a href="#">'+arg.roomname+'</a> '+
				'<strong>'+ arg.num +'</strong>'+
				'<span class="statusScret" style="float: right;">' + (arg.roompsw == null || arg.roompsw == '' ?'无密码':'有密码') +'</span>'+
			'</li>'
		}
		//房间查询模块
		searchRoom();
		function searchRoom(){
			$('#createSE').on('click',function(){
				$('.zhezhao').css('display','block');
				$('#goRoomSC').css('display','block');
			});
			$('#roomnameSC').on('focus',function(){
				$(this).css('color','black');
				if($(this).val() === 'no kong！'){
					$(this).val('');
				}
			})
			$('#submitSC').on('click',function(){
				var roomname = $('#roomnameSC').val();
				if(roomname === ''){
					$('#roomnameSC').val('no kong！').css('color','red');
				}else{
					var get = {
						method:'get',
						cbfn:serch,
						url:'../php/commnsqlfn.php',
						arg: {forserch:'searchRoom',roomname:roomname}
					};
					getNewResult(get);
				}
			});
			function serch(arg){
				if(arg === 'success'){
					$('#goRoomS').css('display','block');
					$('#roomnameG').val($('#roomnameSC').val());
					$('#roomnameSC').val('').css('color','black');
					$('#goRoomSC').css({'display':'none'});
				}else if(arg === '0'){
					$('#roomnameSC').val('查无房间').css({'color':'red'});
				}
			}
		}
		
	}

})