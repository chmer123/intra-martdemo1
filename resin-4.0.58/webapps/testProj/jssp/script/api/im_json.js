﻿/**
 * JSON 関連のメソッドを提供します。
 * @fileoverview JSON 関連のライブラリです。
 * @class JSON 関連のライブラリです。<br/>
 * 		  <br/>
 * 		  JSON (JavaScript Object Notation)は、軽量のデータ交換フォーマットです。<br/>
 * 		  JSON については、<a href="http://www.json.org/json-ja.html">JSON の紹介</a> を参照してください。
 * @constructor
 *
 * @version 1.0
 */
function ImJson(){}

/**
 * JSON 文字列からJavaScriptオブジェクトへの変換に失敗した場合に投げられる例外のメッセージです。
 * @final
 * @type String
 */
ImJson.PARSE_JSON_ERROR_MESSAGE = "parseJSON Error";

/**
 * @private
 * インデント用文字列のキャッシュ
 */
ImJson.indentStringCache = new Array();

/**
 * インデント文字列
 * @final
 * @type String
 */
ImJson.INDENT_STRING = "    ";

/**
 * @private
 * Name/Valueのセパレータ文字列
 * @final
 * @type String
 */
ImJson.NAME_VALUE_SEPARATER = ", ";

/**
 * 「null」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_NULL = "Null";

/**
 * 「Undefined」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_UNDEFINED = "Undefined";

/**
 * 「String」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_STRING = "String";

/**
 * 「Date」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_DATE = "Date";

/**
 * 「Array」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_ARRAY = "Array";

/**
 * 「Object」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_OBJECT = "Object";

/**
 * 「Function」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_FUNCTION = "Function";

/**
 * 「Number」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_NUMBER = "Number";

/**
 * 「Boolean」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_BOOLEAN = "Boolean";

/**
 * 「XML」型 を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_XML = "XML";

/**
 * 型が特定できない場合を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_UNKNOWN = "Unknown";

/**
 * 「Java」型を表す定数
 * @final
 * @type String
 */
ImJson.TYPE_JAVA = "Java";

/**
 * JSON 文字列からJavaScriptオブジェクトに変換します。<br/>
 * <br/>
 *
 * @param {String} jsonString JSON 文字列
 * @return JavaScriptオブジェクト
 * @type Object
 * @throws SyntaxError JSON 文字列からJavaScriptオブジェクトへの変換に失敗した場合に投げられます。
 *						（例外のメッセージは、{@link ImJson#PARSE_JSON_ERROR_MESSAGE}に設定されます）
 */
ImJson.parseJSON = function(jsonString) {

	if(false == ImJson.checkJSONString(jsonString)){
		throw new SyntaxError(ImJson.PARSE_JSON_ERROR_MESSAGE);
	}

	try{
		var newObject;

		newObject = eval('('+jsonString+')');
		return newObject;
	} catch(e){
        throw new SyntaxError(ImJson.PARSE_JSON_ERROR_MESSAGE);
	}
}

/**
 * JSON 文字列に変換します。<br/>
 * <br/>
 * 引数「debugFlg」が true の場合、JSON 文字列のインデント化、および、型名の付与を行います。<br/>
 * その際、変換対象オブジェクト（内部のプロパティも含む）が 以下の型の場合、特別な動作をします。<br/>
 *
 * <br/>
 * <table border="1">
 * 	<tr>
 * 		<td bgcolor="lightgrey">Date 型</td>
 * 		<td>型名の右側に、日付の文字列表現がJavaScriptのコメントとして出力されます。</td>
 * 	</tr>
 * 	<tr>
 * 		<td bgcolor="lightgrey">Function 型</td>
 * 		<td><b>"THIS_IS_FUNCTION"</b> として表現します。</td>
 * 	</tr>
 * </table>
 * <br/>
 * なお、引数「debugFlg」が true 時の本メソッドの返却値には型名が付与されているため、<br/>
 * {@link ImJson#checkJSONString}でのチェックには失敗します。<br/>
 *
 * @param {Object} value 変換対象
 * @param {Boolean} debugFlg [option] JSON 文字列のインデント化、および、型名の付与を行う場合は trueを設定してください。
 * 									  省略時のデフォルトは false。
 * @return JSON 文字列
 * @type String
 */
ImJson.toJSONString = function(value, debugFlg){

	/**
	 * @private
	 * 引数で与えられた値の型を判定します。
	 *
	 * @param {Object} value 判定対象オブジェクト
	 * @return 型を表す文字列
	 * @type String
	 */
	function getTypeName(value){
		if( isJavaInstance(value) ){
			return ImJson.TYPE_JAVA;
		}

		if( value === null ) {
			return ImJson.TYPE_NULL;
		}
		else if( typeof(value) == "undefined" ) {
			return ImJson.TYPE_UNDEFINED;
		}
		else if( typeof(value) == "string" ) {
			return ImJson.TYPE_STRING;
		}
		else if( typeof(value) == "number" ) {
			return ImJson.TYPE_NUMBER;
		}
		else if( typeof(value) == "boolean" ) {
			return ImJson.TYPE_BOOLEAN;
		}
		else if( typeof(value) == "object" && typeof(value.push) == "function" ) {
			return ImJson.TYPE_ARRAY;
		}
		else if( typeof(value) == "object" && typeof(value.getFullYear) == "function" ) {
			return ImJson.TYPE_DATE;
		}
		else if( typeof(value) == "xml" ) {
			return ImJson.TYPE_XML;
		}
		else if( typeof(value) == "function" ) {
			return ImJson.TYPE_FUNCTION;
		}
		else if( typeof(value) == "object" ) {
			return ImJson.TYPE_OBJECT;
		}
		else {
			return ImJson.TYPE_UNKNOWN;
		}
	}


	/**
	 * @private
	 * JSON 文字列への変換（Object用）
	 *
	 * @param {Object} objectData 変換対象オブジェクト
	 * @param {String} indent インデント
	 * @return JSON 文字列
	 * @type String
	 */
	function toJSONString4Object(objectData, indentDepth){
		var array = new Array();

		for(var prop in objectData){
			if( typeof(objectData.hasOwnProperty) != "function"
			    ||
			    objectData.hasOwnProperty(prop)) {

				var tempStr  = '"' + ImJson.escapeData(prop) + '" : ';
				var typeName = getTypeName(objectData[prop]);

				switch(typeName){
					case ImJson.TYPE_NULL :
					case ImJson.TYPE_UNDEFINED :
						typeName += getJavaClassName(objectData, prop); // Javaクラス名があれば追記
						tempStr += new String(objectData[prop]);
						break;

					case ImJson.TYPE_NUMBER :
					case ImJson.TYPE_BOOLEAN :
						tempStr += objectData[prop];
						break;

					case ImJson.TYPE_DATE :
						typeName += " (" + objectData[prop].toString() + ")";  /* ← 型名の横にDateの文字列表現 */
						tempStr += ImJson.dateToSrcString(objectData[prop]);
						break;

					case ImJson.TYPE_ARRAY :
						typeName += getJavaClassName(objectData, prop); // Javaクラス名があれば追記
						tempStr += toJSONString4Array(objectData[prop], indentDepth + 1);
						break;

					case ImJson.TYPE_OBJECT :
						typeName += getJavaClassName(objectData, prop); // Javaクラス名があれば追記
						tempStr += toJSONString4Object(objectData[prop], indentDepth + 1);
						break;

					case ImJson.TYPE_FUNCTION :
						/* FunctionはJSON 文字列化しない */
						if(debugFlg == true){
							tempStr += '\"THIS_IS_FUNCTION\"';
							array[array.length] = concatTypeName(tempStr, typeName, indentDepth);
						}
						continue;
						break;

					case ImJson.TYPE_XML :
						tempStr += '"\n' + objectData[prop].toXMLString() + '"';
						break;

					case ImJson.TYPE_JAVA :
						typeName += getJavaClassName(objectData, prop); // Javaクラス名があれば追記
						tempStr += '"' + ImJson.escapeData( new String(objectData[prop]) ) + '"';
						break;
					
					case ImJson.TYPE_STRING :
					case ImJson.TYPE_UNKNOWN :
					default :
						tempStr += '"' + ImJson.escapeData( new String(objectData[prop]) ) + '"';
						break;
				}

				/* 型の名称を付与 */
				if(debugFlg == true){
					tempStr = concatTypeName(tempStr, typeName, indentDepth);
				}

				array[array.length] = tempStr;
			}
		}

		var str = "{";

		if(debugFlg == true){
			str += concatIndent(array, indentDepth);
		}
		else {
			str += array.join(ImJson.NAME_VALUE_SEPARATER);
		}

		str += "}";
		return str;
	}

	/**
	 * @private
	 * JSON 文字列への変換（Array用）<br/>
	 *
	 * @param {Array} arrayData 配列
	 * @param {Number} indentDepth インデントの深さ
	 * @return JSON 文字列
	 * @type String
	 */
	function toJSONString4Array(arrayData, indentDepth){
		var array = new Array();

		for(var idx = 0, max = arrayData.length;  idx < max; idx++){
			var typeName = getTypeName(arrayData[idx]);
			var insertIdx = array.length;

			switch(typeName){
				case ImJson.TYPE_NULL :
				case ImJson.TYPE_UNDEFINED :
					typeName += getJavaClassName(arrayData, ""); // Javaクラス名があれば追記
					array[insertIdx] = new String(arrayData[idx]);
					break;

				case ImJson.TYPE_NUMBER :
				case ImJson.TYPE_BOOLEAN :
					array[insertIdx] = arrayData[idx];
					break;

				case ImJson.TYPE_DATE :
					typeName += " (" + arrayData[idx].toString() + ")";  /* ← 型名の横にDateの文字列表現 */
					array[insertIdx] = ImJson.dateToSrcString(arrayData[idx]);
					break;

				case ImJson.TYPE_ARRAY :
					typeName += getJavaClassName(arrayData, ""); // Javaクラス名があれば追記
					array[insertIdx] = toJSONString4Array(arrayData[idx], indentDepth + 1);
					break;

				case ImJson.TYPE_OBJECT :
					typeName += getJavaClassName(arrayData, ""); // Javaクラス名があれば追記
					array[insertIdx] = toJSONString4Object(arrayData[idx], indentDepth + 1);
					break;

				case ImJson.TYPE_FUNCTION :
					/* FunctionはJSON 文字列化しない */
					if(debugFlg == true){
						array[insertIdx] = concatTypeName('\"THIS_IS_FUNCTION\"', typeName, indentDepth);
					}
					continue;
					break;

				case ImJson.TYPE_XML :
					array[insertIdx] = '"\n' + arrayData[idx].toXMLString() + '"';
					break;

				case ImJson.TYPE_JAVA :
					typeName += getJavaClassName(arrayData, ""); // Javaクラス名があれば追記
					array[insertIdx] = '"' + ImJson.escapeData( new String(arrayData[idx]) ) + '"';
					break;
					
				case ImJson.TYPE_STRING :
				case ImJson.TYPE_UNKNOWN :
				default :
					array[insertIdx] = '"' + ImJson.escapeData( new String(arrayData[idx]) ) + '"';
					break;
			}

			/* 型の名称を付与 */
			if(debugFlg == true){
				array[insertIdx] = concatTypeName(array[insertIdx], typeName, indentDepth);
			}
		}

		var str = "[";

		if(debugFlg == true){
			str += concatIndent(array, indentDepth);
		}
		else {
			str += array.join(ImJson.NAME_VALUE_SEPARATER);
		}

		str += "]";
		return str;
	}

	/**
	 * @private
	 * インデント文字列を 引数「depth」個分連結した文字列返却します。<br/>
	 * <br/>
	 *
	 * @param {Number} depth インデントの深さ
	 * @return インデント文字列
	 * @type String
	 */
	function getIndentString(depth){
		var indentString = ImJson.indentStringCache[depth];

		if(!indentString){
			indentString = "";
			for(var idx = 0; idx < depth; idx++){
				indentString += ImJson.INDENT_STRING;
			}
			ImJson.indentStringCache[depth] = indentString;
		}
		return indentString;
	}

	/**
	 * @private
	 * 引数「value」に型の名称を付加した文字列を返却します。<br/>
	 * <br/>
	 * 引数「depth」で指定された値を元に、インデント処理を行います。
	 *
	 * @param {String} value 文字列
	 * @param {String} typeName 型の名称
	 * @param {Number} depth インデントの深さ
	 * @return 引数「value」に型の名称を付加した文字列
	 * @type String
	 */
	function concatTypeName(value, typeName, depth){
		depth = (depth) ? depth : 0;
		return "/* " + typeName + " */" + "\n" + getIndentString(depth) + value;
	}

	/**
	 * @private
	 * Name/Valueのセパレータ文字列で配列を連結します。<br/>
	 * <br/>
	 * 引数「depth」で指定された値を元に、インデント処理を行います。
	 *
	 * @param {Array} array 連結を行う配列
	 * @param {Number} depth インデントの深さ
	 * @return 連結後の文字列
	 * @type String
	 */
	function concatIndent(array, depth){
		var str = "";

		str += "\n" + getIndentString(depth);
		str += array.join(ImJson.NAME_VALUE_SEPARATER + "\n\n" + getIndentString(depth));
		str += "\n" + getIndentString(depth - 1);

		return str;
	}

	/**
	 * @private
	 * 引数に渡されたJSオブジェクトが、
	 * 「org.intra_mart.jssp.util.JavaScriptUtility」クラスを利用して
	 * JavaBeanから変換されたJSオブジェクトだった場合、
	 * 引数「typeName」に変換元のJavaBeanのクラス名を連結した文字列を返却します。
	 *
	 * @param {Object} obj JSオブジェクト
	 * @param {String} typeName 型の名称
	 * @return 引数「typeName」にクラス名を連結した文字列。
	 *         変換元がStringクラス等のラッパークラス、または、JavaBeanでは無い場合は引数「typeName」をそのまま返却します。
	 * @type String
	 */
	function getJavaClassName(obj, propName){
		if(obj == undefined || obj == null){
			return "";
		}
		
		var javaClassName = obj["__javaClassName_" + propName + "__"]; 
		
		if(javaClassName == undefined){
			return "";
		}
		else{
			return " <" + javaClassName + ">";
		}
	}

	/**
	 * @private
	 * ImJsonのtoJSONString() 処理本体
	 */
	{
		debugFlg = (debugFlg) ? debugFlg : false;

		var jsonString = "";
		var typeName = getTypeName(value);

		switch(typeName){
			case ImJson.TYPE_NULL :
			case ImJson.TYPE_UNDEFINED :
				typeName += getJavaClassName(value, ""); // Javaクラス名があれば追記
				jsonString = new String(value);
				break;

			case ImJson.TYPE_NUMBER :
			case ImJson.TYPE_BOOLEAN :
				jsonString = value;
				break;

			case ImJson.TYPE_DATE :
				typeName += " (" + value.toString() + ")";  /* ← 型名の横にDateの文字列表現 */
				jsonString = ImJson.dateToSrcString(value);
				break;

			case ImJson.TYPE_ARRAY :
				typeName += getJavaClassName(value, ""); // Javaクラス名があれば追記
				jsonString = toJSONString4Array(value, 1);
				break;

			case ImJson.TYPE_OBJECT :
				typeName += getJavaClassName(value, ""); // Javaクラス名があれば追記
				jsonString = toJSONString4Object(value, 1);
				break;

			case ImJson.TYPE_FUNCTION :
				/* FunctionはJSON 文字列化しない */
				if(debugFlg == true){
					jsonString = '\"THIS_IS_FUNCTION\"';
				}
				break;

			case ImJson.TYPE_XML :
				jsonString = '"\n' + value.toXMLString() + '"';
				break;

			case ImJson.TYPE_JAVA :
				typeName += getJavaClassName(value, ""); // Javaクラス名があれば追記
				jsonString = '"' + ImJson.escapeData(new String(value) ) + '"';
				break;

			case ImJson.TYPE_STRING :
			case ImJson.TYPE_UNKNOWN :
			default :
				jsonString = '"' + ImJson.escapeData(new String(value) ) + '"';
				break;
		}

		/* 型の名称を付与 */
		if(debugFlg == true){
			jsonString = concatTypeName(jsonString, typeName, 0);
		}

		return String(jsonString);
	}
}

/**
 * @private
 * 文字列をエスケープします。
 *
 * @param {String} targetData エスケープ対象文字列
 * @return エスケープ後の文字列
 * @type String
 */
ImJson.escapeData = function(targetData) {
	var returnData;
	var convTbl = {
	    '\b': '\\b',
	    '\t': '\\t',
	    '\n': '\\n',
	    '\f': '\\f',
	    '\r': '\\r',
	    '"' : '\\"'
	};

	returnData = targetData.replace(/\\/g, "\\\\");
	returnData = returnData.replace(/\"/g, "\\\"");

	returnData = returnData.replace(/([\x08-\x0D])/g,function(pc,nc){
                    var convChar = convTbl[pc];
                    if (convChar) {
                        return convChar;
                    }
					return pc;
                 })

	/* 改行コードの変換 */
	returnData = returnData.split("\r\n").join("\\n");
	returnData = returnData.split("\r").join("\\r");
	returnData = returnData.split("\n").join("\\n");

	return returnData;
}

/**
 * JSON 文字列の妥当性をチェックします。
 *
 * @param {String} jsonString JSON 文字列
 * @return 正当なJSON 文字列の場合は true、不正なJSON 文字列の場合は false を返却します。
 * @type Boolean
 */
ImJson.checkJSONString = function(jsonString){
	/* チェック！ */
	if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]|new Date\([0-9]*\)|undefined|NaN|Infinity|\-Infinity)+?$/.
	          test(jsonString)) {
		return true;
	} else {
		return false;
	}
}

/**
 * @private
 * Date型のオブジェクトをJSON 文字列化します。
 *
 * @parama {Date} date Date型のオブジェクト
 * @return Date型オブジェクトを変換したJSON 文字列
 * @type String
 */
ImJson.dateToSrcString = function(date) {
	var src = "new Date(" +
		date.getTime() + ")";
	return src;
}

/**
 * @private
 * Function : /intra-mart/jssp-rpc/marshller/function-name/marshall
 */
var imJsonMarshall = function (obj, debugFlg) {
	return ImJson.toJSONString(obj, debugFlg);
}

/**
 * @private
 * Function : /intra-mart/jssp-rpc/marshller/function-name/unmarshall
 */
var imJsonUnmarshall = function (jsonString) {
	return ImJson.parseJSON(jsonString);
}
