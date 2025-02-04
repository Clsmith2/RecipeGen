require('dotenv').config();
const mongoose = require('mongoose');
const GroceryItem = require('./models/GroceryItem');  // Import the schema
 
const items = {
    Dairy: [
        { brand: 'Horizon', products: [{ name: 'Milk', variants: ['16 oz', '32 oz', '1 gallon'] }, { name: 'Cream', variants: ['8 oz', '16 oz'] }], priceRange: [3, 5] },
        { brand: 'Land O Lakes', products: [{ name: 'Butter', variants: ['4 sticks', '8 oz'] }, { name: 'Cheese', variants: ['8 oz', '16 oz'] }], priceRange: [2, 4] },
        { brand: 'Chobani', products: [{ name: 'Yogurt', variants: ['6 oz', '12 oz', '4-pack'] }], priceRange: [1, 3] },
        { brand: 'Yoplait', products: [{ name: 'Yogurt', variants: ['6 oz', '12 oz', '4-pack'] }], priceRange: [1, 3] },
        { brand: 'Kerrygold', products: [{ name: 'Butter', variants: ['8 oz', '16 oz'] }, { name: 'Cheese', variants: ['7 oz', '14 oz'] }], priceRange: [4, 6] }
    ],
    Fruits: [
        { brand: 'Dole', products: [{ name: 'Bananas', variants: ['per lb', 'bunch'] }, { name: 'Pineapple', variants: ['each'] }, { name: 'Strawberries', variants: ['16 oz', '32 oz'] }, { name: 'Peaches', variants: ['each', 'bag'] }, { name: 'Grapes', variants: ['per lb', 'bag'] }, { name: 'Avocados', variants: ['each', 'bag'] }], priceRange: [1, 4] },
        { brand: 'Chiquita', products: [{ name: 'Bananas', variants: ['per lb', 'bunch'] }, { name: 'Avocados', variants: ['each', 'bag'] }, { name: 'Mangoes', variants: ['each'] }, { name: 'Blueberries', variants: ['6 oz', '18 oz'] }, { name: 'Pears', variants: ['each', 'bag'] }], priceRange: [1, 4] },
        { brand: 'Del Monte', products: [{ name: 'Pineapple', variants: ['each'] }, { name: 'Oranges', variants: ['per lb', 'bag'] }, { name: 'Limes', variants: ['each', 'bag'] }, { name: 'Lemons', variants: ['each', 'bag'] }], priceRange: [2, 5] },
        { brand: 'Sunkist', products: [{ name: 'Oranges', variants: ['per lb', 'bag'] }, { name: 'Lemons', variants: ['each', 'bag'] }], priceRange: [2, 4] },
        { brand: 'Zespri', products: [{ name: 'Kiwis', variants: ['each', 'tray of 4'] }, { name: 'Golden Kiwis', variants: ['each', 'tray of 4'] }], priceRange: [3, 5] },
        { brand: 'Driscoll\'s', products: [{ name: 'Raspberries', variants: ['6 oz', '12 oz'] }, { name: 'Blueberries', variants: ['6 oz', '18 oz'] }, { name: 'Blackberries', variants: ['6 oz', '12 oz'] }], priceRange: [3, 6] },
        { brand: 'Granny Smith', products: [{ name: 'Apples', variants: ['per lb', 'bag'] }], priceRange: [2, 4] },
        { brand: 'Red Delicious', products: [{ name: 'Apples', variants: ['per lb', 'bag'] }], priceRange: [2, 4] },
        { brand: 'Fuji', products: [{ name: 'Apples', variants: ['per lb', 'bag'] }], priceRange: [2, 4] },
    ],
    Vegetables: [
        { brand: 'Green Giant', products: [{ name: 'Broccoli', variants: ['per lb', 'bunch'] }, { name: 'Carrots', variants: ['per lb', 'bag'] }, { name: 'Peas', variants: ['12 oz bag', '16 oz bag'] }, { name: 'Cauliflower', variants: ['per lb', 'head'] }, { name: 'Green Beans', variants: ['per lb', 'bag'] }, { name: 'Bell Peppers', variants: ['each', 'bag'] }, { name: 'Asparagus', variants: ['per lb', 'bunch'] }], priceRange: [2, 5] },
        { brand: 'Birds Eye', products: [{ name: 'Spinach', variants: ['10 oz bag', '16 oz bag'] }, { name: 'Broccoli', variants: ['12 oz bag', '16 oz bag'] }, { name: 'Mixed Vegetables', variants: ['12 oz bag', '16 oz bag'] }, { name: 'Brussels Sprouts', variants: ['12 oz bag', '16 oz bag'] }, { name: 'Corn', variants: ['12 oz bag', '16 oz bag'] }], priceRange: [1, 4] },
        { brand: 'Fresh Express', products: [{ name: 'Lettuce', variants: ['per lb', 'bag'] }, { name: 'Spinach', variants: ['per lb', 'bag'] }, { name: 'Romaine', variants: ['per lb', 'bag'] }, { name: 'Kale', variants: ['per lb', 'bag'] }, { name: 'Chard', variants: ['per lb', 'bag'] }, { name: 'Arugula', variants: ['per lb', 'bag'] }], priceRange: [2, 5] },
        { brand: 'Organic Girl', products: [{ name: 'Spinach', variants: ['5 oz container', '10 oz container'] }, { name: 'Kale', variants: ['5 oz container', '10 oz container'] }, { name: 'Spring Mix', variants: ['5 oz container', '10 oz container'] }, { name: 'Herbs', variants: ['per oz', 'bunch'] }], priceRange: [3, 6] },
        { brand: 'Bolthouse Farms', products: [{ name: 'Carrots', variants: ['per lb', 'bag'] }, { name: 'Baby Carrots', variants: ['12 oz bag', '16 oz bag'] }, { name: 'Celery', variants: ['per lb', 'bag'] }, { name: 'Radishes', variants: ['per lb', 'bag'] }], priceRange: [1, 4] },
        { brand: 'Idaho', products: [{ name: 'Potatoes', variants: ['per lb', '5 lb bag', '10 lb bag'] }], priceRange: [1, 5] },
        { brand: 'Vidalia', products: [{ name: 'Onions', variants: ['per lb', 'bag'] }], priceRange: [1, 3] },
        { brand: 'Texas Sweet', products: [{ name: 'Onions', variants: ['per lb', 'bag'] }, { name: 'Shallots', variants: ['per lb', 'bag'] }, { name: 'Scallions', variants: ['bunch', 'bag'] }], priceRange: [1, 4] },
        { brand: 'California Farms', products: [{ name: 'Tomatoes', variants: ['per lb', 'box'] }, { name: 'Bell Peppers', variants: ['each', 'bag'] }, { name: 'Cucumbers', variants: ['each', 'bag'] }, { name: 'Zucchini', variants: ['per lb', 'bag'] }, { name: 'Eggplant', variants: ['per lb', 'each'] }], priceRange: [1, 4] },
        { brand: 'Mann\'s', products: [{ name: 'Broccoli Florets', variants: ['12 oz bag', '16 oz bag'] }, { name: 'Snap Peas', variants: ['6 oz bag', '12 oz bag'] }, { name: 'Shredded Carrots', variants: ['10 oz bag'] }], priceRange: [2, 5] },
        { brand: 'Dandy', products: [{ name: 'Green Onions', variants: ['bunch', '3-pack'] }, { name: 'Bean Sprouts', variants: ['8 oz bag', '16 oz bag'] }], priceRange: [1, 3] },
        { brand: 'Shiitake', products: [{ name: 'Mushrooms', variants: ['4 oz package', '8 oz package'] }], priceRange: [3, 6] },
        { brand: 'Christopher Ranch', products: [{ name: 'Fresh Garlic Bulbs', variants: ['each', '3-pack', '5-pack'] }, { name: 'Peeled Garlic Cloves', variants: ['6 oz bag', '12 oz bag'] }, { name: 'Minced Garlic in Water', variants: ['4.5 oz jar', '8 oz jar'] }], priceRange: [2, 6] },
    ],
    Meat: [
        { brand: 'Tyson', products: [{ name: 'Chicken Breast', variants: ['per lb', 'pack of 4'] }, { name: 'Ground Beef', variants: ['per lb', '1 lb package'] }], priceRange: [5, 10] },
        { brand: 'Oscar Mayer', products: [{ name: 'Bacon', variants: ['12 oz', '16 oz'] }, { name: 'Hot Dogs', variants: ['8-pack', '12-pack'] }], priceRange: [3, 7] },
        { brand: 'Smithfield', products: [{ name: 'Pork Chops', variants: ['per lb', 'pack of 4'] }, { name: 'Bacon', variants: ['12 oz', '16 oz'] }], priceRange: [4, 8] },
        { brand: 'Applegate', products: [{ name: 'Sausages', variants: ['12 oz', '16 oz'] }, { name: 'Bacon', variants: ['12 oz', '16 oz'] }], priceRange: [5, 9] },
        { brand: 'Hillshire Farm', products: [{ name: 'Sausages', variants: ['12 oz', '16 oz'] }, { name: 'Ham', variants: ['per lb', '1 lb package'] }], priceRange: [4, 8] },
        { brand: 'Butcher\'s Mark', products: [{ name: 'Short Ribs', variants: ['per lb', '4-pack'] }, { name: 'Ground Turkey', variants: ['per lb', '1 lb package'] }], priceRange: [7, 15] },
        { brand: 'Perdue', products: [{ name: 'Chicken Thighs', variants: ['per lb', 'pack of 4'] }, { name: 'Chicken Drumsticks', variants: ['per lb', 'pack of 6'] }], priceRange: [4, 8] }
    ],
    Seafood: [
        { brand: 'Gorton\'s', products: [{ name: 'Fish Sticks', variants: ['18-pack', '24-pack'] }], priceRange: [5, 7] },
        { brand: 'Bumble Bee', products: [{ name: 'Tuna', variants: ['5 oz can', '12 oz can'] }], priceRange: [1, 3] },
        { brand: 'Sea Best', products: [{ name: 'Shrimp', variants: ['1 lb bag', '2 lb bag'] }], priceRange: [8, 15] },
        { brand: 'Chicken of the Sea', products: [{ name: 'Salmon', variants: ['5 oz can', '12 oz can'] }], priceRange: [3, 5] },
    ],
    Bakery: [
        { brand: 'Gold Medal', products: [{ name: 'Flour', variants: ['5 lb bag', '10 lb bag'] }], priceRange: [2, 4] },
        { brand: 'Hershey\'s', products: [{ name: 'Cocoa Powder', variants: ['8 oz can', '16 oz can'] }], priceRange: [3, 5] },
        { brand: 'Pillsbury', products: [{ name: 'Sugar', variants: ['4 lb bag', '10 lb bag'] }], priceRange: [2, 4] },
        { brand: 'Betty Crocker', products: [{ name: 'Cake Mix', variants: ['15.25 oz box', '21 oz box'] }], priceRange: [2, 4] },
        { brand: 'Wonder', products: [{ name: 'Bread', variants: ['loaf', '2-pack'] }], priceRange: [2, 4] },
        { brand: 'Sara Lee', products: [{ name: 'Bread', variants: ['loaf', '2-pack'] }, { name: 'Bagels', variants: ['6-pack', '12-pack'] }], priceRange: [3, 5] },
        { brand: 'Pepperidge Farm', products: [{ name: 'Bread', variants: ['loaf', '2-pack'] }, { name: 'Cookies', variants: ['8 oz bag', '16 oz bag'] }], priceRange: [3, 6] },
        { brand: 'Entenmann\'s', products: [{ name: 'Muffins', variants: ['4-pack', '8-pack'] }, { name: 'Donuts', variants: ['6-pack', '12-pack'] }], priceRange: [4, 7] },
        { brand: 'King\'s Hawaiian', products: [{ name: 'Bread', variants: ['loaf', 'rolls 12-pack'] }, { name: 'Rolls', variants: ['12-pack', '24-pack'] }], priceRange: [3, 5] },
        { brand: 'Arm & Hammer', products: [{ name: 'Baking Soda', variants: ['1 lb box', '2 lb box'] }], priceRange: [1, 3] },
        { brand: 'Clabber Girl', products: [{ name: 'Baking Powder', variants: ['8.1 oz can', '14 oz can'] }], priceRange: [2, 4] },
        { brand: 'Domino', products: [{ name: 'Brown Sugar', variants: ['1 lb bag', '2 lb bag'] }, { name: 'Confectioners Sugar', variants: ['1 lb bag', '2 lb bag'] }], priceRange: [2, 5] },
        { brand: 'Nielsen-Massey', products: [{ name: 'Vanilla Extract', variants: ['2 oz bottle', '4 oz bottle'] }], priceRange: [8, 15] },
        { brand: 'Fleischmann\'s', products: [{ name: 'Active Dry Yeast', variants: ['4 oz jar', '2-pack 0.75 oz envelopes'] }, { name: 'RapidRise Yeast', variants: ['4 oz jar', '3-pack 0.75 oz envelopes'] }], priceRange: [2, 5] },
        { brand: 'Pillsbury', products: [{ name: 'Pie Crust', variants: ['2-pack', '4-pack'] }, { name: 'Crescent Rolls', variants: ['8 oz can', '12 oz can'] }], priceRange: [3, 5] },
        { brand: 'Red Star', products: [{ name: 'Instant Yeast', variants: ['3-pack 0.25 oz envelopes', '4 oz jar'] }], priceRange: [2, 5] }
    ],
    Spices: [
        { brand: 'McCormick', products: [{ name: 'Garlic Powder', variants: ['2.5 oz', '6 oz'] }, { name: 'Onion Powder', variants: ['2.62 oz', '6.5 oz'] }, { name: 'Black Pepper', variants: ['2 oz', '4 oz', '8 oz'] }, { name: 'Cinnamon', variants: ['2.37 oz', '6 oz'] }, { name: 'Paprika', variants: ['2 oz', '6 oz'] }, { name: 'Chili Powder', variants: ['2.5 oz', '8 oz'] }, { name: 'Cumin', variants: ['1.5 oz', '4 oz'] }, { name: 'Turmeric', variants: ['2 oz', '4 oz'] }, { name: 'Oregano', variants: ['0.87 oz', '2 oz'] }, { name: 'Basil', variants: ['0.62 oz', '1.5 oz'] }], priceRange: [2, 8] },
        { brand: 'Lawry\'s', products: [{ name: 'Seasoned Salt', variants: ['8 oz', '16 oz'] }, { name: 'Garlic Salt', variants: ['8 oz', '16 oz'] }], priceRange: [3, 5] },
        { brand: 'Simply Organic', products: [{ name: 'Thyme', variants: ['0.78 oz jar', '1.6 oz jar'] }, { name: 'Rosemary', variants: ['0.85 oz jar', '1.7 oz jar'] }, { name: 'Red Pepper Flakes', variants: ['1.59 oz jar'] }], priceRange: [3, 7] }
    ],
    Beverages: [
        { brand: 'Coca-Cola', products: [{ name: 'Soda', variants: ['12-pack', '6-pack', '2-liter'] }], priceRange: [4, 7] },
        { brand: 'Pepsi', products: [{ name: 'Soda', variants: ['12-pack', '6-pack', '2-liter'] }], priceRange: [4, 7] },
        { brand: 'Tropicana', products: [{ name: 'Orange Juice', variants: ['12 oz', '32 oz', '64 oz'] }], priceRange: [3, 5] },
        { brand: 'Gatorade', products: [{ name: 'Sports Drink', variants: ['20 oz', '32 oz', '6-pack'] }], priceRange: [1, 4] },
        { brand: 'Lipton', products: [{ name: 'Tea', variants: ['12-pack', '6-pack', '2-liter'] }], priceRange: [2, 5] }
    ],
    Condiments: [
        { brand: 'Heinz', products: [{ name: 'Ketchup', variants: ['14 oz bottle', '32 oz bottle'] }], priceRange: [2, 4] },
        { brand: 'Hellmann\'s', products: [{ name: 'Mayonnaise', variants: ['15 oz jar', '30 oz jar'] }], priceRange: [3, 5] },
        { brand: 'French\'s', products: [{ name: 'Mustard', variants: ['8 oz bottle', '14 oz bottle'] }], priceRange: [1, 3] },
        { brand: 'Hidden Valley', products: [{ name: 'Ranch Dressing', variants: ['12 oz bottle', '24 oz bottle'] }], priceRange: [3, 5] },
        { brand: 'Lee Kum Kee', products: [{ name: 'Soy Sauce', variants: ['10 oz bottle', '20 oz bottle'] }, { name: 'Hoisin Sauce', variants: ['8.5 oz bottle', '20 oz bottle'] }], priceRange: [2, 5] },
        { brand: 'Kikkoman', products: [{ name: 'Teriyaki Sauce', variants: ['10 oz bottle', '20 oz bottle'] }, { name: 'Mirin', variants: ['10 oz bottle', '20 oz bottle'] }], priceRange: [3, 6] },
        { brand: 'Laoganma', products: [{ name: 'Chili Crisp', variants: ['7.41 oz jar', '14 oz jar'] }], priceRange: [4, 8] }
    ],
    Snacks: [
        { brand: 'Kellogg\'s', products: [{ name: 'Pop-Tarts', variants: ['8-pack', '12-pack'] }], priceRange: [2, 4] },
        { brand: 'Nabisco', products: [{ name: 'Ritz Crackers', variants: ['13.7 oz box', 'Family Size'] }], priceRange: [3, 5] },
        { brand: 'Planters', products: [{ name: 'Peanuts', variants: ['16 oz jar', '32 oz jar'] }], priceRange: [3, 6] },
        { brand: 'Nature Valley', products: [{ name: 'Granola Bars', variants: ['6-pack', '12-pack'] }], priceRange: [3, 5] },
        { brand: 'Lay\'s', products: [{ name: 'Chips', variants: ['single bag', 'party size bag'] }], priceRange: [2, 4] },
        { brand: 'Doritos', products: [{ name: 'Chips', variants: ['single bag', 'party size bag'] }], priceRange: [2, 4] },
        { brand: 'Cheez-It', products: [{ name: 'Crackers', variants: ['8 oz box', '12 oz box'] }], priceRange: [3, 5] },
        { brand: 'Oreos', products: [{ name: 'Cookies', variants: ['single pack', 'family size'] }], priceRange: [3, 5] },
        { brand: 'Pringles', products: [{ name: 'Chips', variants: ['single can', '3-pack'] }], priceRange: [2, 4] }
    ],
    FrozenFoods: [
        { brand: 'DiGiorno', products: [{ name: 'Frozen Pizza', variants: ['single', '2-pack'] }], priceRange: [5, 8] },
        { brand: 'Ben & Jerry\'s', products: [{ name: 'Ice Cream', variants: ['pint', 'quart'] }], priceRange: [4, 6] },
        { brand: 'Totino\'s', products: [{ name: 'Frozen Pizza', variants: ['single', 'party pack'] }], priceRange: [3, 5] },
        { brand: 'Stouffer\'s', products: [{ name: 'Frozen Meals', variants: ['single', 'family size'] }], priceRange: [3, 6] },
        { brand: 'Amy\'s', products: [{ name: 'Frozen Meals', variants: ['single', 'family size'] }], priceRange: [4, 7] },
        { brand: 'PF Chang\'s', products: [{ name: 'Chicken Stir Fry', variants: ['20 oz bag', '30 oz family size'] }, { name: 'Beef and Broccoli', variants: ['22 oz bag', '30 oz family size'] }], priceRange: [6, 10] },
        { brand: 'Tai Pei', products: [{ name: 'General Tso\'s Chicken', variants: ['11 oz bowl', '20 oz bag'] }, { name: 'Sweet & Sour Chicken', variants: ['11 oz bowl', '20 oz bag'] }], priceRange: [3, 7] }
    ],
    Pantry: [
        { brand: 'Barilla', products: [{ name: 'Pasta', variants: ['16 oz box', '32 oz box'] }], priceRange: [1, 3] },
        { brand: 'Uncle Ben\'s', products: [{ name: 'Rice', variants: ['16 oz bag', '32 oz bag'] }], priceRange: [2, 4] },
        { brand: 'Kellogg\'s', products: [{ name: 'Cereal', variants: ['12 oz box', '18 oz box'] }], priceRange: [3, 5] },
        { brand: 'Quaker', products: [{ name: 'Oats', variants: ['18 oz canister', '42 oz canister'] }], priceRange: [2, 4] },
        { brand: 'Pillsbury', products: [{ name: 'Flour', variants: ['5 lb bag', '10 lb bag'] }, { name: 'Cake Mix', variants: ['15 oz box', '18 oz box'] }], priceRange: [2, 4] },
        { brand: 'Hunt\'s', products: [{ name: 'Tomato Paste', variants: ['6 oz can', '12 oz can'] }, { name: 'Diced Tomatoes', variants: ['14.5 oz can', '28 oz can'] }], priceRange: [1, 3] },
        { brand: 'S&W', products: [{ name: 'Garbanzo Beans', variants: ['15 oz can', '4-pack'] }, { name: 'Black Beans', variants: ['15 oz can', '4-pack'] }], priceRange: [1, 4] },
        { brand: 'Kikkoman', products: [{ name: 'Soy Sauce', variants: ['10 oz bottle', '20 oz bottle'] }], priceRange: [2, 5] },
        { brand: 'Old El Paso', products: [{ name: 'Taco Shells', variants: ['12-pack', '18-pack'] }, { name: 'Refried Beans', variants: ['16 oz can', '28 oz can'] }], priceRange: [2, 5] },
        { brand: 'Goya', products: [{ name: 'Red Kidney Beans', variants: ['15 oz can', '4-pack'] }, { name: 'Chickpeas', variants: ['15 oz can', '4-pack'] }, { name: 'Coconut Milk', variants: ['13.5 oz can', '6-pack'] }], priceRange: [1, 4] },
        { brand: 'Roland', products: [{ name: 'Quinoa', variants: ['12 oz bag', '24 oz bag'] }, { name: 'Couscous', variants: ['10 oz box', '2 lb bag'] }], priceRange: [3, 6] },
        { brand: 'Bar Harbor', products: [{ name: 'Clam Juice', variants: ['8 oz bottle', '16 oz bottle'] }, { name: 'Fish Stock', variants: ['15 oz can', '32 oz carton'] }], priceRange: [2, 5] },
        { brand: 'Swanson', products: [{ name: 'Chicken Broth', variants: ['14 oz can', '32 oz carton'] }, { name: 'Beef Broth', variants: ['14 oz can', '32 oz carton'] }], priceRange: [2, 4] }
    ],
    CannedGoods: [
        { brand: 'Del Monte', products: [{ name: 'Green Beans', variants: ['14.5 oz can', '4-pack'] }], priceRange: [1, 3] },
        { brand: 'Campbell\'s', products: [{ name: 'Tomato Soup', variants: ['10.75 oz can', '4-pack'] }], priceRange: [1, 3] },
        { brand: 'Progresso', products: [{ name: 'Chicken Noodle Soup', variants: ['19 oz can', '4-pack'] }], priceRange: [2, 4] },
        { brand: 'Bush\'s', products: [{ name: 'Baked Beans', variants: ['16 oz can', '28 oz can'] }], priceRange: [2, 4] },
        { brand: 'Hunt\'s', products: [{ name: 'Crushed Tomatoes', variants: ['28 oz can', '4-pack'] }, { name: 'Tomato Sauce', variants: ['15 oz can', '29 oz can'] }], priceRange: [2, 4] },
        { brand: 'RO*TEL', products: [{ name: 'Diced Tomatoes & Green Chilies', variants: ['10 oz can', '3-pack'] }], priceRange: [1, 3] }
    ],
    MeatAlternatives: [
        { brand: 'MorningStar Farms', products: [{ name: 'Veggie Burgers', variants: ['4-pack', '8-pack'] }, { name: 'Chik\'n Nuggets', variants: ['10 oz bag', '16 oz bag'] }], priceRange: [4, 7] },
        { brand: 'Beyond Meat', products: [{ name: 'Plant-Based Ground Beef', variants: ['16 oz', '2-pack'] }, { name: 'Plant-Based Sausage', variants: ['4-pack', '8-pack'] }], priceRange: [7, 12] }
    ],
    Eggs: [
        { brand: 'Eggland\'s Best', products: [{ name: 'Large Eggs', variants: ['dozen', '18-pack'] }, { name: 'Cage-Free Eggs', variants: ['dozen', '18-pack'] }], priceRange: [3, 6] }
    ],
    GrainsAndPasta: [
        { brand: 'Ancient Harvest', products: [{ name: 'Quinoa', variants: ['12 oz bag', '24 oz bag'] }, { name: 'Polenta', variants: ['18 oz roll', '24 oz roll'] }], priceRange: [3, 6] },
        { brand: 'Ronzoni', products: [{ name: 'Elbow Macaroni', variants: ['16 oz box', '32 oz box'] }, { name: 'Spaghetti', variants: ['16 oz box', '32 oz box'] }], priceRange: [1, 3] }
    ],
    
    NutsAndSeeds: [
        { brand: 'Blue Diamond', products: [{ name: 'Almonds', variants: ['6 oz bag', '16 oz bag'] }, { name: 'Smokehouse Almonds', variants: ['6 oz bag', '16 oz bag'] }], priceRange: [3, 8] },
        { brand: 'Bob\'s Red Mill', products: [{ name: 'Chia Seeds', variants: ['16 oz bag', '32 oz bag'] }, { name: 'Flaxseed Meal', variants: ['16 oz bag', '32 oz bag'] }], priceRange: [4, 9] }
    ],
    
    OilsAndVinegars: [
        { brand: 'Colavita', products: [{ name: 'Extra Virgin Olive Oil', variants: ['17 oz bottle', '34 oz bottle'] }, { name: 'Balsamic Vinegar', variants: ['8.5 oz bottle', '17 oz bottle'] }], priceRange: [4, 12] },
        { brand: 'Pompeian', products: [{ name: 'Canola Oil', variants: ['16 oz bottle', '48 oz bottle'] }, { name: 'Red Wine Vinegar', variants: ['16 oz bottle', '32 oz bottle'] }], priceRange: [2, 6] }
    ],
    
    FrozenProduce: [
        { brand: 'Cascadian Farm', products: [{ name: 'Frozen Mixed Berries', variants: ['10 oz bag', '32 oz bag'] }, { name: 'Frozen Green Beans', variants: ['10 oz bag', '16 oz bag'] }], priceRange: [3, 7] },
        { brand: 'Birds Eye', products: [{ name: 'Frozen Corn', variants: ['10 oz bag', '16 oz bag'] }, { name: 'Frozen Spinach', variants: ['10 oz bag', '16 oz bag'] }], priceRange: [2, 5] }
    ],
    
    Cheese: [
        { brand: 'Tillamook', products: [{ name: 'Cheddar Cheese', variants: ['8 oz block', '2 lb block'] }, { name: 'Colby Jack Cheese', variants: ['8 oz block', '2 lb block'] }], priceRange: [4, 10] },
        { brand: 'BelGioioso', products: [{ name: 'Mozzarella Cheese', variants: ['8 oz ball', '16 oz ball'] }, { name: 'Parmesan Cheese', variants: ['8 oz wedge', '16 oz wedge'] }], priceRange: [5, 12] },
        { brand: 'Polly-O', products: [{ name: 'Ricotta Cheese', variants: ['15 oz container', '32 oz container'] }], priceRange: [4, 7] },
        { brand: 'Sargento', products: [{ name: 'Parmesan Cheese', variants: ['5 oz grated', '8 oz shredded'] }], priceRange: [3, 6] }
    ],
    
    BreakfastItems: [
        { brand: 'Kodiak Cakes', products: [{ name: 'Pancake Mix', variants: ['20 oz box', '45 oz box'] }, { name: 'Oatmeal', variants: ['6-pack', '12-pack'] }], priceRange: [4, 8] },
        { brand: 'Aunt Jemima', products: [{ name: 'Pancake Syrup', variants: ['24 oz bottle', '36 oz bottle'] }, { name: 'Pancake & Waffle Mix', variants: ['32 oz box', '64 oz box'] }], priceRange: [3, 6] }
    ],
    BreadAndPastry: [
        { brand: 'Nature\'s Own', products: [{ name: 'Brioche Bread', variants: ['loaf', '6-pack rolls'] }, { name: 'Baguette', variants: ['single', '2-pack'] }], priceRange: [3, 5] },
        { brand: 'La Brea Bakery', products: [{ name: 'Ciabatta Rolls', variants: ['4-pack', '8-pack'] }, { name: 'Sourdough Bread', variants: ['loaf', '2-pack'] }], priceRange: [4, 7] }
    ],
    Beverages: [
        { brand: 'Ocean Spray', products: [{ name: 'Cranberry Juice', variants: ['32 oz bottle', '64 oz bottle'] }, { name: 'Cran-Grape Juice', variants: ['32 oz bottle', '64 oz bottle'] }], priceRange: [3, 6] },
        { brand: 'Snapple', products: [{ name: 'Iced Tea', variants: ['16 oz bottle', '6-pack'] }, { name: 'Fruit Punch', variants: ['16 oz bottle', '6-pack'] }], priceRange: [2, 5] }
    ],
    SaucesAndPastes: [
        { brand: 'Mutti', products: [{ name: 'Tomato Paste', variants: ['4.5 oz tube', '9 oz jar'] }, { name: 'Passata', variants: ['24 oz bottle', '32 oz bottle'] }], priceRange: [2, 6] },
        { brand: 'Pomi', products: [{ name: 'Tomato Sauce', variants: ['26 oz carton', '52 oz carton'] }, { name: 'Marinara Sauce', variants: ['24 oz bottle', '32 oz bottle'] }], priceRange: [3, 7] }
    ],
    Miscellaneous: [
        { brand: 'Bob\'s Red Mill', products: [{ name: 'Rolled Oats', variants: ['16 oz bag', '32 oz bag'] }, { name: 'Almond Flour', variants: ['16 oz bag', '32 oz bag'] }], priceRange: [4, 8] }
    ]
};

const stores = ['Safeway', 'Walmart', 'Target'];

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateAllGroceryItems(items) {
    const groceryData = [];

    stores.forEach(store => {
        Object.keys(items).forEach(category => {
            items[category].forEach(brandAndProducts => {
                brandAndProducts.products.forEach(productData => {
                    productData.variants.forEach(variant => {
                        const priceRange = brandAndProducts.priceRange;
                        const price = (Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]).toFixed(2);
                        const productName = `${brandAndProducts.brand} ${productData.name} (${variant})`;

                        groceryData.push({
                            store: store,
                            category: category,
                            name: productName,
                            price: price,
                        });
                    });
                });
            });
        });
    });

    return groceryData;
}

// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB');

        // Generate grocery items
        const groceryData = generateAllGroceryItems(items);

        // Save data to MongoDB without duplicating existing items
        for (const item of groceryData) {
            try {
                await GroceryItem.updateOne(
                    { store: item.store, name: item.name }, // Filter: match by store and name
                    { $setOnInsert: item }, // Insert if not exists
                    { upsert: true } // If exists, do nothing; otherwise, insert
                );
                console.log(`Processed item: ${item.name} at ${item.store}`);
            } catch (error) {
                console.error(`Error processing item: ${item.name} at ${item.store}:`, error);
            }
        }

        console.log('Data successfully processed and saved to MongoDB');
        mongoose.connection.close(); // Close the connection after saving
    })
    .catch(error => console.error('MongoDB connection error:', error));