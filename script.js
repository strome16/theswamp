document.addEventListener('DOMContentLoaded', () => {
  // === Footer year ===
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === URL param (?q=...) ===
  const params = new URLSearchParams(location.search);
  const qParam = params.get('q');

  // === Search & tag filtering (only runs if elements exist) ===
  const searchInput = document.getElementById('search');
  const clearBtn    = document.getElementById('clear');
  const SearchForm  = document.querySelector('.search-box');
  const albumsWrap  = document.querySelector('#albums');
  const albumCards  = Array.from(document.querySelectorAll('#albums .album'));
 
  // === Helper: filter logic (no-op if not on reviews page) ===
let noResultsEl = null;
if (albumsWrap) {
  noResultsEl = document.createElement('p');
  noResultsEl.textContent = 'No albums match your search.';
  noResultsEl.style.textAlign = 'center';
  noResultsEl.style.marginTop = '20px';
  noResultsEl.style.color = '#aab3be'
  albumsWrap.after(noResultsEl);
  noResultsEl.style.display = 'none';
}

function applyFilter(query) {
  if (!albumsWrap) return;
  const q = (query || '').toLowerCase().trim();
  let visible = 0;

albumCards.forEach(card => {
  const match = card.innerText.toLowerCase().includes(q);
  const wrapper = card.closest('.album-link') || card;
  wrapper.style.display = match ? '' : 'none';
  if (match) visible++;
});

  if (noResultsEl) noResultsEl.style.display = visible === 0 ? '' : 'none';
}

function toggleClearVisibility() {
  if (clearBtn && searchInput) {
    clearBtn.style.visibility = searchInput.value ? 'visible' : 'hidden';
  }
}

// === Helper: set search box, run filter, toggle clear visibility ===
function setSearch(query) {
  if (searchInput) searchInput.value = query;
  applyFilter(query);
  toggleClearVisibility();
  if (clearBtn && searchInput) {
    clearBtn.style.visibility = searchInput.value ? 'visible' : 'hidden';
  }
}

// === Search: live filter on reviews page; redirect elsewhere ===
if (SearchForm) {
  if (albumsWrap) {
    // live filtering on reviews page
    if (searchInput) {
      searchInput.addEventListener('input', () => setSearch(searchInput.value));
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchInput.value && clearBtn) clearBtn.click();
      });
    }

    SearchForm.addEventListener('submit', (e) => e.preventDefault());
  } else {
    // on non-reviews page, submit navigates to album-reviews/html
    SearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (searchInput?.value || '').trim();
      const url = new URL('album-reviews.html', location.href);
      if (q) url.searchParams.set('q', q);
      location.href = url.toString();
    });

    if (searchInput) searchInput.addEventListener('input', toggleClearVisibility);
  }
}


// Clear button (works everywhere, filters only on reviews page)
if (clearBtn && searchInput) {
  clearBtn.addEventListener('click', () => {
    setSearch('');
    searchInput.focus();
  });
}
toggleClearVisibility();

//Tags: filter on reviews page, navigate with ?q= on other pages
document.querySelectorAll('.tag').forEach(tag => {
  const activate = () => {
    const tagText = tag.textContent.trim();
    if (albumsWrap) {
      setSearch(tagText);
      searchInput?.focus();
    } else {
      const url = new URL('album-reviews.html', location.href);
      url.searchParams.set('q', tagText);
      location.href = url.toString();
    }
  };

  tag.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    activate();
 });

  tag.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      activate();
    }
  });
});

// Initial State
  if (albumsWrap) {
  setSearch(qParam || '');
  }
});
