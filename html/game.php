<?php 
	// require_once '../php/commnsqlfn.php';
	// $username = isset($_COOKIE['username']) ? $_COOKIE['username'] : '';
	// isAllowGoPage($username);
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<link rel="icon" href="data:;base64,iVBORw0KGgo=">
	<title>Document</title>
	<style>
		*{
			padding: 0px;
			margin: 0px;
		}
		html,body{
			height: 100%;
			width: 100%;
			overflow: hidden;
		}
		#myCanvas {
			perspective:1000px;

		}
		#info{
			position: fixed;
			right: 4px;
			top: 2px;
			height: 30px;
			width: 350px;
			border-radius: 3px;
			background: rgba(0,0,0,.5);
			line-height: 30px;
		}
		#bulletnum{
			float: left;
			width: 125px;
			margin-left: 10px;
		}
		#killNum{
			position: absolute;
			/*margin-right: 20px;*/
			right: 130px;
		}
		#xueliang{
			position: absolute;
			right: 25px;
		}
		.zhezhao{
			position: fixed;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background: rgba(0,0,0,.5);
			text-align: center;
			line-height: 622px;
			min-height: 622px;
			font-size: 70px;
			display: none;
		}
	</style>
	<script src="../js/jquery-1.11.1.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/ajaxdemo.js"></script>
	<script src="../js/bullet.js"></script>
	<script src="../js/panker.js"></script>
	<script src="../js/mian.js"></script>
	<script src="../js/moveupdate.js"></script>
</head>
<body>
	<canvas id="myCanvas"></canvas>
	<div id="info">
		<span id="bulletnum">子弹数量：10</span>
		<span id="killNum">杀敌数量：0</span>
		<span id="xueliang">生命值：3</span>
	</div>
	<div class="zhezhao">Game Over</div>
	<input type="hidden" id="forUsername" name="username" value="<?php echo isset($_GET['username']) ? $_GET['username'] : '' ?>" >
</body>
</html>