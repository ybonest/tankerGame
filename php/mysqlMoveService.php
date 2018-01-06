<?php 
	require "mysql.php";

	if($_SERVER['REQUEST_METHOD'] === 'POST'){
		//判断是否用户为空
		$username = empty($_POST['username']) ? '' : $_POST['username'];
		$forwhat = empty($_POST['forwhat']) ? '' : $_POST['forwhat'];
		$bulletNameArr = empty($_POST['bulletNameArr']) ? '' : $_POST['bulletNameArr'];
		if($username === ""){
			echo "用户不存在";
		}else{
			if($forwhat === 'getUserInfo'){
				$result = getUserInfo($username);
				echo $result;
			}else{
				move($username);  //用户移动更新
				$usersInfo = getUsers($username,$bulletNameArr); //返回同房间用户
				$users = $usersInfo ? $usersInfo : '';

				echo $users;
			}
		}
	}else{//初始化跳转
		$username = empty($_GET['username']) ? '' : $_GET['username'];
		if($username !== ''){
			//查询数据库该用户是否存在
			$sql = "select count(1) from tem_user where live = 1 and username = '{$username}';";
			$result = select($sql);
			if($result !== 'failed' && count($result) > 0){
				header("Location:../html/game.php?username={$username}"); 
			}
		}
	}

	function getUserInfo($username){
		$sql = "select * from tem_user where username = '{$username}';";
		$result = select($sql);
		if($result !== 'failed' && count($result) > 0){
			return json_encode($result);
		}else{
			return 'failed';
		}
	}

	//移动存储信息
	function move($username){
		//获取当前用户移动信息
		$x = isset($_POST['x']) ? $_POST['x'] : "";
		$y = isset($_POST['y']) ? $_POST['y'] : "";
		$direction = isset($_POST['direction']) ? $_POST['direction'] : "";
		if($x === "" || $y === "" || $direction === ""){
			return;
		}

		//将位置信息存入对应用户文件
		if($username !== "用户不存在"){

			$sql = "UPDATE panker_game.tem_user SET posX = '{$x}',posY = '{$y}',direction = '{$direction}' WHERE username = '{$username}'";
			$result = update($sql);
			if($result === 'failed'){
				echo '数据更新失败';
			}
		}
	}
	
	//同房间其他用户
	// function getUsers($username){
	// 	$sql = "SELECT * FROM tem_user WHERE username != '{$username}' AND roomnum in 
	// 		(select roomnum FROM tem_user WHERE username = '{$username}')";
	// 	$usersInfo = select($sql);
	// 	// $sql = "SELECT * FROM panker_game.tem_user WHERE username != '{$username}'";
	// 	$bltSql = "select * from bullet WHERE username != '{$username}' AND roomnum in 
	// 		(select roomnum FROM tem_user WHERE username = '{$username}');";
	// 	$bltInfo = select($bltSql);
	// 	if($usersInfo === 'failed'){
	// 		return false;
	// 	}else if(count($usersInfo) === 0){
	// 		return 'none'; //表示暂无可更新数据
	// 	}else{
	// 		return json_encode($usersInfo);
	// 	}
	// }

	function getUsers($username,$bulletNameArr){
		$sql = "SELECT * FROM tem_user WHERE roomnum in 
			(select roomnum FROM tem_user WHERE username = '{$username}') and live != '0';";
		$usersInfo = select($sql);
		// return $bulletNameArr;
		// $sql = "SELECT * FROM panker_game.tem_user WHERE username != '{$username}'";
		// return $bulletNameArr;
		if($bulletNameArr !== ''){
			$bulletNameJson = json_decode($bulletNameArr,true);
			if(count($bulletNameJson) > 0){
				$stringBll = implode("','", $bulletNameJson);
				$stringBll = "'".$stringBll."'";
				$bltSql = "select * from bullet WHERE username != '{$username}' AND roomnum in 
						(select roomnum FROM tem_user WHERE username = '{$username}') and bulletname not in ({$stringBll});";
			}else{
				$bltSql = "select * from bullet WHERE username != '{$username}' AND roomnum in 
						(select roomnum FROM tem_user WHERE username = '{$username}');"; // and bulletname not in ($bulletNameArr)
			}
		}
		$bltInfo = select($bltSql);
		if($usersInfo === 'failed' || $bltInfo === 'failed'){
			return false;
		}
		$array = array();
		if(count($usersInfo) === 0){
			$array['usersInfo'] = 0; //表示暂无可更新数据
		}else{
			$array['usersInfo'] = $usersInfo;
		}
		if(count($bltInfo) === 0){
			$array['bltInfo'] = 0;
		}else{
			$array['bltInfo'] = $bltInfo;
		}
		return json_encode($array);
	}

	// //处理搜寻数据
	// function dealInfo($data){
	// 	$array = array();
	// 	$arrayforPanker = array();
	// 	$arrayforBullet = array();
	// 	foreach ($data as $value) {
			
	// 	}
	// }
 ?>