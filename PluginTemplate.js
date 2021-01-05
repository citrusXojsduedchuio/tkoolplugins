/*:
@target MZ

@plugindesc
プラグインを作るための、テンプレートです

@author
シトラス

@param   String
@text    文字列
@desc    特に制約のない通常の文字列入力項目になります。
@default hoge
@type    string


@param   multiline_string
@text    複数行文字列
@desc    複数行入力可能な文字列入力項目になります。	
@default
hoge
piyo
hage
@type    multiline_string

@param file
@text ファイル
@desc
画像や音声などのファイルを選択します。ここで選択された
ファイルは未使用素材削除機能の対象外になります。
@default
@dir　./
@type file
	
@param   Number
@text    数値
@desc    数値のみ入力可能な項目になります。
@default 10
@type    number

@param   Number10to100
@text    制限のある数値
@desc    10~100までの数値を設定できます
@default 10
@max     100
@min     10
@type    number

@param   DecimalsNumber
@text    小数
@desc    -100~100までの数値を小数点第2位まで設定できます
@default 0
@max     100
@min     -100
@decimals 2
@type    number

@param   Boolean
@text    真偽値型
@desc    ONかOFFかで表される値です
@default true
@type    boolean

@param   ON or OFF
@text    オンかオフか
@desc    ONかOFFかで表される値です
@default true
@on      オン
@off     オフ
@type    boolean

@param    Select
@text     プルダウンリスト
@desc     複数の中から、1つを選ぶことができます。
@option   ツンデレ
@option   ヤンデレ
@option   クーデレ
@default  ツンデレ
@type     select

@param   ComboBox
@text    コンボボックス
@desc
複数の中から一つを選べ、自分で項目を
追加することもできます。
@option  煮卵
@option  チャーシュー
@option  ネギ
@default 
@type    combo

@param   Actor
@text    アクター選択
@desc    データベースのアクターを選択するダイアログになります。
@default 1
@type    actor

@param   Switch
@text    スイッチ選択
@desc    スイッチを選択するダイアログになります。
@default 1
@type    switch

@param   Variable
@text    変数選択
@desc    変数を選択するダイアログになります
@default 1
@type    variable

@param   StringArray
@text    文字列の配列
@desc
文字列を配列として入力できます。文字列以外でも後ろに
[]を付与すれば全て配列扱いになります。
@default　[hoge,piyo]
@type    string[]

@command COMMAND1
@text    コマンド1
@desc    引数のないプラグインコマンドです

@command COMMAND2
@text    コマンド2
@desc    引数があるプラグインコマンドです
@arg     arg1
@text    引数1
@desc    1つ目の引数です
@arg     arg2
@text    引数2
@desc    2つめの引数

@help
プラグインの詳細な説明です。

プラグインコマンドはありません。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url

*/
(() => {
	//メソッドの再定義
	/*
	const _Class_XXX_method_XXX = Class_XXX.prototype.method_XXX;
	Class_XXX.prototype.method_XXX = function(args) {
	  _Class_XXX_method_XXX.apply(this, arguments);
	  //実行内容
	};
	
	//プラグインコマンドの実行
	PluginManager.registerCommand(pluginName, "commandName", args => {
		//xxxは引数の名前であり、それを取り出している
		const hoge = args.xxx;
	});
	
	//Game_Interpreter(イベントコマンド関連)を呼び出したい場合
	PluginManager.registerCommand("プラグイン名", "コマンド名", function(args) {
		//プラグインコマンドで指定したフレーム数だけウェイトを行う場合
		const waitSecond = Number(args.waitSecond);
		this.wait(waitSecond);
	});
	
	プラグインパラメータを参照する。取り出したパラメータは文字列になるのでその都度変換が必要
	let hoge = PluginManager.parameters("CTRS_HogePlugin").hogeParameter;
	
	配列であればJSON.parseを使う
	let hoge = JSON.parse(PluginManager.parameters("CTRS_HogePlugin").hogeParameter);
	*/
	
})();
