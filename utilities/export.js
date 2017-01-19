db = new Mongo().getDB('popcorn');

var cursorA = db.popcorn.find({}).limit(7).skip(60);
while(cursorA.hasNext()) {
	var popcorn = cursorA.next();
	var categoryId = ObjectId(popcorn.category);
	var cursorB = db.categories.find({_id: categoryId});
	while(cursorB.hasNext()) {
		var category = cursorB.next();
		var cursorC = db.options.find({popcornId: popcorn._id.valueOf()});
		while(cursorC.hasNext()) {
			var option = cursorC.next();
print("\""+option._id.valueOf()+"\",\""+popcorn.name+"\",\""+popcorn.description+"\",\""+category.name+"\",\""+option.name+"\",\""+option.price+"\"");
		}
	}
}
