/*:
@target MZ

@pluginname
戦闘中用フェイス定義

@plugindesc
戦闘中における顔グラフィックを、メニューとは
別のものにできます。

@author
シトラス

@help
アクターのメモ欄に<BattleOnlyActorId:x>と書き込めば
x番のIDを持つアクターの顔が戦闘中に使われます。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins
*/
(() => {
	'use strict'
	Game_Actor.prototype.battleOnlyActorId = function() {
		if(this.actor().meta.BattleOnlyActorId === undefined){
			return this._actorId;
		}
		return Number(this.actor().meta.BattleOnlyActorId);
	}
	Game_Actor.prototype.battleOnlyActor = function(){
		return $gameActors.actor(this.battleOnlyActorId() );
	};
	Window_BattleStatus.prototype.drawItemImage = function(index) {
		const actor = this.actor(index).battleOnlyActor();
		const rect  = this.faceRect(index);
		this.drawActorFace(actor, rect.x, rect.y, rect.width, rect.height);
	};
})();