const escapeAttr = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export function Modal(editingProp = null) {
  const isEdit = Boolean(editingProp);
  const p = editingProp || {};
  const images = p.imagenes || [];
  const features = (p.caracteristicas || []).join('\n');

  return `
    <div id="modal-overlay" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <div>
            <span class="section-kicker">${isEdit ? 'Editar' : 'Nueva propiedad'}</span>
            <h2>${isEdit ? 'Editar propiedad' : 'Crear propiedad'}</h2>
          </div>
          <button onclick="window.closeModal()" class="close-btn" type="button">&times;</button>
        </div>
        <form id="prop-form" class="modal-form">
          <div class="form-grid">
            <div class="form-group wide">
              <label>Título</label>
              <input type="text" id="f-titulo" value="${escapeAttr(p.titulo || '')}" required>
            </div>
            <div class="form-group wide">
              <label>Ubicación</label>
              <input type="text" id="f-ubicacion" value="${escapeAttr(p.ubicacion || '')}" required>
            </div>
            <div class="form-group">
              <label>Precio</label>
              <input type="number" id="f-precio" value="${escapeAttr(p.precio ?? '')}" min="0" step="1">
            </div>
            <div class="form-group">
              <label>Expensas</label>
              <input type="number" id="f-expensas" value="${escapeAttr(p.expensas ?? '')}" min="0" step="1">
            </div>
            <div class="form-group">
              <label>Moneda</label>
              <select id="f-moneda">
                <option value="ARS" ${p.moneda === 'ARS' ? 'selected' : ''}>ARS</option>
                <option value="USD" ${p.moneda === 'USD' ? 'selected' : ''}>USD</option>
                <option value="Consultar" ${p.moneda === 'Consultar' ? 'selected' : ''}>Consultar</option>
              </select>
            </div>
            <div class="form-group">
              <label>Operación</label>
              <select id="f-operacion">
                ${['Venta','Alquiler','Alquiler temporario','Consultar'].map(v => `<option value="${v}" ${p.operacion === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Tipo</label>
              <input type="text" id="f-tipo" value="${escapeAttr(p.tipo || '')}" placeholder="Departamento, casa, terreno...">
            </div>
            <div class="form-group">
              <label>Estado</label>
              <select id="f-estado">
                ${['Disponible','Reservado','Vendido','Alquilado','Inactivo'].map(v => `<option value="${v}" ${p.estado === v ? 'selected' : ''}>${v}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Ambientes</label>
              <input type="number" id="f-ambientes" value="${escapeAttr(p.ambientes ?? '')}" min="0">
            </div>
            <div class="form-group">
              <label>Dormitorios</label>
              <input type="number" id="f-dormitorios" value="${escapeAttr(p.dormitorios ?? '')}" min="0">
            </div>
            <div class="form-group">
              <label>Baños</label>
              <input type="number" id="f-banios" value="${escapeAttr(p.banios ?? '')}" min="0">
            </div>
            <div class="form-group">
              <label>Cochera</label>
              <input type="text" id="f-cochera" value="${escapeAttr(p.cochera || '')}">
            </div>
            <div class="form-group">
              <label>Superficie total</label>
              <input type="text" id="f-sup-total" value="${escapeAttr(p.sup_total || '')}">
            </div>
            <div class="form-group">
              <label>Superficie cubierta</label>
              <input type="text" id="f-sup-cubierta" value="${escapeAttr(p.sup_cubierta || '')}">
            </div>
            <div class="form-group">
              <label>WhatsApp</label>
              <input type="text" id="f-whatsapp" value="${escapeAttr(p.whatsapp || '5493795066314')}">
            </div>
            <div class="form-group checkbox-line">
              <input type="checkbox" id="f-destacada" ${p.destacada ? 'checked' : ''}>
              <label for="f-destacada">Marcar como destacada</label>
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <textarea id="f-descripcion" rows="5">${escapeAttr(p.descripcion || '')}</textarea>
          </div>
          <div class="form-group">
            <label>Características principales <small>(una por línea)</small></label>
            <textarea id="f-caracteristicas" rows="4">${escapeAttr(features)}</textarea>
          </div>

          <div class="form-group">
            <label>Imágenes JPG/PNG/WebP</label>
            <div class="upload-zone" id="upload-zone">
              <strong>Arrastrá imágenes acá</strong>
              <span>o hacé click para seleccionarlas. Luego podés reordenarlas arrastrando.</span>
              <input type="file" id="f-files" accept="image/jpeg,image/png,image/webp" multiple hidden>
            </div>
            <div class="image-manager" id="image-manager">
              ${images.map((img, index) => imageItem(img, index)).join('')}
            </div>
            <textarea id="f-imagenes" hidden>${escapeAttr(images.join('\n'))}</textarea>
            <small>Con Supabase conectado, las fotos se suben a Storage. Sin Supabase, quedan como respaldo local en el navegador.</small>
          </div>

          <div class="form-actions">
            <button type="button" onclick="window.closeModal()" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save">${isEdit ? 'Guardar cambios' : 'Crear propiedad'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function imageItem(src, index) {
  return `
    <div class="image-item" draggable="true" data-src="${escapeAttr(src)}">
      <span class="drag-handle">☰</span>
      <img src="${escapeAttr(src)}" alt="Imagen ${index + 1}">
      <button type="button" onclick="window.removeImageItem(this)">Eliminar</button>
    </div>
  `;
}
