import { initialProperties } from '/js/data.js';
import { Navbar } from '/js/components/Navbar.js';
import { Hero } from '/js/components/Hero.js';
import { PropertyCard } from '/js/components/PropertyCard.js';
import { Admin } from '/js/components/Admin.js';
import { Modal } from '/js/components/Modal.js';
import { Footer } from '/js/components/Footer.js';

let properties = [...initialProperties];
let currentEditingId = null;

function render() {
    document.getElementById('properties-grid').innerHTML = properties.map(p => PropertyCard(p)).join('');
    document.getElementById('admin-root').innerHTML = Admin(properties);
}

window.openModal = (id = null) => {
    currentEditingId = id;
    const prop = id ? properties.find(p => p.id === id) : null;
    const modalDiv = document.createElement('div');
    modalDiv.id = 'modal-container';
    modalDiv.innerHTML = Modal(prop);
    document.body.appendChild(modalDiv);
    document.getElementById('prop-form').onsubmit = handleFormSubmit;
};

window.closeModal = () => {
    const m = document.getElementById('modal-container');
    if (m) m.remove();
    currentEditingId = null;
};

function handleFormSubmit(e) {
    e.preventDefault();
    const data = {
        id: currentEditingId || Date.now().toString(),
        titulo: document.getElementById('f-titulo').value,
        ubicacion: document.getElementById('f-ubicacion').value,
        precio: parseFloat(document.getElementById('f-precio').value),
        moneda: document.getElementById('f-moneda').value,
        tipo: document.getElementById('f-tipo').value,
        operacion: document.getElementById('f-operacion').value,
        ambientes: parseInt(document.getElementById('f-ambientes').value),
        sup_total: document.getElementById('f-sup-total').value,
        descripcion: document.getElementById('f-descripcion').value,
        imagenes: [document.getElementById('f-imagenes').value],
        estado: "Disponible",
        destacada: false
    };

    if (currentEditingId) {
        properties = properties.map(p => p.id === currentEditingId ? data : p);
    } else {
        properties.push(data);
    }

    window.closeModal();
    render();
}

window.deleteProp = (id) => {
    if (confirm('¿Eliminar?')) {
        properties = properties.filter(p => p.id !== id);
        render();
    }
};

window.editProp = (id) => window.openModal(id);

function init() {
    document.getElementById('navbar-root').innerHTML = Navbar();
    document.getElementById('hero-root').innerHTML = Hero();
    const f = document.createElement('div');
    f.innerHTML = Footer();
    document.body.appendChild(f);
    render();
}

init();