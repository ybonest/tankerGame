<?php 
	require "mysql.php";
	if($_SERVER['REQUEST_METHOD'] === 'POST'){
		$username = isset($_POST['username']) ? $_POST['username'] : '';
		$x = isset($_POST['x']) ? $_POST['x'] : '';
		$y = isset($_POST['y']) ? $_POST['y'] : '';
		$direction = isset($_POST['direction']) ? $_POST['direction'] : '';
		$forWhat = isset($_POST['forWhat']) ? $_POST['forWhat'] : '';
		$bulletname = isset($_POST['bulletname']) ? $_POST['bulletname'] : '';
		$bulletArray = isset($_POST['bulletArray']) ? $_POST['bulletArray'] : '';
		$needDeleteBut = isset($_POST['needDeleteBut']) ? $_POST['needDeleteBut'] : '';
		$bpzname = isset($_POST['bpzname']) ? $_POST['bpzname'] : '';

		if($forWhat === 'insertBullet' && $x !== '' && $y !== '' && $direction !== ''){
			$result = insertBulletAndUser($username,$x,$y,$direction);
			echo $result;
		}
		// if($forWhat === 'dealBullet' && $bulletArray !== ''){
		// 	$result = updateUserInfo($bulletArray);
		// 	echo $result;
		// }
		if($forWhat === 'getMoveInfo'){
			$result = getBulletPos($username);
			echo $result;
		}

		if($forWhat === 'deleteBullet' && $username !== '' && $needDeleteBut !== ''){
			$result = deleteBullet($username,$needDeleteBut);
			echo $result;
		}

		if($forWhat === 'refreshUserInfo' && $username !== '' && $bpzname !== ''){
			$result = pzBresh($bpzname,$username,$bulletname);
			echo $result;
		}

		if($forWhat === 'forGameOver' && $username !== ''){
			$result = forGameOver($username);
			echo $result;
		}
	}

	//更改用户子弹数量，并将子弹插入子弹记录表
	//该函数返回结果三种：noBullet/子弹名称/failed
	function insertBulletAndUser($username,$x,$y,$direction){
		//先判断当前用户子弹数量
		$sqlSrh = "select bulletnum,roomnum from tem_user where username = '{$username}';";

		$resultBltNum = select($sqlSrh);

		if($resultBltNum !== 'failed' && count($resultBltNum) > 0){
			$bulletNum = $resultBltNum[0]['bulletnum'];
			if($bulletNum === '0'){
				return 'noBullet'; //无子弹了
			}else{
				//有子弹则进行子弹存储，
				$roomnum = $resultBltNum[0]['roomnum'];
				$bulletname = $username."{$bulletNum}";
			 	$sqlInt = "INSERT into bullet (username,bulletX,bulletY,direction,roomnum,bulletname) 
			 				VALUES ('{$username}','{$x}','{$y}','{$direction}',{$roomnum},'{$bulletname}');";
			 	$resultBlt = insert($sqlInt);
			 	$bulletnum = intval($bulletNum,10) -1;
			 	// return $resultBltNum;
			 	//更改用户子弹数量
			 	$sqlUpt = "update tem_user set bulletnum = '{$bulletnum}' WHERE username = '{$username}' 
			 				and roomnum = '{$roomnum}';";
			 	$resultUpt = update($sqlUpt);
			 	if($resultBlt === 'success' && $resultUpt === 'success'){  //插入子弹成功
			 		$arr = array('bulletname'=>$bulletname,'bulletnum'=>$bulletnum);
			 		return json_encode($arr);
			 	}else{
			 		return 'failed';
			 	}
			}
		}else{	
			return 'failed';
		}
	}

	function deleteBullet($username,$needDeleteBut){
		$needDeleteArr = json_decode($needDeleteBut,true);
		$stringBll = implode("','", $needDeleteArr);
		$stringBll = "'".$stringBll."'";
		$bltSql = "delete from bullet where roomnum in 
				(select roomnum FROM tem_user WHERE username = '{$username}') and bulletname in ({$stringBll});";
		$result = delete($bltSql);
		return $result;	
	}

	//更改子弹位置，同时判断子弹位置，如果超出边界进行删除（放弃使用，不对数据进行更新处理）
	function updateUserInfo($bulletArray){
		//超出边界删除
		$bullets = json_decode($bulletArray,true);
		foreach ($bullets as  $val) {
			$x = $val['x'];
			$y = $val['y'];
			$bulletname = $val['bulletname'];
			$username = $val['owener'];
			
			if(intval($x,10) < 0 || intval($y,10) < 0 || intval($x,10) > 1366 || intval($y,10) > 622 ){
				$sql = "delete from bullet where username = '{$username}' and bulletname = '{$bulletname}';";
				$result = delete($sql);
				if(!$result){
					return 'failed';
				}
			}else{
				$sql = "update bullet set bulletX='{$x}',bulletY='{$y}' WHERE username = '{$username}' 
							and bulletname = '{$bulletname}';";
				$result = update($sql);
				if(!$result){
					return 'failed';
				}
				return $result;
				// $allBullet = getBulletPos($username);
				// return $allBullet;
			}
		}
	}

	//获取所有子弹位置以及方向
	function getBulletPos($username){
		$sql = "select * from bullet where roomnum in (select roomnum FROM tem_user WHERE username = '{$username}') 
				AND username != '{$username}';";
		$result = select($sql);
		$sqlOwn = "select * from bullet where username = '{$username}';";
		$slqOwnReslt = select($sqlOwn);

		$array = array();
		if($result !== 'failed' && count($result) > 0){
			$array['others'] = $result;
		}else if($result === 'failed'){
			return 'failed';
		}else if(count($result) === 0){
			$array['others'] = 0;
		}
		if($slqOwnReslt !== 'failed' && count($slqOwnReslt) > 0){
			$array['own'] = $slqOwnReslt;
		}else if($slqOwnReslt === 'failed'){
			return 'failed';
		}else if(count($slqOwnReslt) === 0){
			$array['own'] = 0;
		}
		return json_encode($array);
	}

	//当坦克与子弹碰撞时调用，获取子弹拥有者，更改子弹状态，拥有者状态，如果地方被杀死则修改killNum，更改撞击者状态
	//$bpzname:被撞者,$ownname：子弹拥有者,$bulletname：子弹名字,$roomnum：房间名称
	function pzBresh($bpzname,$ownname,$bulletname){
		//删除当前子弹
		$delSql = "delete from bullet where username = '{$ownname}' and bulletname = '{$bulletname}';";
		$del_result = delete($delSql);
		if($del_result === 'failed'){
			return 'failed';
		}
		//获取被撞坦克信息
		$bpz_sltSql = "select * from tem_user where username = '{$bpzname}';";
		$bpz_sltResult = select($bpz_sltSql);
		
		if($bpz_sltResult !== 'failed' && count($bpz_sltResult) > 0){
			$bpz_live = $bpz_sltResult[0]['live'];
			$now_bpz_live = intval($bpz_live,10) - 1;
			if($now_bpz_live <= 0){  //被撞击者生命清零，更改被撞击者信息与子弹拥有者信息
				//更改被撞击者状态(die);
				// $bpz_update_sql = "update tem_user set killByWho = '{$ownname}',live = '0' where username = '{$bpzname}';";
				// $bpz_update_result = update($bpz_update_sql);
				$bpz_delete_sql = "delete from tem_user where username = '{$bpzname}';";
				$bpz_delete_result = delete($bpz_delete_sql);
				if($bpz_delete_result === 'failed'){
					return 'failed';
				}
				$update_createuser = "update createuser set userstatus = 0,userroom = null where username='{$bpzname}';";
				$update_createuserRe = update($update_createuser);
				if($update_createuserRe === 'failed'){
					return 'failed';
				}

				//更改子弹拥有者状态，杀敌数量+1
				$own_select_slq = "select * from tem_user where username = '{$ownname}';";
				$own_select_result = select($own_select_slq);
				if ($own_select_result !== 'failed' && count($own_select_result) > 0) {
					$killNum = intval($own_select_result[0]['killNum'],10) + 1;
					$bulletnum = intval($own_select_result[0]['bulletnum'],10) + 2;
					$own_update_sql = "update tem_user set killNum = {$killNum},bulletnum = '{$bulletnum}' 
								where username = '{$ownname}';";
					$own_update_result = update($own_update_sql);
					if($own_update_result){
						// $own_select_result[0]['killNum'] = $killNum;
						return 'killed';
					}
				}else{
					return 'failed';  //查询子弹拥有者失败
				}

			}else{
				$bpz_update_sql = "update tem_user set killByWho = '{$ownname}',
					live = '{$now_bpz_live}' where username = '{$bpzname}';";
				$bpz_update_result = update($bpz_update_sql);
				if($bpz_update_result === 'failed'){
					return 'failed';
				}else{
					return 'success';
				}
			}
		}
	}

	function forGameOver($username){
		$deleteRoom = "delete from game_room where roomnum in (select roomnum from tem_user where username = '{$username}');";
		$deleteRoom_result = delete($deleteRoom);
		$deleteUser = "delete from tem_user where username = '{$username}';";
		$deleteUserR = delete($deleteUser);
		$update_createuser = "update createuser set userstatus = 0,userroom = null where username='{$username}';";
				$update_createuserRe = update($update_createuser);
		if($update_createuserRe === 'failed'){
			return 'failed';
		}
		if($deleteRoom_result === 'success' && $deleteUserR === 'success'){
			return 'success';
		}
	}

 ?>