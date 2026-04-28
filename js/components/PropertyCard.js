const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const formatPrice = (prop) => {
  if (prop.precio === null || prop.precio === undefined || prop.precio === '' || Number.isNaN(Number(prop.precio))) return 'Consultar';
  const amount = Number(prop.precio).toLocaleString('es-AR');
  return `${escapeHtml(prop.moneda || 'ARS')} ${amount}`;
};

export function PropertyCard(prop) {
  const img = prop.imagenes?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';
  return `
    <article class="card" onclick="window.openPropertyDetail('${escapeHtml(prop.id)}')">
      <div class="card-img-container">
        <div class="badge-tipo">${escapeHtml(prop.operacion || 'Consultar')} | ${escapeHtml(prop.tipo || 'Propiedad')}</div>
        ${prop.destacada ? '<div class="badge-destacada">DESTACADA</div>' : ''}
        <img src="${escapeHtml(img)}" alt="${escapeHtml(prop.titulo)}" loading="lazy">
      </div>
      <div class="card-content">
        <div class="card-location">📍 ${escapeHtml(prop.ubicacion || 'Consultar ubicación')}</div>
        <h3 class="card-title">${escapeHtml(prop.titulo || 'Propiedad disponible')}</h3>
        <div class="card-price">${formatPrice(prop)}</div>
        <div class="card-specs">
          <div class="spec-item"><span class="spec-val">${escapeHtml(prop.ambientes || '-')}</span><span class="spec-label">Amb.</span></div>
          <div class="spec-item"><span class="spec-val">${escapeHtml(prop.dormitorios || '-')}</span><span class="spec-label">Dorm.</span></div>
          <div class="spec-item"><span class="spec-val">${escapeHtml(prop.sup_total || '-')}</span><span class="spec-label">m² total</span></div>
        </div>
        <button class="btn-card" type="button">Ver ficha</button>
      </div>
    </article>
  `;
}

export function PropertyDetail(prop) {
  const images = prop.imagenes?.length ? prop.imagenes : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'];
  const features = prop.caracteristicas?.length ? prop.caracteristicas : [];
  const whatsapp = prop.whatsapp || '5493795066314';
  const text = encodeURIComponent(`Hola, quiero consultar por: ${prop.titulo}`);
  return `
    <div class="modal-overlay detail-overlay" onclick="window.closeDetail(event)">
      <div class="detail-modal">
        <button class="close-btn detail-close" onclick="window.closeDetail()">&times;</button>
        <div class="detail-gallery">
          <img class="detail-main-img" src="${escapeHtml(images[0])}" alt="${escapeHtml(prop.titulo)}" id="detail-main-img">
          <div class="detail-thumbs">
            ${images.map((img, index) => `<button class="thumb-btn" onclick="window.setDetailImage('${escapeHtml(img)}')"><img src="${escapeHtml(img)}" alt="Imagen ${index + 1}"></button>`).join('')}
          </div>
        </div>
        <div class="detail-content">
          <span class="status-pill">${escapeHtml(prop.estado || 'Disponible')}</span>
          <h2>${escapeHtml(prop.titulo)}</h2>
          <p class="detail-location">📍 ${escapeHtml(prop.ubicacion || 'Consultar')}</p>
          <p class="detail-price">${formatPrice(prop)}${prop.expensas ? ` <span>+ expensas ${Number(prop.expensas).toLocaleString('es-AR')}</span>` : ''}</p>
          <div class="detail-specs">
            <span>${escapeHtml(prop.ambientes || '-')} ambientes</span>
            <span>${escapeHtml(prop.dormitorios || '-')} dormitorio/s</span>
            <span>${escapeHtml(prop.banios || '-')} baño/s</span>
            <span>${escapeHtml(prop.cochera || 'Consultar cochera')}</span>
          </div>
          <p class="detail-description">${escapeHtml(prop.descripcion || '')}</p>
          ${features.length ? `<div class="features-list">${features.map(f => `<span>${escapeHtml(f)}</span>`).join('')}</div>` : ''}
          <div class="detail-actions">
            <a class="btn-primary" href="https://wa.me/${escapeHtml(whatsapp)}?text=${text}" target="_blank" rel="noopener">Consultar por WhatsApp</a>
            <a class="btn-secondary dark" href="#contacto" onclick="window.closeDetail()">Ver contacto</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
