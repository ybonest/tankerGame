<?php
	require "../php/mysql.php"; 

	if($_SERVER['REQUEST_METHOD'] === 'POST'){

		$playerC = isset($_POST['playerC']) ? $_POST['playerC'] : '';
		if($playerC === 'goST'){
			$username = isset($_POST['username']) ? $_POST['username'] : '';
			$password = isset($_POST['password'])?$_POST['password'] : '';
			$roomname = isset($_POST['roomname'])?$_POST['roomname'] : '';
			if($username !== '' &&  $roomname !== ''){
				$result = gameRoomStatus($username,$password,$roomname);
				echo $result;

			}
		}else{
			$result = createRoom();
			if($result !== 'failed'){
				echo $result;
			}else{
				echo 'failed';
			}
		}
		
	}
	//右侧点击无密码房间
	// function gameRoonNoScrete($username,$roomname){
	// 	//查询当前房间用户数据
	// 	$sql = "select count(1) as num from tem_user where roomnum in (select roomnum from game_room WHERE roomname = '{$roomname}');";
	// 	$result = select($sql);
	// 	if($result !== 'failed' && count($result) > 0 && $result[0]['num'] < 6){  //房间可以进入

	// 	}
	// }
	//判断当前房间是否满员,并验证密码
	function gameRoomStatus($username,$password,$roomname){
		//查询当前房间用户数据
		$sql = "select count(1) as num from tem_user where roomnum in (select roomnum from game_room WHERE roomname = '{$roomname}');";
		$result = select($sql);
		if($result !== 'failed' && count($result) > 0 && $result[0]['num'] < 6){  //房间可以进入
		//查询当前房间密码以及id
		$selecSql = "select roompsw,roomnum from game_room WHERE roomname = '{$roomname}'";
		$resultPsw = select($selecSql);
		$resultPswCC = $resultPsw[0]['roompsw']; 
			if($password !== ''){  //输入密码进入
				if($resultPsw !== 'failed' && count($resultPsw) > 0 && $resultPswCC !== ''){
					// $cpassword = $resultPsw[0]['roompsw'];
					if($resultPswCC === $password){
						//密码正确，用户进入房间
						$backflag = changUsertem($resultPsw[0]['roomnum'],$username);
						if($backflag === 'failed'){
							return 'failed'; //插入user_tmp失败
						}else{
							//跳入等待页面
							// header("Location:../php/waiting.php");
							return 'success';
						}
					}else{
						return 'wrongPsw';
					}
				}else{
					return 'failed'; //查询用户密码失败
				}
			}else {  //普通房间进入
				$backflag = changUsertem($resultPsw[0]['roomnum'],$username);
				if($backflag === 'failed'){
					return 'failed'; //插入user_tmp失败
				}else{
					//跳入等待页面
					// header("Location:../php/waiting.php");
					return 'success';
				}
			}
		}else if($result[0]['num'] > 6){  //房间满员
			return 'roomMan'; 
		}else{ //数据返回失败
			return 'failed';
		}
	}
	//用户进入等待区，修改tmp_user表
	function changUsertem($roomnum,$username){
		//查询当前房间用户数量，以便确定该用户状态
		$sqlCountUser = "SELECT count(1) as count FROM tem_user where roomnum = {$roomnum};";
		$resultCountUser = select($sqlCountUser);
		if($resultCountUser==='failed'||count($resultCountUser) == 0){
			// echo '';
			return 'failed';  //用户初始化失败
		}
		//获取坦克基本信息
		$sqlRoom = "select * from pankerstatus";
		$pankerResult = select($sqlRoom);

		if($pankerResult==='failed'||count($pankerResult) == 0){
			return 'failed';  //用户初始化失败
		}
		//test
		// return $resultCountUser;
		$count = $resultCountUser[0]['count'];
		$x =  $pankerResult[$count]['posX'];
		$y =  $pankerResult[$count]['posY'];
		$direction =  $pankerResult[$count]['direction'];

		$sql = "INSERT INTO panker_game.tem_user (username,posX,posY,live,bulletnum,panker,userlife,direction,roomnum,serialNum) VALUES ('{$username}','{$x}','{$y}','3','10','cmnpanker','3','{$direction}',{$roomnum},{$count});";
		$result = insert($sql);
		if($result === 'failed'){
			return 'failed'; //"插入数据失败";
		}else{
			return 'success';
		}
	}

	//创建房间
	function createRoom(){
		if($_SERVER['REQUEST_METHOD'] === 'POST'){
			
			$roomname = isset($_POST['roomname'])?$_POST['roomname']:'';
			$password = isset($_POST['password'])?$_POST['password']:'';
			$username = isset($_POST['username'])?$_POST['username']:'';	
			
			if($roomname==''||$password==''||$username==''){
				//此后还需完成服务端预防为空时返回给页面的数据，此时暂不做

				return 'failed';
			}
			
			//查询房间名是否已经存在，存在则重新定义名称
			$serach = "SELECT * FROM game_room WHERE roomname = '{$roomname}';";
			$sercResult = select($serach);
			if(count($sercResult)>0){
				$roomname = 'gameroom is existed,please change a name';
				$array = array('roomname' => $roomname,'password' => $password);
				return json_encode($array);
			}
			
			$sql = "INSERT INTO game_room (roomname,roompsw,isbegin,roommaster) VALUES ('{$roomname}','{$password}','0','{$username}');";
			$result = insert($sql);
			
			if($result === 'success'){
				//返回房间号
				$sltSql = "select roomnum from game_room where roomname = '{$roomname}';";
				$sltResult = select($sltSql);
				
				if($sltResult !== 'failed' && count($sltResult) > 0 && count($sltResult[0]) > 0){
					return $sltResult[0]['roomnum'];
				}else{
					return 'failed';  
				}
			}
		}
	}
 ?>