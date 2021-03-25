/*:
@target MZ

@plugindesc
タイムプログレスバトルにおいて、スキル発動後ゲージの再始動場所を
調節できます。

@author
シトラス

@help
スキルの部分に<TPGaugeRestartPoint:number>(numberは数字)と書き込むと
スキル発動後にゲージのスタート場所を、初期値以外から
始めることができます。

例：
<TPGaugeRestartPoint:-1>
スキルを発動した後、タイムプログレスゲージの再始動値が-1になる。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
(() => {
	'use strict'
	//文字列を数字に変換する。数でないなら、isNaN_Changeの値を返す
	const NumberEx = function(str,isNaN_Change){
		const  num = Number(str);
		return Number.isNaN(num) ? isNaN_Change : num;
	};
	
	//再定義して、tpbReStartPointを追加する
	const _Game_Battler_initMembers = Game_Battler.prototype.initMembers;
	Game_Battler.prototype.initMembers = function(){
		_Game_Battler_initMembers.apply(this,arguments);
		this._tpbReStartPoint = 0;
	};
	
	//再定義する
	const _Game_Battler_clearTpbChargeTime = Game_Battler.prototype.clearTpbChargeTime;
	Game_Battler.prototype.clearTpbChargeTime = function() {
		_Game_Battler_clearTpbChargeTime.apply(this,arguments);
		this._tpbChargeTime = this._tpbReStartPoint;
		this._tpbReStartPoint = 0;
	};
	
	Game_Battler.prototype.setRestartPoint = function(itemRestartTime){
		this._tpbReStartPoint = itemRestartTime;
	};
	
	Game_Action.prototype.itemRestartPoint = function(){
		return NumberEx(this.item().meta.TPGaugeRestartPoint,0);
	};
	
	const _Game_Action_proto_applyGlobal = Game_Action.prototype.applyGlobal;
	Game_Action.prototype.applyGlobal = function() {
		_Game_Action_proto_applyGlobal.call(this);
		this.subject().setRestartPoint(this.itemRestartPoint() );
	};
})();