const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const price = (p) => p.precio ? `${escapeHtml(p.moneda || 'ARS')} ${Number(p.precio).toLocaleString('es-AR')}` : 'Consultar';

export function AdminLogin(session, authMessage = '') {
  if (session) {
    return `
      <section class="admin-section container" id="admin-root">
        <div class="admin-header">
          <div>
            <span class="section-kicker">Administración</span>
            <h2>Panel administrativo</h2>
            <p>Gestioná propiedades, fotos, estado y orden de publicación.</p>
          </div>
          <div class="admin-actions-top">
            <button class="btn-admin secondary" onclick="window.syncFromSupabase()">Sincronizar</button>
            <button class="btn-admin danger" onclick="window.adminLogout()">Cerrar sesión</button>
            <button class="btn-admin" onclick="window.openModal()">+ Nueva propiedad</button>
          </div>
        </div>
        <div id="admin-table-root"></div>
      </section>
    `;
  }

  return `
    <section class="admin-login-section container" id="admin-root">
      <div class="admin-login-card">
        <span class="section-kicker">Acceso privado</span>
        <h2>Panel administrativo</h2>
        <p>Ingresá con el usuario creado en Supabase Auth. El panel no permite editar sin sesión iniciada.</p>
        ${authMessage ? `<div class="alert">${escapeHtml(authMessage)}</div>` : ''}
        <form id="admin-login-form" class="admin-login-form">
          <label>Email</label>
          <input id="admin-email" type="email" placeholder="tu-email@dominio.com" required autocomplete="email">
          <label>Contraseña</label>
          <input id="admin-password" type="password" placeholder="Contraseña" required autocomplete="current-password">
          <button class="btn-admin" type="submit">Ingresar</button>
        </form>
        <small>Tip: desactivá nuevos registros en Supabase y creá solo tu usuario admin.</small>
      </div>
    </section>
  `;
}

export function AdminTable(properties) {
  return `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Propiedad</th>
            <th>Ubicación</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Destacada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${properties.map((p, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${escapeHtml(p.titulo)}</strong><br><small>${escapeHtml(p.tipo || '')} - ${escapeHtml(p.operacion || '')}</small></td>
              <td>${escapeHtml(p.ubicacion || 'Consultar')}</td>
              <td>${price(p)}</td>
              <td><span class="status-admin">${escapeHtml(p.estado || 'Disponible')}</span></td>
              <td>${p.destacada ? 'Sí' : 'No'}</td>
              <td class="table-actions">
                <button onclick="window.editProp('${escapeHtml(p.id)}')">Editar</button>
                <button class="danger-text" onclick="window.deleteProp('${escapeHtml(p.id)}')">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
