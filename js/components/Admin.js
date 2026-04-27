export function Admin(properties) {
    return `
        <div class="admin-section container">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; border-top: 1px solid var(--gray-200); padding-top: 4rem;">
                <h2 style="font-family:var(--font-display); font-size:2.5rem; color:var(--navy);">Panel Administrativo</h2>
                <button class="btn-admin" onclick="window.openModal()" style="background:var(--gold); color:var(--navy); padding:1rem 2rem; border:none; font-weight:700; cursor:pointer; border-radius:4px;">+ Nueva Propiedad</button>
            </div>
            <div style="background:var(--white); border-radius:8px; box-shadow:var(--shadow-md); overflow:hidden;">
                <table style="width:100%; border-collapse:collapse; text-align:left;">
                    <thead>
                        <tr style="background:var(--navy); color:var(--white); font-family:var(--font-display);">
                            <th style="padding:1.5rem;">Propiedad</th>
                            <th style="padding:1.5rem;">Ubicación</th>
                            <th style="padding:1.5rem;">Precio</th>
                            <th style="padding:1.5rem;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${properties.map(p => `
                            <tr style="border-bottom:1px solid var(--gray-100);">
                                <td style="padding:1.5rem; font-weight:600;">${p.titulo}</td>
                                <td style="padding:1.5rem;">${p.ubicacion}</td>
                                <td style="padding:1.5rem; color:var(--gold); font-weight:700;">${p.moneda} ${p.precio.toLocaleString()}</td>
                                <td style="padding:1.5rem;">
                                    <button onclick="window.deleteProp('${p.id}')" style="color:var(--red); background:none; border:none; cursor:pointer; font-weight:600;">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}