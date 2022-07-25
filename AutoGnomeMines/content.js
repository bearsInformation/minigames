/* content.js */
let divMessage = null;
let isMouseOver = false;
let beftype = '';
let befCommand = '';
let commandCount = 0;
let nextCheckTime = new Date();
let isNextCheck = false;
let modes = {};
let passm = '';
const isDebug = true;


// ページ読み込み時
window.addEventListener("load", () => {
	// 整形された画面のみ対応
	if(!window.name.startsWith('gnomemines')) return;

	// 画面サイズの調整
	if(window.outerWidth == '916'){
		document.body.setAttribute('style','width:1000px;');
	}else if(window.outerWidth == '516'){
		document.body.setAttribute('style','width:556px;');
	}

	// メッセージ及びウォレットアドレスの表示
	let divHedder = document.createElement('div');
	divHedder.id = 'divHedder';
	divHedder.setAttribute('style','position:fixed;top:0;width:100%;padding: 0 5px;');
	divHedder.innerHTML 
	= '<div id="divMessage" style="float:left;width:400px;height:12px;font-size:10px;" onclick="\n'
	+ 'let GETETHACCOUNT = async () => {\n'
	+ '  try {\n'
	+ '    const account = await window.ethereum.request({ method: \'eth_requestAccounts\' });\n'
	+ '    if(account.length > 0){\n'
	+ '    	 document.title = \'Gnome Mines \' + account[0];\n'
	+ '    }\n'
	+ '  }catch(err){}\n'
	+ '};\n'
	+ 'GETETHACCOUNT();'
	+ '"></div>';
	document.body.insertBefore(divHedder, document.body.firstChild);
	divMessage = document.getElementById('divMessage');
	divMessage.click();

	// キャンバスイベント追加(デバック用)
	document.getElementById("unity-canvas-1").addEventListener('click', canvasPosition);
	document.getElementById("unity-canvas-1").addEventListener('mouseover', canvasMouseOver);
	document.getElementById("unity-canvas-1").addEventListener('mouseout', canvasMouseOut);

	// フルスクリーンボタン削除
	document.getElementsByClassName("expand")[0].style.display = 'none';

	// キャンバス位置調整
	settingPosition();

	// コマンド実行
	nextCheckTime = new Date();
	setTimeout(modecheck, 5000);

	// リロード
	setTimeout(function(){window.location.reload();}, randomCoordinate(12 * 60 * 60 * 1000, 16 * 60 * 60 * 1000));
});
/* ----- キャンバス位置調整 ----- */
function settingPosition(){
	let hcAOhC = document.getElementsByClassName('hcAOhC')[0];
	let unity = document.getElementById("unity-canvas-1");
	if(hcAOhC && unity){
		if(hcAOhC.style.alignItems != 'normal' 
		|| hcAOhC.style.justifyContent != 'end'){
			hcAOhC.style.alignItems = 'normal';
			hcAOhC.style.justifyContent = 'end';
			setTimeout(settingPosition, 1000);
		}else{
			if(window.outerWidth == '916'){
				if(unity.height != '450' || unity.height != '525'){
					unity.height = '525';
					setTimeout(settingPosition, 1000);
				}
			}else if(window.outerWidth == '516'){
				if(unity.height != '250' || unity.height != '292'){
					unity.height = '292';
					setTimeout(settingPosition, 1000);
				}
			}
		}
	}else{
		setTimeout(settingPosition, 1000);
	}
}

/* ----- 画面モード判定 ----- */
function modecheck(){
	// マウス画面外へ移動
	if(isMouseOver == true){
		simulateMouseReset();
	}
	// モード取得
	let msg = {
		"type":"GetGnomeMinesMode",
		"hwnd":Number(window.name.replace('gnomemines ',''))
	};
	chrome.runtime.sendMessage(msg, (response) => {
		try{
			if(response.result == 'getting'){
				modes = response;
				runCommand();
			}else{
				if(isDebug) console.log("##### modecheck:retry #####");
				setTimeout(modecheck, 1000);
			}
		}catch(error){
			if(isDebug) console.log("##### modecheck:err" + error + " #####");
			setTimeout(modecheck, 1000);
		}
	});
}
/* ----- コマンド(クリック)実行 ----- */
function runCommand(){
	if(!nextCheckTime) return true;
	if(!document.getElementById('unity-canvas-1')) return true;

	let RECT = {};
	let x = 0;
	let y = 0;

    if(modes.IsServerError == true
    || modes.IsSomethingWentWrong == true){
		// ----- 再読み込み
		commandControl('ServerError');
		window.location.reload(true);
		return true;
	}

	if(beftype != modes.Mode){
		commandCount = 0;
		beftype = modes.Mode;
		divMessage.click();
	}

	if(modes.IsMapComplete == true){
		// ----- NewMapボタン押下
		if(commandCount != 0 && (randomCoordinate(1,7) == 4 || commandCount >= 10)){
			commandControl('MapComplete');
			RECT = modes.RECT['MapCompleteButton'];
			x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
			y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
			simulateMouse(x,y);
		}else{
			commandControl('MapComplete Sleep... ');
			setMessage('MapComplete Sleep... ' + commandCount + '/10');
		}

		// ----- 画面表示まで確認
		setTimeout(modecheck, randomCoordinate(60000,90000));
		return true;
	}

    switch(modes.Mode){
    case 'Main':
	    if(isNextCheck == true){
			// ----- 次の確認日時設定
			commandControl('nextCheckTime');
			nextCheckTime = new Date();
			let sec = randomCoordinate(480, 600);	// 6～10分
			nextCheckTime.setSeconds(nextCheckTime.getSeconds() + sec);
			isNextCheck = false;
		}
		if(nextCheckTime <= new Date()){
	    	if(commandCount == 0 || commandCount >= 5){
				commandCount = 0;
		    	if(modes.IsTool == false){
					// ----- ツール表示ボタン押下
					commandControl('ToolOpen');
					RECT = modes.RECT['ToolButton'];
					x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
					y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
					simulateMouse(x, y);

					// ----- ツール表示まで確認
					setTimeout(modecheck, randomCoordinate(1000,3000));
				}else{
					// ----- Inventory表示ボタン押下
					commandControl('InventoryOpen');
					RECT = modes.RECT['InventoryButton'];
					x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
					y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
					simulateMouse(x, y);

					// ----- Inventory表示まで確認
					isNextCheck = false;
					setTimeout(modecheck, randomCoordinate(4000,6000));
		    	}
			}else{
		    	if(modes.IsTool == false){
					// ----- ツール表示まで確認
					commandControl('ToolOpenCheck');
					isNextCheck = false;
					setTimeout(modecheck, randomCoordinate(1000,2000));
				}else{
					// ----- Inventory表示ボタン押下
					commandControl('InventoryOpen2');
					RECT = modes.RECT['InventoryButton'];
					x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
					y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
					simulateMouse(x, y);

					// ----- Inventory表示まで確認
					isNextCheck = false;
					setTimeout(modecheck, randomCoordinate(4000,6000));
		    	}
			}
		}else{
			let nextTime = ((nextCheckTime - new Date()) / 1000);
			setMessage('Next Check ... ' + nextTime + 'sec');
			if(nextTime >= 15){
				setTimeout(modecheck, 10000);
			}else{
				setTimeout(modecheck, 1000);
			}
		}
		break;
    case 'Inventory':
		if(nextCheckTime <= new Date()){
			if(modes.IsNomeInfo == true){
				// ----- Nome詳細ボタン押下
				commandControl('nomeButton');
				RECT = modes.RECT['nomeButton'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(1000,2000));
			}else if(modes.Nome1full == true && modes.Nome1IsRest == true){
				// ----- Miningボタン押下
				commandControl('nome1Mining');
				RECT = modes.RECT['nome1Mining'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(5000,7000));
			}else if(modes.Nome2full == true && modes.Nome2IsRest == true){
				// ----- Miningボタン押下
				commandControl('nome2Mining');
				RECT = modes.RECT['nome2Mining'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(5000,7000));
			}else if(modes.Nome3full == true && modes.Nome3IsRest == true){
				// ----- Miningボタン押下
				commandControl('nome3Mining');
				RECT = modes.RECT['nome3Mining'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(5000,7000));
			}else if(modes.Nome4full == true && modes.Nome4IsRest == true){
				// ----- Miningボタン押下
				commandControl('nome4Mining');
				RECT = modes.RECT['nome4Mining'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(5000,7000));
			}else if(modes.Nome5full == true && modes.Nome5IsRest == true){
				// ----- Miningボタン押下
				commandControl('nome5Mining');
				RECT = modes.RECT['nome5Mining'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(5000,7000));
			}else if(modes.IsFeed == true){
				// ----- 次のページボタン押下
				commandControl('InventoryNextPage');
				RECT = modes.RECT['InventoryPage'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, randomCoordinate(4000,7000));
			}else if(modes.IsFeed == false){
				// ----- ゲーム画面ボタン押下
				commandControl('BackToMain');
				isNextCheck = true;
				RECT = modes.RECT['ToolButton'];
				x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
				y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
				simulateMouse(x, y);
				// ----- 切り替え取得
				setTimeout(modecheck, 1000);
			}
		}else{
			let nextTime = ((nextCheckTime - new Date()) / 1000);
			setMessage('Next Check ... ' + nextTime + 'sec');
			setTimeout(modecheck, 1000);
		}
		break;

    case 'ConnectWallet':
		// ----- ConnectWalletボタン押下
		commandControl('ConnectWallet');
		RECT = modes.RECT['ConnectWallet'];
		x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
		y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
		simulateMouse(x, y);

		// ----- 画面推移完了まで確認
		isNextCheck = false;
		setTimeout(modecheck, randomCoordinate(3000,5000));
		break;

    case 'ConnectMetamask':
		// ----- ConnectMetamaskボタン押下
		commandControl('ConnectMetamask');
		RECT = modes.RECT['ConnectMetamask'];
		x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
		y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
		simulateMouse(x, y);

		// ----- 画面推移完了まで確認
		isNextCheck = false;
		setTimeout(modecheck, randomCoordinate(3000,5000));
		break;

	default:
		setMessage('mode Unown ... ');
		commandControl('modeUnown');
		chromeActivation();
		setTimeout(modecheck, 1000);
	}
	return true;
}
/* ----- コマンド(クリック)実行コントロール ----- */
function commandControl(command){
	if(isDebug) console.log('##### Command:' + command + ' #####');
	if(befCommand != command){
		befCommand = command;
		commandCount = 1;
	}else{
		commandCount ++;
	}
    switch(modes.Mode){
    case 'Inventory':
		if(commandCount > 5){
			// ----- ゲーム画面ボタン押下
			commandControl('BackToMain(reset)');
			isNextCheck = false;
			let RECT = modes.RECT['ToolButton'];
			let x = randomCoordinate(RECT.x + 1, RECT.x + RECT.width - 1);
			let y = randomCoordinate(RECT.y + 1, RECT.y + RECT.height - 1);
			simulateMouse(x, y);
		}
		break;
    case 'ConnectWallet':
    case 'Main':
		break;
	default:
		if(command = 'modeUnown' && commandCount > 60){
			window.location.reload(true);
		}
		break;
	}
}
/* ----- マウスイベントシミュレート ----- */
function simulateMouseEvent(element, eventName, coordX, coordY) {
	let adjust = (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) ? 6 : 8;
	let screenX = window.screenX + (window.outerWidth - window.innerWidth) - adjust;
	let screenY = window.screenY + (window.outerHeight - window.innerHeight) - adjust;
	element.dispatchEvent(new MouseEvent(eventName, {
		view: window,
		bubbles: true,
		cancelable: true,
		clientX: coordX,
		clientY: coordY,
		screenX: screenX + coordX,
		screenY: screenY + coordY,
		button: 0
	}));
};
/* ----- 複合マウスイベントシミュレート ----- */
function simulateMouse(coordX, coordY){
	let root = document.getElementById('root');
	let canvas = document.getElementById('unity-canvas-1');
	let rootRect = root.getBoundingClientRect();
	let canvasRect = canvas.getBoundingClientRect();
	let msg = {
		"type":"ChromeActivation",
		"title":document.title.toString(),
		"hwnd":Number(window.name.replace('gnomemines ','')),
		"mode":0,
		"x":coordX + canvasRect.x,
		"y":coordY + canvasRect.y + (window.outerHeight - window.innerHeight)
	};
	chrome.runtime.sendMessage(msg, (response) => {
		let root = document.getElementById('root');
		let canvas = document.getElementById('unity-canvas-1');
		let rootRect = root.getBoundingClientRect();
		let canvasRect = canvas.getBoundingClientRect();
		let isRoot = false;
		let isCanvas = false;
		let x = coordX + canvasRect.x;
		let y = coordY + canvasRect.y;

		if(document.hasFocus()){
			if(rootRect.left     <= x 
			&& rootRect.right    >= x 
			&& rootRect.top      <= y 
			&& rootRect.bottom   >= y){
				isRoot = true;
			}
			if(canvasRect.left   <= x 
			&& canvasRect.right  >= x 
			&& canvasRect.top    <= y 
			&& canvasRect.bottom >= y){
				isCanvas = true;
			}
		}
		if(isCanvas){
			simulateMouseEvent(canvas, "mousemove", x, y);
			simulateMouseEvent(canvas, "mouseenter", x, y);
			simulateMouseEvent(canvas, "mouseover", x, y);
			simulateMouseEvent(canvas, "mousedown", x, y);
			simulateMouseEvent(canvas, "mouseup", x, y);
			simulateMouseEvent(canvas, "click", x, y);
		}else if(isRoot){
			simulateMouseEvent(root, "mousemove", x, y);
			simulateMouseEvent(root, "mouseenter", x, y);
			simulateMouseEvent(root, "mouseover", x, y);
			simulateMouseEvent(root, "mousedown", x, y);
			simulateMouseEvent(root, "mouseup", x, y);
			simulateMouseEvent(root, "click", x, y);
		}
	});
/*
	chrome.runtime.sendMessage({"type": "AutoGnomeActive"}, (response) => {
		let root = document.getElementById('root');
		let canvas = document.getElementById('unity-canvas-1');
		let rootRect = root.getBoundingClientRect();
		let canvasRect = canvas.getBoundingClientRect();
		let isRoot = false;
		let isCanvas = false;
		let x = coordX + canvasRect.x;
		let y = coordY + canvasRect.y;

		if(document.hasFocus()){
			if(rootRect.left     <= x 
			&& rootRect.right    >= x 
			&& rootRect.top      <= y 
			&& rootRect.bottom   >= y){
				isRoot = true;
			}
			if(canvasRect.left   <= x 
			&& canvasRect.right  >= x 
			&& canvasRect.top    <= y 
			&& canvasRect.bottom >= y){
				isCanvas = true;
			}
		}
		if(isCanvas){
			simulateMouseEvent(canvas, "mousemove", x, y);
			simulateMouseEvent(canvas, "mouseenter", x, y);
			simulateMouseEvent(canvas, "mouseover", x, y);
			simulateMouseEvent(canvas, "mousedown", x, y);
			simulateMouseEvent(canvas, "mouseup", x, y);
			simulateMouseEvent(canvas, "click", x, y);
		}else if(isRoot){
			simulateMouseEvent(root, "mousemove", x, y);
			simulateMouseEvent(root, "mouseenter", x, y);
			simulateMouseEvent(root, "mouseover", x, y);
			simulateMouseEvent(root, "mousedown", x, y);
			simulateMouseEvent(root, "mouseup", x, y);
			simulateMouseEvent(root, "click", x, y);
		}
	});
*/
}
/* ----- マウス位置リセット ----- */
function simulateMouseReset(){
	chrome.runtime.sendMessage({"type": "AutoGnomeActive"}, (response) => {
		let root = document.getElementById('root');
		let canvas = document.getElementById('unity-canvas-1');
		let rootRect = root.getBoundingClientRect();
		let canvasRect = canvas.getBoundingClientRect();
		let isRoot = false;
		let isCanvas = false;
//		let x = canvasRect.x + (canvasRect.width / 2);
//		let y = canvasRect.y + (canvasRect.height / 2);
		let x = randomCoordinate(5, Number(window.outerWidth) - 5);
		let y = rootRect.y + randomCoordinate(1, 10);
		if(document.hasFocus()){
			simulateMouseEvent(canvas, "mouseout", x, y);
			simulateMouseEvent(root, "mousemove", x, y);
			simulateMouseEvent(root, "mouseover", x, y);
		}
	});
}
/* ----- Chromeウインドウを最前面に移動 ----- */
function chromeActivation(){
	let root = document.getElementById('root');
	simulateMouseEvent(root, "mousemove", 0, 0);
	simulateMouseEvent(root, "mouseover", 0, 0);
	let msg = {
		"type":"ChromeActivation",
		"title":document.title.toString(),
		"hwnd":Number(window.name.replace('gnomemines ','')),
		"mode":0,
		"x":0,
		"y":0
	};
	chrome.runtime.sendMessage(msg, (response) => {});
}
	
/* ----- ランダム座標 ----- */
function randomCoordinate(min,max){
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}
/* ----- メッセージ設定 ----- */
function setMessage(msg){
	divMessage.innerHTML = msg;
	divMessage.style.color = document.hasFocus() ? "#ffffff" : "#ff0000";
	divMessage.style.textShadow = document.hasFocus() ? "0 0 #f0f0f0" : "0 0 #f00000";
}
/* ----- canvasクリック確認 ----- */
function canvasPosition(event){
	console.log("canvas "
	+  "client(X:" + event.clientX + "/ Y:" + event.clientY + ") " 
	+  "layer(X:" + event.layerX + "/ Y:" + event.layerY + ") " 
	+  "movement(X:" + event.movementX + "/ Y:" + event.movementY + ") " 
	+  "offset(X:" + event.offsetX + "/ Y:" + event.offsetY + ") " 
	+  "page(X:" + event.pageX + "/ Y:" + event.pageY + ") " 
	+  "screen(X:" + event.screenX + "/ Y:" + event.screenY + ") " 
	+  "(X:" + event.x + "/ Y:" + event.y + ")"
	);
	let d = new Date();
	let f = 'hh:mm:ss';
	f = f.replace(/hh/g, ('00' + d.getHours()).slice(-2));
	f = f.replace(/mm/g, ('00' + d.getMinutes()).slice(-2));
	f = f.replace(/ss/g, ('00' + d.getSeconds()).slice(-2));

	setMessage(f + " click client(X:" + event.clientX + "/ Y:" + event.clientY + ") ");
}
/* ----- canvasマウスオーバー ----- */
function canvasMouseOver(event){
	isMouseOver = true;
}
/* ----- canvasマウスアウト ----- */
function canvasMouseOut(event){
	isMouseOver = false;
}
