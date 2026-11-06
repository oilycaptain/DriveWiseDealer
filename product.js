(() => {
  const inventory = [...window.DWD_INVENTORY];
  const state = { search: '', brands: new Set(), bodies: new Set(), fuels: new Set(), min: '', max: '', sort: 'featured' };
  const grid = document.getElementById('inventoryGrid');
  const resultCount = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');
  const activeFilters = document.getElementById('activeFilters');

  const unique = key => [...new Set(inventory.map(item => item[key]))].sort();
  const counts = (key, value) => inventory.filter(item => item[key] === value).length;
  const renderOptions = (containerId, values, key) => {
    document.getElementById(containerId).innerHTML = values.map(value => `<label class="check-option"><span><input type="checkbox" value="${value}" data-filter-key="${key}">${value}</span><span class="filter-count">${counts(key, value)}</span></label>`).join('');
  };
  renderOptions('brandFilters', unique('brand'), 'brand');
  renderOptions('bodyFilters', unique('body'), 'body');
  renderOptions('fuelFilters', unique('fuel'), 'fuel');

  const params = new URLSearchParams(location.search);
  const urlBrand = params.get('brand');
  const urlBody = params.get('body');
  const urlFuel = params.get('fuel');
  const urlMax = params.get('max');
  if (urlBrand) state.brands.add(urlBrand);
  if (urlBody) state.bodies.add(urlBody);
  if (urlFuel) state.fuels.add(urlFuel);
  if (urlMax) state.max = urlMax;

  document.querySelectorAll('[data-filter-key]').forEach(input => {
    const set = input.dataset.filterKey === 'brand' ? state.brands : input.dataset.filterKey === 'body' ? state.bodies : state.fuels;
    input.checked = set.has(input.value);
    input.addEventListener('change', () => {
      input.checked ? set.add(input.value) : set.delete(input.value);
      render();
    });
  });
  document.getElementById('maxPrice').value = state.max;

  const getFiltered = () => {
    const search = state.search.trim().toLowerCase();
    let list = inventory.filter(car => {
      const text = `${car.brand} ${car.model} ${car.year} ${car.body} ${car.fuel}`.toLowerCase();
      return (!search || text.includes(search)) &&
        (!state.brands.size || state.brands.has(car.brand)) &&
        (!state.bodies.size || state.bodies.has(car.body)) &&
        (!state.fuels.size || state.fuels.has(car.fuel)) &&
        (!state.min || car.price >= Number(state.min)) &&
        (!state.max || car.price <= Number(state.max));
    });
    const sorters = {
      'featured': (a,b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
      'price-asc': (a,b) => a.price - b.price,
      'price-desc': (a,b) => b.price - a.price,
      'year-desc': (a,b) => b.year - a.year,
      'name': (a,b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
    };
    return list.sort(sorters[state.sort]);
  };

  const renderChips = () => {
    const chips = [];
    state.brands.forEach(value => chips.push(value));
    state.bodies.forEach(value => chips.push(value));
    state.fuels.forEach(value => chips.push(value));
    if (state.min) chips.push(`From ${window.DWD.money(Number(state.min))}`);
    if (state.max) chips.push(`Up to ${window.DWD.money(Number(state.max))}`);
    if (state.search) chips.push(`“${state.search}”`);
    activeFilters.innerHTML = chips.map(chip => `<span class="filter-chip">${chip}</span>`).join('');
  };

  function render() {
    const list = getFiltered();
    grid.innerHTML = list.map(car => window.DWD.vehicleCard(car)).join('');
    resultCount.textContent = `${list.length} of ${inventory.length} vehicles shown`;
    noResults.classList.toggle('show', !list.length);
    renderChips();
    window.DWD.refreshReveal();
  }

  document.getElementById('searchInput').addEventListener('input', e => { state.search = e.target.value; render(); });
  document.getElementById('sortSelect').addEventListener('change', e => { state.sort = e.target.value; render(); });
  document.getElementById('minPrice').addEventListener('input', e => { state.min = e.target.value; render(); });
  document.getElementById('maxPrice').addEventListener('input', e => { state.max = e.target.value; render(); });
  document.getElementById('resetFilters').addEventListener('click', () => {
    state.search = ''; state.brands.clear(); state.bodies.clear(); state.fuels.clear(); state.min = ''; state.max = ''; state.sort = 'featured';
    document.getElementById('searchInput').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = 'featured';
    document.querySelectorAll('[data-filter-key]').forEach(input => input.checked = false);
    history.replaceState({}, '', 'product.html');
    render();
  });

  const panel = document.getElementById('filterPanel');
  document.getElementById('openFilters').addEventListener('click', () => panel.classList.add('open'));
  document.getElementById('applyMobileFilters').addEventListener('click', () => panel.classList.remove('open'));

  render();
})();
