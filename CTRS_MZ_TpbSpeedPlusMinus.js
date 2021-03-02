/*:
@target MZ

@plugindesc
タイムプログレスバトルにおいて、ゲージがたまる相対速度を
加算・減算できます。

@author
シトラス

@param   lowestTpbSpeed
@text    TPB速度最小値
@desc
タイムプログレスバトルにおけるバトラーの最低速度を
設定します。減算されたとき、これ以下の値になりません。
@default 0.5
@min     0.01
@decimals 2
@type    number

@help
アクターやエネミーのメモ欄に<TpbSpeedPm:x(数値)>のように書き込むと
タイムプログレスバトルにおける相対速度がそのぶん加算・減算されます。

例：
<TpbSpeedPm:1>
タイムプログレス相対速度が1上昇。最速のアクターであれば
2倍分の上昇に相当する。

<TpbSpeedPm:-0.5>
タイムプログレス相対速度が0.5減少。最速のアクターであれば
半分の減少に相当する。

どれほど減算値が重なっても、プラグインパラメータで設定した最低値を
下回ることはありません。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
(() => {
	'use strict'
	//アクターの特徴から、TPBスピードを加減算する
	const PLUGIN_NAME = "CTRS_MZ_TpbSpeedPlusMinus";
	const LOWEST_TPB_SPEED = Number(PluginManager.parameters(PLUGIN_NAME).lowestTpbSpeed);
	
	Game_Battler.prototype.lowestTpbSpeed = function(){
		return LOWEST_TPB_SPEED;
	}
	//かかっているステートから、相対速度を加減算する
	Game_Battler.prototype.tpbSpeedPmByState = function(){
		return this.states().reduce( (tpbSpeedPmSum,state) => {
			const tpbSpeedPm = Number(state.meta.TpbSpeedPm);
			if(Number.isNaN(tpbSpeedPm) ){
				return tpbSpeedPmSum;
			}else{
				return tpbSpeedPmSum + tpbSpeedPm;
			}
		},0);
	}
	//アクターとエネミーで共通の相対速度
	const _Game_Battler_tpbRelativeSpeed = Game_Battler.prototype.tpbRelativeSpeed;
	Game_Battler.prototype.tpbRelativeSpeed = function() {
		return _Game_Battler_tpbRelativeSpeed.call(this) + this.tpbSpeedPmByState();
	};
	
	//アクターのメモ欄から、相対速度を加減算する
	Game_Actor.prototype.tpbSpeedPmByActor = function(){
		const tpbPm = Number(this.actor().meta.TpbSpeedPm);
		return Number.isNaN(tpbPm) ? 0 : tpbPm;
	}
	//職業のメモ欄から、相対速度を加減算する
	Game_Actor.prototype.tpbSpeedPmByClass = function(){
		const tpbPm = Number(this.currentClass().meta.TpbSpeedPm);
		return Number.isNaN(tpbPm) ? 0 : tpbPm;
	}
	//装備のメモ欄から、相対速度を加減算する
	Game_Actor.prototype.tpbSpeedPmByEquip = function(){
		return this.equips().reduce( (tpbSpeedPmSum,equip) => {
			if(equip === null){
				return tpbSpeedPmSum;
			}
			const tpbSpeedPm = Number(equip.meta.TpbSpeedPm);
			if(Number.isNaN(tpbSpeedPm) ){
				return tpbSpeedPmSum;
			}
			return tpbSpeedPmSum + tpbSpeedPm;
		},0);
	}
	//スキルのメモ欄から、相対速度を加減算する
	Game_Actor.prototype.tpbSpeedPmBySkill = function(){
		return this.skills().reduce( (tpbSpeedPmSum,skill) => {
			const tpbSpeedPm = Number(skill.meta.TpbSpeedPm);
			if(Number.isNaN(tpbSpeedPm) ){
				return tpbSpeedPmSum;
			}else{
				return tpbSpeedPmSum + tpbSpeedPm;
			}
		},0);
	}
	//アクターに付随する様々な要因から、相対速度を加減算する
	Game_Actor.prototype.tpbSpeedPm = function(){
		return    this.tpbSpeedPmByActor()
				+ this.tpbSpeedPmByClass()
				+ this.tpbSpeedPmByEquip()
				+ this.tpbSpeedPmBySkill();
	}
	Game_Actor.prototype.tpbRelativeSpeed = function() {
		const tpbRelativeSpeed = Game_Battler.prototype.tpbRelativeSpeed.call(this) + this.tpbSpeedPm();
		return Math.max(this.lowestTpbSpeed(),tpbRelativeSpeed);
	};
	
	//エネミーのメモ欄から、相対速度を加減算する
	Game_Enemy.prototype.tpbSpeedPmByEnemy = function(){
		const tpbSpeedPm = Number(this.enemy().meta.TpbSpeedPm);
		if(Number.isNaN(tpbSpeedPm) ){
			return 0;
		}else{
			return tpbSpeedPm;
		}
	};
	//エネミーの相対速度を加減算する
	Game_Enemy.prototype.tpbRelativeSpeed = function(){
		const tpbRelativeSpeed = Game_Battler.prototype.tpbRelativeSpeed.call(this) + this.tpbSpeedPmByEnemy();
		return Math.max(this.lowestTpbSpeed(),tpbRelativeSpeed);
	}
})();