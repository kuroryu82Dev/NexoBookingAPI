const socket = io();
const liveStatus = document.querySelector('#live-status');
const escapeHtml = (value) =>
  String(value ?? '').replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      })[character]
  );

async function readApi(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()).data;
}

function serviceCard(service) {
  return `<article class="card">
  <div class="card-heading">
  <span class="category">${escapeHtml(service.category)}</span><span class="availability ${service.available ? '' : 'unavailable'}">${service.available ? 'Disponible' : 'No disponible'}</span>
  </div>
  <h2>${escapeHtml(service.name)}</h2>
  <p>${escapeHtml(service.description)}</p>
  <dl>
  <div><dt>Duración</dt><dd>${escapeHtml(service.duration)} min</dd></div><div><dt>Precio</dt><dd>$${escapeHtml(service.price)}</dd></div></dl></article>`;
}

function bookingCard(booking) {
  return `<article class="card"><div class="card-heading"><span class="category">${escapeHtml(booking.status)}</span></div><h3>${escapeHtml(booking.clientName)}</h3><p>${escapeHtml(booking.clientEmail)}</p><dl><div><dt>Fecha</dt><dd>${escapeHtml(booking.date)}</dd></div><div><dt>Hora</dt><dd>${escapeHtml(booking.time)}</dd></div></dl></article>`;
}

async function updateServices() {
  const services = await readApi('/api/services?limit=100');
  const list = document.querySelector('#services-list');
  if (list)
    list.innerHTML = services.length
      ? services.map(serviceCard).join('')
      : '<p class="empty">Todavía no hay servicios registrados.</p>';
  const available = document.querySelector('#available-services');
  if (available) {
    const items = services.filter((service) => service.available);
    available.innerHTML = items.length
      ? items
          .map(
            (service) =>
              `<li><strong>${escapeHtml(service.name)}</strong><span>${escapeHtml(service.duration)} min · $${escapeHtml(service.price)}</span></li>`
          )
          .join('')
      : '<li>No hay servicios disponibles.</li>';
  }
}

async function updateBookings() {
  const list = document.querySelector('#bookings-list');
  if (!list) return;
  const bookings = await readApi('/api/bookings');
  list.innerHTML = bookings.length
    ? bookings.map(bookingCard).join('')
    : '<p class="empty">No hay reservas registradas.</p>';
}

async function showUpdate(message, update) {
  try {
    await update();
    liveStatus.textContent = message;
    liveStatus.classList.add('updated');
    window.setTimeout(() => liveStatus.classList.remove('updated'), 2500);
  } catch {
    liveStatus.textContent = 'No se pudo sincronizar';
  }
}

socket.on('services:changed', () => showUpdate('Servicios actualizados', updateServices));
socket.on('bookings:changed', () => showUpdate('Reservas actualizadas', updateBookings));
