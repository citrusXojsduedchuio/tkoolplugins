/*:
@target MZ

@plugindesc
タイムプログレスバトルにおいて、スキル発動後ゲージの再始動場所を
調節できます。

@author
シトラス

@help
スキルの部分に<TpgaugeRestartPoint:number>(numberは数字)と書き込むと
スキル発動後にゲージのスタート場所を、初期値以外から
始めることができます。

例：
<TPGaugeRestartPoint:-1>
スキルを発動した後、タイムプログレスゲージの初期値が-1になる。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
(() => {
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
	
	const _Game_Action_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		_Game_Action_apply.apply(this,arguments);
		//applyを再定義して処理を追加する
		this.subject()._tpbReStartPoint = this.itemRestartTime();
	};
	
	Game_Action.prototype.itemRestartTime = function(){
		const tpGaugeRestartPoint = Number(this.item().meta.TPGaugeRestartPoint);
		if(Number.isNaN(tpGaugeRestartPoint) ){
			return 0;
		}
		return tpGaugeRestartPoint;
	};
})();