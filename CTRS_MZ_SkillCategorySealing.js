/*:
@target MZ

@plugindesc
スキルにカテゴリーを設け、それをもとにして封印の処理を行う

@author
シトラス

@help
アクター、職業、スキル、武器、防具、ステートにスキル封印カテゴリーを
設定し、そこに記されたカテゴリーのスキルを封印します。

スキルのメモ欄に<SkillCategorys:Magic,Fire>と書き込むことで
そのスキルは「Magic」と「Fire」という2つのカテゴリーに属することになります。

そして例えば、魔法を封印するステートのメモ欄に<SealCategorys:Magic,Ice>と
書き込めばそのステートにかかっているときカテゴリー「Magic」と「Ice」の
スキルを封印することができます。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
(() => {
	//カテゴリーの影響で、スキルが封じられている。1つでも当てはまれば、封印される
	Game_BattlerBase.prototype.isSkillSealedByCategory = function(skill) {
		if(skill.meta.SkillCategorys === undefined){
			return false;
		}
		const skillCategorys = skill.meta.SkillCategorys.split(",");
		return this.sealedSkillCategorys().some(category => skillCategorys.includes(category) );
	};
	
	const _Game_BattlerBase_meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
	Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
		const usable = _Game_BattlerBase_meetsSkillConditions.apply(this,arguments);
		return usable && !this.isSkillSealedByCategory(skill);
	};
	
	//ステートを参照して、封印されているスキルカテゴリーを得る
	Game_BattlerBase.prototype.sealedSkillCategorys = function(){
		return this.states().filter(state => state.meta.SealCategorys).flatMap(state => state.meta.SealCategorys.split(",") );
	}
	
	//封印されているスキルカテゴリー取得・アクター
	Game_Actor.prototype.sealedSkillCategorys = function(){
		let sealCategorys = Game_Battler.prototype.sealedSkillCategorys.call(this);
		
		//アクターのメモ欄から取得
		sealCategorys = sealCategorys.concat(this.sealedSkillCategorysByActorMemo() );
		
		//職業のメモ欄から習得
		sealCategorys = sealCategorys.concat(this.sealedSkillCategorysByClassMemo() );
		
		//スキルのメモ欄から取得
		sealCategorys = sealCategorys.concat(this.sealedSkillCategorysBySkillsMemo() );
		
		//装備のメモ欄から取得
		sealCategorys = sealCategorys.concat(this.sealedSkillCategorysByEquipsMemo() );
		
		return sealCategorys;
	};
	
	//アクターのメモ欄から、封印されているスキルのカテゴリーを取得する
	Game_Actor.prototype.sealedSkillCategorysByActorMemo = function(){
		if(this.actor().meta.SealCategorys){
			return this.actor().meta.SealCategorys.split(",");
		}
		return [];
	};
	
	//職業のメモ欄から、封印されているスキルのカテゴリーを取得する
	Game_Actor.prototype.sealedSkillCategorysByClassMemo = function(){
		if(this.currentClass().meta.SealCategorys){
			return this.currentClass().meta.SealCategorys.split(",");
		}
		return [];
	};
	
	//装備のメモ欄から、封印されているスキルのカテゴリーを取得する
	Game_Actor.prototype.sealedSkillCategorysByEquipsMemo = function(){
		//実体のある装備を抽出する
		const entitiveEquips = this.equips().filter(equip => equip !== null);
		if(entitiveEquips.length === 0){
			//何も装備していなければ、空配列を出力する
			return [];
		}
		
		//スキルを封印している装備を抽出する
		const sealingEquips = entitiveEquips.filter(equip => equip.meta.SealCategorys);
		//スキルを封印している装備がなければ、空配列を出力する
		if(sealingEquips.length === 0){
			//封印装備がなければ、空配列を出力する
			return [];
		}
		
		//封印しているスキルカテゴリーを配列化する
		const sealCategorys = sealingEquips.flatMap(equip => equip.meta.SealCategorys.split(",") );
		return sealCategorys;
	};
	
	//装備のメモ欄から、封印されているスキルのカテゴリーを取得する
	Game_Actor.prototype.sealedSkillCategorysBySkillsMemo = function(){
		//スキルがなければ、空配列を出力する
		if(this.skills().length === 0){
			return [];
		}
		
		//スキルを封印しているスキルを抽出する
		const sealingSkills = this.skills().filter(skill => skill.meta.SealCategorys);
		//封印しているスキルがなければ、空配列を出力する
		if(sealingSkills.length === 0){
			return [];
		}
		//封印しているスキルカテゴリーを配列化する
		const sealCategorys = sealingSkills.flatMap(skill => skill.meta.SealCategorys.split(",") );
		return sealCategorys;
	};
})();
