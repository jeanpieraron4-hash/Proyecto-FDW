document.addEventListener('DOMContentLoaded', function() {
    
    // Conectamos con tu formulario de registro
    const formRegistro = document.getElementById('form-registro');

    if (formRegistro) {
        formRegistro.addEventListener('submit', function(evento) {
            evento.preventDefault(); // Evita que la página parpadee

            // Capturamos los datos que escribió el usuario
            const email = document.getElementById('email-registro').value;
            const password = document.getElementById('pass-registro').value;
            const passwordConfirm = document.getElementById('clave2').value;

            // VALIDACIÓN: Comprobamos que las contraseñas coincidan
            if (password !== passwordConfirm) {
                alert("Las contraseñas no coinciden. Por favor, vuélvelo a intentar.");
                return; // Detiene el código aquí si hay error
            }

            // Guardamos los datos en la memoria del navegador (localStorage)
            localStorage.setItem('gloxer_email', email);
            localStorage.setItem('gloxer_password', password);

            // Le avisamos al usuario y lo mandamos a que inicie sesión
            alert("¡Registro exitoso! Tu cuenta ha sido creada. Ahora inicia sesión.");
            
            // Redirigimos EXACTAMENTE a tu archivo con mayúscula
            window.location.href = "Inicio_sesion.html"; 
        });
    }
});