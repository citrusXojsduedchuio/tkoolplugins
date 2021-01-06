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
		sealCategorys = sealCategorys.concat(this.actor().meta.SealCategorys.split(",") );
		
		//職業のメモ欄から習得
		sealCategorys = sealCategorys.concat(this.currentClass().meta.SealCategorys.split(",") );
		
		//スキルのメモ欄から取得
		sealCategorys = sealCategorys.concat(this.skills().filter(skill => skill.meta.SealCategorys).flatMap(skill => skill.meta.SealCategorys.split(",") ) );
		//装備のメモ欄から取得
		sealCategorys = sealCategorys.concat(this.equips().flatMap(equip => {
			if(equip === null){
				return null;
			}
			return equip.meta.SealCategorys ? equip.meta.SealCategorys.split(",") : null;
		} ).filter(sealCategory => sealCategory !== null) );
		
		return sealCategorys;
	};
})();