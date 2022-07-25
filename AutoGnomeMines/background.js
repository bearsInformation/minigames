/* background.js */

/* ----- content.jsからのメッセージ受信時 ----- */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch(msg.type){
    case 'GetGnomeMinesMode':
		// ----- モード取得
		chrome.runtime.sendNativeMessage('cefgm', msg, function(response){
			sendResponse(response);
			return true;
		});
    break;
    case 'AutoGnomeActive':
		// ----- アクティブウインドウ
		chrome.tabs.query({url : 'https://app.gnomemines.com/'}, (tabs) => {
			if(tabs){
				chrome.tabs.update(tabs[0].id, {active:true,selected:true,highlighted:true});
			}
			return true;
		});
		sendResponse({});
    break;
    case 'ChromeActivation':
		// ----- 値取得
		let send = {"type":"MetamaskControl","url":"https://app.gnomemines.com","pass":""};
		chrome.storage.local.get("passm", function(result){
		    send.pass = (result.passm) ? result.passm : '';
			// ----- メタマスク操作
			chrome.runtime.sendNativeMessage('cefmm', send, function(response){
				if(response.result == 'controled'){
					// ----- Chromeアクティブ
					chrome.runtime.sendNativeMessage('cefgm', msg, function(response){
						// ----- アクティブウインドウ
						chrome.tabs.query({url : 'https://app.gnomemines.com/'}, (tabs) => {
							if(tabs){
								chrome.tabs.update(tabs[0].id, {active:true,selected:true,highlighted:true});
							}
							return true;
						});
						sendResponse(response);
						return true;
					});
				}
				return true;
			});
			return true;
		});
	break;
	case 'AutoGnomeMinesCheck':
		// ----- ユーザ確認
		(async () => {
		    let url = 'https://ipinfo.io?callback';
		    let response = await fetch(url);
			    if(response.ok) {
			        let json = await response.json();
					let req = {
						"type":"AutoGnomeMines",
						"user":msg.mail,
						"pass":msg.pass,
						"ip":json.ip
					};
					url = 'https://bearsroom.net/check_if_correct/usercheck.php';
					url += "?param=" + btoa(JSON.stringify(req));
				    response = await fetch(url);
				    if(response.ok) {
				        json = await response.json();
						sendResponse(json);
				    }else{
						sendResponse({"type":"AutoGnomeMinesUserCheck","check":false});
					}
			    }else{
					sendResponse({"type":"AutoGnomeMinesUserCheck","check":false});
				}
		})();
	break;
    case 'GetWindowHandle':
		// ----- ウインドウハンドル取得
		chrome.runtime.sendNativeMessage('cefgm', msg, function(response){
			sendResponse(response);
			return true;
		});
	break;
    case 'GetWindowCount':
		// ----- ウインドウカウント数取得
		chrome.runtime.sendNativeMessage('cefgm', msg, function(response){
			sendResponse(response);
			return true;
		});
	break;
    }
	return true;
});
