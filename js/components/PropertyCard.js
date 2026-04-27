export function PropertyCard(prop) {
    return `
        <div class="card" onclick="window.location.hash='property-${prop.id}'">
            <div class="card-img-container">
                <div class="badge-tipo">${prop.operacion} | ${prop.tipo}</div>
                ${prop.destacada ? '<div class="badge-destacada">DESTACADA</div>' : ''}
                <img src="${prop.imagenes[0]}" alt="${prop.titulo}">
            </div>
            <div class="card-content">
                <div class="card-location">
                    <span>📍 ${prop.ubicacion}</span>
                </div>
                <h3 class="card-title">${prop.titulo}</h3>
                <div class="card-price">
                    <span class="currency">${prop.moneda}</span>
                    <span class="amount">${prop.precio.toLocaleString()}</span>
                </div>
                <div class="card-specs">
                    <div class="spec-item">
                        <span class="spec-val">${prop.ambientes || '-'}</span>
                        <span class="spec-label">Amb.</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-val">${prop.dormitorios || '-'}</span>
                        <span class="spec-label">Dorm.</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-val">${prop.sup_total}m²</span>
                        <span class="spec-label">Total</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}