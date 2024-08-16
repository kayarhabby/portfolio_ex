document.addEventListener("DOMContentLoaded", () => {
    // Sélectionne tous les liens de la navigation dans la section des projets
    const links = document.querySelectorAll("article#projects div.projects nav ul li a");

    // Sélectionne le conteneur où les images des projets seront affichées
    const projectsImgContainer = document.querySelector("section.gallerie_container");

    // Boucle à travers chaque lien et ajoute un écouteur d'événement pour les clics
    links.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du lien

            // Récupère la catégorie de projets associée au lien cliqué
            const category = event.currentTarget.dataset.category;

            // Détermine l'URL à utiliser pour la requête en fonction de la catégorie
            let url = category === "projects" ? "/api/projects" : `/api/projects/${category}`;

            try {
                // Effectue une requête GET pour récupérer les projets correspondants
                const response = await fetch(url);

                // Vérifie si la requête a échoué
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Convertit la réponse en format JSON
                const projects = await response.json();

                // Met à jour le contenu de la section projets avec les données récupérées
                updateProjectsContent(projects);
            } catch (err) {
                // Affiche une erreur si la requête échoue
                console.log("Failed to fetch projects: ", err);
            }
        });
    });

    // Fonction pour charger les projets initiaux (tous les projets par défaut)
    async function loadInitialProjects() {
        try {
            // Requête GET pour récupérer tous les projets
            const response = await fetch("/api/projects");

            // Vérifie si la requête a échoué
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Convertit la réponse en format JSON
            const projects = await response.json();

            // Met à jour le contenu de la section projets avec les données récupérées
            updateProjectsContent(projects);
        } catch (err) {
            // Affiche une erreur si la requête échoue
            console.log("Failed to fetch projects: ", err);
        }
    }

    // Fonction pour mettre à jour le contenu de la section projets
    function updateProjectsContent(projects) {
        projectsImgContainer.innerHTML = ""; // Supprime le contenu existant

        // Boucle à travers chaque projet et crée les éléments HTML pour l'affichage
        projects.forEach(project => {
            const projectDiv = document.createElement("article");
            projectDiv.classList.add("gallerie_content");

            const imgDiv = document.createElement("div");
            imgDiv.classList.add("gallerie_items_img");

            const imgLink = document.createElement("a");
            imgLink.href = project.link || "#"; // Lien vers le projet ou '#' si pas de lien

            const img = document.createElement("img");
            img.src = '/images/' + project.image; // Chemin de l'image du projet
            img.alt = `${project.title} image`; // Texte alternatif pour l'image

            const h4 = document.createElement("h4");
            h4.textContent = project.title; // Titre du projet

            // Structure de l'élément projet: <a><img><h4></a>
            imgLink.appendChild(img);
            imgLink.appendChild(h4);
            imgDiv.appendChild(imgLink);
            projectDiv.appendChild(imgDiv);
            projectsImgContainer.appendChild(projectDiv); // Ajoute le projet au conteneur
        });
    }

    // Charger les projets initiaux (tous les projets)
    loadInitialProjects();
});
