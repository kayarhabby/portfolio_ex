// // Validation du formulaire
//
// const form = document.getElementById('formulaire');
// const email = document.getElementById('Email');
// const password = document.getElementById('Password');
//
// // Affiche un message d'erreur pour un champ de saisie donné
// function showError(input, message) {
//     const formControl = input.parentElement;
//     formControl.className = 'form-control error';
//     const small = formControl.querySelector('small');
//     small.innerText = message;
// }
//
// // Affiche un message de succès pour un champ de saisie donné
// function showSuccess(input) {
//     const formControl = input.parentElement;
//     formControl.className = 'form-control success';
// }
//
// // Vérifie que l'adresse email est valide
// function checkEmail(input) {
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     if (re.test(input.value.trim())) {
//         showSuccess(input);
//     } else {
//         showError(input, 'L\'adresse email n\'est pas valide');
//     }
// }
//
// // Vérifie que le mot de passe respecte les règles
// function checkPassword(input) {
//     const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
//     if (re.test(input.value.trim())) {
//         showSuccess(input);
//     } else {
//         showError(input, 'Le mot de passe doit comporter au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.');
//     }
// }
//
// // Vérifie que tous les champs requis sont remplis
// function checkRequired(inputArr) {
//     let allFieldsValid = true;
//     inputArr.forEach(function(input) {
//         if (input.value.trim() === '') {
//             showError(input, `${getFieldName(input)} est requis`);
//             allFieldsValid = false;
//         } else {
//             showSuccess(input);
//         }
//     });
//     return allFieldsValid;
// }
//
// // Renvoie le nom d'un champ de saisie donné sous une forme lisible
// function getFieldName(input) {
//     return input.name.charAt(0).toUpperCase() + input.name.slice(1);
// }
//
// // Gestion de la soumission du formulaire
// form.addEventListener('submit', async function(e) {
//     e.preventDefault(); // Empêche le comportement par défaut
//
//     // Validation des champs
//     const isFormValid = checkRequired([email, password]) && checkEmail(email) && checkPassword(password);
//
//     // Si le formulaire est valide, soumettre les données
//     if (isFormValid) {
//         submitForm();
//     }
// });
//
// function submitForm() {
//     const data = new FormData(form);
//
//     fetch("/api/login", {
//         method: "POST",
//         body: data
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                 console.log("Formulaire envoyé !");
//                 clearForm();
//             } else {
//                 alert(data.msg);
//             }
//         })
//         .catch(error => {
//             alert("Une erreur est survenue...");
//         });
// }
//
// function clearForm() {
//     form.reset(); // Réinitialise tous les champs du formulaire
// }

// ### Détails de la Validation du Mot de Passe :
//     - **`/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/`** :
// - `(?=.*[a-z])` : Au moins une lettre minuscule.
// - `(?=.*[A-Z])` : Au moins une lettre majuscule.
// - `(?=.*\d)` : Au moins un chiffre.
// - `(?=.*[@$!%*?&#])` : Au moins un caractère spécial.
// - `[A-Za-z\d@$!%*?&#]{8,}` : Longueur minimale de 8 caractères, contenant les caractères spécifiés.
//
//     Avec ce script, vous garantissez que le mot de passe répond à des critères de sécurité de base avant qu'il ne soit ' +
// 'envoyé au serveur. Cela améliore l'expérience utilisateur en évitant d'envoyer un formulaire incomplet ou incorrect, ce qui peut être frustrant.

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    document.getElementById('formulaire').addEventListener('submit', async function(event) {
        event.preventDefault(); // Empêche le rechargement de la page

        const email = document.getElementById('Email').value;
        const password = document.getElementById('Password').value;

        const formData = { email, password };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Vérifie si la requête a été réussie
            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);

                // Vider les champs du formulaire après envoi réussi
                document.getElementById('formulaire').reset();

                // Redirection vers le tableau de bord ou une autre page
                window.location.href = '/dashboard';
            } else {
                // Gestion des erreurs
                const error = await response.json();
                console.error('Login failed:', error.message);
                alert('Login failed: ' + error.message); // Affiche l'erreur à l'utilisateur
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('An error occurred during the login process.');
        }
    });
});

