/*:
@target MZ

@plugindesc
何らかの条件を満たすと、商品が増えるショップを
作ることができます。

@author
シトラス

@base
PluginCommonBase

@command CONDITION_SHOP
@text    条件付きショップ
@desc    商品が並ぶ条件を設定できるショップを開きます
	@arg  goodsArray
	@text 販売する商品
	@type struct<SellGoods>[]
	
	@arg  buyingOnly
	@text 購入専門ショップか
	@desc
	trueにすると売却ができない、購入専門のショップにできます
	@default false
	@on      購入のみ
	@off     売却可能
	@type    boolean

@help
プラグインコマンドで商品とそれが並ぶ条件を設定した
ショップを作ることができます。

「商品を売る条件」では、このように条件を設定できます

s[100]
スイッチ100番がONの時

100 <= v[20]
変数20番が100以上

$gameParty.hasItem($dataItem[40],false)
ID40番のアイテムを持っている

「商品を売る条件」を何も設定しなかった場合、その商品は必ず
店に並びます。

このプラグインを使う場合「PluginCommonBase」と一緒に導入してください。

注意：
このプラグインでは、条件の解析をeval文で行っています。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://www.dropbox.com/sh/30u0e9goi4yd17n/AAAaufl3dIPJPIXRT1-_wFEUa?dl=0
*/
//売るものを表す構造体
/*~struct~SellGoods:
@param goodsNameMemo
@text  売る商品の名前
@desc
売る商品の名前をメモします。
実際の処理には関係しません。

@param   goodsType
@text    商品の種類
@desc    店で売る商品の種類を設定します
@type    select
@default 0,アイテム
@option  0,アイテム
@option  1,武器
@option  2,防具

@param   sellItem
@text    売るアイテム
@desc
店で売るアイテムを設定します
「商品の種類」で「0,アイテム」と設定してください。
@type    item

@param   sellWeapon
@text    売る武器
@desc    
店で売る武器を設定します
「商品の種類」で「1,武器」と設定してください。
@type    weapon

@param   sellArmor
@text    売る防具
@desc    
店で売る防具を設定します
「商品の種類」で「2,防具」と設定してください。
@type    armor

@param goodsPrice
@text  商品の値段
@desc 
商品をいくらで売るか設定します
-1にすると、データベースの設定に準じます
@default -1
@min     -1
@type    number

@param sellCondition
@text  商品を売る条件
@desc  この条件を満たすと、商品が店に並びます
@type  text
*/
(() => {
	'use strict'
	const PLUGIN_NAME = "CTRS_MZ_ConditionShop";
	PluginManagerEx.registerCommand(document.currentScript, "CONDITION_SHOP", args => {
		if($gameParty.inBattle() ){
			return false;
		}
		
		const sellableGoods = args.goodsArray.filter( (goods) => {
			return SELLCONDITION_ANALYSE(goods.sellCondition);
		});
		
		const sellGoodsArrays = sellableGoods.map( (goods,index) => {
			const goodsType = Number(goods.goodsType.split(",")[0] );
			
			let goodsId = 0;
			let sellGoodsData = {};
			if(goodsType === 0){
				//アイテムであれば
				goodsId       = Number(goods.sellItem);
				sellGoodsData = $dataItems[goodsId];
			}else if(goodsType === 1){
				//武器であれば
				goodsId       = Number(goods.sellWeapon);
				sellGoodsData = $dataWeapons[goodsId];
			}else if(goodsType === 2){
				//防具であれば
				goodsId       = Number(goods.sellArmor);
				sellGoodsData = $dataArmors[goodsId];
			}
			
			//データベース通りの値段で売るか
			let price = Number(goods.goodsPrice);
			let databasePrice = 1;
			if(price === -1){
				price = sellGoodsData.price;
				databasePrice = 0;
			}
			
			const buyingOnly = (args.buyingOnly === true);
			let result = [];
			if(index === 0){
				result = [goodsType,goodsId,databasePrice,price,buyingOnly];
			}else{
				result = [goodsType,goodsId,databasePrice,price];
			}
			
			return result;			
		});
		
		SceneManager.push(Scene_Shop);
		SceneManager.prepareNextScene(sellGoodsArrays,args.buyingOnly);
		return true;
	});
	
	const SELLCONDITION_ANALYSE = function(condition){
		if(condition === ""){
			return true;
		}
		const v = $gameVariables._data
		const s = $gameSwitches._data
		return eval(condition);
	};
})();