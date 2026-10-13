document.addEventListener("DOMContentLoaded", () => {
    
    const tarjetas = document.querySelectorAll(".course-card");
    
    // Modales de Cursos e Imagen
    const modalSpecs = document.getElementById("course-modal");
    const modalCloseSpecs = document.getElementById("modal-close");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalDuration = document.getElementById("modal-duration");
    const modalSyllabus = document.getElementById("modal-syllabus");
    const modalPrice = document.getElementById("modal-price");
    const modalBtnInscribir = document.getElementById("modal-btn-inscribir");

    const modalImg = document.getElementById("img-modal");
    const modalCloseImg = document.getElementById("img-modal-close");
    const modalImgLarge = document.getElementById("modal-img-large");

    let cursoActualSeleccionado = "";
    let precioActualSeleccionado = "";

    // Interactividad por Tarjeta
    tarjetas.forEach(tarjeta => {
        const imgContainer = tarjeta.querySelector(".course-img-container");
        const textClickable = tarjeta.querySelector(".course-text-clickable");
        const btnInscribir = tarjeta.querySelector(".btn-inscribir");

        imgContainer.addEventListener("click", () => {
            const imgElement = imgContainer.querySelector("img");
            modalImgLarge.src = imgElement.src;
            modalImg.classList.add("active");
        });

        textClickable.addEventListener("click", () => {
            modalTitle.textContent = tarjeta.getAttribute("data-curso");
            modalDesc.textContent = tarjeta.getAttribute("data-descripcion");
            modalDuration.textContent = tarjeta.getAttribute("data-duracion");
            modalSyllabus.textContent = tarjeta.getAttribute("data-temario");
            modalPrice.textContent = tarjeta.getAttribute("data-precio");
            
            cursoActualSeleccionado = tarjeta.getAttribute("data-curso");
            precioActualSeleccionado = tarjeta.getAttribute("data-precio");

            modalSpecs.classList.add("active");
        });

        btnInscribir.addEventListener("click", () => {
            const nombreCurso = tarjeta.getAttribute("data-curso");
            const precioCurso = tarjeta.getAttribute("data-precio");
            procesarInscripcionWhatsApp(nombreCurso, precioCurso);
        });
    });

    const procesarInscripcionWhatsApp = (nombreCurso, precioCurso) => {
        const numeroWhatsApp = "584121234567";
        const mensaje = `¡Hola! 👋 Me interesa inscribirme en el curso *${nombreCurso}* por ${precioCurso} en Libertademi. ¿Me ayudan con los datos de pago por favor?`;
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, "_blank");
    };

    const cerrarModales = () => {
        if (modalSpecs) modalSpecs.classList.remove("active");
        if (modalImg) modalImg.classList.remove("active");
    };

    if (modalBtnInscribir) {
        modalBtnInscribir.addEventListener("click", () => {
            procesarInscripcionWhatsApp(cursoActualSeleccionado, precioActualSeleccionado);
            cerrarModales();
        });
    }

    if (modalCloseSpecs) modalCloseSpecs.addEventListener("click", cerrarModales);
    if (modalSpecs) modalSpecs.addEventListener("click", (e) => { if (e.target === modalSpecs) cerrarModales(); });

    if (modalCloseImg) modalCloseImg.addEventListener("click", cerrarModales);
    if (modalImg) modalImg.addEventListener("click", (e) => { if (e.target === modalImg) cerrarModales(); });


    // Animación al hacer Scroll
    const elementosAnimados = document.querySelectorAll(".animate-on-scroll");
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elementosAnimados.forEach(el => observer.observe(el));


    // Modal de Registro y Validaciones
    const authModal = document.getElementById("auth-modal");
    const btnLoginNav = document.getElementById("btn-login-nav");
    const authClose = document.getElementById("auth-close");
    const formRegistro = document.getElementById("form-registro");
    const mensajeRespuesta = document.getElementById("mensaje-respuesta");

    if (btnLoginNav) {
        btnLoginNav.addEventListener("click", (e) => {
            e.preventDefault();
            if (authModal) authModal.classList.add("active");
        });
    }

    if (authClose) {
        authClose.addEventListener("click", () => authModal.classList.remove("active"));
        if (authModal) {
            authModal.addEventListener("click", (e) => { if (e.target === authModal) authModal.classList.remove("active"); });
        }
    }

    if (formRegistro) {
        formRegistro.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("reg-nombre").value;
            const correo = document.getElementById("reg-correo").value;
            const correoConfirm = document.getElementById("reg-correo-confirm").value;
            const password = document.getElementById("reg-password").value;

            mensajeRespuesta.style.display = "block";

            if (correo !== correoConfirm) {
                mensajeRespuesta.style.color = "#ef4444";
                mensajeRespuesta.textContent = "❌ Los correos electrónicos no coinciden.";
                return;
            }

            const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!regexPassword.test(password)) {
                mensajeRespuesta.style.color = "#ef4444";
                mensajeRespuesta.textContent = "❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.";
                return;
            }

            mensajeRespuesta.style.color = "#f59e0b";
            mensajeRespuesta.textContent = "Conectando con el servidor...";

            try {
                const respuesta = await fetch("https://libertudemi-backend.onrender.com/api/registro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, correo, password })
                });

                const resultado = await respuesta.json();

                if (resultado.exito) {
                    mensajeRespuesta.style.color = "#10b981";
                    mensajeRespuesta.textContent = resultado.mensaje;
                    setTimeout(() => {
                        authModal.classList.remove("active");
                        mensajeRespuesta.textContent = "";
                        mensajeRespuesta.style.display = "none";
                        formRegistro.reset();
                    }, 3500);
                } else {
                    mensajeRespuesta.style.color = "#ef4444";
                    mensajeRespuesta.textContent = resultado.mensaje || "Hubo un problema al registrarse.";
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                mensajeRespuesta.style.color = "#ef4444";
                mensajeRespuesta.textContent = "No se pudo conectar con el servidor de Python.";
            }
        });
    }


    // Modales Legales
    const legalModal = document.getElementById("legal-modal");
    const legalClose = document.getElementById("legal-close");
    const legalTitle = document.getElementById("legal-title");
    const legalBody = document.getElementById("legal-body");

    const linkTerminos = document.getElementById("link-terminos");
    const linkPrivacidad = document.getElementById("link-privacidad");
    const linkAviso = document.getElementById("link-aviso");
    const linkContacto = document.getElementById("link-contacto");

    const contenidoLegal = {
        terminos: {
            titulo: "Términos y Condiciones",
            html: `
                <p>Bienvenido a <strong>Libertudemi</strong>. Al acceder y utilizar nuestra plataforma web y nuestros programas educativos, aceptas cumplir con los siguientes términos y condiciones de uso.</p>
                <p><strong>1. Uso de la plataforma:</strong> Los cursos adquiridos son para uso personal e individual del estudiante. Queda prohibida la reventa, distribución o reproducción no autorizada del contenido.</p>
                <p><strong>2. Inscripciones y Pagos:</strong> Las transacciones se realizan mediante los canales habilitados y confirmados oficialmente. Una vez procesada la inscripción, se otorga acceso al programa correspondiente.</p>
                <p><strong>3. Modificaciones:</strong> Libertademi se reserva el derecho de actualizar o modificar los temarios y condiciones de servicio en cualquier momento para mejorar la calidad académica.</p>
            `
        },
        privacidad: {
            titulo: "Política de Privacidad",
            html: `
                <p>En <strong>Libertudemi</strong> valoramos y protegemos la privacidad de nuestros usuarios y estudiantes.</p>
                <p><strong>1. Información recopilada:</strong> Recopilamos datos básicos de registro (nombre y correo electrónico) facilitados voluntariamente por el usuario para gestionar el acceso a la academia.</p>
                <p><strong>2. Uso de los datos:</strong> Los datos proporcionados se utilizan exclusivamente para fines académicos, confirmación de cuentas y notificaciones importantes del servicio. Nunca compartimos tu información con terceros con fines comerciales.</p>
                <p><strong>3. Seguridad:</strong> Implementamos medidas de seguridad para proteger la información personal almacenada en nuestros sistemas.</p>
            `
        },
        aviso: {
            titulo: "Aviso Legal",
            html: `
                <p><strong>1. Titularidad:</strong> El sitio web <strong>Libertudemi</strong> es una plataforma de educación online dedicada a la enseñanza de habilidades de alto valor.</p>
                <p><strong>2. Propiedad Intelectual:</strong> Todos los logotipos, textos, diseños, gráficos y contenidos audiovisuales presentes en esta web están protegidos por las leyes de propiedad intelectual y pertenecen a Libertademi o a sus respectivos instructores.</p>
                <p><strong>3. Responsabilidad:</strong> Libertademi no se hace responsable por el mal uso de la información práctica impartida en los cursos, siendo responsabilidad exclusiva del estudiante la aplicación de las estrategias financieras o profesionales.</p>
            `
        },
        contacto: {
            titulo: "Contacto y Soporte",
            html: `
                <p>¿Tienes dudas, necesitas soporte técnico o requieres asistencia con tu inscripción en <strong>Libertudemi</strong>?</p>
                <p>Puedes comunicarte con nuestro equipo de atención al estudiante a través de los siguientes canales:</p>
                <ul>
                    <li><strong>Correo electrónico:</strong> soporte@libertudemi.com</li>
                    <li><strong>Atención por WhatsApp:</strong> +58 412-1234567</li>
                    <li><strong>Horario de atención:</strong> Lunes a Viernes de 9:00 AM a 6:00 PM.</li>
                </ul>
            `
        }
    };

    const abrirLegal = (tipo) => {
        const datos = contenidoLegal[tipo];
        if (datos) {
            legalTitle.textContent = datos.titulo;
            legalBody.innerHTML = datos.html;
            legalModal.classList.add("active");
        }
    };

    if (linkTerminos) linkTerminos.addEventListener("click", (e) => { e.preventDefault(); abrirLegal("terminos"); });
    if (linkPrivacidad) linkPrivacidad.addEventListener("click", (e) => { e.preventDefault(); abrirLegal("privacidad"); });
    if (linkAviso) linkAviso.addEventListener("click", (e) => { e.preventDefault(); abrirLegal("aviso"); });
    if (linkContacto) linkContacto.addEventListener("click", (e) => { e.preventDefault(); abrirLegal("contacto"); });

    if (legalClose) {
        legalClose.addEventListener("click", () => legalModal.classList.remove("active"));
        if (legalModal) {
            legalModal.addEventListener("click", (e) => { if (e.target === legalModal) legalModal.classList.remove("active"); });
        }
    }

});
