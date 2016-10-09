function forEach(array,callback) {
	for (var i = array.length - 1; i >= 0; i--) {
	 callback(array[i]);
	}
}