export function Modal(editingProp = null) {
    const isEdit = !!editingProp;
    return `
        <div id="modal-overlay" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${isEdit ? 'Editar Propiedad' : 'Nueva Propiedad'}</h2>
                    <button onclick="window.closeModal()" class="close-btn">&times;</button>
                </div>
                <form id="prop-form" class="modal-form">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Título</label>
                            <input type="text" id="f-titulo" value="${isEdit ? editingProp.titulo : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Ubicación</label>
                            <input type="text" id="f-ubicacion" value="${isEdit ? editingProp.ubicacion : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Precio</label>
                            <input type="number" id="f-precio" value="${isEdit ? editingProp.precio : ''}" required>
                        </div>
                        <div class="form-group">
                            <label>Moneda</label>
                            <select id="f-moneda">
                                <option value="USD" ${isEdit && editingProp.moneda === 'USD' ? 'selected' : ''}>USD</option>
                                <option value="ARS" ${isEdit && editingProp.moneda === 'ARS' ? 'selected' : ''}>ARS</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Tipo</label>
                            <input type="text" id="f-tipo" placeholder="Casa, Departamento..." value="${isEdit ? editingProp.tipo : ''}">
                        </div>
                        <div class="form-group">
                            <label>Operación</label>
                            <select id="f-operacion">
                                <option value="Venta" ${isEdit && editingProp.operacion === 'Venta' ? 'selected' : ''}>Venta</option>
                                <option value="Alquiler" ${isEdit && editingProp.operacion === 'Alquiler' ? 'selected' : ''}>Alquiler</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ambientes</label>
                            <input type="number" id="f-ambientes" value="${isEdit ? editingProp.ambientes : ''}">
                        </div>
                        <div class="form-group">
                            <label>Superficie Total (m²)</label>
                            <input type="text" id="f-sup-total" value="${isEdit ? editingProp.sup_total : ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="f-descripcion" rows="4">${isEdit ? editingProp.descripcion : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>URLs de Imágenes (separadas por coma)</label>
                        <textarea id="f-imagenes" rows="2">${isEdit ? editingProp.imagenes.join(', ') : ''}</textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="window.closeModal()" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-save">${isEdit ? 'Guardar Cambios' : 'Crear Propiedad'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}