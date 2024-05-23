/*:
@target MZ

@plugindesc
表示するパラメータを少なくし、ステータス画面をシンプルにすることができます

@author
シトラス

@help
このプラグインを有効化することにより、装備・ステータス画面で表示する能力値を
攻撃力・防御力・敏捷性の3つに絞ることができます。
ただしショップ画面では、最大HP・最大MP・攻撃力・防御力・敏捷性の
変化を描画しています。
魔法力・魔法防御・運は、表示されないだけでシステム上存在しています。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins/blob/main/CTRS_MZ_SimpleStatus.js
*/
(() => {
	Window_EquipSlot.prototype.itemHeight = function(){
		//3はマジックナンバー。装備の数に応じて変えたい
		return Math.floor(this.innerHeight/3);
	};
	
	Window_EquipStatus.prototype.drawAllParams = function() {
		const displayParamIds = [2,3,6];
		const blockHeight     = Math.floor( (this.innerHeight - this.paramY(0) ) )/3;
		const padding         = this.paramY(0) + Math.floor(blockHeight/2 - this.contents.fontSize/2);
		
		displayParamIds.forEach( (paramId,index) => {
			this.drawItem(this.itemPadding(),padding + blockHeight*index,paramId);
		});
	};
	Window_StatusParams.prototype.drawAllItems = function(){
		const displayStatusValue = [this._actor.param(2),this._actor.param(3),this._actor.param(6) ];
		const displayStatusName  = [TextManager.param(2),TextManager.param(3),TextManager.param(6) ];
		const blockHeight        = Math.floor(this.innerHeight/3);
		const padding            = Math.floor(blockHeight/2 - this.contents.fontSize/2);
		
		//能力名を描画
		this.changeTextColor(ColorManager.systemColor());
		displayStatusName.forEach( (statusName,index) => {
			this.drawText(statusName,10,padding + blockHeight*index,160);
		});
		
		//値を描画
		this.resetTextColor();
		displayStatusValue.forEach( (value,index) => {
			this.drawText(value,10,padding + blockHeight*index,160,"right");
		});
	};
	
	//ステータスシーンの装備ウィンドウを描画
	Window_StatusEquip.prototype.drawAllItems = function(index) {
		const blockHeight = this.innerHeight/3;
		const equips      = this._actor.equips();
		const slotNames   = [this.actorSlotName(this._actor,0),this.actorSlotName(this._actor, 1),this.actorSlotName(this._actor,2) ];
		
		//装備カテゴリーを描画
		this.changeTextColor(ColorManager.systemColor() );
		slotNames.forEach( (slotName,index) => {
			this.drawText(slotName,10,10 + blockHeight*index,160);
		});
		
		//装備の名前を描画
		equips.forEach( (equip,index) => {
			this.drawItemName(equip,140,10 + blockHeight*index,300);
		});
	};
	
	//ショップウィンドウの書き換え
	Window_ShopStatus.prototype.pageSize = function() {
		return 1;
	};
	Window_ShopStatus.prototype.drawActorEquipInfo = function(x, y, actor) {
		const item1 = this.currentEquippedItem(actor, this._item.etypeId);
		const width = this.innerWidth - x - this.itemPadding();
		const enabled = actor.canEquip(this._item);
		this.changePaintOpacity(enabled);
		
		const blockHeight = Math.floor( (this.innerHeight - 110)/5);
		const padding     = Math.floor( (blockHeight - this.contents.fontSize)/2);
		
		//アクターの名前を描画
		this.resetTextColor();
		this.drawText(actor.name(), x, y - 25, width);
				
		//パラメータの変化を描画
		if (enabled) {
			const paramIds = [0,1,2,3,6];
			paramIds.forEach( (paramId,index) => {
				this.drawActorParamChange(x,y + 55 + padding + index*blockHeight,actor,item1,paramId);
			});
		}
		this.drawItemName(item1, x, y + 5, width);
		this.changePaintOpacity(true);
		
		//パラメータの名前を描画
		this.changeTextColor(ColorManager.systemColor() );
		const paramNames = [TextManager.param(0),TextManager.param(1),TextManager.param(2),TextManager.param(3),TextManager.param(6) ];
		paramNames.forEach( (paramName,index) => {
			this.drawText(paramName,0,y + 55 + padding + index*blockHeight,width);
		});
	};
	
	Window_ShopStatus.prototype.drawActorParamChange = function(x, y, actor, item1,paramId) {
		const width = this.innerWidth - this.itemPadding() - x;
		const change  = this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
		this.changeTextColor(ColorManager.paramchangeTextColor(change));
		this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
	};
})();
