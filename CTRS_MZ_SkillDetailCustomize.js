/*:
@target MZ

@plugindesc
スキルに対する反射や回避の反応を個別に設定できます

@author
シトラス

@help
スキルのメモ欄に、これらのタグを設定することで
反撃の可否や参照するダメージ率、ステートに対して
抵抗できるかを設定できます。

参照する回避率は、スキルの「命中タイプ」で設定してください。

<DamageType:Physical>
ダメージに物理ダメージ率が影響する

<DamageType:Magical>
ダメージに魔法ダメージ率が影響する

<DamageType:Certain>
物理・魔法ダメージを参照しない

<Reaction:Counter>
そのスキルに対して「反撃」を行なえる

<Reaction:Reflect>
そのスキルに対して「反射」を行なえる

<Reaction:None>
そのスキルには反撃も反射もできない

<Resistable>
ステートや弱体化に対して抵抗される

<Unresistable>
ステートや弱体化に対して抵抗できない

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。
@url
https://github.com/citrusXojsduedchuio/tkoolplugins/blob/main/CTRS_MZ_SkillDetailCustomize.js
*/
(() => {
	'use strict'
	//ダメージタイプの判定
	Game_Action.prototype.damageType = function(){
		//タグで判定する
		//必中であるか
		if(this.item().meta.DamageType === "Certain"){
			return 0;
		}
		//物理ダメージであるか
		if(this.item().meta.DamageType === "Physical"){
			return 1;
		}
		//魔法ダメージであるか
		if(this.item().meta.DamageType === "Magical"){
			return 2;
		}
		//タグが存在しない
		if(this.isCertainHit() ){
			return 0;
		}
		if(this.isPhysical() ){
			return 1;
		}
		if(this.isMagical() ){
			return 2;
		}
		//イレギュラー
		return -1
	};
	//ダメージタイプを判定する
	//物理ダメージ
	Game_Action.prototype.isPhysicalDamage = function(){
		return this.damageType() === 1;
	};
	//魔法ダメージ
	Game_Action.prototype.isMagicalDamage = function(){
		return this.damageType() === 2;
	};
	//必中ダメージ
	Game_Action.prototype.isMagicalDamage = function(){
		return this.damageType() === 0;
	};
	//ダメージ計算
	Game_Action.prototype.makeDamageValue = function(target, critical) {
		const item = this.item();
		const baseValue = this.evalDamageFormula(target);
		let value = baseValue * this.calcElementRate(target);
		if (this.isPhysicalDamage() ) {
			value *= target.pdr;
		}
		if (this.isMagicalDamage() ) {
			value *= target.mdr;
		}
		if (baseValue < 0) {
			value *= target.rec;
		}
		if (critical) {
			value = this.applyCritical(value);
		}
		value = this.applyVariance(value, item.damage.variance);
		value = this.applyGuard(value, target);
		value = Math.round(value);
		return value;
	};
	
	//リアクション処理
	//リアクションを判定
	Game_Action.prototype.reactionType = function(){
		//タグで判定
		if(this.item().meta.Reaction === "None"){
			return 0;
		}
		if(this.item().meta.Reaction === "Counter"){
			return 1;
		}
		if(this.item().meta.Reaction === "Reflect"){
			return 2;
		}
		//タグがない場合
		if(this.isCertainHit() ){
			return 0;
		}
		if(this.isPhysical() ){
			return 1;
		}
		if(this.isMagical() ){
			return 2;
		}
		//イレギュラー
		return -1;
	};
	//反撃が可能か
	Game_Action.prototype.isCounterable = function(){
		return this.reactionType() === 1;
	};
	//反射が可能か
	Game_Action.prototype.isReflectable = function(){
		return this.reactionType() === 2;
	};
	//リアクションが不可能か
	Game_Action.prototype.isNoReaction = function(){
		return this.reactionType() === 0;
	};
	
	Game_Action.prototype.itemCnt = function(target) {
		if (this.isCounterable() && target.canMove() ) {
			return target.cnt;
		} else {
			return 0;
		}
	};

	Game_Action.prototype.itemMrf = function(target) {
		if (this.isReflectable() ) {
			return target.mrf;
		} else {
			return 0;
		}
	};
	//スキルがもたらす状態に対して抵抗可能か
	Game_Action.prototype.resistType = function(){
		//タグで判定する
		if(this.item().meta.Resistable){
			return 1;
		}
		if(this.item().meta.Unresistable){
			return 0;
		}
		//スキルタイプで判定
		if(this.isCertainHit() ){
			return 0;
		}else{
			return 1;
		}
		//イレギュラー
		return -1;
	};
	Game_Action.prototype.isResistable = function(){
		return this.resistType() === 1;
	};
	//ステート有効度の計算
	Game_Action.prototype.addStateChance = function(target,effect){
		//スキルがステートを与える確率
		const skillAddStateRate = effect.value1;
		//対象のステート有効度
		const targetStateRate   = target.stateRate(effect.dataId);
		//運の良さによる影響
		const lukEffectRate     = this.lukEffectRate(target);
		if(this.isResistable() ){
			return skillAddStateRate*targetStateRate*lukEffectRate;
		}
		//抵抗できないならスキルの有効度をそのまま返す
		return skillAddStateRate;
	}
	
	Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
		if(Math.random() < this.addStateChance(target, effect) ){
			target.addState(effect.dataId);
			this.makeSuccess(target);
		}
	}
	
	Game_Action.prototype.lukEffectRate = function(target) {
		return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
	};
})();
