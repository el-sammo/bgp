db = new Mongo().getDB('popcorn');

var popcornFlavors = [
	// candy flavors
	{
		name: 'Blazin\' Blackberry', 
		description: 'Flavorful blackberry flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Blue Coconut', 
		description: 'Tropical cocount flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Bubblicious',
		description: 'Bubblegum flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Crazy Cornfetti',
		description: 'Crazy mix of all the candy-floavored gourmet popcorn flavors',
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Creamy Cheesecake',
		description: 'Rich, creamy cheesecake flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Gonzo Grape',
		description: 'Juicy purple grape flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Green Applicious',
		description: 'Crisp green apple flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Old Fashioned Vanilla',
		description: 'Classic vanilla flavored gourmet popcorn', 
		category: 'Candy', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Orange Crush',
		description: 'Citrus orange flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Pink Cotton Candy',
		description: 'Fun cotton candy flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Red Hot Cinnamon',
		description: 'Fiery cinnamon flavored gourmet popcorn', 
		category: 'Candy', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Rockin\' Raspberry', 
		description: 'Tart raspberry flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Strawberry Patch',
		description: 'Cool strawberry flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Very Cherry',
		description: 'Sweet cherry flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Wacky Watermelon',
		description: 'Electric watermelon flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Wild Blueberry',
		description: 'Scrumptious blueberry flavored gourmet popcorn', 
		category: 'Candy', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	// caramel flavors
	{
		name: 'Caramel',
		description: 'Authentic caramel flavored gourmet popcorn', 
		category: 'Caramel', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Chicago',
		description: 'A mix of cheese and caramel flavored gourmet popcorn', 
		category: 'Caramel', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Denver',
		description: 'A mix of white cheddar and caramel flavored gourmet popcorn', 
		category: 'Caramel', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Lite Caramel',
		description: 'Low-calorie caramel flavored gourmet popcorn', 
		category: 'Caramel', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Sea Salt & Caramel',
		description: 'Tasty blend of sea salt and caramel flavored gourmet popcorn', 
		category: 'Caramel', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	{
		name: 'Vegas',
		description: 'A mix of butter, cheese & caramel flavored gourmet popcorn', 
		category: 'Caramel', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 3.50}, {name: 'Small', price: 6.50}, {name: 'Medium', price: 9.75}, {name: 'Large', price: 22.50}]
	},
	// cheese flavors
	{
		name: 'Cheese',
		description: 'A fabulous cheese flavored gourmet popcorn', 
		category: 'Cheese', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Cinnamon Toast',
		description: 'A flavorful cinnamon toast flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Dill Pickle',
		description: 'A dill flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Jalapeno Ranch',
		description: 'A delightful blend of spicy jalapeno and cool ranch flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Kettle Corn',
		description: 'A traditional kettle corn gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Lite Cheese',
		description: 'A low-calorie cheese flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Loaded Baked Potato',
		description: 'A crwod-pleasing gourmet popcorn featuring cheese, sour cream, chives and bacon', 
		category: 'Cheese', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Mac & Cheese',
		description: 'A creamy cheese flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Movie Kettle',
		description: 'A theater-style kettle gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Movie Theater Butter',
		description: 'A buttery favorite gourmet popcorn inspired by theater-style flavor', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Nacho Cheese',
		description: 'A slightly-spicy cheese flavored gourmet popcorn', 
		category: 'Cheese', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Parmesan & Garlic',
		description: 'An artisanal gourmet popcorn with parmesan and garlic highlights', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Pizza',
		description: 'A pizza flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Ranch',
		description: 'A gourmet popcorn with cool and creamy ranch flavor', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Salt & Vinegar',
		description: 'Excite your palate with this slightly exotic gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Sour Cream & Chives',
		description: 'A down home favorite gourmet popcorn', 
		category: 'Cheese', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Southwest Hot Wings',
		description: 'Hotwing flavored gourmet popcorn with a kick', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Southwest Jalapeno',
		description: 'Spicy gourmet popcorn with a hint of west-mex flavor', 
		category: 'Cheese', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'Spicy & Hot Cheese',
		description: 'A very spicy cheese flavored gourmet popcorn', 
		category: 'Cheese', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	{
		name: 'White Cheddar',
		description: 'The original cheese flavored gourmet popcorn', 
		category: 'Cheese', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.95}, {name: 'Small', price: 5.75}, {name: 'Medium', price: 7.25}, {name: 'Large', price: 19.50}]
	},
	// chocolate flavors
	{
		name: 'Banana Pudding',
		description: 'A creamy banana flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Birthday Cake',
		description: 'A fun and festive gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Butterfinger',
		description: 'A chocolate gourmet popcorn flavored with hints of butterfinger', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Chocolate',
		description: 'A light and sweet chocolate flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Cinnabun',
		description: 'A sweet gourmet popcorn that reminds you of hot, fresh-baked cinnamon rolls', 
		category: 'Chocolate', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Dark Chocolate',
		description: 'A less sweet dark chocolate flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Heath Toffee Almond',
		description: 'An exquisite gourmet popcorn flavored with heath toffee and almond', 
		category: 'Chocolate', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Lemon Meringue Pie',
		description: 'A not-too-tart lemon flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Oreo',
		description: 'An oreo-inspired gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Peanut Butter Chocolate',
		description: 'A wonderful blend of peanut butter and chocolate flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Puppy Chow',
		description: 'A powdered-sugar coated chocolate flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'S\'mores',
		description: 'This gourmet popcorn is a campfire-inspired homage', 
		category: 'Chocolate', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Strawberry Cheesecake',
		description: 'A sweet strawberry flavor highlights this cheesecake-infused gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'Tuxedo',
		description: 'A tasteful drizzle of white and milk chocolates renders this gourmet popcorn obscenely good', 
		category: 'Chocolate', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'White Chocolate',
		description: 'Becca\'s take on this original gourmet popcorn', 
		category: 'Chocolate', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'White Chocolate Peppermint',
		description: 'Peppermint accents added to our signature white chocolate flavored gourmet popcorn', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	{
		name: 'White Chocolate Pretzel',
		description: 'This gourmet popcorn combines ptezel bits with our signature white chocolate', 
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 5.95}, {name: 'Small', price: 11.75}, {name: 'Medium', price: 18.25}, {name: 'Large', price: 45.50}]
	},
	// specialty flavors
	{
		name: 'Becca\'s Special',
		description: 'A mix of chocolate, caramel and nuts compose this symphony of gourmet popcorn', 
		category: 'Specialty', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 4.95}, {name: 'Small', price: 9.25}, {name: 'Medium', price: 12.25}, {name: 'Large', price: 32.50}]
	},
	{
		name: 'Caramel with Nuts',
		description: 'Caramel and nuts make this gourmet popcorn incredibly snack-worthy', 
		category: 'Specialty', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 4.95}, {name: 'Small', price: 9.25}, {name: 'Medium', price: 12.25}, {name: 'Large', price: 32.50}]
	},
	// original flavors
	{
		name: 'Buttery',
		description: 'This original buttery gourmet popcorn will have you wanting more', 
		category: 'Original', 
		active: true, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.00}, {name: 'Small', price: 3.50}, {name: 'Medium', price: 4.50}, {name: 'Large', price: 10.25}]
	},
	{
		name: 'Low Salt',
		description: 'This original gourmet popcorn satisfies the most discerning while honoring a low-sodium diet',
		category: 'Chocolate', 
		active: false, 
		months: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
		sizes: [{name: 'Mini', price: 2.00}, {name: 'Small', price: 3.50}, {name: 'Medium', price: 4.50}, {name: 'Large', price: 10.25}]
	},
];

insertPopcorn(popcornFlavors);

function insertPopcorn(popcornFlavors) {
	popcornFlavors.forEach(function(flavor) {
print('insertPopcorn() called with '+flavor.name+', '+flavor.description+', '+flavor.category+', '+flavor.active+', '+flavor.months+', '+flavor.sizes);
		db.popcorn.insert({
			name: flavor.name,
			description: flavor.description,
			category: flavor.category,
			active: flavor.active,
			months: flavor.months,
			sizes: flavor.sizes
		});
	});
}

