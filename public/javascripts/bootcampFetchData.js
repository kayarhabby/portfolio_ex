document.addEventListener("DOMContentLoaded", () => {
    const bootcampImgContainer = document.querySelector("#bootcamp_img_container");

    // Fonction pour charger les bootcamps initiaux (tous les bootcamps par défaut)
    async function loadInitialBootcamps() {
        try {
            // Requête GET pour récupérer tous les bootcamps
            const response = await fetch("/api/bootcamps");

            // Vérifie si la requête a échoué
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Convertit la réponse en format JSON
            const bootcamps = await response.json();

            // Met à jour le contenu de la section bootcamp avec les données récupérées
            updateBootcampContent(bootcamps);
        } catch (err) {
            // Affiche une erreur si la requête échoue
            console.log("Failed to fetch bootcamps: ", err);
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }

    // Fonction pour mettre à jour le contenu de la section bootcamp
    function updateBootcampContent(bootcamps) {
        bootcampImgContainer.innerHTML = ""; // Supprime le contenu existant

        // Boucle à travers chaque bootcamp et crée les éléments HTML pour l'affichage
        bootcamps.forEach(bootcamp => {
            const bootcampDiv = document.createElement("article");
            bootcampDiv.classList.add("bootcamp_content");

            const imgDiv = document.createElement("div");
            imgDiv.classList.add("bootcamp_item_img");

            const img = document.createElement("img");
            img.src = "/images/" + bootcamp.image; // Chemin de l'image du bootcamp
            img.alt = `${bootcamp.title} image`; // Texte alternatif pour l'image

            const dateDiv = document.createElement("div");
            dateDiv.classList.add("bootcamp_items_date");

            const calendarIcon = document.createElement("i");
            calendarIcon.classList.add("fa-solid", "fa-calendar-days");

            const dateSpan = document.createElement("span");
            dateSpan.classList.add("date");
            dateSpan.textContent = formatDate(bootcamp.date);

            const textDiv = document.createElement("div");
            textDiv.classList.add("bootcamp_items_text");

            const h3 = document.createElement("h3");
            h3.textContent = bootcamp.title; // Titre du bootcamp

            const small = document.createElement("small");
            small.textContent = bootcamp.description; // Description du bootcamp

            const readMoreDiv = document.createElement("div");
            readMoreDiv.classList.add("readmoreContainer");

            const certLink = document.createElement("a");
            certLink.href = "/documents/" + bootcamp.certification || "#"; // Lien vers le certificat ou '#' si pas de lien
            certLink.target = "_blank";
            certLink.textContent = "CERTIFICAT";

            const arrowLink = document.createElement("a");
            const arrowIcon = document.createElement("i");
            arrowIcon.classList.add("fa-solid", "fa-arrow-right");
            arrowLink.appendChild(arrowIcon);

            // Structure de l'élément bootcamp: img, date, texte, lien
            dateDiv.appendChild(calendarIcon);
            dateDiv.appendChild(dateSpan);

            readMoreDiv.appendChild(certLink);
            readMoreDiv.appendChild(arrowLink);

            textDiv.appendChild(h3);
            textDiv.appendChild(small);
            textDiv.appendChild(readMoreDiv);

            imgDiv.appendChild(img);
            bootcampDiv.appendChild(imgDiv);
            bootcampDiv.appendChild(dateDiv);
            bootcampDiv.appendChild(textDiv);

            bootcampImgContainer.appendChild(bootcampDiv); // Ajoute le bootcamp au conteneur
        });
    }

    // Charger les bootcamps initiaux (tous les bootcamps)
    loadInitialBootcamps();
});
