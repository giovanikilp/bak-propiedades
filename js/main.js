import { initialProperties } from '/js/data.js';
import { supabase, hasSupabaseConfig, STORAGE_BUCKET } from '/js/supabase-client.js';
import { Navbar } from '/js/components/Navbar.js';
import { Hero } from '/js/components/Hero.js';
import { PropertyCard, PropertyDetail } from '/js/components/PropertyCard.js';
import { AdminLogin, AdminTable } from '/js/components/Admin.js';
import { Modal } from '/js/components/Modal.js';
import { Footer } from '/js/components/Footer.js';

const LOCAL_KEY = 'bak_properties_fallback_v2';

let properties = [];
let session = null;
let currentEditingId = null;
let authMessage = '';
let draggedImage = null;

const byOrder = (a, b) => Number(a.orden || 999) - Number(b.orden || 999);
const activeProperties = () => properties.filter(p => (p.estado || 'Disponible') !== 'Inactivo').sort(byOrder);

function normalizeProperty(raw) {
  return {
    ...raw,
    precio: raw.precio === '' || raw.precio === null || raw.precio === undefined ? null : Number(raw.precio),
    expensas: raw.expensas === '' || raw.expensas === null || raw.expensas === undefined ? null : Number(raw.expensas),
    ambientes: raw.ambientes === '' || raw.ambientes === null || raw.ambientes === undefined ? null : Number(raw.ambientes),
    dormitorios: raw.dormitorios === '' || raw.dormitorios === null || raw.dormitorios === undefined ? null : Number(raw.dormitorios),
    banios: raw.banios === '' || raw.banios === null || raw.banios === undefined ? null : Number(raw.banios),
    imagenes: Array.isArray(raw.imagenes) ? raw.imagenes.filter(Boolean) : [],
    caracteristicas: Array.isArray(raw.caracteristicas) ? raw.caracteristicas.filter(Boolean) : [],
    destacada: Boolean(raw.destacada),
    orden: Number(raw.orden || 999)
  };
}

async function loadSession() {
  if (!hasSupabaseConfig) return;
  const { data } = await supabase.auth.getSession();
  session = data.session;
  supabase.auth.onAuthStateChange((_event, newSession) => {
    session = newSession;
    renderAll();
  });
}

async function loadProperties() {
  const local = loadLocalProperties();
  properties = local.length ? local : [...initialProperties];

  if (!hasSupabaseConfig) return;

  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length) {
      properties = data.map(normalizeProperty);
      saveLocalProperties(properties);
    }
  } catch (error) {
    console.warn('No se pudo leer Supabase, se usa respaldo local:', error.message);
  }
}

function loadLocalProperties() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]').map(normalizeProperty);
  } catch {
    return [];
  }
}

function saveLocalProperties(nextProperties = properties) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(nextProperties));
}

function renderPublic() {
  document.getElementById('navbar-root').innerHTML = Navbar(Boolean(session));
  document.getElementById('hero-root').innerHTML = Hero();
  const list = activeProperties();
  document.getElementById('properties-grid').innerHTML = list.length
    ? list.map(p => PropertyCard(p)).join('')
    : '<div class="empty-state">No hay propiedades disponibles por el momento.</div>';
  document.getElementById('footer-root').innerHTML = Footer();
}

function renderAdmin() {
  document.getElementById('admin-root').innerHTML = AdminLogin(session, authMessage);
  const form = document.getElementById('admin-login-form');
  if (form) form.onsubmit = handleLogin;

  const tableRoot = document.getElementById('admin-table-root');
  if (tableRoot && session) tableRoot.innerHTML = AdminTable(properties.sort(byOrder));
}

function renderAll() {
  renderPublic();
  renderAdmin();
}

async function handleLogin(e) {
  e.preventDefault();
  authMessage = 'Ingresando...';
  renderAdmin();

  if (!hasSupabaseConfig) {
    authMessage = 'Supabase no está configurado. Revisá js/supabase-client.js.';
    renderAdmin();
    return;
  }

  const email = document.getElementById('admin-email').value.trim();
  const password = document.getElementById('admin-password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authMessage = 'No se pudo ingresar. Revisá email y contraseña.';
    renderAdmin();
    return;
  }

  session = data.session;
  authMessage = '';
  await loadProperties();
  renderAll();
}

window.adminLogout = async () => {
  if (hasSupabaseConfig) await supabase.auth.signOut();
  session = null;
  renderAll();
};

window.openAdminLogin = () => {
  document.getElementById('admin-root')?.scrollIntoView({ behavior: 'smooth' });
};

window.toggleMenu = () => {
  document.getElementById('nav-links')?.classList.toggle('open');
};

window.syncFromSupabase = async () => {
  await loadProperties();
  renderAll();
  alert('Propiedades sincronizadas.');
};

window.openPropertyDetail = (id) => {
  const prop = properties.find(p => String(p.id) === String(id));
  if (!prop) return;
  const div = document.createElement('div');
  div.id = 'detail-container';
  div.innerHTML = PropertyDetail(prop);
  document.body.appendChild(div);
};

window.closeDetail = (event = null) => {
  if (event && !event.target.classList.contains('detail-overlay')) return;
  document.getElementById('detail-container')?.remove();
};

window.setDetailImage = (src) => {
  const img = document.getElementById('detail-main-img');
  if (img) img.src = src;
};

window.openModal = (id = null) => {
  if (!session) {
    authMessage = 'Primero tenés que iniciar sesión para editar.';
    renderAdmin();
    window.openAdminLogin();
    return;
  }

  currentEditingId = id;
  const prop = id ? properties.find(p => String(p.id) === String(id)) : null;
  const modalDiv = document.createElement('div');
  modalDiv.id = 'modal-container';
  modalDiv.innerHTML = Modal(prop);
  document.body.appendChild(modalDiv);
  setupImageManager();
  document.getElementById('prop-form').onsubmit = handleFormSubmit;
};

window.closeModal = () => {
  document.getElementById('modal-container')?.remove();
  currentEditingId = null;
};

function setupImageManager() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('f-files');
  const manager = document.getElementById('image-manager');

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', async (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    await addFiles([...e.dataTransfer.files]);
  });
  input.addEventListener('change', async () => addFiles([...input.files]));

  manager.addEventListener('dragstart', (e) => {
    draggedImage = e.target.closest('.image-item');
  });
  manager.addEventListener('dragover', (e) => e.preventDefault());
  manager.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target.closest('.image-item');
    if (!draggedImage || !target || draggedImage === target) return;
    const items = [...manager.querySelectorAll('.image-item')];
    const draggedIndex = items.indexOf(draggedImage);
    const targetIndex = items.indexOf(target);
    if (draggedIndex < targetIndex) target.after(draggedImage);
    else target.before(draggedImage);
    syncImagesTextarea();
  });
}

async function addFiles(files) {
  const validFiles = files.filter(file => file.type.startsWith('image/'));
  for (const file of validFiles) {
    const src = await uploadImage(file);
    appendImageItem(src);
  }
  syncImagesTextarea();
}

async function uploadImage(file) {
  if (hasSupabaseConfig && session) {
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
    const path = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (!error) {
      const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
      return data.publicUrl;
    }
    console.warn('No se pudo subir a Storage, se guarda como respaldo local:', error.message);
  }

  return await fileToDataURL(file);
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function appendImageItem(src) {
  const manager = document.getElementById('image-manager');
  const item = document.createElement('div');
  item.className = 'image-item';
  item.draggable = true;
  item.dataset.src = src;
  item.innerHTML = `
    <span class="drag-handle">☰</span>
    <img src="${src}" alt="Imagen subida">
    <button type="button" onclick="window.removeImageItem(this)">Eliminar</button>
  `;
  manager.appendChild(item);
}

window.removeImageItem = (button) => {
  button.closest('.image-item')?.remove();
  syncImagesTextarea();
};

function syncImagesTextarea() {
  const values = [...document.querySelectorAll('#image-manager .image-item')].map(item => item.dataset.src).filter(Boolean);
  document.getElementById('f-imagenes').value = values.join('\n');
}

async function handleFormSubmit(e) {
  e.preventDefault();
  if (!session) return;

  syncImagesTextarea();

  const formData = readFormData();
  const data = normalizeProperty({
    ...formData,
    id: currentEditingId || crypto.randomUUID(),
    created_at: properties.find(p => String(p.id) === String(currentEditingId))?.created_at,
    orden: properties.findIndex(p => String(p.id) === String(currentEditingId)) + 1 || properties.length + 1
  });

  const previous = [...properties];
  if (currentEditingId) properties = properties.map(p => String(p.id) === String(currentEditingId) ? data : p);
  else properties.push(data);
  saveLocalProperties(properties);
  renderAll();
  window.closeModal();

  if (hasSupabaseConfig) {
    const payload = { ...data };
    const { error } = await supabase.from('properties').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.error(error);
      properties = previous;
      saveLocalProperties(properties);
      renderAll();
      alert('No se pudo guardar en Supabase. Revisá las policies y la tabla. No se aplicaron los cambios.');
    }
  }
}

function readFormData() {
  const images = document.getElementById('f-imagenes').value
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean);
  const features = document.getElementById('f-caracteristicas').value
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean);

  return {
    titulo: document.getElementById('f-titulo').value.trim(),
    ubicacion: document.getElementById('f-ubicacion').value.trim(),
    precio: document.getElementById('f-precio').value || null,
    expensas: document.getElementById('f-expensas').value || null,
    moneda: document.getElementById('f-moneda').value,
    tipo: document.getElementById('f-tipo').value.trim() || 'Propiedad',
    operacion: document.getElementById('f-operacion').value,
    estado: document.getElementById('f-estado').value,
    ambientes: document.getElementById('f-ambientes').value || null,
    dormitorios: document.getElementById('f-dormitorios').value || null,
    banios: document.getElementById('f-banios').value || null,
    cochera: document.getElementById('f-cochera').value.trim() || 'Consultar',
    sup_total: document.getElementById('f-sup-total').value.trim() || 'No especificado',
    sup_cubierta: document.getElementById('f-sup-cubierta').value.trim() || 'No especificado',
    whatsapp: document.getElementById('f-whatsapp').value.trim() || '5493795066314',
    descripcion: document.getElementById('f-descripcion').value.trim(),
    caracteristicas: features,
    imagenes: images,
    destacada: document.getElementById('f-destacada').checked
  };
}

window.editProp = (id) => window.openModal(id);

window.deleteProp = async (id) => {
  if (!session) return;
  if (!confirm('¿Eliminar esta propiedad?')) return;
  const previous = [...properties];
  properties = properties.filter(p => String(p.id) !== String(id));
  saveLocalProperties(properties);
  renderAll();

  if (hasSupabaseConfig) {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) {
      properties = previous;
      saveLocalProperties(properties);
      renderAll();
      alert('No se pudo eliminar en Supabase. Revisá las policies.');
    }
  }
};

async function init() {
  await loadSession();
  await loadProperties();
  renderAll();
}

init();
