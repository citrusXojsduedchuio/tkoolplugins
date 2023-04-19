/*:
@target MZ

@plugindesc
消費MPを、メモ欄によって加減算できます

@author
シトラス

@base
CTRS_MZ_OriginalParameterManager

@param   MpCostUnder
@text    消費MP下限設定
@desc
スキルの消費MPが減算されて0を下回った場合
最小値を1にするか0にするか選べます
@on  1
@off 0
@default true
@type    boolean

@help
このプラグインを使用する場合
CTRS_MZ_OriginalParameterManagerと


アクター、職業、装備、ステート、エネミーのメモ欄に<amc:X> (Xは整数)と入力すれば
その値だけ、スキルを使用するときの消費MPを加減算することができます。
これにより、消費MPを算出する式は以下のようになります。

スキルの消費MP×MP消費率 + 消費MP加減算値(amc)

・消費MPが元々0のスキルには適用されません。

・減算された結果、消費MPが0以下になる場合はプラグインコマンドにより
0にするか1でとどめるか選ぶことができます

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins
*/
(() => {
	'use strict'
	const ADDITIONAL_MP_COST = "amc";
	const MPCOST_UNDER       = PluginManager.parameters("CTRS_MZ_MpCostAdditional").MpCostUnder === "true" ? 1 : 0;
	Object.defineProperties(Game_BattlerBase.prototype, {
		//hoge:加算されるオリジナルパラメータ
		amc: {
			get: function() {
				return this.getOriginalParamaterAdd(ADDITIONAL_MP_COST);
			},
			configurable: true
		},
	});
	
	
	Game_Battler.prototype.additionalMpCost = function(){
		return this.getOriginalParamaterAdd(ADDITIONAL_MP_COST);
	};
	
	Game_BattlerBase.prototype.skillMpCost = function(skill) {
		//MPコストが0なら何もしない
		if(skill.mpCost === 0){
			return 0;
		}
		const mpCost = Math.floor(skill.mpCost * this.mcr) + this.amc;
		if(mpCost <= 0){
			return MPCOST_UNDER;
		}
		return mpCost;
	};
})();