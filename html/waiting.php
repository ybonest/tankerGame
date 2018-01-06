<?php
	// require_once '../php/commnsqlfn.php';
	// $username = isset($_COOKIE['username']) ? $_COOKIE['username'] : '';
	// isAllowGoPage($username);
	 
	if($_SERVER['REQUEST_METHOD'] === 'GET'){
		$username = isset($_GET['username']) ? $_GET['username'] : '';
	}

 ?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="../css/waiting.css">
	<script src="../js/jquery-1.11.1.min.js"></script>
	<script src='../js/ajaxdemo.js'></script>
	<script src="../js/waiting.js"></script>
</head>
<body>
	<div class="box">
		<ul>
			<li>
				<img src="../img/1.jpeg" alt="">
				<p></p>
				<img class='waiting' src="../img/download.gif" alt="">
				<div class="zz"></div>
				<div class="begin">开始游戏</div>
			</li>
			<li>
				<img src="../img/2.jpg" alt="">
				<p></p>
				<img class='waiting' src="../img/download.gif" alt="">
				<div class="zz"></div>
				<div class="begin">开始游戏</div>
			</li>
			<li>
				<img src="../img/3.jpg" alt="">
				<p></p>
				<img class='waiting' src="../img/download.gif" alt="">
				<div class="zz"></div>
				<div class="begin">开始游戏</div>
			</li>
			<li>
				<img src="../img/4.jpg" alt="">
				<p></p>
				<img class='waiting' src="../img/download.gif" alt="">
				<div class="zz"></div>
				<div class="begin">开始游戏</div>
			</li>
			<li>
				<img src="../img/5.jpg" alt="">
				<p></p>
				<img class='waiting' src="../img/download.gif" alt="">
				<div class="zz"></div>
				<div class="begin">开始游戏</div>
			</li>
			<li>
				<img src="../img/6.jpg" alt="">
				<p></p>
				<img class='waiting' src="../img/download.gif" alt="">
				<div class="zz"></div>
				<div class="begin">开始游戏</div>
			</li>
		</ul>
	</div>
	<div class="djtime"></div>
	<input type="hidden" id="forUserName" name="username" value="<?php echo $username ?>">
</body>
</html>