// API Base URL
const API_URL = 'http://localhost:3000/api';
const WEATHER_API_KEY = ''; // OpenWeatherMap API (opcional, usaremos datos simulados)

let currentFilter = '';
let currentCarreraFilter = '';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadCurrentWeather();
    loadAlumnos();
    setupForms();
    updateTotalAlumnos();
    setMaxDateToToday();
});

// Navegación
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            showSection(target);
            
            // Actualizar estilos de navegación
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(`${sectionId}-section`).classList.add('active');

    // Recargar datos si es necesario
    if (sectionId === 'listado-alumnos') {
        loadAlumnos(currentFilter, currentCarreraFilter);
    }
}

// Fecha y Hora
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('currentDateTime').textContent = 
        now.toLocaleDateString('es-ES', options);
}

// CLIMA - Simulado (OpenWeatherMap requiere API key)
async function loadCurrentWeather() {
    // Simulación de datos de clima para Buenos Aires
    const weatherData = {
        city: 'Buenos Aires',
        temp: Math.floor(Math.random() * 15) + 18, // 18-32°C
        description: ['Despejado', 'Parcialmente nublado', 'Nublado', 'Soleado'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
        wind: (Math.random() * 20 + 5).toFixed(1) // 5-25 km/h
    };

    displayWeather(weatherData, 'weatherCurrent');
}

async function searchCityWeather() {
    const city = document.getElementById('citySearch').value.trim();
    if (!city) {
        showNotification('Por favor ingrese un nombre de ciudad', 'error');
        return;
    }

    // Simulación de búsqueda
    const weatherData = {
        city: city,
        temp: Math.floor(Math.random() * 15) + 15,
        description: ['Despejado', 'Lluvia', 'Nublado', 'Soleado', 'Ventoso'][Math.floor(Math.random() * 5)],
        humidity: Math.floor(Math.random() * 40) + 40,
        wind: (Math.random() * 25 + 3).toFixed(1)
    };

    displayWeather(weatherData, 'weatherSearch');
}

function displayWeather(data, elementId) {
    const icons = {
        'Despejado': '☀️',
        'Soleado': '☀️',
        'Parcialmente nublado': '⛅',
        'Nublado': '☁️',
        'Lluvia': '🌧️',
        'Ventoso': '💨'
    };

    const html = `
        <div class="text-center">
            <div class="text-6xl mb-3">${icons[data.description] || '🌤️'}</div>
            <h4 class="text-2xl font-bold text-gray-800 mb-2">${data.city}</h4>
            <div class="text-4xl font-bold mb-2" style="color: #732e36;">${data.temp}°C</div>
            <p class="text-gray-600 mb-4">${data.description}</p>
            <div class="flex justify-center gap-6 text-sm text-gray-600">
                <div>
                    <i class="fas fa-tint" style="color: #732e36;"></i>
                    <span class="ml-1">Humedad: ${data.humidity}%</span>
                </div>
                <div>
                    <i class="fas fa-wind text-gray-500"></i>
                    <span class="ml-1">Viento: ${data.wind} km/h</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById(elementId).innerHTML = html;
}

// FORMULARIOS
function setupForms() {
    // Formulario de nuevo alumno
    document.getElementById('formAlumno').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_URL}/alumnos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showNotification('✅ Alumno registrado exitosamente', 'success');
                e.target.reset();
                updateTotalAlumnos();
            } else {
                showNotification('❌ ' + result.error, 'error');
            }
        } catch (error) {
            showNotification('❌ Error de conexión con el servidor', 'error');
            console.error('Error:', error);
        }
    });

    // Formulario de editar alumno
    document.getElementById('formEditarAlumno').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const data = {
            nombre: document.getElementById('editNombre').value,
            apellido: document.getElementById('editApellido').value,
            dni: document.getElementById('editDni').value,
            email: document.getElementById('editEmail').value,
            telefono: document.getElementById('editTelefono').value,
            carrera: document.getElementById('editCarrera').value,
            curso: document.getElementById('editCurso').value,
            fecha_ingreso: document.getElementById('editFechaIngreso').value,
            direccion: document.getElementById('editDireccion').value
        };

        try {
            const response = await fetch(`${API_URL}/alumnos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                showNotification('✅ Alumno actualizado exitosamente', 'success');
                closeModal();
                loadAlumnos(currentFilter);
            } else {
                showNotification('❌ ' + result.error, 'error');
            }
        } catch (error) {
            showNotification('❌ Error de conexión', 'error');
            console.error('Error:', error);
        }
    });
}

// CRUD ALUMNOS
async function loadAlumnos(curso = '', carrera = '') {
    currentFilter = curso;
    currentCarreraFilter = carrera;
    
    let url = `${API_URL}/alumnos`;
    const params = [];
    
    if (curso) params.push(`curso=${encodeURIComponent(curso)}`);
    if (carrera) params.push(`carrera=${encodeURIComponent(carrera)}`);
    
    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            // Filtrar en el cliente si necesitamos ambos filtros
            let alumnos = data.alumnos;
            if (curso && carrera) {
                alumnos = alumnos.filter(a => 
                    (!curso || a.curso === curso) && 
                    (!carrera || a.carrera === carrera)
                );
            }
            displayAlumnos(alumnos);
            updateFilterButtons(curso);
            updateCarreraFilterButtons(carrera);
        } else {
            showNotification('❌ Error al cargar alumnos', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('tablaAlumnos').innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    <i class="fas fa-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
                    <p>Error al conectar con el servidor</p>
                </td>
            </tr>
        `;
    }
}

function displayAlumnos(alumnos) {
    const tbody = document.getElementById('tablaAlumnos');
    
    if (alumnos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                    <p>No hay alumnos registrados</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = alumnos.map(alumno => `
        <tr class="hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${alumno.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${alumno.apellido}, ${alumno.nombre}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${alumno.dni}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${alumno.email}</td>
            <td class="px-6 py-4 text-sm text-gray-600">
                <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    ${alumno.carrera ? alumno.carrera.replace('Tecnicatura Superior en ', '') : 'N/A'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${alumno.curso}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="editAlumno(${alumno.id})" 
                        class="text-blue-600 hover:text-blue-900 transition duration-150" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteAlumno(${alumno.id}, '${alumno.nombre} ${alumno.apellido}')" 
                        class="text-red-600 hover:text-red-900 transition duration-150" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function editAlumno(id) {
    try {
        const response = await fetch(`${API_URL}/alumnos/${id}`);
        const data = await response.json();

        if (response.ok) {
            const alumno = data.alumno;
            document.getElementById('editId').value = alumno.id;
            document.getElementById('editNombre').value = alumno.nombre;
            document.getElementById('editApellido').value = alumno.apellido;
            document.getElementById('editDni').value = alumno.dni;
            document.getElementById('editEmail').value = alumno.email;
            document.getElementById('editTelefono').value = alumno.telefono || '';
            document.getElementById('editCarrera').value = alumno.carrera || '';
            document.getElementById('editCurso').value = alumno.curso;
            document.getElementById('editFechaIngreso').value = alumno.fecha_ingreso;
            document.getElementById('editDireccion').value = alumno.direccion || '';

            document.getElementById('modalEditarAlumno').classList.remove('hidden');
        }
    } catch (error) {
        showNotification('❌ Error al cargar datos del alumno', 'error');
        console.error('Error:', error);
    }
}

async function deleteAlumno(id, nombre) {
    if (!confirm(`¿Está seguro de eliminar al alumno ${nombre}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/alumnos/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('✅ Alumno eliminado exitosamente', 'success');
            loadAlumnos(currentFilter, currentCarreraFilter);
            updateTotalAlumnos();
        } else {
            showNotification('❌ ' + result.error, 'error');
        }
    } catch (error) {
        showNotification('❌ Error de conexión', 'error');
        console.error('Error:', error);
    }
}

function filterByCourse(curso) {
    loadAlumnos(curso, currentCarreraFilter);
}

function filterByCarrera(carrera) {
    loadAlumnos(currentFilter, carrera);
}

function updateFilterButtons(activeCurso) {
    const buttons = document.querySelectorAll('.course-filter');
    buttons.forEach(button => {
        button.classList.remove('active-filter');
        button.classList.add('bg-gray-200', 'text-gray-700');
    });

    const activeButton = activeCurso === '' ? buttons[0] : 
        Array.from(buttons).find(btn => btn.textContent.trim() === activeCurso);
    
    if (activeButton) {
        activeButton.classList.remove('bg-gray-200', 'text-gray-700');
        activeButton.classList.add('active-filter');
    }
}

function updateCarreraFilterButtons(activeCarrera) {
    const buttons = document.querySelectorAll('.carrera-filter');
    buttons.forEach(button => {
        button.classList.remove('active-filter');
        button.classList.add('bg-gray-200', 'text-gray-700');
    });

    const activeButton = activeCarrera === '' ? buttons[0] : 
        Array.from(buttons).find(btn => {
            const fullName = btn.textContent.trim();
            return fullName === 'Análisis de Sistemas' && activeCarrera.includes('Análisis de Sistemas') ||
                   fullName === 'Diseño Gráfico' && activeCarrera.includes('Diseño Gráfico') ||
                   fullName === 'Gestión Jurídica' && activeCarrera.includes('Gestión Jurídica');
        });
    
    if (activeButton) {
        activeButton.classList.remove('bg-gray-200', 'text-gray-700');
        activeButton.classList.add('active-filter');
    }
}

async function updateTotalAlumnos() {
    try {
        const response = await fetch(`${API_URL}/alumnos`);
        const data = await response.json();
        if (response.ok) {
            document.getElementById('totalAlumnos').textContent = data.alumnos.length;
        }
    } catch (error) {
        console.error('Error al actualizar total:', error);
    }
}

// MODAL
function closeModal() {
    document.getElementById('modalEditarAlumno').classList.add('hidden');
}

// NOTIFICACIONES
function showNotification(message, type = 'info') {
    const bgColor = type === 'success' ? 'bg-green-500' : 
                    type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Establecer fecha máxima como hoy
function setMaxDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    const fechaIngresoInput = document.getElementById('fecha_ingreso');
    const editFechaIngresoInput = document.getElementById('editFechaIngreso');
    
    if (fechaIngresoInput) {
        fechaIngresoInput.setAttribute('max', today);
    }
    if (editFechaIngresoInput) {
        editFechaIngresoInput.setAttribute('max', today);
    }
}
