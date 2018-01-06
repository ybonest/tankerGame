<?php 
	// require_once "php/mysql.php";
	// $sql = "SELECT * FROM game_room where isbegin = 0;";
	// $result = select($sql);
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="icon" href="data:;base64,iVBORw0KGgo=">
	<link rel="stylesheet" href="css/bootstrap.css">
	<link rel="stylesheet" href="css/main.css">

	<script src="js/jquery-1.11.1.min.js"></script>
	<script src="js/jquery-3.2.1.min.js"></script>
	<script src='js/ajaxdemo.js'></script>
	<script src='js/jqmain.js'></script>
</head>

<body>
<div class="box">
	<div class="one">
		<!-- <button style="width: 80%;margin-bottom: 30px;" type="button" class="btn btn-primary btn-lg btn-block">坦克大战</button> -->
		<button style="width: 80%;margin-bottom: 30px;" id="randomRoom" type="button" class="btn btn-primary btn-lg btn-block">随机房间</button>
		<button style="width: 80%;margin-bottom: 30px;" type="button" id="createR" class="btn btn-primary btn-lg btn-block">创建房间</button>
		<button style="width: 80%;" type="button" id="createSE" class="btn btn-primary btn-lg btn-block">查询房间</button>
	</div>
	<div class="two" data-example-id="contextual-backgrounds-helpers">
		<div class="inner">
			<ul class="forappend">
				
			</ul>
		</div>
		
	</div>
	<!-- 创建房间 -->
		<div id="fangjia" class="fangjia">
			<!-- <form> -->
	  		<div style="margin: 50px 10px 20px 10px;" class="form-group">
		    <input  type="text" class="form-control" id="roomname" name="roomname" aria-describedby="emailHelp" placeholder="Roomname">
		 	 </div>
		  	<div style="margin: 10px 10px 20px 10px;" class="form-group">
		    <input type="password" name="password" class="form-control" id="password" placeholder="Password">
		  	</div>
	  		<button style="margin:0px auto;display: block;" id="submit" type="submit" class="btn btn-primary">创建房间</button>
		<!-- </form> -->
	</div>
	<div id="goRoomS" class="fangjia">
		<div style="margin: 50px 10px 20px 10px;" class="form-group">
	    <input readonly type="text" class="form-control" id="roomnameG" name="roomnameG" aria-describedby="emailHelp" placeholder="Roomname">
	 	 </div>
	  	<div style="margin: 10px 10px 20px 10px;" class="form-group">
	    <input type="password" name="passwordG" class="form-control" id="passwordG" placeholder="Password">
	  	</div>
  		<button style="margin:0px auto;display: block;" id="submitG" type="submit" class="btn btn-primary">进入房间</button>
	</div>
	<div id="goRoomSC" style="height: 200px;margin-top: -100px;" class="fangjia">
		<div style="margin: 50px 10px 20px 10px;" class="form-group">
	    <input type="text" class="form-control" id="roomnameSC" name="roomnameSC" aria-describedby="emailHelp" placeholder="Roomname">
	 	 </div>
  		<button style="margin:0px auto;display: block;" id="submitSC" type="submit" class="btn btn-primary">查询房间</button>
	</div>
	
</div>
<div class="zhezhao"></div>
<input type="hidden" id="forUserName" name="username" value="">
</body>
</html>