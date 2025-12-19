// ===== NAVEGACIÓN =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

// Scroll navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link en scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Cerrar menu al hacer click en link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== TEMA =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Cargar tema guardado
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ===== PARTÍCULAS CANVAS =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 50;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Conectar partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 242, 255, ${0.2 * (1 - distance / 150)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ===== EFECTO TYPING =====
const typedText = document.getElementById('typed-text');
const phrases = [
    'Desarrollador Web',
    'Freelancer',
    'Estudiante de Informática',
    'Desarrollador De Videojuegos',
    'Creador de sistemas'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typedText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        setTimeout(() => isDeleting = true, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    
    const typingSpeed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, typingSpeed);
}

typeEffect();

// ===== ANIMACIONES DE ENTRADA =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.skill-card, .project-card, .service-card, .text-block').forEach(el => {
    observer.observe(el);
});

// ===== CONTADOR ESTADÍSTICAS =====
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    let current = 0;
    const increment = target / 50;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.textContent === '0') {
            animateCounter(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => statsObserver.observe(stat));

// ===== BARRAS DE HABILIDADES =====
const skillBars = document.querySelectorAll('.skill-progress');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = progress + '%';
        }
    });
}, observerOptions);

skillBars.forEach(bar => skillsObserver.observe(bar));

// ===== CARRUSEL DE TESTIMONIOS =====
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const dotsContainer = document.getElementById('testimonialDots');

let currentTestimonial = 0;
let testimonialInterval;

// Crear dots
testimonialCards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('testimonial-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToTestimonial(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.testimonial-dot');

function updateTestimonial() {
    testimonialCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentTestimonial) {
            card.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentTestimonial) {
            dot.classList.add('active');
        }
    });
    
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    updateTestimonial();
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    updateTestimonial();
}

function goToTestimonial(index) {
    currentTestimonial = index;
    updateTestimonial();
    resetInterval();
}

function resetInterval() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

nextBtn.addEventListener('click', () => {
    nextTestimonial();
    resetInterval();
});

prevBtn.addEventListener('click', () => {
    prevTestimonial();
    resetInterval();
});

// Auto-play
testimonialInterval = setInterval(nextTestimonial, 5000);

// ===== SISTEMA DE MODAL DE PROYECTOS =====
const projectModal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Base de datos de proyectos
const projectsData = {
    'pos-system': {
        title: 'Sistema de Punto de Venta',
        tags: ['PHP', 'MySQL', 'JavaScript', 'HTML'],
        description: 'Sistema completo de punto de venta (POS) para supermercados, con gestión integral de inventario, ventas, clientes y reportes en tiempo real. Incluye control de múltiples cajas, gestión de empleados, sistema generador de códigos de barras & codigos QR y generación de reportes detallados.',
        features: [
            'Control de inventario en tiempo real',
            'Sistema de múltiples cajas registradoras',
            'Gestión de clientes y proveedores',
            'Reportes de ventas y ganancias',
            'Sistema de códigos de barras y QR',
            'Control de empleados y permisos',
            'control de acceso con roles',
            'Dashboard con estadísticas',
            'Historial de transacciones',
            'Generación de facturas (PDF)'
        ],
        technologies: [
            { icon: '<i class="devicon-php-plain colored"></i>', name: 'PHP' },
            { icon: '<i class="devicon-mysql-plain colored"></i>', name: 'MySQL' },
            { icon: '<i class="devicon-javascript-plain colored"></i>', name: 'JavaScript' },
            { icon: '<i class="devicon-html5-plain colored"></i>', name: 'HTML5' },
            { icon: '<i class="devicon-css3-plain colored"></i>', name: 'CSS3' },
            //{ icon: '<i class="devicon-bootstrap-plain colored"></i>', name: 'Bootstrap' },
            //{ icon: '<i class="devicon-react-original colored"></i>', name: 'React' },
            //{ icon: '<i class="devicon-nodejs-plain colored"></i>', name: 'Node.js' },
            //{ icon: '<i class="devicon-mongodb-plain colored"></i>', name: 'MongoDB' },
            //{ icon: '<i class="devicon-python-plain colored"></i>', name: 'Python' },
            //{ icon: '<i class="devicon-laravel-plain colored"></i>', name: 'Laravel' },
            //{ icon: '<i class="devicon-vuejs-plain colored"></i>', name: 'Vue.js' },
            //{ icon: '<i class="devicon-postgresql-plain colored"></i>', name: 'PostgreSQL' },
            //{ icon: '<i class="devicon-flask-original colored"></i>', name: 'Flask' },
            //{ icon: '<i class="devicon-express-original colored"></i>', name: 'Express' },
        ],
        images: [
            'assets/supermercado/captura1.jpg',
            'assets/supermercado/captura2.jpg',
            'assets/supermercado/captura3.jpg',
            'assets/supermercado/captura4.jpg',
            'assets/supermercado/captura5.jpg',
            'assets/supermercado/captura6.jpg'
        ],
        githubUrl: 'https://github.com/ArkF2000/Punto-de-Venta-Web-para-Supermercado.git',
        liveUrl: null
    },


    // ... resto de proyectos
        'menu-system': {
        title: 'Menú Interactivo para Restaurantes',
        tags: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'UI'],
        description: 'Sistema web interactivo para restaurantes que permite a los clientes ordenar desde su móvil o tablet mediante un menú dinámico, intuitivo y multilenguaje. Incluye panel administrativo oculto para gestionar productos, pedidos, disponibilidad y facturación',
        features: [
            'Control de inventario',
            'Sistema de ordenes por "Turnos"',
            'Funcion multilenguaje',
            'Gestión de clientes',
            'Reportes de ventas y ganancias',
            'Sistema de pedidos en tiempo real',
            'Dashboard con estadísticas',
            'Historial de transacciones',
            'Generación de facturas (PDF)',
            'Filtros de comida y bebida'
        ],
        technologies: [
            { icon: '<i class="devicon-php-plain colored"></i>', name: 'PHP' },
            { icon: '<i class="devicon-mysql-plain colored"></i>', name: 'MySQL' },
            { icon: '<i class="devicon-javascript-plain colored"></i>', name: 'JavaScript' },
            { icon: '<i class="devicon-html5-plain colored"></i>', name: 'HTML5' },
            { icon: '<i class="devicon-css3-plain colored"></i>', name: 'CSS3' },
            //{ icon: '<i class="devicon-bootstrap-plain colored"></i>', name: 'Bootstrap' },
            //{ icon: '<i class="devicon-react-original colored"></i>', name: 'React' },
            //{ icon: '<i class="devicon-nodejs-plain colored"></i>', name: 'Node.js' },
            //{ icon: '<i class="devicon-mongodb-plain colored"></i>', name: 'MongoDB' },
            //{ icon: '<i class="devicon-python-plain colored"></i>', name: 'Python' },
            //{ icon: '<i class="devicon-laravel-plain colored"></i>', name: 'Laravel' },
            //{ icon: '<i class="devicon-vuejs-plain colored"></i>', name: 'Vue.js' },
            //{ icon: '<i class="devicon-postgresql-plain colored"></i>', name: 'PostgreSQL' },
            //{ icon: '<i class="devicon-flask-original colored"></i>', name: 'Flask' },
            //{ icon: '<i class="devicon-express-original colored"></i>', name: 'Express' },
        ],
        images: [
            'assets/menu/captura1.jpg',
            'assets/menu/captura2.jpg',
            'assets/menu/captura3.jpg',
            'assets/menu/captura4.jpg',
            'assets/menu/captura5.jpg',
            'assets/menu/captura6.jpg'
        ],
        githubUrl: 'https://github.com/ArkF2000/Punto-de-Venta-Web-para-Supermercado.git',
        liveUrl: null
    },



    //Landing page para gimnasio
        'landing-page-gym': {
        title: 'Landing Page - Gimnasio',
        tags: ['MySQL', 'JavaScript', 'HTML', 'UI'],
        description: 'landing page para promocionar el gimnasio “Fitness Time”, con el objetivo de presentar los servicios, instalaciones, precios y facilitar la inscripción de nuevos usuarios de forma atractiva y directa. La página resume en un solo flujo toda la información relevante, desde la propuesta de valor, las opciones de contacto y ubicación, ofreciendo una navegación simple, atractiva y clara para visitantes interesados en inscribirse.',
        features: [
            'Diseño responsivo',
            'Sección de servicios e instalaciones',
            'Galería de imágenes del gimnasio',
            'Integración de API con WhatsApp para contacto directo',

            'Llamado a la acción (CTA) destacado',
            'Presentación de precios y promociones',
            'Enlaces a redes sociales',
            'Optimización visual y minimalista',
            'Carga ligera y rápida',
            'Información de horarios y ubicación'
        ],
        technologies: [
            { icon: '<i class="devicon-javascript-plain colored"></i>', name: 'JavaScript' },
            { icon: '<i class="devicon-html5-plain colored"></i>', name: 'HTML5' },
            { icon: '<i class="devicon-css3-plain colored"></i>', name: 'CSS3' },
            //{ icon: '<i class="devicon-bootstrap-plain colored"></i>', name: 'Bootstrap' },
            //{ icon: '<i class="devicon-react-original colored"></i>', name: 'React' },
            //{ icon: '<i class="devicon-nodejs-plain colored"></i>', name: 'Node.js' },
            //{ icon: '<i class="devicon-mongodb-plain colored"></i>', name: 'MongoDB' },
            //{ icon: '<i class="devicon-python-plain colored"></i>', name: 'Python' },
            //{ icon: '<i class="devicon-laravel-plain colored"></i>', name: 'Laravel' },
            //{ icon: '<i class="devicon-vuejs-plain colored"></i>', name: 'Vue.js' },
            //{ icon: '<i class="devicon-postgresql-plain colored"></i>', name: 'PostgreSQL' },
            //{ icon: '<i class="devicon-flask-original colored"></i>', name: 'Flask' },
            //{ icon: '<i class="devicon-express-original colored"></i>', name: 'Express' },
        ],
        images: [
            'assets/gimnasio/captura1.jpg',
            'assets/gimnasio/captura2.jpg',
            'assets/gimnasio/captura3.jpg',
            'assets/gimnasio/captura4.jpg',
            'assets/gimnasio/captura5.jpg',
            'assets/gimnasio/captura6.jpg'
        ],
        liveUrl: 'https://fitness-time-eda5a.web.app',
        githubUrl: 'https://fitness-time-eda5a.web.app'

    },

    //Videojuego indie de terror UNITY
        'videojuego-spirexx': {
        title: 'Videojuego 3D "Spirexx"',
        tags: ['Unity', '3D', 'C#', 'Indie'],
        description: 'Spirexx es un videojuego de terror en primera persona desarrollado en Unity, diseñado como un prototipo jugable que combina exploración urbana, tensión psicológica y mecánicas básicas de supervivencia. El proyecto se enfocó en crear una experiencia inmersiva utilizando iluminación dramática, sonidos ambientales, fisicas realistas y un flujo de juego que genera incertidumbre constante.',
        features: [
            'Sombras dinámicas para crear tensión',
            'Cámara con rotación suave y sensibilidad ajustable.',
            'Sistema de detección de suelo y colisiones.',
            'Post-processing para añadir niebla, viñeta y tono frío',
            'Presentación de precios y promociones',
            'Sonido ambiental realista (viento, pasos, crujidos).',
            'Movimiento controlado por scripts',
            'Control en primera persona',            
            'Menu de pausa',
            'Sistema de linterna con bateria Recargable'
        ],
technologies: [
    { icon: '<i class="devicon-csharp-plain colored"></i>', name: 'C#' },
    { icon: '<i class="devicon-unity-plain colored"></i>', name: 'Unity'},
    { icon: '<i class="devicon-blender-original colored"></i>', name: 'Blender' },
],
        images: [
            'assets/spirexx/captura1.jpg',
            'assets/spirexx/captura2.jpg',
            'assets/spirexx/captura3.jpg',
            'assets/spirexx/captura4.jpg',
            'assets/spirexx/captura5.jpg',
            'assets/spirexx/captura6.jpg'
        ],
        githubUrl: null

    },


    //downloader
        'downloader': {
        title: 'Clipzo - Media Downloader',
        tags: ['NodeJS', 'JavaScript', 'HTML', 'APK'],
        description: 'Clipzo es una plataforma web diseñada para permitir la descarga rápida, sencilla y en máxima calidad de videos y audios provenientes de varias redes sociales populares, incluyendo YouTube, Instagram, Facebook y TikTok. El diseño se pensó desde el inicio para evolucionar fácilmente hacia una APK local, manteniendo la misma interfaz y lógica, pero ejecutándose en Android mediante WebView o como app híbrida. ',

        features: [
            'Detección automática de metadatos',
            'Conversión automatizada desde el video original.',
            'Control de errores para URLs inválidas',
            'Interfaz ligera, táctil y responsive',
            'Diseño adaptado para APK',
            'Descarga de Videos,',
            'multiformato',
            'MultiPlataforma',
            'Manejo inteligente de resoluciones',
        ],
        technologies: [
            { icon: '<i class="devicon-nodejs-plain colored"></i>', name: 'Node.js' },            
            { icon: '<i class="devicon-javascript-plain colored"></i>', name: 'JavaScript' },
            { icon: '<i class="devicon-html5-plain colored"></i>', name: 'HTML5' },
            { icon: '<i class="devicon-css3-plain colored"></i>', name: 'CSS3' },
            //{ icon: '<i class="devicon-bootstrap-plain colored"></i>', name: 'Bootstrap' },
            //{ icon: '<i class="devicon-react-original colored"></i>', name: 'React' },
            //{ icon: '<i class="devicon-mongodb-plain colored"></i>', name: 'MongoDB' },
            //{ icon: '<i class="devicon-python-plain colored"></i>', name: 'Python' },
            //{ icon: '<i class="devicon-laravel-plain colored"></i>', name: 'Laravel' },
            //{ icon: '<i class="devicon-vuejs-plain colored"></i>', name: 'Vue.js' },
            //{ icon: '<i class="devicon-postgresql-plain colored"></i>', name: 'PostgreSQL' },
            //{ icon: '<i class="devicon-flask-original colored"></i>', name: 'Flask' },
            //{ icon: '<i class="devicon-express-original colored"></i>', name: 'Express' },
        ],
        images: [
            'assets/downloader/captura1.jpg'
        ],
        githubUrl: 'https://github.com/ArkF2000/clipzo.git',
        liveUrl: null
    },

    // Sistema de Reportes Escolares
    'reportes-escolares': {
    title: 'Sistema de Reportes Escolares',
    tags: ['PHP', 'MySQL', 'JavaScript', 'CRUD'],
    description: 'Sistema web completo para la gestión y digitalización de reportes disciplinarios escolares. Diseñado con arquitectura de dos roles (Administrador y Profesor), permite la administración integral de grados, secciones, materias, profesores y alumnos, así como la creación, seguimiento y análisis de reportes disciplinarios. El sistema implementa un flujo de asignaciones jerárquicas donde el administrador asigna recursos educativos a profesores, quienes posteriormente gestionan alumnos y generan reportes dentro de sus asignaciones. Incluye validación de permisos multinivel, prevención de duplicados y manejo de estados (activo/inactivo/anulado) en lugar de eliminaciones.',

    features: [
        'Sistema de autenticación con roles (Admin/Profesor)',
        'Panel administrativo con CRUD completo',
        'Gestión de grados, secciones y materias',
        'Asignación dinámica de recursos a profesores',
        'Navegación contextual con breadcrumbs',
        'Gestión de alumnos por grado y sección',
        'Sistema de reportes disciplinarios',
        'Control de estados sin eliminaciones',
        'Validación de permisos por asignaciones',
        'Estadísticas y análisis por materia',
        'Interfaz responsive y moderna',
        'Sesiones seguras con timeout',
    ],
    technologies: [
        { icon: '<i class="devicon-php-plain colored"></i>', name: 'PHP' },
        { icon: '<i class="devicon-mysql-plain colored"></i>', name: 'MySQL' },
        { icon: '<i class="devicon-javascript-plain colored"></i>', name: 'JavaScript' },
        { icon: '<i class="devicon-html5-plain colored"></i>', name: 'HTML5' },
        { icon: '<i class="devicon-css3-plain colored"></i>', name: 'CSS3' },
    ],
    images: [
        'assets/reportes/captura1.jpg',
        'assets/reportes/captura2.jpg',
        'assets/reportes/captura3.jpg',
        'assets/reportes/captura4.jpg'
    ],
    githubUrl: 'https://github.com/tu-usuario/reportes-escolares.git',
    liveUrl: null
}
};

// Función para abrir modal
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;
    
    // Generar HTML del modal
    const modalHTML = `
        <div class="project-detail-header">
            <h2 class="project-detail-title">${project.title}</h2>
            <div class="project-detail-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <p class="project-detail-description">${project.description}</p>
        </div>
        
        <div class="project-gallery">
            <h3>📸 Galería de Imágenes</h3>
            <div class="gallery-grid">
                ${project.images.map((img, index) => `
                    <div class="gallery-item">
                        ${img.startsWith('ruta/') ? `
                            <div class="gallery-placeholder">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <span>Captura ${index + 1}</span>
                            </div>
                        ` : `
                            <img src="${img}" alt="Captura ${index + 1}" loading="lazy">
                        `}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="project-features">
            <h3>✨ Características Principales</h3>
            <div class="features-list">
                ${project.features.map(feature => `
                    <div class="feature-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="project-tech">
            <h3>🛠️ Tecnologías Utilizadas</h3>
            <div class="tech-grid">
                ${project.technologies.map(tech => `
                    <div class="tech-item">
                        <div class="tech-item-icon">${tech.icon}</div>
                        <div class="tech-item-name">${tech.name}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="project-links">
            <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Ver en GitHub
            </a>
            ${project.liveUrl ? `
                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    Ver Demo en Vivo
                </a>
            ` : ''}
        </div>
    `;
    
    modalBody.innerHTML = modalHTML;
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar modal
function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners para los enlaces de proyectos
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = link.getAttribute('data-project');
        openProjectModal(projectId);
    });
});

// Cerrar modal
modalClose.addEventListener('click', closeProjectModal);
modalOverlay.addEventListener('click', closeProjectModal);

// Cerrar con tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});



// ===== FORMULARIO DE CONTACTO =====
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simular envío
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validación básica
    if (!data.name || !data.email || !data.subject || !data.message) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Simular envío exitoso
    setTimeout(() => {
        showMessage('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
        contactForm.reset();
    }, 1000);
});

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        formMessage.className = 'form-message';
    }, 5000);
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== CURSOR PERSONALIZADO (OPCIONAL) =====
const cursor = document.createElement('div');
cursor.style.cssText = `
    width: 20px;
    height: 20px;
    border: 2px solid var(--primary);
    border-radius: 50%;
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.2s, opacity 0.2s;
    opacity: 0;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
    cursor.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Efecto en elementos interactivos
document.querySelectorAll('a, button, .project-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = 'var(--secondary)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursor.style.borderColor = 'var(--primary)';
    });
});

// ===== PARALLAX SUAVE =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroShapes = document.querySelectorAll('.shape');
    
    heroShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== PRELOADER (OPCIONAL) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== EFECTO HOVER EN PROYECTOS =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== SCROLL TO TOP =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
`;
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    border-radius: 50%;
    color: white;
    cursor: pointer;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-md);
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s ease;
`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.transform = 'translateY(0)';
    } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'translateY(100px)';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'translateY(-5px) scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'translateY(0) scale(1)';
});

// ===== PROTECCIÓN DE CONTENIDO (OPCIONAL) =====
document.addEventListener('contextmenu', (e) => {
    // e.preventDefault(); // Descomentar para desactivar click derecho
});

// ===== LOG DE CONSOLA =====
console.log('%c¡Hola Developer! 👋', 'color: #00f2ff; font-size: 20px; font-weight: bold;');
console.log('%c¿Te gusta este portafolio? Contacta conmigo para crear el tuyo.', 'color: #a855f7; font-size: 14px;');
console.log('%cHecho con ❤️ por Ariel', 'color: #00f2ff; font-size: 12px;');