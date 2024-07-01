window.onload = ()=>{
    const menuHamburger = document.querySelector(".fa-solid.fa-bars");
    const nav = document.querySelector("nav");
    const closemenu = document.querySelector(".fa-x");


    if(menuHamburger)
    {
        menuHamburger.addEventListener('click',()=>{
            nav.classList.toggle('mobile-menu');
            closemenu.style.display="inline-block";
            menuHamburger.style.display = "none";
        })
    }
    if(closemenu)
    {
        closemenu.addEventListener('click',()=>{
            nav.classList.toggle('mobile-menu');
            closemenu.style.display="none";
            menuHamburger.style.display = "inline-block";
        })
    }
}