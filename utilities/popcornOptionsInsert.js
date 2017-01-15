db = new Mongo().getDB('popcorn');

insertPopcornOptions();

function insertPopcornOptions() {
	var cursor = db.popcorn.find();
	while(cursor.hasNext()) {
		var flavorData = cursor.next();
		var flavorId = flavorData._id.valueOf();
		flavorData.sizes.forEach(function(size) {
			var sizeName = size.name;
			var sizePrice = size.price;
			db.options.insert({
				popcornId: flavorId, 
				name: sizeName,
				price: sizePrice
			});
		});
	}
}

