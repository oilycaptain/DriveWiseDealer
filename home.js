(() => {
  const featuredContainer = document.getElementById('featuredVehicles');
  const featured = window.DWD_INVENTORY.filter(car => car.featured).slice(0, 6);
  featuredContainer.innerHTML = featured.map(car => window.DWD.vehicleCard(car)).join('');

  const interest = document.getElementById('interest');
  const savedInterest = sessionStorage.getItem('dwdVehicleInterest');
  window.DWD_INVENTORY.forEach(car => {
    const option = document.createElement('option');
    option.value = car.id;
    option.textContent = `${car.year} ${car.brand} ${car.model}`;
    interest.appendChild(option);
  });
  if (savedInterest) {
    const match = window.DWD_INVENTORY.find(car => `${car.year} ${car.brand} ${car.model}` === savedInterest);
    if (match) interest.value = match.id;
    sessionStorage.removeItem('dwdVehicleInterest');
  }

  document.getElementById('quickSearch').addEventListener('submit', event => {
    event.preventDefault();
    const params = new URLSearchParams();
    const brand = document.getElementById('quickBrand').value;
    const body = document.getElementById('quickBody').value;
    const budget = document.getElementById('quickBudget').value;
    if (brand) params.set('brand', brand);
    if (body) params.set('body', body);
    if (budget) params.set('max', budget);
    window.location.href = `product.html${params.toString() ? `?${params}` : ''}`;
  });

  window.DWD.refreshReveal();
})();
