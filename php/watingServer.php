<?php
	require "mysql.php";

	if($_SERVER['REQUEST_METHOD'] === 'POST'){

		$username = isset($_POST['username']) ? $_POST['username'] : '';
		$requestflag = isset($_POST['requestflag']) ? $_POST['requestflag'] : '';

		if($username !== ''&& $requestflag !== ''){
			if($requestflag === 'init'){
				$result = refreshUser($username);
				if($result !== 'failed'){
					echo $result;
				}else{
					echo 'failed';
				}
			}else if($requestflag === 'changB'){
				$result = changeZB($username);
				if($result !== 'failed'){
					echo $result;
				}else{
					echo 'failed';
				}
			}else if($requestflag === 'changSTT'){
				$result = isCanBegin($username);
				echo $result;
				// var_dump($result);
			}else if($requestflag === 'checkS'){
				$result = isCanBeginTwo($username);
				echo $result;
			}
		}
	}else{
		echo "wrong";
	}

	function isCanBeginTwo($username){
		$sql = "select count(1) as num from tem_user where roomnum in (select roomnum from tem_user where username = '{$username}');";
		$result = select($sql);
		if($result !== 'failed' && count($result) > 0 && intval($result[0]['num'],10) >= 2){
			return 'success';
		}else if($result !== 'failed' && count($result) > 0 && intval($result[0]['num'],10) < 2){
			return 'failed';
		}else{
			return 'wrong';
		}
	}

	//游戏开始函数
	function isCanBegin($username){
		//判断用户是否是房主，是则允许操作
		$sql = "select roommaster,roomnum from game_room where roommaster = '{$username}' and isbegin = '0' and roomnum in (select roomnum from tem_user where username = '{$username}');";
		$result = select($sql);
		if($result !== 'failed' && count($result)>0){
			$updateSql = "update game_room set isbegin = '1' where isbegin = '0' and roommaster = '{$username}';";
			$updateResultHH = update($updateSql);
			if($updateResultHH === 'success'){
				$roomnum = $result[0]['roomnum'];
				//房间状态修改成功，修改同房间用户状态
				$updateRoomUserSql = "update createuser set userstatus = 2 where userroom = {$roomnum}";
				$updateRoomUser = update($updateRoomUserSql);
				if($updateRoomUser === 'success'){
					return 'success';
				}else{
					return 'failed1';
				}
			}else{
				return 'failed2';
			}
		}
	}

	//游戏开始函数
	// function isCanBeginSJ($username){
	// 	//判断用户是否是房主，是则允许操作
	// 	$sql = "select roommaster,roomnum from game_room where roommaster = '{$username}' and isbegin = '0' and roomnum in (select roomnum from tem_user where username = '{$username}');";
	// 	$result = select($sql);
	// 	if($result !== 'failed' && count($result)>0){
	// 		$updateSql = "update game_room set isbegin = '1' where isbegin = '0' and roommaster = '{$username}';";
	// 		$updateResultHH = update($updateSql);
	// 		if($updateResultHH === 'success'){
	// 			$roomnum = $result[0]['roomnum'];
	// 			//房间状态修改成功，修改同房间用户状态
	// 			$updateRoomUserSql = "update createuser set userstatus = 2 where userroom = {$roomnum}";
	// 			$updateRoomUser = update($updateRoomUserSql);
	// 			if($updateRoomUser === 'success'){
	// 				return 'success';
	// 			}else{
	// 				return 'failed1';
	// 			}
	// 		}else{
	// 			return 'failed2';
	// 		}
	// 	}
	// }

	//1、更新用户表用户状态以及所在房间房间
	//2、获取tem_user标用户序列号，返回数据，以便用户位置，更新遮罩的显示与否
	function refreshUser($username){

		// $sqlU = "SELECT roomnum,serialNum FROM tem_user WHERE username = '{$username}';";
		$sqlU = "SELECT tem.roomnum,tem.serialNum,cuser.userstatus FROM tem_user tem 
			left join createuser cuser on tem.username = cuser.username WHERE tem.username = '{$username}';";
		$seletResult = select($sqlU);
		
		if($seletResult !== 'failed' && count($seletResult) > 0){

			$roomnum = $seletResult[0]['roomnum'];
			$updateSql = "UPDATE createuser SET userstatus= 1,userroom = '{$roomnum}' WHERE username = '{$username}' and userstatus = 0;";
			$updateResult = update($updateSql);
			$selectMaster = "select roommaster from game_room where roomnum = {$roomnum};";
			$master = select($selectMaster);

			// return json_encode($master);

			if($updateResult === 'success'){
				$result = array();
				$serialNum = $seletResult[0]['serialNum'];
				if($master !== 'failed' && count($master) > 0){
					$master = $master[0]['roommaster'];
					$userstatus = $seletResult[0]['userstatus'];
					$result = array('serialNum'=>$serialNum,'master'=>$master,'userstatus'=>$userstatus);				
				}else{
					$result = array('serialNum'=>$serialNum,'master'=>'failed','userstatus'=>$userstatus);				
				}
				return json_encode($result);
			}else{
				return 'failed';  //更新数据失败
			}
		
		}else {
			return 'failed'; //查询失败
		} 
	}

	function changeZB($username){
		// $sql = "select username,serialNum from tem_user where roomnum in (select roomnum from tem_user where username = '{$username}');";
		$sql = "select tem.username,tem.serialNum,cuser.userstatus from tem_user tem 
					left join createuser cuser on tem.username = cuser.username 
					where tem.roomnum in (select roomnum from tem_user where username = '{$username}');";
		$result = select($sql);
		if($result!=='failed'&&count($result)>0){
			return json_encode($result);
		}else{
			return 'failed';
		}
	}

	//3、用户在等待界面，可以选择在六个方块的位置
	// function chooseStyle($username){

	// }
	
	
	//4、当等待用户>=2时，房间拥有者可以选择开始与否，若房间是随机生成则，或者房间拥有者不选择开始，则等待30s自动开始游戏
	//5、游戏开始，更新用户状态（主界面为0，waiting为1，游戏为2），房间状态（是否已经开战（0，1））

 ?>