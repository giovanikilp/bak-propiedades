export function Footer() {
    return `
        <footer style="background:var(--navy); color:var(--white); padding:4rem 0; margin-top:4rem; border-top:4px solid var(--gold);">
            <div class="container" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:3rem;">
                <div>
                    <h3 style="font-family:var(--font-display); margin-bottom:1.5rem; color:var(--gold);">BAK PROPIEDADES</h3>
                    <p style="color:var(--gray-400); font-size:0.9rem;">Excelencia y compromiso en el mercado inmobiliario de Corrientes.</p>
                </div>
                <div>
                    <h4 style="margin-bottom:1.2rem;">Contacto</h4>
                    <p style="font-size:0.9rem; color:var(--gray-400);">📍 Junín 1234, Corrientes</p>
                    <p style="font-size:0.9rem; color:var(--gray-400);">📞 +54 9 379 506-6314</p>
                </div>
            </div>
        </footer>
    `;
}