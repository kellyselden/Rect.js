function Rect(x1, y1, x2, y2, zindex) {
	function print() { return '[{0}, {1}, {2}, {3}]'.format(x1, y1, x2, y2) }
	function testArea() {
		if (x1 == x2) throw new Error('rectangle has zero width ' + print());
		if (x1 > x2) throw new Error('rectangle has negative width ' + print());
		if (y1 == y2) throw new Error('rectangle has zero height ' + print());
		if (y1 > y2) throw new Error('rectangle has negative height ' + print());
	}
	testArea();
	this.zindex = zindex;
	this.getX1 = function() { return x1 }
	this.getY1 = function() { return y1 }
	this.getX2 = function() { return x2 }
	this.getY2 = function() { return y2 }
	this.setX1 = function(x) { x1 = x; testArea() }
	this.setY1 = function(y) { y1 = y; testArea() }
	this.setX2 = function(x) { x2 = x; testArea() }
	this.setY2 = function(y) { y2 = y; testArea() }
	this.clone = function() {
		return new Rect(this.getX1(), this.getY1(), this.getX2(), this.getY2(), this.zindex);
	}
}
Rect.subtractMultiple = function(r1s, r2s) {
	if (r2s.length)
		for (var i in r1s) {
			var r1 = r1s[i];
			for (var j in r2s) {
				var r2 = r2s[j];
				
				if (!Rect.getIntersect(r1, r2)) continue;
				if (r1.zindex > r2.zindex) continue;
				
				var rects = [];
				var cutR1 = r1.clone();
				if (r1.getX1() < r2.getX1()) {
					var left = r1.clone();
					left.setX2(r2.getX1());
					rects.push(left);
					cutR1.setX1(left.getX1());
				}
				if (r1.getX2() > r2.getX2()) {
					var right = r1.clone();
					right.setX1(r2.getX2());
					rects.push(right);
					cutR1.setX2(right.getX2());
				}
				if (r1.getY1() < r2.getY1()) {
					var top = cutR1.clone();
					top.setY2(r2.getY1());
					rects.push(top);
				}
				if (r1.getY2() > r2.getY2()) {
					var bottom = cutR1.clone();
					bottom.setY1(r2.getY2());
					rects.push(bottom);
				}
				r1s = r1s.slice(0);
				r1s.splice(parseInt(i), 1);
				for (var k in rects)
					r1s.push(rects[k]);
				return Rect.subtractMultiple(r1s, r2s);
			}
		}
	return r1s;
}
Rect.getIntersect = function(r1, r2) {
	return r1.getX1() < r2.getX2()
		&& r1.getY1() < r2.getY2()
		&& r1.getX2() > r2.getX1()
		&& r1.getY2() > r2.getY1()
		? new Rect(
			Math.max(r1.getX1(), r2.getX1()),
			Math.max(r1.getY1(), r2.getY1()),
			Math.min(r1.getX2(), r2.getX2()),
			Math.min(r1.getY2(), r2.getY2()),
			Math.max(r1.zindex, r2.zindex))
		: null;
}
Rect.areEqual = function(r1, r2) {
	return r1.getX1() == r2.getX1()
		&& r1.getY1() == r2.getY1()
		&& r1.getX2() == r2.getX2()
		&& r1.getY2() == r2.getY2();
}
// Rect.contains = function(rects, rect) {
	// for (var i in rects) {
		// if (Rect.areEqual(rects[i], rect))
			// return true;
	// }
	// return false;
// }