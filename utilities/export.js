db = new Mongo().getDB('popcorn');

var cursor = db.popcorn.find({});
while(cursor.hasNext()) {
	var popcorn = cursor.next();
print("'"+popcorn._id.valueOf()+"','"+popcorn.name+"','"+popcorn.description+"'");
}
