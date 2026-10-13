document.addEventListener("DOMContentLoaded", () => {
    
    const tarjetas = document.querySelectorAll(".course-card");
    
    // Modales
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

    // --- Interactividad por Tarjeta ---
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
        const numeroWhatsApp = "584121234567"; // Cambia por tu número real de WhatsApp
        const mensaje = `¡Hola! 👋 Me interesa inscribirme en el curso *${nombreCurso}* por ${precioCurso} en Libertademi. ¿Me ayudan con los datos de pago por favor?`;
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, "_blank");
    };

    const cerrarModales = () => {
        modalSpecs.classList.remove("active");
        modalImg.classList.remove("active");
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


    // --- Animación al hacer Scroll (Intersection Observer) ---
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


    // --- Lógica del Modal Flotante de Registro y Validaciones ---
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

});
