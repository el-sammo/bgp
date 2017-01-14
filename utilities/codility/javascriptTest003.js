// starts at coords 0,0
// moves as a knight, with 2 hor & 1 ver or 2 ver & 1 hor
// returns -1 if the knight cannot reach the given square (not possible)
// returns -2 if the number of moves required is over 100,000,000 (if any coordinate is greater than 100,000,000 or less than 100,000,000)

function solution(x, y) {
	var xInc, yInc, memo;

	for(var i = 0; i < 100000000; i++) {
		x = Math.abs(x);
		y = Math.abs(y);

		if(x === 0 && y === 0) {
			return i;
		}

		if(x < 3 && y < 3) {
			if(x < y) {
				memo = x;
				x = y;
				y = memo;
			}

			if(x === 0 && y === 1) {
				return i + 3;
			}
			if(x === 0 && y === 2) {
				return i + 2;
			}
			if(x === 1 && y === 1) {
				return i + 2;
			}
			if(x === 1 && y === 2) {
				return i + 1;
			}
			if(x === 2 && y === 2) {
				return i + 4;
			}
		}

		if(x > y) {
			xInc = 2;
			yInc = 1;
		} else {
			xInc = 1;
			yInc = 2;
		}

		x -= xInc;
		y -= yInc;
	}

	return -2;
}

console.log(solution(0, 30)); // 0,1 -> 4,0


			// 0,0         = 2 moves
			// 0,1 and 1,0 = 3 moves
			// 0,2 and 2,0 = 2 moves
			// 0,3 and 3,0 = 3 moves
			// 0,4 and 4,0 = 2 moves
			// 0,5 and 5,0 = 3 moves
			// 0,6 and 6,0 = 4 moves
			// 
			// 1,1         = 2 moves
			// 1,2 and 2,1 = 1 moves
			// 1,3 and 3,1 = 2 moves
			// 1,4 and 4,1 = 3 moves
			// 1,5 and 5,1 = 4 moves
			// 1,6 and 6,1 = 3 moves
			// 
			// 2,2         = 4 moves
			// 2,3 and 3,2 = 3 moves
			// 2,4 and 4,2 = 2 moves
			// 2,5 and 5,2 = 3 moves
			// 2,6 and 6,2 = 4 moves
			// 
			// 3,3         = 2 moves
			// 3,4 and 4,3 = 3 moves
			// 3,5 and 5,3 = 4 moves
			// 3,6 and 6,3 = 3 moves
			// 
			// 4,4         = 4 moves
			// 4,5 and 5,4 = 3 moves
			// 4,6 and 6,4 = 4 moves
			// 
			// 5,5         = 4 moves
			// 5,6 and 6,5 = 5 moves
			// 
			// 6,6         = 4 moves
