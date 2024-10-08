document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("article#skills .skills_title_container ul li a"); // links = ["skills", "languages", "framework", "devops_skills"]
    const skillsImgContainer = document.getElementById("skills_img_container");

    links.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            const category = event.currentTarget.dataset.category;
            let url = category === "skills" ? "/api/skills" : `/api/skills/category/${category}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const skills = await response.json();
                updateSkillsContent(skills);
            } catch (err) {
                console.log("Failed to fetch skills: ", err);
            }
        });
    });

    async function loadInitialSkills() {
        try {
            const response = await fetch("/api/skills");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const skills = await response.json();
            updateSkillsContent(skills);
        } catch (err) {
            console.log("Failed to fetch skills: ", err);
        }
    }

    function updateSkillsContent(skills) {
        skillsImgContainer.innerHTML = ""; // Supprimer le contenu existant
        skills.forEach(skill => {
            const skillDiv = document.createElement("div");
            skillDiv.classList.add("skills_content_image");

            const img = document.createElement("img");
            img.src = '/images/' + skill.image;
            img.alt = `${skill.title} image`;

            const p = document.createElement("p");
            p.textContent = skill.title;

            skillDiv.appendChild(img);
            skillDiv.appendChild(p);
            skillsImgContainer.appendChild(skillDiv);
        });
    }

    // Charger les compétences initiales
    loadInitialSkills();
});
