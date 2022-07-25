let inpMail;
let inpPassG;
let inpPassM;
let inpSize;
let size = 0;
let btnOpen;
window.addEventListener("load", () => {
	inpMail = document.getElementById("mail");
	inpPassG = document.getElementById("passg");
	inpPassM = document.getElementById("passm");
	inpSize = document.getElementsByName("size");
	size = 0;
	btnOpen = document.getElementById("WindowOPEN");

	chrome.storage.local.get("mail", function(result){
    	inpMail.value = (result.mail) ? result.mail : '';
	});
	chrome.storage.local.get("passg", function(result){
	    inpPassG.value = (result.passg) ? result.passg : '';
	});
	chrome.storage.local.get("passm", function(result){
	    inpPassM.value = (result.passm) ? result.passm : '';
	});
	chrome.storage.local.get("size", function(result){
		if(result.size){
			for(let i = 0; i < inpSize.length; i++){
			    if(inpSize.item(i).value == result.size){
			        inpSize.item(i).checked = true;
					size = inpSize.item(0).value;
			        break;
			    }
			}
		}else{
			inpSize.item(0).checked = true;
			size = inpSize.item(0).value;
		}
	});
	inpMail.addEventListener('change', () => {
		btnOpen.innerText = 'Check!';
	});
	inpPassG.addEventListener('change', () => {
		btnOpen.innerText = 'Check!';
	});
	inpPassM.addEventListener('change', () => {
		btnOpen.innerText = 'Check!';
	});
	btnOpen.addEventListener('click', () => {
		let windowFeatures = '';
		switch(OS()){
		case 'Windows 10':
			if(size == '900'){
				windowFeatures = ',width=916,height=578,resizable=no';
			}else if(size == '500'){
				windowFeatures = ',width=516,height=345,resizable=no';
			}		
	    	break;
		case 'Windows 8.1':
		case 'Windows 8':
		case 'Windows 7':
			if(size == '900'){
				windowFeatures = ',width=916,height=577,resizable=no'
			}else if(size == '500'){
				windowFeatures = ',width=516,height=344,resizable=no';
			}
	    	break;
		default:
			alert('対応していません。');
			return;
		}
		if(btnOpen.innerText == 'Window OPEN'){
			chrome.runtime.sendMessage({"type": "GetWindowCount","title":"Gnome Mines"}, async (response) => {
				let popup = open('', 'gnomemines', 'top=' + (response.count * 50) +  ',left=' + (response.count * 25) + windowFeatures);
				let popupTitle = 'gnomemines DT' + (new Date().getTime());
				popup.document.title = popupTitle;
				await sleep(1000);
				chrome.runtime.sendMessage({"type": "GetWindowHandle","title":popupTitle}, (response) => {
					if(response.result == 'successful'){
						popup.name = 'gnomemines ' + response.handle;
						popup.location.href = 'https://app.gnomemines.com/';
					}else{
						popup.close();
					}
					window.close();
				});
			});
		}else{
			let mail = inpMail.value.trim();
			let passg = inpPassG.value.trim();
			let passm = inpPassM.value.trim();
			for(let i = 0; i < inpSize.length; i++){
			    if(inpSize.item(i).checked){
			        size = inpSize.item(i).value;
			        break;
			    }
			}
			chrome.storage.local.set({"mail": mail}, function(){ });
			chrome.storage.local.set({"passg": passg}, function(){ });
			chrome.storage.local.set({"passm": passm}, function(){ });
			chrome.storage.local.set({"size": size}, function(){ });
			chrome.runtime.sendMessage({"type": "AutoGnomeMinesCheck","mail":mail,"pass":passg}, (response) => {
				if(response.check == true){
					btnOpen.innerText = 'Window OPEN';
				}else{
					btnOpen.innerText = 'Check!';
				}
			});
		}
	});
});
// スリープ
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
// OS名取得
function OS(){
	let os = "N/A";
	let ua = navigator.userAgent;
	if(ua.match(/Win(dows )?NT 10\.0/)){				os = "Windows 10";
	}else if(ua.match(/Win(dows )?NT 6\.3/)) {			os = "Windows 8.1";
	}else if(ua.match(/Win(dows )?NT 6\.2/)) {			os = "Windows 8";
	}else if(ua.match(/Win(dows )?NT 6\.1/)) {			os = "Windows 7";
	}else if(ua.match(/Win(dows )?NT 6\.0/)) {			os = "Windows Vista";
	}else if(ua.match(/Win(dows )?NT 5\.2/)) {			os = "Windows Server 2003";
	}else if(ua.match(/Win(dows )?(NT 5\.1|XP)/)) {		os = "Windows XP";
	}else if(ua.match(/Win(dows)? (9x 4\.90|ME)/)) {	os = "Windows ME";
	}else if(ua.match(/Win(dows )?(NT 5\.0|2000)/)) {	os = "Windows 2000";
	}else if(ua.match(/Win(dows )?98/)) {				os = "Windows 98";
	}else if(ua.match(/Win(dows )?NT( 4\.0)?/)) {		os = "Windows NT";
	}else if(ua.match(/Win(dows )?95/)) {				os = "Windows 95";
	}else if(ua.match(/Windows Phone/)) {				os = "Windows Phone";
	}else if(ua.match(/iPhone|iPad/)) {					os = "iOS";
	}else if(ua.match(/Mac|PPC/)) {						os = "Mac OS";
	}else if(ua.match(/Android ([\.\d]+)/)) {			os = "Android " + RegExp.$1;
	}else if(ua.match(/Linux/)) {						os = "Linux";
	}else if(ua.match(/^.*\s([A-Za-z]+BSD)/)) {			os = RegExp.$1;
	}else if(ua.match(/SunOS/)) {						os = "Solaris";
	}
	return os;
}