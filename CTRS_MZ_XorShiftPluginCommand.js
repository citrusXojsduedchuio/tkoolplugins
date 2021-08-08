/*:
@target MZ

@plugindesc
プラグインコマンドで、xorshift乱数の処理を行えます。

@author
シトラス

@command XOR_SHIFT_RANDOM_INT
@text    xorshift乱数
@desc    xorshift法に基づいた乱数を出力します	
	@arg     numRange
	@text    数値
	@desc    0~(引数の値-1)までの乱数を出力します
	@default 100
	@min     2
	@type    number
	
	@arg     seedVariableId
	@text    乱数シード変数ID
	@desc    この変数に入っている値が乱数シードになり、出力後に値が変化します。
	@default 1
	@type    variable

	@arg     outputVariableId
	@text    乱数出力変数ID
	@desc    この変数に、乱数を出力します
	@default 1
	@type    variable

@help
プラグインコマンドを使い、変数をシード値としたxorshift乱数を利用した
乱数を出力します。

プラグインコマンドを使うたびに、シードに設定されている変数の値は変化します。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins/blob/main/CTRS_MZ_XorShiftPluginCommand.js
*/
(() => {
	'use strict'
	const PLUGIN_NAME = "CTRS_MZ_XorShiftPluginCommand";
	PluginManager.registerCommand(PLUGIN_NAME, "XOR_SHIFT_RANDOM_INT", args => {
		const numRange         = Number(args.numRange);
		const seedVariableId   = Number(args.seedVariableId);
		const outputVariableId = Number(args.outputVariableId);
		const seed             = $gameVariables.value(seedVariableId);
		//seedとseedを左に13ビットシフトしたもののxorをとる
		const  phase1 = seed ^ (seed << 13);
		//phase1とphase1を右に17ビットシフトしたもののxorをとる
		const  phase2 = phase1 ^ (phase1 >> 17);
		//phase2とphase2を左に15ビットシフトしたもののxorをとる
		const  phase3 = phase2 ^ (phase2 << 15);
		
		//乱数シードを更新する
		$gameVariables.setValue(seedVariableId,phase3);
		
		//乱数を出力する
		$gameVariables.setValue(outputVariableId,(phase3 & 0x7FFFFFFF)%numRange);
	});
})();
