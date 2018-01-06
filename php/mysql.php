<?php
	function cmnPlace($flag,$sql){
		$servername = "127.0.0.1";
		$username = "root";
		$password = "ybo123";
		$dbname = "panker_game";
		$conn = mysqli_connect($servername,$username,$password,$dbname);
		if(is_bool($conn)){
			$conn = mysqli_connect($servername,$username,$password,$dbname);
		}
		mysqli_set_charset($conn,'utf8');  //此函数用于设置连接对象的字符集

		if (!$conn) {
			file_put_contents('log.txt', mysqli_connect_error());
    		// die("Connection failed: " . mysqli_connect_error());
		}

		if($flag === "mulit"){
			$result = mysqli_multi_query($conn,$sql);
		}else {
			$result = mysqli_query($conn,$sql);
		}

		// var_dump($result);
		
		mysqli_close($conn);

		if(is_bool($result)){
			if($result){
				// mysqli_free_result($result);
				return 'success';
			}else{
				// mysqli_free_result($result);
				return 'failed';
			}
		}else{
			if($result){  //失败返回boolean值
				$arr = array();
				while($row = mysqli_fetch_assoc($result)){
					$arr[] =$row;
				}
				// mysqli_free_result($result);
				return $arr;
			}else{
				// mysqli_free_result($result);
				return 'failed';
			}	
		}
	} 

	//插入元素
	function insert($sql){
		return cmnPlace("insert",$sql);
	}
	//多行插入
	//$sql = "INSERT INTO MyGuests (firstname, lastname, email) VALUES ('John', 'Doe', 'john@example.com');";
	//$sql .= "INSERT INTO MyGuests (firstname, lastname, email) VALUES ('Mary', 'Moe', 'mary@example.com');";
	//$sql .= "INSERT INTO MyGuests (firstname, lastname, email) VALUES ('Julie', 'Dooley', 'julie@example.com')";
	function multiInsert($sql){
		return cmnPlace("mulit",$sql);
	}
	//查询
	function select($sql){
		return cmnPlace("select",$sql);
	}

	//更新元素
	function update($sql){
		return cmnPlace("update",$sql);
	}

	//删除元素
	function delete($sql){
		return cmnPlace("delete",$sql);
	}
	
	// function testFn(){
	// 	$username = '34e5e5';
	// 	$posX = '221';
	// 	$posY = '33';
	// 	$direction = 'top';
	// 	$sql = "INSERT INTO tem_user (username,posX,posY,live,bulletnum,panker,userlife,direction) VALUES ('{$username}','{$posX}',{$posY},'1','10','cmnpanker','3','{$direction}')";
	// 	// $sql = "SELECT * FROM panker_game.tem_user WHERE username != '{$username}'";
	// 	$result =insert($sql);
	// 	// $result = select($sql);
	// 	// $sql = "UPDATE panker_game.tem_user SET posX = '{$posX}',posY = '{$posY}',direction = '' WHERE username = '{$username}'";
	// 		// file_put_contents("../userfiles/".$username.".json", $positionXY);
	// 		// $result = update($sql);
	// 	var_dump($result);
	// 	// var_dump($sql);
	// }
	// testFn();
 ?>