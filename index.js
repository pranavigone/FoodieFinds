const express = require('express');
const cors = require('cors');
const sqlite = require('sqlite3').verbose();
let { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

//get restaurants
async function getRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}
app.get('/restaurants', async (req, res) => {
  try {
    let result = await getRestaurants();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found:' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurants by id
async function getRestaurantsById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await getRestaurantsById(id);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found with id:' + id });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurants by cuisine
async function getRestaurantsBycuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);
  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await getRestaurantsBycuisine(cuisine);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found with cuisine:' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurants by filter
async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating=? AND isLuxury=?';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response };
}
app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  try {
    let result = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);
    if (result.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found with cuisine:' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get restaurants by cuisine
async function getRestaurantsSortedByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query);
  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await getRestaurantsSortedByRating();
    if (result.restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found:' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//get all dishes
async function getDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let result = await getDishes();
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found:' });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get dishes by id
async function getDishesById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);
  return { dishes: response };
}
app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let result = await getDishesById(id);
    if (result.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found with id:' + id });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get dishes by filter
async function filterDishes(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}
app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  try {
    let result = await filterDishes(isVeg);
    if (result.dishes.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found with cuisine:' + cuisine });
    }
    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get dishes /dishes/sort-by-price
async function getDishesSortByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await getDishesSortByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
