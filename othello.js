$(function(){
	var colorName = ["black", "white"];
	var currentTurn = 0;	// 0:black, 1:white
	var colorTable = []; // -1:未選択　0:black 1:white

	//初期化処理
/*
TODO: テーブルの生成はHTMLでなくここでやる
	$("<td>", {
		class: "squares",
		id: "1",
	}).appendTo("tr");
*/

// 中央の４ますに開始時の駒を配置。TODO:数値はハードコーディングやめたい。
	setPiece($("td#27"), 0);
	setPiece($("td#28"), 1);
	setPiece($("td#35"), 1);
	setPiece($("td#36"), 0);

	setCount();
	


	$(".squares").mouseover(function(){
		if(colorTable[$(this).attr("id")] == undefined){
			colorTable[$(this).attr("id")] = -1;
		}
		if((colorTable[$(this).attr("id")]) < 0){
			$(this).css("background-image", "url(img/" + colorName[currentTurn] + ".jpg");
		}
	});

	$(".squares").mouseout(function(){
		if(colorTable[$(this).attr("id")] < 0){
			$(this).css("background-image", "none");
		}
	});

	$(".squares").click(function(){
		if(colorTable[$(this).attr("id")] < 0){
			if(turnOver(this, currentTurn)){
				setPiece(this, currentTurn);
				currentTurn = (++currentTurn) % 2;
				setCount();
			}
		}
	})


	function turnOver(position, currentTurn){
		var positions = searchReversiblePieces(position, currentTurn);
		if(positions.length > 0){
			reversePieces(positions, currentTurn);
			return true;
		}

		return false;
	};

	function searchReversiblePieces(position, color) {
		var reversiblePieces = [];
		var startingPoint = Number($(position).attr("id"));
		var diffEachDirection = [ -1, -9, -8, -7, 1, 9, 8, 7];	// 左から時計回りに、隣のマスへの差分 TODO:この辺の数値もハードコーディングやめる	
		var endOfDirection = [startingPoint - startingPoint % 8, 0, 0, 0, startingPoint + 7 - startingPoint % 8, 63, 63, 63];

		var i = 0;
		// マスの番地が小さい方へ、ひっくり返せるマスがあるか探査 TODO:同じ処理２回繰り返すのをなんとかする
		for(; i<diffEachDirection.length/2; i++){
			var pieces = [];
			for(var j = startingPoint + diffEachDirection[i]; j >= endOfDirection[i]; j+=diffEachDirection[i]){
				if(colorTable[j] == undefined || colorTable[j] == -1){
					break;
				}else if(colorTable[j] == color){
					if(pieces.length > 0){
						Array.prototype.push.apply(reversiblePieces, pieces);
					}
					break;

				}
				pieces.push($("td#" + j));
				if(i % 2 == 1 && (j%8 == 0 || j%8 == 7)){	// 斜めに走査した時の端っこ判定
					break;
				}
			}

		}
		// マスの番地が大きい方へ、ひっくり返せるマスがあるか探査
		for(; i<diffEachDirection.length; i++){
			var pieces = [];
			for(var j = startingPoint + diffEachDirection[i]; j <= endOfDirection[i]; j+=diffEachDirection[i]){
				if(colorTable[j] == undefined || colorTable[j] == -1){
					break;
				}else if(colorTable[j] == color){
					if(pieces.length > 0){
						Array.prototype.push.apply(reversiblePieces, pieces);
					}
					break;

				}
				pieces.push($("td#" + j));
				if(i % 2 == 1  && (j%8 == 0 || j%8 == 7)){	// 斜めに走査した時の端っこ判定
					break;
				}
			}

		}

		return reversiblePieces;
	}

	function reversePieces(positions, colorNum){
		for(var i=0; i<positions.length; i++){
			setPiece(positions[i], colorNum);
		}
	};

	function countNum(colorNum) {
		var num = 0;
		for(var i=0; i<colorTable.length; i++){
			if(colorTable[i] == colorNum){
				num++;
			}
		}
		return num;
	}

	function setCount(){
		$("p#numOfBlack").html(countNum(0));
		$("p#numOfWhite").html(countNum(1));
	}

	function setPiece(position, colorNum) {
		colorTable[$(position).attr("id")] = colorNum;
		$(position).css("background-image", "url(img/" + colorName[colorNum] + ".jpg");
	}

});

