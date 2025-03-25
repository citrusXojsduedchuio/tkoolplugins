/*:
@target MZ

@plugindesc
スキルのメモ欄に<weaponAction>と書き込むと
武器攻撃のアクションをします。

@author
シトラス

@help
スキルのメモ欄に<weaponAction>と書き込むと
そのスキルのアクションが装備している武器のものになります。
または<weaponActionType:数字>と書き込むと
上から(数字)番目の武器攻撃アクションを行います。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
(() => {
	const _Game_Actor_performAction = Game_Actor.prototype.performAction;
	Game_Actor.prototype.performAction = function(action) {
		console.log(action.weaponActionType() );
		if(action.item().meta.weaponAction){
			this.performAttack();
		}else if(action.item().meta.weaponActionType){
			console.log($dataSystem.attackMotions[action.weaponActionType() ] );
			const attackMotion = $dataSystem.attackMotions[action.weaponActionType() - 1];
			if (attackMotion) {
				if (attackMotion.type === 0) {
					this.requestMotion("thrust");
				} else if (attackMotion.type === 1) {
					this.requestMotion("swing");
				} else if (attackMotion.type === 2) {
					this.requestMotion("missile");
				}
				this.startWeaponAnimation(attackMotion.weaponImageId);
			}
		}else{
			_Game_Actor_performAction.apply(this,arguments);
		}
	};
	Game_Action.prototype.weaponActionType = function(){
		let result = Number(this.item().meta.weaponActionType);
		if(isNaN(result) ){
			result = 0;
		}
		return result;
	};
})();