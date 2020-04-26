var WhoShouldMove = function() {

}

var Chess = function () {
    // const translate = {"a": "1", "b": "2", "c": "3", "d": "4", "e": "5", "f": "6", "g": "7", "h": "8"};

    var occupied = function (rank, column) {

        var occupationSquare = $(document).find("img[data-rank=" + rank + "][data-column=" + column + "]").length;

        if (occupationSquare === 1) {
            return true;
        } else {
            return false;
        }
    };

    // return which piece (type) is present in the table cell, if the cell is occupied before the move

    var getTypePieceOnSquare = function (rank, column) {

        if (occupied(rank, column) === true) {
            // pokud je zamyslene policko obsazene, zjisti typ figurky

            var typePieceOnSquare = $(document).find("img[data-rank=" + rank + "][data-column=" + column + "]").attr("data-type");
            return typePieceOnSquare;
        } else {


        }

    };

    // return which piece (color) is present in the table cell, if the cell is occupied before the move

    var getColorPieceOnSquare = function (rank, column) {
        if (occupied(rank, column) === true) {
            // pokud je zamyslene policko obsazene, zjisti typ a barvu figurky
            var colorPieceOnSquare = $(document).find("img[data-rank=" + rank + "][data-column=" + column + "]").attr("data-color");
            return colorPieceOnSquare;
        } else {
        }
    };
    // zkontroluje, zda je rank ci column volny (tj. bez vlasnich ci cizich figurek) od aktualni pozice figurky az po zamyslene finalni policko
    // vraci true = je volna,  nebo false = neni volna

    var freeRank = function (rankPiece, columnPiece, rankSquare, columnSquare) {
        var rankDifference = rankSquare - rankPiece;
        var columnDifference = columnSquare - columnPiece;

        var result = true;
        if (rankDifference === 0 && columnDifference > 0) {
            for (var i = 1; i < columnDifference; i++) {

                if (occupied(rankPiece, columnPiece + i) === true) {
                    result = false;
                    break;
                }
            }
        }

        if (rankDifference === 0 && columnDifference < 0) {
            for (var j = 1; j < -columnDifference; j++) {

                if (occupied(rankPiece, columnPiece - j) === true) {
                    result = false;
                    break;
                }
            }

        }

        if (rankDifference > 0 && columnDifference === 0) {

            for (var k = 1; k < rankDifference; k++) {

                if (occupied(rankPiece + k, columnPiece) === true) {
                    result = false;
                    break;
                }
            }

        }

        if (rankDifference < 0 && columnDifference === 0) {

            for (var l = 1; l < -rankDifference; l++) {

                if (occupied(rankPiece - l, columnPiece) === true) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    };

    // zkontroluje, zda fce isValidPieceMove vraci true a nasledne musi zkoumat, zda figurka ma volnou cestu na zamyslene pole
    // fce freePath vraci true nebo false
    var freeDiagonal = function (rankPiece, columnPiece, rankSquare, columnSquare) {
        var rankDifference = rankSquare - rankPiece;
        var columnDifference = columnSquare - columnPiece;
        var result = true;

        if (rankDifference > 0 && columnDifference > 0) {

            for (var i = 1; i < columnDifference; i++) {

                if (occupied(rankPiece + i, columnPiece + i) === true) {
                    result = false;
                    break;
                }
            }
        }


        if (rankDifference < 0 && columnDifference < 0) {
            for (var j = 1; j < -columnDifference; j++) {
                if (occupied(rankPiece - j, columnPiece - j) === true) {
                    result = false;
                    break;
                }
            }
        }

        if (rankDifference < 0 && columnDifference > 0) {
            for (var k = 1; k < columnDifference; k++) {
                if (occupied(rankPiece - k, columnPiece + k) === true) {
                    result = false;
                    break;
                }
            }
        }

        if (rankDifference > 0 && columnDifference < 0) {
            for (var l = 1; l < rankDifference; l++) {
                if (occupied(rankPiece + l, columnPiece - l) === true) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    };

    var freePath = function (myPiece, square) {
        if (myPiece.attr("data-type") === "king" || myPiece.attr("data-type") === "knight") {
            return true;
        } else if (myPiece.attr("data-type") === "pawn") {
            if (freeRank(parseInt(myPiece.attr('data-rank')), parseInt(myPiece.attr('data-column')), parseInt(square.attr('data-rank')), parseInt(square.attr('data-column'))) === false) {
                return false
            } else {
                return true
            }
        }

        else if (myPiece.attr("data-type") === "rook") {
            if (freeRank(parseInt(myPiece.attr('data-rank')), parseInt(myPiece.attr('data-column')), parseInt(square.attr('data-rank')), parseInt(square.attr('data-column'))) === true) {
                return true;
            } else {
                return false
            }

        } else if (myPiece.attr("data-type") === "bishop") {
            if (freeDiagonal(parseInt(myPiece.attr('data-rank')), parseInt(myPiece.attr('data-column')), parseInt(square.attr('data-rank')), parseInt(square.attr('data-column'))) === true) {
                return true;
            } else {
                return false
            }


        } else if (myPiece.attr("data-type") === "queen") {
            if ((freeDiagonal(parseInt(myPiece.attr('data-rank')), parseInt(myPiece.attr('data-column')), parseInt(square.attr('data-rank')), parseInt(square.attr('data-column'))) === true) &&
                (freeRank(parseInt(myPiece.attr('data-rank')), parseInt(myPiece.attr('data-column')), parseInt(square.attr('data-rank')), parseInt(square.attr('data-column'))) === true)) {
                return true;

            } else {
                return false
            }

        }

    };

    // isValidMove resi chod figur diky prevzeti parametru funkce isValidPieceMove a navic overuje, zda na zamyslenem policku stoji jina figurka.
    // Porovna barvu figurek a rozhodne o (ne)moznosti tahu\


    // capturingWithPawn dodatecne resi specificke brani pescem souperovy figurky

    // var capturingWithPawn = function (piece, square) {
    // 	var pieceRank = parseInt(piece.attr("data-rank"));
    // 	var pieceColumn = parseInt(piece.attr("data-column"));
    //
    // 	if ((piece.attr("data-color") == "white") && (square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") === (pieceColumn + 1)) ||
    // 		(piece.attr("data-color") == "white") && (square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn - 1))) {
    // 		return true
    // 	} else {
    //
    // 		return false
    // 	}
    //
    // };

    var isValidMove = function (myPiece, square) {
        var isValidPieceMoveVar = isValidPieceMove(myPiece, square);
        var freePathVar = freePath(myPiece, square);
        console.log("test : " + myPiece.attr("data-type"));

        if (isValidPieceMoveVar === true) {
            // pokud tah odpovida chodu figur
            if (freePathVar === true) {
                // pokud figurce neprekazi v ceste na zamyslene policko cizi ci svoje figurka
                if (occupied(square.attr('data-rank'), square.attr('data-column')) === false) {
                    // zamyslene policko je volne, neresim brani
                    return true;
                } else
                    // na zamyslenem policku je nejaka figurka, resim barvu a typ kvuli brani
                {
                    var otherPieceType = getTypePieceOnSquare(square.attr("data-rank"), square.attr("data-column"));
                    var otherPieceColor = getColorPieceOnSquare(square.attr("data-rank"), square.attr("data-column"));
                    var myPieceColor = myPiece.attr("data-color");
                    var myPieceType = myPiece.attr("data-type");

                    if (myPieceColor === otherPieceColor) {
                        //pokud jsou obe figurky stejne barvy, tah je nemozny
                        return false;

                        // nemuzu sebrat krale!
                    } else if (otherPieceType === "king") {
                        return false;

                    } else
                        //potrebuji vyresit brani cizi figurky
                    {
                        return true;
                    }
                }
            }
        }
    };

    //funkce isValidPieceMove resi POUZE mozny chod figur, neresi napr. brani svych figur, apod.

    var isValidPieceMove = function (piece, square) {
        var pieceRank = parseInt(piece.attr("data-rank"));
        var pieceColumn = parseInt(piece.attr("data-column"));
        var squareRank = parseInt(square.attr("data-rank"));
        var squareColumn = parseInt(square.attr("data-column"));

        var otherPieceType = getTypePieceOnSquare(squareRank, squareColumn);

        //pravidla pro chod figur, vyhodi true nebo false
        //rook

        if (piece.attr("data-type") === "rook") {
            if (squareRank == pieceRank || squareColumn == pieceColumn) {
                return true
            } else {
                return false
            }
        }

        //king

        // puvodni podminky pro king
        // if (square.attr("data-rank") == (pieceRank + 1) || square.attr("data-rank") == (pieceRank - 1) || square.attr("data-rank") == pieceRank &&
        //	(square.attr("data-column") == pieceColumn || (square.attr("data-column") == pieceColumn - 1) || (square.attr("data-column") == pieceColumn + 1))) {

        if (piece.attr("data-type") === "king") {
            if ((square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == pieceColumn)) {
                return true
            } else if ((square.attr("data-rank") == pieceRank) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true
            } else if ((square.attr("data-rank") == pieceRank) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true

            } else if ((square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn))) {
                return true
            }

            //castle kingside

            else if ((square.attr("data-rank") == pieceRank) && (pieceRank == 1 || pieceRank == 8) && (square.attr("data-column") == (pieceColumn + 2)) && (pieceColumn == 5) && (parseInt(square.attr("data-column")) == 7)) {
                return true
            }

            //castle queenside

            else if ((square.attr("data-rank") == pieceRank) && (pieceRank == 1 || pieceRank == 8) && (square.attr("data-column") == (pieceColumn - 2)) && (pieceColumn == 5) && (parseInt(square.attr("data-column")) == 3)) {
                return true
            } else {
                return false
            }
        }
        // white pawn
        if (piece.attr("data-type") === "pawn" && piece.attr("data-color") === "white") {
            if (square.attr("data-rank") == (pieceRank + 1) && square.attr("data-column") == pieceColumn && (occupied((pieceRank + 1), pieceColumn) === false)) {
                return true
            } else if (square.attr("data-column") == pieceColumn && (pieceRank == "2") && (square.attr("data-rank") == (pieceRank + 2))) {
                return true
            } else if ((occupied((pieceRank + 1), (pieceColumn + 1)) === true) && (square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true
            } else if ((occupied((pieceRank + 1), (pieceColumn - 1)) === true) && (square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            }

            //brani mimochodem
            else if ((occupied(pieceRank, (pieceColumn - 1)) === true) && (pieceRank == 5) && (square.attr("data-column") == (pieceColumn - 1)) && (square.attr("data-rank") == (pieceRank + 1))) {
                return true
            } else if ((occupied(pieceRank, (pieceColumn + 1)) === true) && (pieceRank == 5) && (square.attr("data-column") == (pieceColumn + 1)) && (square.attr("data-rank") == (pieceRank + 1))) {
                return true
            } else {
                return false
            }
        }

        // black pawn
        if (piece.attr("data-type") === "pawn" && piece.attr("data-color") === "black") {
            if (square.attr("data-rank") == (pieceRank - 1) && square.attr("data-column") == pieceColumn && (occupied((pieceRank - 1), pieceColumn) === false)) {
                return true
            } else if (square.attr("data-column") == pieceColumn && (pieceRank == "7") && (square.attr("data-rank") == (pieceRank - 2))) {
                return true
            } else if ((occupied((pieceRank - 1), (pieceColumn - 1)) === true) && (square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            } else if ((occupied((pieceRank - 1), (pieceColumn + 1)) === true) && (square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true
            }

            //brani mimochodem
            else if ((occupied(pieceRank, (pieceColumn - 1)) === true) && (pieceRank == 4) && (square.attr("data-column") == (pieceColumn - 1)) && (square.attr("data-rank") == (pieceRank - 1))) {
                return true
            } else if ((occupied(pieceRank, (pieceColumn + 1)) === true) && (pieceRank == 4) && (square.attr("data-column") == (pieceColumn + 1)) && (square.attr("data-rank") == (pieceRank - 1))) {
                return true
            } else {
                return false
            }
        }

        //bishop
        if (piece.attr("data-type") === "bishop") {
            var i;
            var result = false;
            for (i = 1; i < 8; i++) {
                if ((square.attr("data-rank") == pieceRank + i) && ((square.attr("data-column") == pieceColumn + i))) {
                    result = true;
                } else if ((square.attr("data-rank") == pieceRank + i) && ((square.attr("data-column") == pieceColumn - i))) {
                    result = true;
                } else if ((square.attr("data-rank") == pieceRank - i) && ((square.attr("data-column") == pieceColumn - i))) {
                    result = true;
                } else if ((square.attr("data-rank") == pieceRank - i) && ((square.attr("data-column") == pieceColumn + i))) {
                    result = true;
                }
            }
            return result;
        }

        //knight
        if (piece.attr("data-type") === "knight") {
            if ((square.attr("data-rank") == (pieceRank + 2)) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank + 2)) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn + 2))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank + 1)) && (square.attr("data-column") == (pieceColumn - 2))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn + 2))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank - 1)) && (square.attr("data-column") == (pieceColumn - 2))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank - 2)) && (square.attr("data-column") == (pieceColumn + 1))) {
                return true
            } else if ((square.attr("data-rank") == (pieceRank - 2)) && (square.attr("data-column") == (pieceColumn - 1))) {
                return true
            } else {
                return false
            }
        }

        //queen
        if (piece.attr("data-type") === "queen") {

            var i;
            var result = false;
            for (i = 1; i < 8; i++) {
                if ((square.attr("data-rank") == pieceRank + i) && ((square.attr("data-column") == pieceColumn + i))) {
                    result = true;
                } else if ((square.attr("data-rank") == pieceRank + i) && ((square.attr("data-column") == pieceColumn - i))) {
                    result = true;
                } else if ((square.attr("data-rank") == pieceRank - i) && ((square.attr("data-column") == pieceColumn - i))) {
                    result = true;
                } else if ((square.attr("data-rank") == pieceRank - i) && ((square.attr("data-column") == pieceColumn + i))) {
                    result = true;
                } else if (square.attr("data-rank") == pieceRank || square.attr("data-column") == pieceColumn) {
                    result = true;
                }

            }
            return result;
        }
    };

    //funkce removingPiece prenastavuje atributy objektu Piece po vyhozeni/presunuti figurky,aby sly na jine misto ci do containeru

    // var removingPiece = function (piece) {
    //
    // 	piece.attr('style', '');
    // 	piece.attr('data-rank', -1);
    // 	piece.attr('data-column', -1);
    //
    // };

    return {
        isValidMove: function (piece, square) {
            return isValidMove(piece, square);
        },

        occupied: function (rank, column) {
            return occupied(rank, column);

        },

        getTypePieceOnSquare: function (rank, column) {
            return getTypePieceOnSquare(rank, column);
        },

        getColorPieceOnSquare: function (rank, column) {
            return getColorPieceOnSquare(rank, column);
        },

    };
};

$(document).ready(function () {

    $('#source img').draggable({
        revert: true,
        helper: 'clone',
        opacity: 0.5
    });


    $(".droppable").droppable({
        drop: function (event, ui) {

            var columnLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

            // pridat (AJAX?) k vyfirovani PHP scriptu k ulozeni do db?
            var square = $(this);
            var piece = ui.draggable;
            var myChess = Chess();

            console.log('piece original location: ' + piece.attr('data-rank') + piece.attr('data-column'));
            console.log('new square location: ' + square.attr('data-rank') + square.attr('data-column'));

            // document.getElementById('movesDiv').innerHTML = 'Last move: ' + piece.attr('data-type') + '-' + square.attr('data-rank') + '-' + square.attr('data-column');

            document.getElementById('pieceDiv').innerHTML = piece.attr('data-type');

            // change to letters
            document.getElementById('columnDiv').innerHTML = columnLetters[square.attr('data-column')-1];

            document.getElementById('rankDiv').innerHTML = square.attr('data-rank');

            document.getElementById('colorDiv').innerHTML = piece.attr('data-color');

            var squareRank = parseInt(square.attr('data-rank'));

            var squareColumn = parseInt(square.attr('data-column'));

            var occupied = myChess.occupied(squareRank, squareColumn);

            var otherPieceType = myChess.getTypePieceOnSquare(square.attr("data-rank"), square.attr("data-column"));

            //bez prelozeni stringu do integeru

            var squareRankVar = square.attr('data-rank');

            var squareColumnVar = square.attr('data-column');

            var occupiedVar = myChess.occupied(squareRankVar, squareColumnVar);


            var isValidMove = myChess.isValidMove(piece, square);

            var pieceRank = parseInt(piece.attr("data-rank"));
            var pieceColumn = parseInt(piece.attr("data-column"));


            if (isValidMove === true) {

                // pokud je zamyslene policko obsazene, proved brani

                if (occupied === true) {

                    removingPiece = $(document).find("img[data-rank=" + squareRank + "][data-column=" + squareColumn + "]");

                    console.log('var removingPiece: ' + removingPiece.attr('data-rank') + removingPiece.attr('data-column') + removingPiece.attr('data-type'));

                    removingPiece.remove();
                    removingPiece.attr('style', '');
                    removingPiece.attr('data-rank', -1);
                    removingPiece.attr('data-column', -1);
                    removingPiece.appendTo('#containerPieces');

                }

                //brani mimochodem za bile = odstraneni cerneho pesce z 5. rady

                if ((piece.attr("data-type") === "pawn") && (piece.attr("data-color") === "white") && (pieceRank === 5) && (myChess.getTypePieceOnSquare(5, squareColumn) === "pawn"))

                {
                    var removingPawn = $(document).find("img[data-rank=" + 5 + "][data-column=" + (squareColumn) + "][data-type=" + "pawn" + "][data-color=" + "black" + "]");

                    console.log('var removingPawnWhite: ' + removingPawn.attr('data-rank') + removingPawn.attr('data-column') + removingPawn.attr('data-type'));

                    removingPawn.remove();
                    removingPawn.attr('style', '');
                    removingPawn.attr('data-rank', -1);
                    removingPawn.attr('data-column', -1);
                    removingPawn.appendTo('#containerPieces');
                }

                //brani mimochodem za cerne = odstraneni bileho pesce ze 4. rady

                if ((myChess.getTypePieceOnSquare(4, squareColumn) === "pawn") && (piece.attr("data-color") === "black") && (pieceRank === 4) && (piece.attr("data-type") === "pawn")) {

                    var removingPawn2 = $(document).find("img[data-rank=" + 4 + "][data-column=" + squareColumn + "][data-type=" + "pawn" + "]");

                    console.log('var removingPawn2: ' + removingPawn2.attr('data-rank') + removingPawn2.attr('data-column') + removingPawn2.attr('data-type'));

                    removingPawn2.remove();
                    removingPawn2.attr('style', '');
                    removingPawn2.attr('data-rank', -1);
                    removingPawn2.attr('data-column', -1);
                    removingPawn2.appendTo('#containerPieces');

                }
                // white castle kingside

                if (occupied === false && (piece.attr("data-type") === "king") && (piece.attr("data-color") == "white") && (piece.attr("data-rank") == 1) && (piece.attr("data-column") == 5) && (squareRank == 1) && (squareColumn == 7)) {
                    var movingRook = $(document).find("img[data-rank=" + 1 + "][data-column=" + 8 + "][data-type=" + "rook" + "]");

                    console.log('var movingRook: ' + movingRook.attr('data-rank') + movingRook.attr('data-column') + movingRook.attr('data-type'));

                    // movingRook.remove();

                    movingRook.attr('data-rank', 1);
                    movingRook.attr('data-column', 6);
                    movingRook.attr('style', '');
                    movingRook.appendTo('#f1');
                }

                // white castle queenside
                if (occupied === false && (piece.attr("data-type") === "king") && (piece.attr("data-color") == "white") && (piece.attr("data-rank") == 1) && (piece.attr("data-column") == 5) && (squareRank == 1) && (squareColumn == 3)) {
                    var movingRook2 = $(document).find("img[data-rank=" + 1 + "][data-column=" + 1 + "][data-type=" + "rook" + "]");

                    console.log('var movingRook: ' + movingRook2.attr('data-rank') + movingRook2.attr('data-column') + movingRook2.attr('data-type'));

                    movingRook2.attr('data-rank', 1);
                    movingRook2.attr('data-column', 4);
                    movingRook2.attr('style', '');
                    movingRook2.appendTo('#d1');
                }

                // black castle kingside

                if (occupied === false && (piece.attr("data-type") === "king") && (piece.attr("data-color") == "black") && (piece.attr("data-rank") == 8) && (piece.attr("data-column") == 5) && (squareRank == 8) && (squareColumn == 7)) {
                    var movingRook = $(document).find("img[data-rank=" + 8 + "][data-column=" + 8 + "][data-type=" + "rook" + "]");

                    console.log('var movingRook: ' + movingRook.attr('data-rank') + movingRook.attr('data-column') + movingRook.attr('data-type'));

                    // movingRook.remove();

                    movingRook.attr('data-rank', 8);
                    movingRook.attr('data-column', 6);
                    movingRook.attr('style', '');

                    movingRook.appendTo('#f8');
                }

                // black castle queenside

                if (occupied === false && (piece.attr("data-type") === "king") && (piece.attr("data-color") == "black") && (piece.attr("data-rank") == 8) && (piece.attr("data-column") == 5) && (squareRank == 8) && (squareColumn == 3)) {
                    var movingRook2 = $(document).find("img[data-rank=" + 8 + "][data-column=" + 1 + "][data-type=" + "rook" + "]");

                    console.log('var movingRook: ' + movingRook2.attr('data-rank') + movingRook2.attr('data-column') + movingRook2.attr('data-type'));

                    // movingRook.remove();

                    movingRook2.attr('data-rank', 8);
                    movingRook2.attr('data-column', 4);
                    movingRook2.attr('style', '');
                    movingRook2.appendTo('#d8');
                }

                $('.ui-draggable-dragging').hide(); // schovej originalni figurku

                console.log('old square location? : ' + square.attr('data-rank') +'-' + square.attr('data-column'));

                // nastav nove figurce novy rank a column
                piece.attr('data-rank', square.attr('data-rank'));
                piece.attr('data-column', square.attr('data-column'));

                piece.appendTo(square);

                console.log('new square location in if : ' + square.attr('data-rank') +'-' + square.attr('data-column'));

                // dojde k brani figurky

                // po dosahnuti 8.rady ma pesec zmizet a promenit se v jinou figurku
                if ((piece.attr("data-type") === "pawn") && (piece.attr("data-color") === "white") && (squareRank === 8))

                    // && (myChess.getTypePieceOnSquare(5, square.attr("data-column")) === "pawn"))
                {
                    console.log('var removingPawnLastRank pred var: ' + square.attr('data-rank')+ '-' + square.attr('data-column') +'-' + piece.attr('data-type'));

                    alert('You achieved promotion!');

                    var removingPawnLastRank = $(document).find("img[data-type=" + "pawn" + "][data-rank=" +8+"]");

                    console.log('var removingPawnLastRank po var: ' + removingPawnLastRank.attr('data-rank')+'-' + removingPawnLastRank.attr('data-column') +'-' + removingPawnLastRank.attr('data-type'));

                    // removingPawnLastRank.remove();
                    removingPawnLastRank.attr('style', '');
                    removingPawnLastRank.attr('data-rank', -1);
                    removingPawnLastRank.attr('data-column', -1);
                    removingPawnLastRank.appendTo('#containerPieces');

                    //najde bilou damu v odkladisti figurek a nasadi ji na pole promeny pesce
                    var newQueen = $(document).find("img[data-time=" + "newWhiteQueen" + "]");

                    newQueen.attr('style', '');

                    newQueen.attr('data-rank', squareRank);
                    newQueen.attr('data-column', squareColumn);

                    newQueen.appendTo(square);

                    console.log('var new Queen: ' + newQueen.attr('data-rank') +'-' + newQueen.attr('data-column') +'-' + newQueen.attr('data-type'));
                }

                // po dosahnuti 1.rady ma cerny pesec zmizet a promenit se v jinou figurku
                if ((piece.attr("data-type") === "pawn") && (piece.attr("data-color") === "black") && (squareRank === 1))

                {
                    console.log('var removingPawnLastRank pred var: ' + square.attr('data-rank')+ '-' + square.attr('data-column') +'-' + piece.attr('data-type'));

                    alert('You achieved promotion!');

                    var removingPawnLastRank = $(document).find("img[data-type=" + "pawn" + "][data-rank=" + 1 +"]");

                    console.log('var removingPawnLastRank po var: ' + removingPawnLastRank.attr('data-rank')+'-' + removingPawnLastRank.attr('data-column') +'-' + removingPawnLastRank.attr('data-type'));

                    // removingPawnLastRank.remove();
                    removingPawnLastRank.attr('style', '');
                    removingPawnLastRank.attr('data-rank', -1);
                    removingPawnLastRank.attr('data-column', -1);
                    removingPawnLastRank.appendTo('#containerPieces');

                    //najde cernou damu v odkladisti figurek a nasadi ji na pole promeny pesce
                    var newQueen = $(document).find("img[data-time=" + "newBlackQueen" + "]");

                    newQueen.attr('style', '');

                    newQueen.attr('data-rank', squareRank);
                    newQueen.attr('data-column', squareColumn);

                    newQueen.appendTo(square);

                    console.log('var new Queen: ' + newQueen.attr('data-rank') +'-' + newQueen.attr('data-column') +'-' + newQueen.attr('data-type'));
                }

            } else {
                console.log('reverting')
            }
        }
    });
});