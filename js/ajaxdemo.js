var xmlHttp;
function GetHttpObject(){
	var xmlHttp = null;
	try{
		xmlHttp = new XMLHttpRequest();
	}catch(e){
		try{
			xmlHttp = new ActiveXObejct("Msxm2.XMLHTTP"); 
		}catch(e){
			xmlHttp = new ActiveXObejct("Microsoft.XMLHTTP");
		}
	}
	return xmlHttp;
}

/*
 * 发送请求并获取结果
 * arg对象形式，传送请求参数
 * cbfunction 回调函数，处理结果
 */
function getResult(arg,cbfunction,panker){
	// getResult.flag = false;
	var xmlHttp = GetHttpObject();
	if(xmlHttp == null){
		alert("wrong");
		return;
	}
	//url处理并请求
	var url = arg.url;
	xmlHttp.onreadystatechange = function(){
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
			cbfunction(xmlHttp.responseText,panker);
		}
	}
	xmlHttp.open("POST",url,true);
	//传参时该条必须写
	xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	// console.log("ddd");
	// console.log("x="+arg.x+"&y="+arg.y);
	xmlHttp.send(arg.sendarg);
	// getResult.flag = true;
}
// getResult.flag = true; //设置标志，保证同时getResult智能被调用一次
//传入请求方式，method ==get/post
//arg 后缀个数
//cbfn:回掉函数
//url:请求地址
function getNewResult(obj){
	
	var method = obj.method,url = obj.url,cbfn = obj.cbfn,arg = obj.arg;
	
	var xmlHttp = GetHttpObject();  //此处注意要声明成局部变量，否则多个ajax请求时会导致数据错乱
	method = method.toUpperCase();
	
	if(xmlHttp == null){
		alert('wrong');
		return;
	}
	
	var arrayArg = new Array();
	
	for(var key in arg){
		arrayArg.push(key+'='+arg[key]);
	}
	var gp = arrayArg.join('&');
	if(method === 'GET'){
		url = url + '?' + gp;
	}
	var data = method === 'POST' ? gp : null;

	//ajax请求共有0-4五种状态，当readyState状态为4时数据完全返回，若不加if语句限制，cbfn方法会调用多次，返回数据可能不准确
	xmlHttp.onreadystatechange = function(){
		// console.log(xmlHttp.readyState);
		if(xmlHttp.readyState === 4 && xmlHttp.status === 200){
			cbfn(this.responseText);
		}
	}

	xmlHttp.open(method,url,true);
	//此行必须设置在open之后，post请求必须设置此条,否则无法将参数传过去
	xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlHttp.send(data);
}