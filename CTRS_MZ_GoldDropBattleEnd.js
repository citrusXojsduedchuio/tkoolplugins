/*:
@target MZ

@plugindesc
戦闘に勝利したとき、お金をいくらか増減させることができます。

@author
シトラス

@param   dropGoldMeaasge
@text    お金入手メッセージ
@desc
お金を手に入れたとき、表示される文字列です。
%1がパーティ名に、%2が入手金額になります。
@default %1は%2\g手に入れた！
@type    string

@param   lostGoldMeaasge
@text    お金紛失メッセージ
@desc
お金が減ったとき、表示される文字列です。
%1がパーティ名に、%2が紛失金額になります。
@default %1は%2\g落とした！
@type    string

@help
戦闘に勝利したとき、お金をエネミーに設定したものとは別に
いくらか増減します。
この値はアクター・職業・装備・ステートのメモ欄に<drg:x(xは数字)>と
書き込まれた値の合計になり、パーティ全員のものが合算されます。

例：
<drg:10>
戦闘終了後に入手できるお金が10増えます

<drg:-20>
戦闘終了後に入手できるお金が20減ります

drgの合計値がマイナスになった場合、戦闘終了後にお金を失います。

合計値に対して何らかの特殊な計算を行いたい場合、関数calcDropGoldを
書き換えてください。

例：
drgの最小値を0にする
Game_Party.prototype.calcDropGold = function(){	
	const  dropGold = this.sumDropGold();
	return Math.max(0,dropGold);
};

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
(() => {
	'use strict'
	const PLUGIN_NAME       = "CTRS_MZ_GoldDropBattleEnd";
	const DROP_GOLD_MESSAGE = PluginManager.parameters(PLUGIN_NAME).dropGoldMeaasge;
	const LOST_GOLD_MESSAGE = PluginManager.parameters(PLUGIN_NAME).lostGoldMeaasge;
	
	Object.defineProperties(Game_BattlerBase.prototype, {
		//drg DRop Gold 戦闘終了後に落とすお金
		drg: {
			get: function() {
				return this.getDropGold();
			},
			configurable: true
		},
	});
	//オリジナルパラメータの計算
	Game_Actor.prototype.getDropGold = function(){
		return  this.getDropGoldByActor() +
				this.getDropGoldByClass() +
				this.getDropGoldByEquip() +
				this.getDropGoldBySkill() +
				this.getDropGoldByState();
	};
	
	//アクターのメモ欄から、オリジナルパラメータを算出する
	Game_Actor.prototype.getDropGoldByActor = function(){
		const dropGoldByActor = Number(this.actor().meta.drg);
		return isNaN(dropGoldByActor) ? 0 : dropGoldByActor;
	};
	
	//就いている職業のメモ欄から、オリジナルパラメータを算出する
	Game_Actor.prototype.getDropGoldByClass = function(){
		const dropGoldByClass = Number(this.currentClass().meta.drg);
		return isNaN(dropGoldByClass) ? 0 : dropGoldByClass;
	};
	
	//装備のメモ欄から、オリジナルパラメータを算出する
	Game_Actor.prototype.getDropGoldByEquip = function(){
		//nullではない装備データを抽出する
		const entityEquips = this.equips().filter( (equip) => equip !== null);
		return entityEquips.reduce( (dropGoldSum,equip) => {
			const equipDropGold = Number(equip.meta.drg);
			return isNaN(equipDropGold) ? dropGoldSum : dropGoldSum + equipDropGold;
		},0);
	};
	
	//習得スキルのメモ欄から、オリジナルパラメータを算出する
	Game_Actor.prototype.getDropGoldBySkill = function(){
		//スキルを習得していなければ、オリジナルパラメータは0とする
		if(this.skills().length === 0){
			return 0;
		}
		return this.skills().reduce( (dropGoldSum,skill) => {
			const skilldropGold = Number(skill.meta.drg);
			return isNaN(skilldropGold) ? dropGoldSum : dropGoldSum + skilldropGold;
		},0);
	};
	//かかっているステートから、オリジナルパラメータを算出する
	Game_Actor.prototype.getDropGoldByState = function(){
		//ステートにかかっていなければ、オリジナルパラメータは0とする
		if(this.states().length === 0){
			return 0;
		}
		return this.states().reduce( (dropGoldSum,state) => {
			//ステートにオリジナルパラメータが定義されているが、数でない場合も合計をそのまま返す
			const statedropGold = Number(state.meta.drg);
			return isNaN(statedropGold) ? dropGoldSum : dropGoldSum + statedropGold;
		},0);
	};
	
	//アクター全員のドロップ金額を合計。小数値がある場合四捨五入する
	Game_Party.prototype.sumDropGold = function(){
		return Math.round(this.members().reduce( (drgSum,member) => {
			return drgSum + member.drg;
		},0) );
	};
	
	//拾えるゴールドを計算。何らかの特殊な処理をしたいときはここを書き換える
	Game_Party.prototype.calcDropGold = function(){
		//拾えるお金の合計を取得
		const dropGold = this.sumDropGold();
		
		//スイッチの状態を取得。s[20]でスイッチ20番の状態を得られる
		const s = $gameSwitches._data;
		
		//変数の値を取得。v[30]で変数30番の状態を得られる
		const v = $gameVariables._data;
		
		return dropGold;
	};
	
	
	BattleManager.displayDropGold = function(){
		const dropGold = $gameParty.calcDropGold();
		const partyName = TextManager.partyName.format($gameParty.leader().name() );
		//お金を手に入れた場合
		if(0 < dropGold){
			$gameMessage.add(DROP_GOLD_MESSAGE.format(partyName,dropGold) );
		}
		//お金を失った場合
		if(dropGold < 0){
			$gameMessage.add(LOST_GOLD_MESSAGE.format(partyName,dropGold) );
		}
	};
	BattleManager.dropGold = function(){
		$gameParty.gainGold($gameParty.calcDropGold() );
	};
	const _BattleManager_processVictory = BattleManager.processVictory;
	BattleManager.processVictory = function() {
		_BattleManager_processVictory.call(this);
		this.dropGold();
		this.displayDropGold();
	};
})();