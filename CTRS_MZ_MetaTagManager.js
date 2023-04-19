/*:
@target MZ

@plugindesc
自分が使っているメタタグの処理を分離しました

@author
シトラス

@help
アクター、職業、スキル、アイテム、装備品、エネミー、ステートに書かれている
メモ欄の数値を算出する処理をまとめました。

このプラグインはWTFPLライセンスで公開します。
ですができれば、ゲーム内などに名前を表示してくれるとありがたいです。

@url
https://github.com/citrusXojsduedchuio/tkoolplugins
*/
(() => {
	'use strict'
	/*
	オリジナルパラメータを表すメタタグが
	１：定義されていない
	0または設定された数字を返す。
	
	2：メタタグのみ書かれている <oriParam>
	エラーを投げて止める
	
	3:メタタグにコロンのみ書かれている <oriParam:>
	エラーを投げて止める
	
	4:メタタグが書かれているが、文字列が数値ではない <oriParam:hoge>
	エラーを投げて止める
	
	5:メタタグに正しい数字が書かれている <oriParam:100>
	数値を返す
	*/
	//メタタグを処理する関数
	function MetaTagManager(){
		throw new Error("これは静的クラスです");
	};
	//メタタグの数値を加減算する場合
	MetaTagManager.toValueAdd = function(metaTag,errorObjName){
		const errorMessage = errorObjName + "に設定されているメタタグが間違っています";
		try{
			//メタタグが定義されていない
			if(metaTag === undefined){
				//console.log(errorObjName + "にメタタグがありません");
				return 0;
			}
			//メタタグしか書かれていない
			if(metaTag === true){
				console.error("メタタグしか書かれていません");
				throw new Error(errorMessage);
			}
			//メタタグにコロンのみ書かれている
			if(metaTag === ""){
				console.error("コロン以降にも数値を入力してください");
				throw new Error(errorMessage);
			}
			const metaTagValue = Number(metaTag);
			//メタタグが書かれているが、文字列が数値ではない
			if(Number.isNaN(metaTagValue) === true){
				console.error("数値を入力してください");
				throw new Error(errorMessage);
			}
			//メタタグに正しい数字が書かれている
			return metaTagValue;
		}catch(e){
			SceneManager.catchException(e);
			return 0;
		}
	};
	
	//メタタグの数値を乗算する場合
	MetaTagManager.toValueMulti = function(metaTag,errorObjName){
		const errorMessage = errorObjName + "に設定されているメタタグが間違っています";
		try{
			//メタタグが定義されていない
			if(metaTag === undefined){
				//console.log(errorObjName + "にメタタグがありません");
				return 1;
			}
			//メタタグしか書かれていない
			if(metaTag === true){
				//console.error("メタタグしか書かれていません");
				throw new Error(errorMessage);
			}
			//メタタグにコロンのみ書かれている
			if(metaTag === ""){
				//console.error("コロン以降にも数値を入力してください");
				throw new Error(errorMessage);
			}
			const metaTagValue = Number(metaTag);
			//メタタグが書かれているが、文字列が数値ではない
			if(Number.isNaN(metaTagValue) === true){
				//console.error("数値を入力してください");
				throw new Error(errorMessage);
			}
			//メタタグに正しい数字が書かれている
			return metaTagValue;
		}catch(e){
			SceneManager.catchException(e);
			return 0;
		}
	};
	//メタタグに特定の文字列が紐づけられているか判定する
	MetaTagManager.stringBoolean = function(metaTag,tagString){
		if(metaTag === undefined){
			return false;
		}
		if(metaTag === tagString){
			return true
		}else{
			return false;
		}
	};
	//メタタグが定義されていなければ、代わりの数値を出力する
	MetaTagManager.toValue = function(metaTag,noneMetaTagNumber,errorObjName){
		const errorMessage = errorObjName + "に設定されているメタタグが間違っています";
		try{
			//メタタグが定義されていない
			if(metaTag === undefined){
				//console.log(errorObjName + "にメタタグがありません");
				//メタタグがない場合、設定した数値を出力する
				return noneMetaTagNumber;
			}
			//メタタグしか書かれていない
			if(metaTag === true){
				//console.error("メタタグしか書かれていません");
				throw new Error(errorMessage);
			}
			//メタタグにコロンのみ書かれている
			if(metaTag === ""){
				//console.error("コロン以降にも数値を入力してください");
				throw new Error(errorMessage);
			}
			const metaTagValue = Number(metaTag);
			//メタタグが書かれているが、文字列が数値ではない
			if(Number.isNaN(metaTagValue) === true){
				//console.error("数値を入力してください");
				throw new Error(errorMessage);
			}
			//メタタグに正しい数字が書かれている
			return metaTagValue;
		}catch(e){
			SceneManager.catchException(e);
			return 0;
		}
	};
	
	window.MetaTagManager = MetaTagManager;
})();
