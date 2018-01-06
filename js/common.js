/*该js中存放共用方法*/

//区分对象还是数组,数组返回true，对象返回false
var arrOrObj = function(obj){
	//Array数组的toString方法是将数组转换为字符串，而最顶层Object对象原型中的toString方法，直接输出[object Array]或[object Object]
	//因此此处是将通过call调用Object原型中的toString方法，以此判断是数组还是对象
	return Object.prototype.toString.call(obj) === '[object Array]';
}
// console.log(arrOrObj(new Array()));
// console.log(arrOrObj(new Object()));
// console.log(Object.prototype.toString.call(new Array('e','r')));
// console.log(new Object().toString());

// console.log(typeof (new Array()));
// var d = [1,2,3];
// var p = d;
// d[0] = 8;
// console.log(p);
//对象和数组拷贝方法，将对象arg1，赋值给对象arg2，flag为true代表深拷贝，false代表浅拷贝，默认深拷贝
var cloneObject = function (arg1,arg2,flag) {
	// body...
	// console.log(flag);
	var flag = flag||flag === undefined ? true : flag;
	for(var key in arg1){
		if(typeof arg1[key] === 'object' && !arrOrObj(arg1[key])){ //如果是对象
			var obj = {};
			if(flag){  //深copy
				cloneObject(arg1[key], obj);
				arg2[key] = obj;
			} else {	//浅copy
				// var arr = new Array();
				arg2[key] = arg1[key];
			}
		}else if(typeof arg1[key] === 'object' && arrOrObj(arg1[key])){ //数组copy,数组也是引用赋值
			var arr = new Array();
			if(flag){
				cloneObject(arg1[key],arr);
				arg2[key] = arr;
			}else{
				arg2[key] = arg1[key];
			}
		}else { //基本类型数据
			arg2[key] = arg1[key];
		}
	}
	return arg2;
}

//测试深拷贝
// var t = {w:2,r:{e:3}};
// var b = {};
// cloneObject(t,b);
// t.w = 4;
// t.r.e = 4;
// console.log(t);
// console.log(b);