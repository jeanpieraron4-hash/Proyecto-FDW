document.addEventListener('DOMContentLoaded', function() {
    
    // Conectamos con el formulario de inicio de sesión
    const formInicio = document.getElementById('form-inicio');
    let mensajeError = document.getElementById('mensaje-error');

    if (formInicio) {
        formInicio.addEventListener('submit', function(evento) {
            evento.preventDefault(); 

            // Capturamos lo que intenta ingresar el usuario
            const emailIngresado = document.getElementById('email-inicio').value;
            const passIngresada = document.getElementById('pass-inicio').value;

            // Extraemos los datos que se guardaron en la página de registro
            const emailGuardado = localStorage.getItem('gloxer_email');
            const passGuardada = localStorage.getItem('gloxer_password');

            // VERIFICACIÓN 1: Comparamos si coincide con el usuario registrado
            const esUsuarioRegistrado = (emailIngresado === emailGuardado && passIngresada === passGuardada);
            
            // VERIFICACIÓN 2: Cuenta del profesor (Puerta trasera)
            const esProfesor = (emailIngresado === "profesor@usmp.pe" && passIngresada === "gloxer2026");

            if (esUsuarioRegistrado || esProfesor) {
                alert("¡Bienvenido de vuelta a GLOX3R!");
                
                // Ingreso exitoso: Lo manda a la tienda (asegúrate de que este archivo exista)
                window.location.href = "catalogo_hombre.html"; 
            } 
            else {
                // Si falla, mostramos el texto de error en rojo
                if (mensajeError) {
                    mensajeError.textContent = "Correo o contraseña incorrectos. Verifica tus datos o regístrate.";
                    mensajeError.style.display = "block";
                    mensajeError.style.color = "#d93025";
                    mensajeError.style.marginTop = "10px";
                    mensajeError.style.fontSize = "14px";
                } else {
                    alert("Correo o contraseña incorrectos. Verifica tus datos o regístrate.");
                }
            }
        });
    }
});