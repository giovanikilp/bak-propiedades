export function Navbar(isAdminLogged = false) {
  return `
    <nav class="navbar">
      <div class="logo-container" onclick="window.scrollTo({top:0,behavior:'smooth'})" role="button" tabindex="0">
        <span class="logo">BAK</span>
        <span class="logo-tagline">Propiedades</span>
      </div>
      <button class="mobile-menu-btn" onclick="window.toggleMenu()" aria-label="Abrir menu">☰</button>
      <div class="nav-links" id="nav-links">
        <a href="#inicio">Inicio</a>
        <a href="#propiedades">Propiedades</a>
        <a href="#contacto">Contacto</a>
        <button class="nav-admin-btn" onclick="window.openAdminLogin()">${isAdminLogged ? 'Panel Admin' : 'Admin'}</button>
        <a href="https://wa.me/5493795066314" target="_blank" rel="noopener" class="btn-contact-nav">WhatsApp</a>
      </div>
    </nav>
  `;
}
