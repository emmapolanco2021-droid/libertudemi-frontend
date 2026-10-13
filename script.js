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

    // --- Interactividad Inteligente por Tarjeta ---
    tarjetas.forEach(tarjeta => {
        const imgContainer = tarjeta.querySelector(".course-img-container");
        const textClickable = tarjeta.querySelector(".course-text-clickable");
        const btnInscribir = tarjeta.querySelector(".btn-inscribir");

        // 1. Clic en la Imagen -> Abre imagen ampliada
        imgContainer.addEventListener("click", () => {
            const imgElement = imgContainer.querySelector("img");
            modalImgLarge.src = imgElement.src;
            modalImg.classList.add("active");
        });

        // 2. Clic en el Texto -> Abre especificaciones del curso
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

        // 3. Clic en el Botón Inscribir -> Redirige a WhatsApp
        btnInscribir.addEventListener("click", () => {
            const nombreCurso = tarjeta.getAttribute("data-curso");
            const precioCurso = tarjeta.getAttribute("data-precio");
            procesarInscripcionWhatsApp(nombreCurso, precioCurso);
        });
    });

    // Función para redactar y abrir WhatsApp
    const procesarInscripcionWhatsApp = (nombreCurso, precioCurso) => {
        const numeroWhatsApp = "584121234567"; // <-- REEMPLAZA ESTE NÚMERO CON TU WHATSAPP REAL
        const mensaje = `¡Hola! 👋 Me interesa inscribirme en el curso *${nombreCurso}* por ${precioCurso} en Libertademi. ¿Me ayudan con los datos de pago por favor?`;
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, "_blank");
    };

    // Funciones para cerrar todos los modales
    const cerrarModales = () => {
        modalSpecs.classList.remove("active");
        modalImg.classList.remove("active");
    };

    modalBtnInscribir.addEventListener("click", () => {
        procesarInscripcionWhatsApp(cursoActualSeleccionado, precioActualSeleccionado);
        cerrarModales();
    });

    modalCloseSpecs.addEventListener("click", cerrarModales);
    modalSpecs.addEventListener("click", (e) => { if (e.target === modalSpecs) cerrarModales(); });

    modalCloseImg.addEventListener("click", cerrarModales);
    modalImg.addEventListener("click", (e) => { if (e.target === modalImg) cerrarModales(); });


    // --- Lógica del Modal Flotante de Registro y Servidor Python ---
    const authModal = document.getElementById("auth-modal");
    const btnLoginNav = document.getElementById("btn-login-nav");
    const authClose = document.getElementById("auth-close");
    const formRegistro = document.getElementById("form-registro");
    const mensajeRespuesta = document.getElementById("mensaje-respuesta");

    if (btnLoginNav) {
        btnLoginNav.addEventListener("click", (e) => {
            e.preventDefault();
            authModal.classList.add("active");
        });
    }

    if (authClose) {
        authClose.addEventListener("click", () => authModal.classList.remove("active"));
        authModal.addEventListener("click", (e) => { if (e.target === authModal) authModal.classList.remove("active"); });
    }

    if (formRegistro) {
        formRegistro.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById("reg-nombre").value;
            const correo = document.getElementById("reg-correo").value;
            const password = document.getElementById("reg-password").value;

            mensajeRespuesta.style.color = "#f59e0b";
            mensajeRespuesta.textContent = "Conectando con el servidor...";

            try {
                const respuesta = await fetch("http://127.0.0.1:5000/api/registro", {
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
                        formRegistro.reset();
                    }, 2000);
                } else {
                    mensajeRespuesta.style.color = "#ef4444";
                    mensajeRespuesta.textContent = "Hubo un problema al registrarse.";
                }

            } catch (error) {
                console.error("Error de conexión:", error);
                mensajeRespuesta.style.color = "#ef4444";
                mensajeRespuesta.textContent = "No se pudo conectar con el servidor de Python.";
            }
        });
    }

});