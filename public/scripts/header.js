const searchBtn = document.getElementById('mobile_nav_search_container');

let isSearchHidden = true;

const toggleSearch = () => {
    if (isSearchHidden) {
        searchBtn.style.animation = 'showSearch 0.3s ease-in-out forwards';
        isSearchHidden = false;
    } else {
        searchBtn.style.animation = 'hideSearch 0.3s ease-in-out forwards';
        isSearchHidden = true;
    }
}

const showAsideMenu = () => {
    let menu = document.getElementById('side_menu')
    menu.style.transition = "0.5s ease-in-out"
    menu.style.display = "flex"
}

const hideAsideMenu = () => {
    let menu = document.getElementById('side_menu')
    menu.style.transition = "0.5s ease-in-out"
    menu.style.display = "none"
}

