const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Set up SQLite database
const db = new sqlite3.Database('recipes.db', (err) => {
  if (err) {
    console.error('Error opening database: ', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create 'recipes' table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL
  )
`, (err) => {
  if (err) {
    console.error('Error creating table: ', err.message);
  } else {
    console.log('Table "recipes" is ready.');
  }
});

// Route to handle recipe submission (POST)
app.post('/submit-recipe', (req, res) => {
  const { title, image, ingredients, instructions } = req.body;

  // Validate incoming data
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('Received data:', { title, image, ingredients, instructions });

  // SQL query to insert recipe into the database
  const query = `
    INSERT INTO recipes (title, image, ingredients, instructions)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [title, image, ingredients, instructions], function (err) {
    if (err) {
      console.error("Database Error: ", err.message);
      return res.status(500).json({ message: 'Failed to submit recipe', error: err.message });
    }
    // Send response back with success message and recipe id
    res.status(200).json({ message: 'Recipe submitted successfully', recipeId: this.lastID });
  });
});

// Route to list all recipes (GET)
app.get('/recipes', (req, res) => {
  const query = 'SELECT * FROM recipes';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database Error: ', err.message);
      return res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
    }
    res.status(200).json({ recipes: rows });
  });
});

// Route to get a specific recipe by ID (GET)
app.get('/recipe/:id', (req, res) => {
  const recipeId = req.params.id;
  const query = 'SELECT * FROM recipes WHERE id = ?';
  
  db.get(query, [recipeId], (err, row) => {
    if (err) {
      console.error('Database Error: ', err.message);
      return res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
    }
    
    if (row) {
      res.status(200).json({ recipe: row });
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  });
});

// Route to handle deleting a recipe by ID (DELETE)
app.delete('/delete-recipe/:id', (req, res) => {
  const recipeId = req.params.id;
  const query = 'DELETE FROM recipes WHERE id = ?';

  db.run(query, [recipeId], function (err) {
    if (err) {
      console.error('Database Error: ', err.message);
      return res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.status(200).json({ message: 'Recipe deleted successfully' });
  });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
