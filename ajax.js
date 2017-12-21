function ajax(option){
//	console.log(option.data)
	//{user:leo,pass:123456}
	//user=leo&pass=123456


//	var ajax = new XMLHttpRequest();

	if(window.XMLHttpRequest){
		var ajax = new XMLHttpRequest();
	}
	else{
		var ajax = new ActiveXObject("Microsoft.XMLHTTP");
	};
	if(option.type == 'get'){
		ajax.open(option.type,option.url+'?'+JsonToString(option.data),true);
		ajax.send();
	}
	else if(option.type='post'){
		ajax.open(option.type,option.url,true);
		ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		ajax.send(JsonToString(option.data));
	}
	
	
	ajax.onreadystatechange=function(){
		//console.log(ajax.readyState)
		if(ajax.readyState == 4){
			if(ajax.status>=200&&ajax.status<300||ajax.status==304){
				option.success(ajax.responseText)
				//console.log()
			}
			else{
				option.error && option.error();
			//	console.log('服务器错误-')
			}
			//console.log(ajax.status)
			//console.log(ajax.responseText)
		}
	}


	function JsonToString(json){
		var arr = [];
		for(var i in json){
			//console.log(i+option.data[i])
			arr.push(i+'='+json[i])
		};
		//console.log(arr.join('&'));
		return arr.join('&');
	}
}