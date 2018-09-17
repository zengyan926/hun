<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
    <title>聊天室2.0</title>
    <link rel="stylesheet" href="css/chat.css" />
    <script src="js/jquery-1.4.2.js"></script>
</head>
<body>

<div class="yemian1">

		<div class="header" >群名字</div>
		
		<div class="input"  id="input"></div>
  		
    	<div class="footer">
			<img src="images/xiaolian.png" alt="" />
			<input id="text"  type="text" maxlength="15" onkeypress="if(event.keyCode==13) {send();return false;}" />
			<button id="send" onclick="send()">发送</button>
		</div>
		</div>

	<!--                          -->
	
	<div class="yemian2">
			<div class="header"   id ="lt">选择聊天人</div>
			
		    <div class="input"  id="input2"></div>
			
   		 	<div class="footer">
			<img src="images/xiaolian.png" alt="" />
			<input id="text2" type="text" onkeypress="if(event.keyCode==13) {danren();return false;}" 
			 />
			<button id="send" onclick="danren()">发送</button>
			</div>
	</div>
    </body>


<script type="text/javascript">

/* $("body").keydown(function() {
    if (event.keyCode == "13") {//keyCode=13是回车键
    	if(document.activeElement.getElementById()=="text1"){
    		send();
    	}
    if(document.activeElement.getElementById()==text2){
        danren();
    	
    }
    }
}); */
   
    var websocket = null;
    var userno=prompt("请输入昵称...");//message 昵称
    
  //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        websocket = new WebSocket("ws://localhost:8080/chat/websocket/"+userno);
    }
    else {
        alert('当前浏览器 Not support websocket');
    }


    //连接发生错误的回调方法
    websocket.onerror = function () {
        setMessageInnerHTML("WebSocket连接发生错误");
    };


    //连接成功建立的回调方法
    websocket.onopen = function () {
        setMessageInnerHTML("WebSocket连接成功");
    }


    //接收到消息的回调方法
    websocket.onmessage = function (event) {
    		
    		var str = event.data;
    		if(str.search("收到消息") != -1 ){
    		  var input = document.getElementById('input2');
    	       input.innerHTML += event.data;
    		}else{
    		var input = document.getElementById('input');
	    	input.innerHTML += event.data;
	    	
    		}

    }


    //连接关闭的回调方法
    websocket.onclose = function () {
        setMessageInnerHTML("WebSocket连接关闭");
    }


    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function () {
        closeWebSocket();
    }


    //将消息显示在网页上
    function setMessageInnerHTML(sendMessage) {	
	    	//alert(sendMessage);
    }


    //关闭WebSocket连接
    function closeWebSocket() {
        websocket.close();
    }

    function danren() {
    	
    	var name,text;
    	name =document.getElementById("lt").innerHTML; 
    	var now=getNowFormatDate();//now 时间
	    var message = document.getElementById("text2").value;//获得text
	    var a = document.getElementById('input2');
	    var xx = document.createElement('div'); 
	    xx.className = 'time';
	    xx.innerHTML='发送给'+name;
	    var msg = document.createElement('div');
	    msg.id = 'message';
	    var div1 = document.createElement('div');
	    div1.className = 'time';
	    div1.innerHTML=now;
	    var div2 = document.createElement('div');
	    div2.className = 'name';
	    div2.innerHTML= userno;
	    var div3 = document.createElement('div');
	    var len = message.length;
	    div3.style.width = len * 25 + len*2 + "px";
	    div3.className = 'message';
	    div3.innerHTML=message;
	    a.appendChild(msg);
	    msg.appendChild(xx);
	    msg.appendChild(div1);
	    msg.appendChild(div2);
	    msg.appendChild(div3);
		
	   	var xxx = new Date();
      	var div = document.getElementById('input2');
      	div.scrollTop = div.scrollHeight;
      	
    	text=msg.innerHTML+"|"+name;
      	 websocket.send(text);
    	document.getElementById('text2').value = "";
    }

    var xxxx= document.getElementById('input');//声明一个变量，默认值为body
    xxxx.onclick = function(event){
      var el = event.target;//鼠标每经过一个元素，就把该元素赋值给变量el
      if(el.className == 'name'){

    	document.getElementById("lt").innerHTML = el.innerHTML; 
    	return;
      }else{
    	  return;
      }
    }

    //发送消息
    function send() {
    	var now=getNowFormatDate();//now 时间
 	    var message = document.getElementById("text").value;//获得text
 	    var a = document.getElementById('input');
 	    var msg = document.createElement('div');
 	    msg.id = 'message';
 	    var div1 = document.createElement('div');
 	    div1.className = 'time';
 	    div1.innerHTML=now;
 	    var div2 = document.createElement('div');
 	    div2.className = 'name';
 	    div2.id= 'namex';
 	    div2.innerHTML = userno;
 	   div2.onmouseout =    function () {
 	    	var a = document.getElementById("lt");
 	    	a.innerHTML = userno;
 	    };
 	    var div3 = document.createElement('div');
 	    var len = message.length;
 	    div3.style.width = len * 25 + len*2 + "px";
 	    div3.className = 'message';
 	    div3.innerHTML=message;
 	    a.appendChild(msg);
 	    msg.appendChild(div1);
 	    msg.appendChild(div2);
 	    msg.appendChild(div3);

 	    var xxx = new Date();
         var div = document.getElementById('input');
         div.scrollTop = div.scrollHeight;
     
 		document.getElementById('text').value = "";
        websocket.send(msg.innerHTML);
        
    }

    //获取当前时间
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();
        return currentdate;
} 
</script>
</html>