export function Navbar() {
    return `
        <nav class="navbar">
            <div class="logo-container" onclick="window.location.href='/'" style="cursor:pointer">
                <span class="logo">BAK</span>
                <span class="logo-tagline">Propiedades</span>
            </div>
            <div class="nav-links">
                <a href="#hero-root">Inicio</a>
                <a href="#properties-grid">Propiedades</a>
                <a href="#admin-root">Administración</a>
                <a href="https://wa.me/5493795066314" target="_blank" class="btn-contact-nav">Contactar</a>
            </div>
        </nav>
    `;
}