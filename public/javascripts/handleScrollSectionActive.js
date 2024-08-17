// Fonction pour gérer le défilement
const handleScroll = () => {
    // Sélectionne toutes les divs qui ont un attribut 'id'
    const sections = document.querySelectorAll('article[id]');
    // Calcule la position de défilement actuelle
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    // Pour chaque section, on vérifie si elle est visible dans la fenêtre d'affichage
    sections.forEach(section => {
        const sectionTop = section.offsetTop; // Position du haut de la section par rapport au haut de la page
        const sectionHeight = section.offsetHeight; // Hauteur de la section
        const sectionId = section.getAttribute('id'); // ID de la section

        // Vérifie si la position de défilement actuelle se trouve dans la section
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            setActiveLink(sectionId); // Appelle la fonction pour activer le lien correspondant
        }
    });
};

// Fonction pour activer le lien correspondant à la section visible
const setActiveLink = (sectionId) => {
    // Sélectionne tous les liens de navigation
    const links = document.querySelectorAll('header nav ul li a');

    // Pour chaque lien, vérifie si l'attribut href contient l'ID de la section visible
    links.forEach(link => {
        if (link.getAttribute('href').includes(sectionId)) {
            link.classList.add('active'); // Ajoute la classe 'active' au lien correspondant
        } else {
            link.classList.remove('active'); // Retire la classe 'active' des autres liens
        }
    });
};

// Ajout de l'événement scroll pour détecter le défilement
window.addEventListener('scroll', handleScroll);
