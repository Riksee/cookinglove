const recipeName = document.querySelector('h2').innerText;
    const favoriteToggle = document.getElementById('favoriteToggle');
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let isFavorite = favorites.includes(recipeName);
  
    function updateButton() {
      favoriteToggle.textContent = isFavorite ? 'Remove from Favorites' : 'Save to Favorites';
    }
  
    favoriteToggle.addEventListener('click', () => {
      if (isFavorite) {
        favorites = favorites.filter(fav => fav !== recipeName);
      } else {
        favorites.push(recipeName);
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
      isFavorite = !isFavorite;
      updateButton();
    });
  
    updateButton();