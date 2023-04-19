/*:
@target MZ

@plugindesc
バトラーにオリジナルパラメータを定義するサポートを行います

@author
シトラス

@base
CTRS_MZ_MetaTagManager

@help
バトラーにオリジナルパラメータを定義することができます。
これを元にして、メモ欄を利用したオリジナルパラメータを
使ったプラグインを作れます。

このプラグインは「CTRS_MZ_MetaTagManager」をベースにしています。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins
*/
(() => {
	'use strict'
	Object.defineProperties(Game_BattlerBase.prototype, {
		//hoge:加算されるオリジナルパラメータ
		hoge: {
			get: function() {
				return this.getOriginalParamaterAdd("hoge");
			},
			configurable: true
		},
	});
	
	Object.defineProperties(Game_BattlerBase.prototype, {
		//piyo:乗算されるオリジナルパラメータ
		piyo: {
			get: function() {
				return this.getOriginalParamaterMulti("piyo");
			},
			configurable: true
		},
	});
	//アクターのオリジナルパラメータを加算する
	Game_Actor.prototype.getOriginalParamaterAdd = function(paramName){
		const oriParams = [
			this.getOriginalParamaterAddByActor(paramName),
			this.getOriginalParamaterAddByClass(paramName),
			this.getOriginalParamaterAddByState(paramName),
			this.getOriginalParamaterAddByEquip(paramName),
			this.getOriginalParamaterAddBySkill(paramName),
		];
		return oriParams.reduce( (sum,oriParam) => {
			return sum + oriParam;
		},0);
	};
	//アクターのオリジナルパラメータを乗算する。
	Game_Actor.prototype.getOriginalParamaterMulti = function(paramName){
		const oriParams = [
			this.getOriginalParamaterMultiByActor(paramName),
			this.getOriginalParamaterMultiByClass(paramName),
			this.getOriginalParamaterMultiByState(paramName),
			this.getOriginalParamaterMultiByEquip(paramName),
			this.getOriginalParamaterMultiBySkill(paramName),
		];
		return oriParams.reduce( (sum,oriParam) => {
			return sum*oriParam;
		},1);
	};
	
	//アクターのオリジナルパラメータを算出する。何らかの特殊な処理をしたいときに書き換える
	Game_Actor.prototype.getOriginalParamater = function(paramName){
		return 1;
	};
	
	//バトラーにかかっているステートから加算するオリジナルパラメータを算出する
	Game_Battler.prototype.getOriginalParamaterAddByState = function(paramName){
		return this.states().reduce( (sum,state) => {
			return MetaTagManager.toValueAdd(state.meta[paramName],state.name) + sum;
		},0);
	};
	
	//バトラーにかかっているステートから乗算するオリジナルパラメータを算出する
	Game_Battler.prototype.getOriginalParamaterMultiByState = function(paramName){
		return this.states().reduce( (sum,state) => {
			return MetaTagManager.toValueMulti(state.meta[paramName],state.name)*sum;
		},1);
	};
	
	//アクターのメモ欄から加算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterAddByActor = function(paramName){
		return MetaTagManager.toValueAdd(this.actor().meta[paramName],this.name() );
	};
	
	//アクターのメモ欄から乗算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterMultiByActor = function(paramName){
		return MetaTagManager.toValueMulti(this.actor().meta[paramName],this.name() );
	};
	
	//アクターが就いている職業のメモ欄から加算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterAddByClass = function(paramName){
		const  className = this.currentClass().name;
		return MetaTagManager.toValueAdd(this.currentClass().meta[paramName],className);
	};
	
	//アクターが就いている職業のメモ欄から乗算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterMultiByClass = function(paramName){
		const  className = this.currentClass().name;
		return MetaTagManager.toValueMulti(this.currentClass().meta[paramName],className);
	};
	
	//アクターが装備している物のメモ欄から加算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterAddByEquip = function(paramName){
		const  entityEquips = this.equips().filter( (equip) => equip !== null);
		return entityEquips.reduce( (sum,equip) => {
			return sum + MetaTagManager.toValueAdd(equip.meta[paramName],equip.name);
		},0);
	};
	
	//アクターが装備している物のメモ欄から乗算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterMultiByEquip = function(paramName){
		const  entityEquips = this.equips().filter( (equip) => equip !== null);
		return entityEquips.reduce( (sum,equip) => {
			return sum*MetaTagManager.toValueMulti(equip.meta[paramName],equip.name);
		},1);
	};
	
	//アクターが習得しているスキルのメモ欄から加算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterAddBySkill = function(paramName){
		return this.skills().reduce( (sum,skill) => {
			return sum + MetaTagManager.toValueAdd(skill.meta[paramName],skill.name);
		},0);
	};
	
	//アクターが習得しているスキルのメモ欄から乗算するオリジナルパラメータを算出する
	Game_Actor.prototype.getOriginalParamaterMultiBySkill = function(paramName){
		return this.skills().reduce( (sum,skill) => {
			return sum*MetaTagManager.toValueMulti(skill.meta[paramName],skill.name);
		},1);
	};
	
	//エネミーのオリジナルパラメータを加算する
	Game_Enemy.prototype.getOriginalParamaterAdd = function(paramName){
		const  originalParamByEnemy = this.getOriginalParamaterAddByEnemy(paramName);
		const  originalParamByState = this.getOriginalParamaterAddByState(paramName);
		return originalParamByEnemy + originalParamByState;
	};
	
	//エネミーのオリジナルパラメータを乗算する
	Game_Enemy.prototype.getOriginalParamaterMulti = function(paramName){
		const  originalParamByEnemy = this.getOriginalParamaterMultiByEnemy(paramName);
		const  originalParamByState = this.getOriginalParamaterMultiByState(paramName);
		return originalParamByEnemy*originalParamByState;
	};
	
	//エネミーのメモ欄から加算するオリジナルパラメータを算出する
	Game_Enemy.prototype.getOriginalParamaterAddByEnemy = function(paramName){
		const  enemyName = this.originalName();
		return MetaTagManager.toValueAdd(this.enemy().meta[paramName],this.originalName() );
	};
	
	//エネミーのメモ欄から乗算するオリジナルパラメータを算出する
	Game_Enemy.prototype.getOriginalParamaterMultiByEnemy = function(paramName){
		const  enemyName = this.originalName();
		return MetaTagManager.toValueMulti(this.enemy().meta[paramName],this.originalName() );
	};
})();