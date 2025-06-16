const searchInput = document.getElementById('searchInput');
    const recipeCards = document.querySelectorAll('.recipe-card');

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();

      recipeCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(query) || description.includes(query)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });