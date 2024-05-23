/*:
@target MZ

@plugindesc
装備画面において、分割の具合を変えます

@author
シトラス

@param   equipDivide
@text    数値
@desc    装備画面の分割数を変えます
@default 4
@type    number

@help
「装備」画面における、スロットの分割数を変えます。
デフォルトのステータス画面で、分割数が4以下にすることを
前提にしています。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins/blob/main/CTRS_MZ_EquipHeight.js
(() => {
	let divide = Number(PluginManager.parameters("CTRS_MZ_EquipHeight").equipDivide);
	if(isNaN(divide) ){
		divide = 1;
	}
	Window_EquipSlot.prototype.itemRect = function(index) {
		const maxCols = this.maxCols();
		const itemWidth = this.itemWidth();
		const itemHeight = this.innerHeight/divide;
		const colSpacing = this.colSpacing();
		const rowSpacing = this.rowSpacing();
		const col = index % maxCols;
		const row = Math.floor(index / maxCols);
		const x = col * itemWidth + colSpacing / 2 - this.scrollBaseX();
		const y = row * itemHeight + rowSpacing / 2 - this.scrollBaseY();
		const width = itemWidth - colSpacing;
		const height = itemHeight - rowSpacing;
		return new Rectangle(x, y, width, height);
	};
	//ステータスシーンの装備ウィンドウを描画
	Window_StatusEquip.prototype.drawAllItems = function(index) {
		const blockHeight = this.innerHeight/divide;
		const equips      = this._actor.equips();
		
		//装備カテゴリーを描画
		this.changeTextColor(ColorManager.systemColor() );
		this._actor.equipSlots().forEach( (slotId,index) => {
			this.drawText(this.actorSlotName(this._actor,index),10,blockHeight*index + blockHeight/4,160);
		});
		//装備の名前を描画
		equips.forEach( (equip,index) => {
			this.drawItemName(equip,140,blockHeight*index + blockHeight/4,300);
		});
	};
})();
