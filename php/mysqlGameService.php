<?php 
	
	require "mysql.php";
	require "commnsqlfn.php";

	if($_SERVER['REQUEST_METHOD'] === 'POST'){

		//初始化创建用户		
		$forwhat = isset($_POST['forwhat']) ? $_POST['forwhat'] : '';

		$flag = checkeCookie();

		if($forwhat !== ''){
			if($flag === 'create'){
				$username = createUser();
				if($username !== 'failed'){
					$rback = json_encode(array('username'=>$username,'userstatus'=>'0'));
				}else{
					$rback = 'failed';
				}
			}else{
				$rback = json_encode($flag); 
			}
			if($rback!=='failed'){
				echo $rback;
			}else{
				echo 'failed';
			}
		}

		//进入等待区域
		$username = isset($_POST['username']) ? $_POST['username'] : '';
		$playerC = isset($_POST['playerC']) ? $_POST['playerC'] : '';
		$roomnum = isset($_POST['roomnum']) ? $_POST['roomnum'] : '';
		if($username !== ''){
			$result = initUser($username,$playerC,$roomnum);
			if($result !== 'failed'){
				print_r($result);
			}else{
				echo 'failed';
			}
		}
	}else{
		$forRefresh = isset($_GET['forRefresh']) ? $_GET['forRefresh'] : '';
		if($forRefresh === 'refresh'){
			$result = refreshRoomShow();
			echo $result;
		}
	}

	function refreshRoomShow(){
		$sql = "select a.roomname,a.roomnum,a.isbegin,a.roompsw,b.num from game_room a 
					left join (select roomnum,count(1) as num from tem_user GROUP BY roomnum) b 
					on a.roomnum = b.roomnum where isbegin = '0';";
		//分页查询
		// $sql = "select a.roomname,a.roomnum,a.isbegin,a.roompsw,b.num from game_room a 
		// 			left join (select roomnum,count(1) as num from tem_user GROUP BY roomnum) b 
		// 			on a.roomnum = b.roomnum where isbegin = '0' LIMIT {$page},{strto$page+9};"
		$result = select($sql);
		
		if($result!=='failed' && count($result) > 0){
			return json_encode($result);
		}else if(count($result) === 0){
			return '0';
		}else{
			return 'failed';
		}
	}

	//检测cookie,如果存在用户则检测用户状态，如果用户在等待区，或者游戏中，则直接进入等待区
	function checkeCookie(){
		$username = isset($_COOKIE['username']) ? $_COOKIE['username'] : '';
		
		if($username !== ''){
			$sqlS = "select username,userstatus from createuser where username = '{$username}'";
			$result = select($sqlS);
			if($result !== 'failed' && count($result) === 0){
				//有cookie，但数据库表中无此用户，重新创建
				return 'create';					
			}else{
				//都有，则不创建
				$userstatus = $result[0]['userstatus'];
				$resultback = array('username'=>$username,'userstatus'=>$userstatus);
				return $resultback;
			}
		}else{
			//没有cookie，所以创建临时用户
			return 'create';
		}
	}


	//进入页面创建用户
	function createUser(){
		$username = isUserExist();	//创建用户
		setcookie('username',$username,time() + 24 * 60 * 60,'/');  //跨域设置cookie时必须加'/'
		$insertSql = "INSERT INTO createuser (username,userstatus) VALUES ('{$username}',0);";
		$result = insert($insertSql);
		if($result === 'success'){
			return $username;
		}else{
			return 'failed';  //创建用户失败
		}
	}

	//随机进入房间，并返回一个随机房间号
	function randonRoom($username){
		//此处添加房间分配
		$roomresult = isAllowGoNum();  //判断当前有无可进的房间，若无则创建一个房间
		if(count($roomresult) === 0){
			$numname = uniqid();  //创建唯一标识
			$sql = "INSERT into game_room (roomname,roompsw,isbegin,roommaster) VALUES ('{$numname}',null,'0','{$username}')";
			$back = insert($sql);
			if($back === 'success'){
				$sql1 = "select roomnum from game_room WHERE roomname = '{$numname}';";
				$resS = select($sql1);
				// var_dump($resS);
				if($resS!=='failed'&&count($resS)>0){
					$roomnum = $resS[0]['roomnum'];
					return $roomnum;
				}else{
					return 'failed';  //返回房间号失败
				}
			}else{
				return 'failed';  //随机创建房间失败
			}
		}else {
			$roomnum = $roomresult[0]['roomnum'];
			return $roomnum;
		}
	}

	//进入房间，初始化用户状态
	function initUser($username,$playerC,$roomnum){
		$sqlRoom = "select * from pankerstatus";
		$pankerResult = select($sqlRoom);

		if($pankerResult==='failed'||count($pankerResult) == 0){
			return 'failed';  //用户初始化失败
		}

		if($playerC === 'Sj'){  //如果是随机选择房间
			$roomnum = randonRoom($username);
			//暂无房间则创建一个房间随机房间
			if($roomnum !== 'failed'){
				//查询当前房间用户数量，以便确定该用户状态
				$sqlCountUser = "SELECT count(1) as count FROM tem_user where roomnum = {$roomnum};";
				$resultCountUser = select($sqlCountUser);
				if($resultCountUser==='failed'||count($resultCountUser) == 0){
					// echo '';
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
				}
				$users = array('count'=>$count,'roomnum'=>$roomnum,'username'=>$username);
				return json_encode($users); //返回随机房间号
			}else{
				return 'failed';  //"分配房间失败";
			}
		} else if($playerC === 'CS') {   //选择房间进入

			if($roomnum !== ''){  //用户进入时携带房间号
				// $sqlCountUser = "SELECT count(1) FROM tem_user where roomnum = {$roomnum};";
				// $resultCountUser = select($sqlCountUser);
				
				// if($resultCountUser==='failed'||count($resultCountUser) == 0||$resultCountUser[0]>=6){
				// 	return 'failed';  //用户初始化失败
				// }
				
				//进入房间，初始化用户表
				// $count = $resultCountUser[0][0];
				$x =  $pankerResult[0]['posX'];
				$y =  $pankerResult[0]['posY'];
				$direction =  $pankerResult[0]['direction'];

				$sql = "INSERT INTO panker_game.tem_user (username,posX,posY,live,bulletnum,panker,userlife,direction,roomnum,serialNum) VALUES ('{$username}','{$x}','{$y}','3','10','cmnpanker','3','{$direction}',{$roomnum},0);";
				$result = insert($sql);
				
				if($result === 'failed'){
					return 'failed';  //"插入数据失败";
				}
				return 'success';
			}
		}
	}

	//判断用户名是否已经存在
	function isUserExist(){
		//产生一个随机数作为临时用户
		$intnum = random_int(3,5);
		$username = bin2hex(random_bytes($intnum));
		$sql = "SELECT * FROM panker_game.createuser tem WHERE tem.username = '{$username}';";
		// return $sql;
		$result = select($sql);
		if($result === 'failed'){
			return 'failed';
		}else if(count($result)>0){
			$username = isUserExist(); //递归直至产生正确的用户名
		}else{
			return $username;
		}
	}
 ?>