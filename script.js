let people = [];

// Load data
async function loadData() {
  try {
    const res = await fetch('data.json');
    people = await res.json();
    renderPeople(people);
  } catch (err) {
    console.error('ডেটা লোড করতে সমস্যা:', err);
    document.getElementById('peopleGrid').innerHTML = '<p style="text-align:center;color:#ef4444;">ডেটা লোড করা যায়নি</p>';
  }
}

// Render cards
function renderPeople(list) {
  const grid = document.getElementById('peopleGrid');
  const noResult = document.getElementById('noResult');

  if (list.length === 0) {
    grid.innerHTML = '';
    noResult.style.display = 'block';
    return;
  }

  noResult.style.display = 'none';
  grid.innerHTML = list.map(person => `
    <div class="card" data-id="${person.id}">
      <img src="${person.mainImage}" alt="${person.name}" class="card-img" loading="lazy">
      <div class="card-name">${person.name}</div>
    </div>
  `).join('');

  // Add click events
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id);
      const person = people.find(p => p.id === id);
      if (person) openModal(person);
    });
  });
}

// Open modal
function openModal(person) {
  const overlay = document.getElementById('modalOverlay');
  document.getElementById('modalMainImg').src = person.mainImage;
  document.getElementById('modalMainImg').alt = person.name;
  document.getElementById('modalName').textContent = person.name;
  document.getElementById('modalDesc').textContent = person.description;

  const extraSection = document.getElementById('extraImagesSection');
  const extraContainer = document.getElementById('extraImages');

  // Extra images (excluding main if same)
  const extras = person.images.filter(img => img !== person.mainImage);

  if (extras.length > 0) {
    extraSection.style.display = 'block';
    extraContainer.innerHTML = extras.map(img => `
      <img src="${img}" alt="${person.name}" loading="lazy" onclick="document.getElementById('modalMainImg').src='${img}'">
    `).join('');
  } else {
    extraSection.style.display = 'none';
    extraContainer.innerHTML = '';
  }

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// Search
document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  if (!query) {
    renderPeople(people);
    return;
  }
  const filtered = people.filter(p => p.name.toLowerCase().includes(query));
  renderPeople(filtered);
});

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Init
loadData();
