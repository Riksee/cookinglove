const sqlite3 = require('sqlite3').verbose();

// Create a new SQLite database (or open an existing one)
const db = new sqlite3.Database('./recipes.db');

// Create the recipes table
db.serialize(() => {
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
      console.error('Error creating table:', err);
    } else {
      console.log('Database setup complete.');
    }
  });
});

