<?php 
	require_once "mysql.php";
	function isAllowGoNum(){
		$sql = "SELECT * FROM game_room ".
					"WHERE roompsw IS NULL AND isbegin = '0' AND roomnum IN ( ".
					"select m.roomnum FROM ".
					"(SELECT gr.roomnum,count(1) cnum FROM tem_user tem LEFT JOIN game_room gr ".
						"ON tem.roomnum = gr.roomnum GROUP BY gr.roomnum ) m ".
				"WHERE m.cnum < 6) ORDER BY roomnum LIMIT 0,1";
		$result = select($sql);
		if($result !== 'failed'){
			return $result;
		}else{
			return 'failed';
		}

	}

	function isAllowGoPage($username){
		if($username === ''){
			header("Location:/main.php");
			return;
		}
		$sql = "select userstatus from createuser where username = '{$username}'";
		$result = select($sql);
		if($result !== 'failed'){  //查询成功
			if(count($result) > 0){  //存在此用户判断状态
				$userstatus = intval($result[0]['userstatus'],10);
				if($userstatus === 2){
					header("Location:/html/game.php");
				}else if($userstatus === 1){
					header("Location:/html/waiting.php");
				}else{
					header("Location:/main.php");
				}
			}
		}
	}
	$forserch = isset($_GET['forserch']) ? $_GET['forserch'] : '';
	if ($forserch === 'searchRoom') {
		# code...
		$result = serahc();
		echo $result;
	}
	function serahc(){
		$roomname = isset($_GET['roomname']) ? $_GET['roomname'] : '';
		$sql = "select count(1) as num from game_room where roomname = '{$roomname}';";
		$result = select($sql);
		if($result !== 'failed' && count($result) > 0){
			return 'success';
		}else if($result !== failed && count($result) === 0){
			return '0';
		}else{
			return 'failed';
		}
	}
 ?>