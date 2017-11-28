var I18N={
	en: require('./lang-en.js'),
	'zh-tw': require('./lang-zh-tw.js')
}

var $=require('jquery')
let LANG='zh-tw';
let nowIndex=0;
let isLoading=false;

function changelang(lang){
	$(".menu h1").text(I18N[lang].TITLE)
	// I18N[lang]['TITLE']
	LANG=lang;//預設是中文，可以將英文指定給LANG
	$(".container").empty();
	nowIndex=0;
	appendData(LANG);

}

//https://gist.github.com/joyrexus/7307312 參考
document.addEventListener('DOMContentLoaded',function(){
	appendData(LANG);
	//網頁一載入先載進前20筆
	window.addEventListener('scroll',function(){
		if($(window).scrollTop() + $(window).height() > $(document).height() -200){
			if(isLoading==false){
				appendData(LANG);
			}
		}
	});
	$('.change_en').click(function(){
		changelang('en');
	});
	$('.change_zh').click(function(){
		changelang('zh-tw');
	});
});
function getData(lang,cb){
	//http://www.smalljacky.com/programming-language/php/ajax-javascript-jquery-example-for-php/ 參考
	isLoading=true;
	const request=new XMLHttpRequest();
	request.open('GET','https://api.twitch.tv/kraken/streams/?game=League%20of%20Legends&language='+lang+'&limit=20&offset='+nowIndex+'',true);
	request.setRequestHeader('client-id','3nic4qrhou17yeyhgg0zh54tsa9sdv');
	request.onreadystatechange=function(){//也可以寫request.onload
		if(request.readyState==4 && request.status==200){
			const data = JSON.parse(request.responseText);//變成js物件
			cb(null,data);
	}
	}
	request.send();

// 	const clientID='3nic4qrhou17yeyhgg0zh54tsa9sdv';
// 	const limit=20;
// 	isLoading=true;
// 	$.ajax({
// 		url: 'https://api.twitch.tv/kraken/streams/?client_id=' + clientID + '&game=League%20of%20Legends&limit='+limit+'&offset='+nowIndex+'',
// 		success: function(response){

// 			cb(null,response);
// 	}
// 	});
}
//以上是第一步，拿資料

function appendData(lang){
	getData(lang,(err,data)=>{
		if(err){
			console.log(err);
		}
		else{
			const streams=data.streams;
			 const container=document.querySelector('.container');
			for(var i=0;i<streams.length;i++){
			 //http://www.cnblogs.com/pigtail/archive/2013/03/11/2953848.html 參考
				container.insertAdjacentHTML('beforeend', getColumn(streams[i]))
				// const div =document.createElement('div');
				// container.appendChild(div);
				// div.outerHTML=getColumn(streams[i]);
		}
			nowIndex+=20;
			//之前設為nowIndex+=20 每次載入都會抓不同的20筆資料 如果資料很少的話容易一下子就抓光了，就會發生資料載入空白的現象
			isLoading=false;
	}
	});
}
//callback function

function getColumn(data){
	return `
			<div class="box">
    <div class="top">
				<img src="${data.preview.medium}"onload="this.style.opacity=1"/>
		</div>
    <div class="bottom">
      <div class="photo">
				<img src="${data.channel.logo}"onload="this.style.opacity=1"/>
			</div>
      <div class="intro">
				<div class="textbox">
        	<div class="channel">${data.channel.status}</div>
        	<div class="name">${data.channel.display_name}</div>
				</div>
      </div>
    </div>
  </div>
				`;
}




