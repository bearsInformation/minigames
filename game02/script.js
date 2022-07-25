let images = {'rocks':[[''],[''],['',''],['','',''],['','','','']]};
let map = [];
let levels = [];
let patterns = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
let info = {'rocks':[],'type':0,'mode':0,'erase':0,'scoreTemp':0,'score':0,'level':0,'isEnd':false,'frame':0,'time':0,'isEvents':false};
let mouseinfo = {'isDown':false, 'x':-1, 'y':-1};
let controlValues = {'energy':100,'energyTime':null,'point':0};
let canvas;
let context;
let score;
let level;
let energy;
let point;
let intervalId = null;

let BLOCK_SIZE = 64;
let ONE_BLOCK_SPEED = 12;
let ONE_BLOCK_MOVE = BLOCK_SIZE / ONE_BLOCK_SPEED;
const ONE_FRAME_MILLISECOND = 1000 / 48;	// ミリ秒
const BLOCK_WAIT = 32;						// 秒
const BLOCK_X_COUNT = 8;
const BLOCK_Y_COUNT = 16;
window.addEventListener("DOMContentLoaded", () => {
	images.rocks[0][0] = new Image();
	images.rocks[0][0].src = 'img/rock01-0.png'

	images.rocks[1][0] = new Image();
	images.rocks[1][0].src = 'img/rock02-0.png'
	images.rocks[1][1] = new Image();
	images.rocks[1][1].src = 'img/rock02-1.png'

	images.rocks[2][0] = new Image();
	images.rocks[2][0].src = 'img/rock03-0.png'
	images.rocks[2][1] = new Image();
	images.rocks[2][1].src = 'img/rock03-1.png'
	images.rocks[2][2] = new Image();
	images.rocks[2][2].src = 'img/rock03-2.png'

	images.rocks[3][0] = new Image();
	images.rocks[3][0].src = 'img/rock04-0.png'
	images.rocks[3][1] = new Image();
	images.rocks[3][1].src = 'img/rock04-1.png'
	images.rocks[3][2] = new Image();
	images.rocks[3][2].src = 'img/rock04-2.png'
	images.rocks[3][3] = new Image();
	images.rocks[3][3].src = 'img/rock04-3.png'

	images.rocks[4][0] = new Image();
	images.rocks[4][0].src = 'img/rock05-0.png'
	images.rocks[4][1] = new Image();
	images.rocks[4][1].src = 'img/rock05-1.png'
	images.rocks[4][2] = new Image();
	images.rocks[4][2].src = 'img/rock05-2.png'
	images.rocks[4][3] = new Image();
	images.rocks[4][3].src = 'img/rock05-3.png'
	images.rocks[4][4] = new Image();
	images.rocks[4][4].src = 'img/rock05-4.png'

	levels.push({'level':1,'from':	0		,'to':1000	,'pattern':0});
	levels.push({'level':2,'from':	1000	,'to':2000	,'pattern':0});
	levels.push({'level':3,'from':	2000	,'to':3000	,'pattern':0});
	levels.push({'level':4,'from':	3000	,'to':4000	,'pattern':0});
	levels.push({'level':5,'from':	4000	,'to':5000	,'pattern':1});
	levels.push({'level':6,'from':	5000	,'to':6000	,'pattern':1});
	levels.push({'level':7,'from':	6000	,'to':7000	,'pattern':1});
	levels.push({'level':8,'from':	7000	,'to':8000	,'pattern':1});
	levels.push({'level':9,'from':	8000	,'to':9000	,'pattern':2});
	levels.push({'level':10,'from':	9000	,'to':10000	,'pattern':2});
	levels.push({'level':11,'from':	10000	,'to':11000	,'pattern':2});
	levels.push({'level':12,'from':	11000	,'to':12000	,'pattern':2});
	levels.push({'level':13,'from':	12000	,'to':13000	,'pattern':3});
	levels.push({'level':14,'from':	13000	,'to':14000	,'pattern':3});
	levels.push({'level':15,'from':	14000	,'to':15000	,'pattern':3});
	levels.push({'level':16,'from':	15000	,'to':16000	,'pattern':3});
	levels.push({'level':17,'from':	16000	,'to':17000	,'pattern':4});
	levels.push({'level':18,'from':	17000	,'to':18000	,'pattern':4});
	levels.push({'level':19,'from':	18000	,'to':19000	,'pattern':4});
	levels.push({'level':20,'from':	19000	,'to':20000	,'pattern':4});
	levels.push({'level':21,'from':	20000	,'to':21000	,'pattern':5});
	levels.push({'level':22,'from':	21000	,'to':22000	,'pattern':5});
	levels.push({'level':23,'from':	22000	,'to':23000	,'pattern':5});
	levels.push({'level':24,'from':	23000	,'to':24000	,'pattern':5});
	levels.push({'level':25,'from':	24000	,'to':25000	,'pattern':5});
	levels.push({'level':26,'from':	25000	,'to':26000	,'pattern':6});
	levels.push({'level':27,'from':	26000	,'to':27000	,'pattern':6});
	levels.push({'level':28,'from':	27000	,'to':28000	,'pattern':6});
	levels.push({'level':29,'from':	28000	,'to':29000	,'pattern':6});
	levels.push({'level':30,'from':	29000	,'to':30000	,'pattern':6});
	levels.push({'level':31,'from':	30000	,'to':31000	,'pattern':7});
	levels.push({'level':32,'from':	31000	,'to':32000	,'pattern':7});
	levels.push({'level':33,'from':	32000	,'to':33000	,'pattern':7});
	levels.push({'level':34,'from':	33000	,'to':34000	,'pattern':7});
	levels.push({'level':35,'from':	34000	,'to':35000	,'pattern':7});
	levels.push({'level':36,'from':	35000	,'to':36000	,'pattern':8});
	levels.push({'level':37,'from':	36000	,'to':37000	,'pattern':8});
	levels.push({'level':38,'from':	37000	,'to':38000	,'pattern':8});
	levels.push({'level':39,'from':	38000	,'to':39000	,'pattern':8});
	levels.push({'level':40,'from':	39000	,'to':40000	,'pattern':8});
	levels.push({'level':41,'from':	40000	,'to':41000	,'pattern':9});
	levels.push({'level':42,'from':	41000	,'to':42000	,'pattern':9});
	levels.push({'level':43,'from':	42000	,'to':43000	,'pattern':9});
	levels.push({'level':44,'from':	43000	,'to':44000	,'pattern':9});
	levels.push({'level':45,'from':	44000	,'to':45000	,'pattern':9});
	levels.push({'level':46,'from':	45000	,'to':46000	,'pattern':10});
	levels.push({'level':47,'from':	46000	,'to':47000	,'pattern':10});
	levels.push({'level':48,'from':	47000	,'to':48000	,'pattern':10});
	levels.push({'level':49,'from':	48000	,'to':49000	,'pattern':10});
	levels.push({'level':50,'from':	49000	,'to':50000	,'pattern':10});
	levels.push({'level':51,'from':	50000	,'to':51000	,'pattern':10});
	levels.push({'level':52,'from':	51000	,'to':52000	,'pattern':11});
	levels.push({'level':53,'from':	52000	,'to':53000	,'pattern':11});
	levels.push({'level':54,'from':	53000	,'to':54000	,'pattern':11});
	levels.push({'level':55,'from':	54000	,'to':55000	,'pattern':11});
	levels.push({'level':56,'from':	55000	,'to':56000	,'pattern':11});
	levels.push({'level':57,'from':	56000	,'to':57000	,'pattern':11});
	levels.push({'level':58,'from':	57000	,'to':58000	,'pattern':11});
	levels.push({'level':59,'from':	58000	,'to':59000	,'pattern':12});
	levels.push({'level':60,'from':	59000	,'to':60000	,'pattern':12});
	levels.push({'level':61,'from':	60000	,'to':61000	,'pattern':12});
	levels.push({'level':62,'from':	61000	,'to':62000	,'pattern':12});
	levels.push({'level':63,'from':	62000	,'to':63000	,'pattern':12});
	levels.push({'level':64,'from':	63000	,'to':64000	,'pattern':12});
	levels.push({'level':65,'from':	64000	,'to':65000	,'pattern':12});
	levels.push({'level':66,'from':	65000	,'to':66000	,'pattern':13});
	levels.push({'level':67,'from':	66000	,'to':67000	,'pattern':13});
	levels.push({'level':68,'from':	67000	,'to':68000	,'pattern':13});
	levels.push({'level':69,'from':	68000	,'to':69000	,'pattern':13});
	levels.push({'level':70,'from':	69000	,'to':70000	,'pattern':13});
	levels.push({'level':71,'from':	70000	,'to':71000	,'pattern':13});
	levels.push({'level':72,'from':	71000	,'to':72000	,'pattern':13});
	levels.push({'level':73,'from':	72000	,'to':73000	,'pattern':14});
	levels.push({'level':74,'from':	73000	,'to':74000	,'pattern':14});
	levels.push({'level':75,'from':	74000	,'to':75000	,'pattern':14});
	levels.push({'level':76,'from':	75000	,'to':76000	,'pattern':14});
	levels.push({'level':77,'from':	76000	,'to':77000	,'pattern':14});
	levels.push({'level':78,'from':	77000	,'to':78000	,'pattern':14});
	levels.push({'level':79,'from':	78000	,'to':79000	,'pattern':14});
	levels.push({'level':80,'from':	79000	,'to':80000	,'pattern':15});
	levels.push({'level':81,'from':	80000	,'to':81000	,'pattern':15});
	levels.push({'level':82,'from':	81000	,'to':82000	,'pattern':15});
	levels.push({'level':83,'from':	82000	,'to':83000	,'pattern':15});
	levels.push({'level':84,'from':	83000	,'to':84000	,'pattern':15});
	levels.push({'level':85,'from':	84000	,'to':85000	,'pattern':15});
	levels.push({'level':86,'from':	85000	,'to':86000	,'pattern':15});
	levels.push({'level':87,'from':	86000	,'to':87000	,'pattern':16});
	levels.push({'level':88,'from':	87000	,'to':88000	,'pattern':16});
	levels.push({'level':89,'from':	88000	,'to':89000	,'pattern':16});
	levels.push({'level':90,'from':	89000	,'to':90000	,'pattern':16});
	levels.push({'level':91,'from':	90000	,'to':91000	,'pattern':16});
	levels.push({'level':92,'from':	91000	,'to':92000	,'pattern':16});
	levels.push({'level':93,'from':	92000	,'to':93000	,'pattern':16});
	levels.push({'level':94,'from':	93000	,'to':94000	,'pattern':17});
	levels.push({'level':95,'from':	94000	,'to':95000	,'pattern':17});
	levels.push({'level':96,'from':	95000	,'to':96000	,'pattern':17});
	levels.push({'level':97,'from':	96000	,'to':97000	,'pattern':17});
	levels.push({'level':98,'from':	97000	,'to':98000	,'pattern':17});
	levels.push({'level':99,'from':	98000	,'to':99000	,'pattern':17});
	levels.push({'level':100,'from':99000	,'to':9999999999999	,'pattern':17});

	patterns[0].push([3,0,0,0,0]);
	patterns[0].push([2,1,0,0,0]);
	patterns[0].push([1,2,0,0,0]);
	patterns[0].push([0,3,0,0,0]);
	
	patterns[1].push([3,1,0,0,0]);
	patterns[1].push([2,2,0,0,0]);
	patterns[1].push([1,3,0,0,0]);
	
	patterns[2].push([4,1,0,0,0]);
	patterns[2].push([3,2,0,0,0]);
	patterns[2].push([2,3,0,0,0]);
	patterns[2].push([1,4,0,0,0]);
	
	patterns[3].push([5,1,0,0,0]);
	patterns[3].push([4,2,0,0,0]);
	patterns[3].push([3,3,0,0,0]);
	patterns[3].push([2,4,0,0,0]);
	patterns[3].push([1,5,0,0,0]);
	
	patterns[4].push([2,0,1,0,0]);
	patterns[4].push([1,1,1,0,0]);
	patterns[4].push([1,0,2,0,0]);
	patterns[4].push([0,2,1,0,0]);
	patterns[4].push([0,1,2,0,0]);
	
	patterns[5].push([3,0,1,0,0]);
	patterns[5].push([2,1,1,0,0]);
	patterns[5].push([2,0,2,0,0]);
	
	patterns[6].push([1,2,1,0,0]);
	patterns[6].push([1,1,2,0,0]);
	patterns[6].push([1,0,3,0,0]);
	
	patterns[7].push([4,0,1,0,0]);
	patterns[7].push([3,1,1,0,0]);
	patterns[7].push([3,0,2,0,0]);
	patterns[7].push([2,2,1,0,0]);
	patterns[7].push([2,1,2,0,0]);
	patterns[7].push([2,0,3,0,0]);
	
	patterns[8].push([1,3,1,0,0]);
	patterns[8].push([1,2,2,0,0]);
	patterns[8].push([1,1,3,0,0]);
	patterns[8].push([1,0,4,0,0]);
	
	patterns[9].push([5,0,1,0,0]);
	patterns[9].push([4,1,1,0,0]);
	patterns[9].push([4,0,2,0,0]);
	patterns[9].push([3,2,1,0,0]);
	patterns[9].push([3,1,2,0,0]);
	patterns[9].push([3,0,3,0,0]);
	patterns[9].push([2,3,1,0,0]);
	patterns[9].push([2,2,2,0,0]);
	patterns[9].push([2,1,3,0,0]);
	patterns[9].push([2,0,4,0,0]);
	
	patterns[10].push([1,4,1,0,0]);
	patterns[10].push([1,3,2,0,0]);
	patterns[10].push([1,2,3,0,0]);
	patterns[10].push([1,1,4,0,0]);
	patterns[10].push([1,0,5,0,0]);
	
	patterns[11].push([0,2,0,1,0]);
	patterns[11].push([0,1,1,1,0]);
	patterns[11].push([0,1,0,2,0]);
	
	patterns[12].push([0,3,0,1,0]);
	patterns[12].push([0,2,1,1,0]);
	patterns[12].push([0,2,0,2,0]);
	patterns[12].push([0,1,2,1,0]);
	patterns[12].push([0,1,1,2,0]);
	patterns[12].push([0,1,0,3,0]);
	
	patterns[13].push([0,4,0,1,0]);
	patterns[13].push([0,3,1,1,0]);
	patterns[13].push([0,3,0,2,0]);
	patterns[13].push([0,2,2,1,0]);
	patterns[13].push([0,2,1,2,0]);
	patterns[13].push([0,2,0,3,0]);
	patterns[13].push([0,1,3,1,0]);
	patterns[13].push([0,1,2,2,0]);
	patterns[13].push([0,1,1,3,0]);
	patterns[13].push([0,1,0,4,0]);
	
	patterns[14].push([0,5,0,1,0]);
	patterns[14].push([0,4,1,1,0]);
	patterns[14].push([0,4,0,2,0]);
	patterns[14].push([0,3,2,1,0]);
	patterns[14].push([0,3,1,2,0]);
	patterns[14].push([0,3,0,3,0]);
	patterns[14].push([0,2,3,1,0]);
	patterns[14].push([0,2,2,2,0]);
	patterns[14].push([0,2,1,3,0]);
	patterns[14].push([0,2,0,4,0]);
	
	patterns[15].push([0,1,4,1,0]);
	patterns[15].push([0,1,3,2,0]);
	patterns[15].push([0,1,2,3,0]);
	patterns[15].push([0,1,1,4,0]);
	patterns[15].push([0,1,0,5,0]);
	
	patterns[16].push([0,0,2,0,1]);
	patterns[16].push([0,0,1,1,1]);
	patterns[16].push([0,0,1,0,2]);
	patterns[16].push([0,0,3,0,1]);
	patterns[16].push([0,0,2,1,1]);
	patterns[16].push([0,0,2,0,2]);
	patterns[16].push([0,0,1,2,1]);
	patterns[16].push([0,0,1,1,2]);
	patterns[16].push([0,0,1,0,3]);
	patterns[16].push([0,0,4,0,1]);
	patterns[16].push([0,0,3,1,1]);
	patterns[16].push([0,0,3,0,2]);
	patterns[16].push([0,0,2,2,1]);
	patterns[16].push([0,0,2,1,2]);
	patterns[16].push([0,0,2,0,3]);
	patterns[16].push([0,0,1,3,1]);
	patterns[16].push([0,0,1,2,2]);
	patterns[16].push([0,0,1,1,3]);
	patterns[16].push([0,0,1,0,4]);
	
	patterns[17].push([0,0,5,0,1]);
	patterns[17].push([0,0,4,1,1]);
	patterns[17].push([0,0,4,0,2]);
	patterns[17].push([0,0,3,2,1]);
	patterns[17].push([0,0,3,1,2]);
	patterns[17].push([0,0,3,0,3]);
	patterns[17].push([0,0,2,3,1]);
	patterns[17].push([0,0,2,2,2]);
	patterns[17].push([0,0,2,1,3]);
	patterns[17].push([0,0,2,0,4]);
	patterns[17].push([0,0,1,4,1]);
	patterns[17].push([0,0,1,3,2]);
	patterns[17].push([0,0,1,2,3]);
	patterns[17].push([0,0,1,1,4]);
	patterns[17].push([0,0,1,0,5]);

});
window.addEventListener("load", () => {
	canvas = document.getElementById("board");
	context = canvas.getContext("2d");
	score = document.getElementById("score");
	level = document.getElementById("level");
	energy = document.getElementById("energy");
	point = document.getElementById("point");
	energy.innerHTML = controlValues.energy + ' (00:00:00)';
	point.innerHTML = controlValues.point;

	if(navigator.userAgent.match(/(iPhone|iPad|iPod|Android)/i)){
		ONE_BLOCK_SPEED *= 2;
		document.getElementById("board").className = "not-pointer";
	}
	// 画面サイズ調整
	window_resize();
});
window.addEventListener("resize", () => {
	window_resize();
});
// 画面サイズ調整
function window_resize(){
	let blockX = Math.floor((window.innerWidth - 20) / BLOCK_X_COUNT / (ONE_BLOCK_SPEED / 2)) * (ONE_BLOCK_SPEED / 2);
	let blockY = Math.floor((window.innerHeight * 0.9) / BLOCK_Y_COUNT / (ONE_BLOCK_SPEED / 2)) * (ONE_BLOCK_SPEED / 2);

	BLOCK_SIZE = Math.min(blockX, blockY)
	ONE_BLOCK_MOVE = BLOCK_SIZE / ONE_BLOCK_SPEED;

	canvas.width = (BLOCK_SIZE * BLOCK_X_COUNT);
	canvas.height = (BLOCK_SIZE * BLOCK_Y_COUNT);

	let bgTopExp = document.getElementById("bgTopExp");
	bgTopExp.width = canvas.width;
	bgTopExp.getElementsByTagName('td')[0].width = canvas.width / 3;
	bgTopExp.getElementsByTagName('td')[1].width = canvas.width / 3;
	bgTopExp.getElementsByTagName('td')[2].width = canvas.width / 3;

	let bgBottomExp = document.getElementById("bgBottomExp");
	bgBottomExp.width = canvas.width;
	bgBottomExp.getElementsByTagName('td')[0].width = canvas.width / 3;
	bgBottomExp.getElementsByTagName('td')[1].width = canvas.width / 3;
	bgBottomExp.getElementsByTagName('td')[2].width = canvas.width / 3;

}
document.addEventListener("contextmenu", (event) => {
	event.preventDefault();
});
window.addEventListener('touchmove', (event) => {
    event.preventDefault();
});

window.addEventListener("mousedown", (event) => {
	window_mousedown(event);
});
window.addEventListener("pointerdown", (event)=> {
	window_mousedown(event);
});
function window_mousedown(event){
	if(canvas){
		mouseinfo.isDown = true;
	    let rect = canvas.getBoundingClientRect();
		mouseinfo.x = event.clientX - rect.left;
		mouseinfo.y = event.clientY - rect.top;
	}
}
window.addEventListener("mousemove", (event)=> {
	window_mousemove(event);
});
window.addEventListener("pointermove", (event)=> {
	window_mousemove(event);
});
function window_mousemove(event){
	if(mouseinfo.isDown == true){
	    let rect = canvas.getBoundingClientRect();
		mouseinfo.x = event.clientX - rect.left;
		mouseinfo.y = event.clientY - rect.top;
	}
}
window.addEventListener("mouseup", ()=> {
	window_mouseup();
});
window.addEventListener("mouseout", () => {
	window_mouseup();
});
window.addEventListener("pointerup", () => {
	window_mouseup();
});
window.addEventListener("pointerout", () => {
	window_mouseup();
});
function window_mouseup(){
	mouseinfo.isDown = false;
	mouseinfo.x = -1;
	mouseinfo.y = -1;
}
// ゲーム開始
function game_start(){
	if(controlValues.energy == 0){
		return;
	}
	controlValues.energy --; 
	energy.innerHTML = controlValues.energy + ' (00:00:00)';

	// 各種値のリセット
	board_reset();

	// 岩を設定
	info.rocks.push([5,3,0,0,0]);
	info.rocks.push([4,4,0,0,0]);
	info.rocks.push([5,3,0,0,0]);
	info.rocks.push([4,4,0,0,0]);

	document.getElementById("startup").className = 'display-none';
	document.getElementById("gameover").className = 'display-none';

}
// 各種値のリセット
function board_reset(){
	if(intervalId !== null) clearTimeout(intervalId);
	map = [];
	for(let x = 0; x < BLOCK_X_COUNT; x++){
		map.push([]);
		for(let y = 0; y < BLOCK_Y_COUNT; y++){
			map[x].push({'type':0,'mode':0,'press':0});
		}
	}
	info = {'rocks':[],'type':0,'mode':0,'erase':0,'scoreTemp':0,'score':0,'level':0,'isEnd':false,'frame':0,'time':0,'isEvents':false};
//	info.score = 90000;
	// 背景リセット
	board_clear();

	// スコア セット
	score_set();

	intervalId = setTimeout(game_progress, 1000);
}
// 岩を設定
function rocks_set(counts){
	// ゲーム終了判定 
	let isEnd = false;
	for(let x = 0; x < BLOCK_X_COUNT; x++){
		if(map[x][0].type != 0){
			isEnd = true;
			break;
		}else{
			map[x][0].mode = 0;
			map[x][0].press = 0;
		}
	}
	if(isEnd){
		return true;
	}
	// 岩タイプ設定
	let x = 0;
	for(let t = 0; t <= 4; t++){
		while(counts[t] > 0){
			map[x][0].type = (t + 1);
			counts[t] --;
			x ++;
		}
	}
	// 岩タイプをランダム配置
	let rnd = 4;
	let type = 0;
	let xFrom = 0;
	let xTo = 0;
	while(rnd > 0){
		xFrom = Math.round(Math.random() * (BLOCK_X_COUNT - 1));
		xTo = Math.round(Math.random() * (BLOCK_X_COUNT - 1));
		if(xFrom != xTo){
			type = map[xFrom][0].type;
			map[xFrom][0].type = map[xTo][0].type;
			map[xTo][0].type = type;
			rnd --;
		}
	}

}
// 岩削除
function rocks_erase(x,y){
	let type = map[x][y].type;
	info.erase ++;					// 消した岩の数
	info.scoreTemp += type * 10;	// 消した岩スコア合計

	// 中央
	map[x][y].type = 0;
	map[x][y].mode = 0;
	map[x][y].press = 0;

	if(x > 0){						// 左
		if(map[x - 1][y].type == type) rocks_erase(x - 1,y);
	}
	if(x < (BLOCK_X_COUNT - 1)){	// 右
		if(map[x + 1][y].type == type) rocks_erase(x + 1,y);
	}
	if(y > 0){						// 上
		if(map[x][y - 1].type == type) rocks_erase(x,y - 1);
	}
	if(y < (BLOCK_Y_COUNT - 1)){	// 下
		if(map[x][y + 1].type == type) rocks_erase(x,y + 1);
	}

}
// 岩を追加
function rocks_add(){
	let p = levels[Math.min(Math.max(info.level - 1,0),99)].pattern;
	let	i = Math.round(Math.random() * (patterns[p].length - 1));
	info.rocks.push(patterns[p][i].concat());
}
// スコアを設定
function score_set(){
	score.innerHTML = info.score.toLocaleString();
	info.level = Math.ceil(info.score / 1000);
	level.innerHTML = info.level;
}

// ゲーム進行
function game_progress(){
	intervalId = null;
	let x = 0;
	let y = 0;
	let befPress = 0;

	let now = new Date();
	if(info.time == 0){
		info.time = now;
		intervalId = setTimeout(game_progress, ONE_FRAME_MILLISECOND);
		return;
	}else{
		info.frame = now - info.time;
		info.time = now;
	}
	// メッセージ表示中
	if(document.getElementById("startup").className == '' 
	|| document.getElementById("gameover").className == ''){
		intervalId = setTimeout(game_progress, ONE_FRAME_MILLISECOND);
		return;	
	}

	// マウス押下位置設定
	if(mouseinfo.isDown == true){
		x = Math.floor(mouseinfo.x / BLOCK_SIZE);
		y = Math.floor(mouseinfo.y / BLOCK_SIZE);
		if(x >= 0 && x < BLOCK_X_COUNT && y > 0 && y < BLOCK_Y_COUNT){
			if(map[x][y].type != 0){
				// マウス押下時間計測及び岩の追加判定
				befPress = Math.floor(map[x][y].press);
				map[x][y].press += (info.frame / 1000 * 2);	// 秒単位
				if(befPress != Math.floor(map[x][y].press)){
					// 岩を追加
					rocks_add();
				}
			}
		}
	}

	if(info.type == 0 && info.mode == 0){
		if(info.rocks.length > 0){
			// 岩を設定
			rocks_set(info.rocks[0]);
			info.rocks.shift();
			// 落下待機状態
			info.type = 1;
			info.mode = Math.floor(info.frame / ONE_FRAME_MILLISECOND);
		}
	}else if(info.type == 1){
		// 待機状態
		if(info.mode < BLOCK_WAIT){
			info.mode += Math.floor(info.frame / ONE_FRAME_MILLISECOND);
		}else{
			info.isEnd = false;
			for(x = 0; x < BLOCK_X_COUNT; x++){
				if(map[x][0].type != 0 && (map[x][1].type != 0 && map[x][1].mode == 0)){
					info.isEnd = true;
				}
			}

			if(info.isEnd == true){
				// ゲームオーバー
				controlValues.point += Math.floor(info.level / 100);
				point.innerHTML = controlValues.point;
				document.getElementById("gameover").className = '';
				return;
			}else{
				// 落下開始状態
				info.type = 2;
				info.mode = Math.floor(info.frame / ONE_FRAME_MILLISECOND);
			}
		}
	}else if(info.type == 2){
		// 落下状態
		if(info.mode < ONE_BLOCK_MOVE){
			info.mode += Math.floor(info.frame / ONE_FRAME_MILLISECOND);
		}else{
			// 次の落下受け入れ状態
			info.type = 0;
			info.mode = 0;
		}
	}

	for(x = 0; x < BLOCK_X_COUNT; x++){
		for(y = (BLOCK_Y_COUNT - 1); y >= 0; y--){
			if(map[x][y].type != 0){
				// タイプと同じ秒数押していた場合	
				if(map[x][y].press > map[x][y].type){
					// 岩削除
					info.erase = 0
					info.scoreTemp = 0;
					rocks_erase(x,y);
					info.score += info.scoreTemp * ((10 + info.erase) / 10);	// スコア
					// スコア設定
					score_set();
				}
				
				if(map[x][y].mode == 0){
					// 落下していない状態
					if(y == 0){
						if(info.type == 2){
							// 落下開始
							map[x][y].mode = Math.floor(info.frame / ONE_FRAME_MILLISECOND);
						}
					}else if(y < (BLOCK_Y_COUNT - 1)){
						if(map[x][y + 1].type == 0){
							// 落下開始
							map[x][y].mode = Math.floor(info.frame / ONE_FRAME_MILLISECOND);
						}
					}
				}else{
					// 落下中
					map[x][y].mode ++;
					if(map[x][y].mode > ONE_BLOCK_MOVE){
						// 落下完了
						map[x][y + 1].type = map[x][y].type;
						map[x][y + 1].mode = 0;
						map[x][y + 1].press = map[x][y].press;
						map[x][y].type = 0;
						map[x][y].mode = 0;
						map[x][y].press = 0;
					}
				}
			}
		}
	}

	// 背景リセット
	board_clear();

	// 岩の描写
	let t = 0;
	let p = 0;
	let m = 0;

	for(let x = 0; x < BLOCK_X_COUNT; x++){
		for(let y = 0; y < BLOCK_Y_COUNT; y++){
			if(map[x][y].type != 0){
				t = map[x][y].type - 1;
				p = Math.floor(map[x][y].press);
				p = Math.min(p,t);
				m = map[x][y].mode * (BLOCK_SIZE / ONE_BLOCK_MOVE);
				context.drawImage(images.rocks[t][p], 0, 0, 64, 64, x * BLOCK_SIZE, (y * BLOCK_SIZE) + m, BLOCK_SIZE, BLOCK_SIZE);
			}
		}
	}
	context.beginPath () ;
	context.rect(0, 0, BLOCK_SIZE * BLOCK_X_COUNT, BLOCK_SIZE);
	context.fillStyle = 'rgba(255,255,255,0.6)';
	context.fill();

	info.isEvents = false;
	intervalId = setTimeout(game_progress, ONE_FRAME_MILLISECOND - (info.frame - ONE_FRAME_MILLISECOND));
}

// 背景リセット
function board_clear(){
	context.beginPath () ;
	// 塗りつぶし
	context.rect(0, 0, BLOCK_SIZE * BLOCK_X_COUNT, BLOCK_SIZE * BLOCK_Y_COUNT);
	context.fillStyle = 'rgba(255,255,255,1)';
	context.fill();
}
