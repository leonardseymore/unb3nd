module("Globals");

test("Globals initial values", function() {
	equal(fps, 0);
	equal(lastFrame, 0);
});