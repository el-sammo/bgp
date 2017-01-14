function solution(str) {
	var chr
		, parenCount = 0
		, closedParensLeft = str.split(')').length - 1;

	for(var idx = 0; idx < str.length; idx++) {
		chr = str[idx];

		if(chr === '(') {
			parenCount++;
		}

		if(chr === ')') {
			closedParensLeft--;
		}

		if(parenCount === closedParensLeft) {
			return idx + 1;
		}
	}
}

