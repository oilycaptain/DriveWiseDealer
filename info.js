(() => {
  const params = new URLSearchParams(location.search);
  const requestedId = params.get('id') || document.body.dataset.defaultVehicle || 'corolla';
  const car = window.DWD_INVENTORY.find(item => item.id === requestedId) || window.DWD_INVENTORY[0];
  const title = `${car.year} ${car.brand} ${car.model}`;
  document.title = `${title} | Drive Wise Dealer`;
  document.getElementById('crumbName').textContent = title;
  document.getElementById('vehicleName').textContent = title;
  document.getElementById('vehicleBadge').textContent = car.badge;
  document.getElementById('vehicleBody').textContent = car.body;
  document.getElementById('vehicleFuel').textContent = car.fuel;
  document.getElementById('vehiclePrice').textContent = window.DWD.money(car.price);
  document.getElementById('financeEstimate').textContent = `Estimated from ${window.DWD.money(Math.round(car.price / 60))}/month · sample only`;
  document.getElementById('specYear').textContent = car.year;
  document.getElementById('specMileage').textContent = car.mileage;
  document.getElementById('specTransmission').textContent = car.transmission;
  document.getElementById('specEngine').textContent = car.engine;
  document.getElementById('vehicleDescription').textContent = car.description;

  const specs = [
    ['Brand', car.brand], ['Model', car.model], ['Body style', car.body], ['Fuel type', car.fuel],
    ['Engine', car.engine], ['Power', car.power], ['Transmission', car.transmission], ['Seats', car.seats],
    ['Mileage', car.mileage], ['Exterior color', car.color]
  ];
  document.getElementById('specTable').innerHTML = specs.map(([label, value]) => `<div class="spec-row"><span>${label}</span><strong>${value}</strong></div>`).join('');

  const gallery = [...new Set(car.gallery.filter(Boolean))];
  const mainImage = document.getElementById('mainVehicleImage');
  const counter = document.getElementById('galleryCounter');
  const thumbnailRow = document.getElementById('thumbnailRow');
  mainImage.src = gallery[0] || car.image;
  mainImage.alt = title;
  thumbnailRow.innerHTML = gallery.map((src, index) => `<button class="thumbnail ${index === 0 ? 'active' : ''}" type="button" data-gallery-index="${index}"><img src="${src}" alt="${title} view ${index + 1}"></button>`).join('');
  counter.textContent = `1 / ${gallery.length}`;
  thumbnailRow.querySelectorAll('.thumbnail').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.galleryIndex);
    mainImage.src = gallery[index];
    counter.textContent = `${index + 1} / ${gallery.length}`;
    thumbnailRow.querySelectorAll('.thumbnail').forEach(item => item.classList.toggle('active', item === button));
  }));

  const related = window.DWD_INVENTORY.filter(item => item.id !== car.id && (item.brand === car.brand || item.body === car.body)).slice(0, 3);
  document.getElementById('relatedVehicles').innerHTML = related.map(item => window.DWD.vehicleCard(item)).join('');

  document.getElementById('saveVehicle').addEventListener('click', event => {
    event.currentTarget.classList.toggle('active');
    window.DWD.showToast(event.currentTarget.classList.contains('active') ? `${title} saved to favorites.` : `${title} removed from favorites.`);
  });
  document.getElementById('shareVehicle').addEventListener('click', async () => {
    const shareData = { title, text: `View the ${title} at Drive Wise Dealer.`, url: location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (_) {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(location.href);
      window.DWD.showToast('Vehicle link copied to clipboard.');
    } else {
      window.DWD.showToast('Copy the page address to share this vehicle.');
    }
  });
  const inquiry = action => {
    sessionStorage.setItem('dwdVehicleInterest', title);
    window.DWD.showToast(`${action} request started for the ${title}.`);
    setTimeout(() => { location.href = 'home.html#contact'; }, 650);
  };
  document.getElementById('testDriveButton').addEventListener('click', () => inquiry('Test drive'));
  document.getElementById('inquiryButton').addEventListener('click', () => inquiry('Vehicle inquiry'));
  window.DWD.refreshReveal();
})();
