const searchBtn=document.getElementById('mobile_nav_search_container');

let isSearchHidden=true;

const toggleSearch=() => {
    if (isSearchHidden) {
        searchBtn.style.animation='showSearch 0.3s ease-in-out forwards';
        isSearchHidden=false;
    } else {
        searchBtn.style.animation='hideSearch 0.3s ease-in-out forwards';
        isSearchHidden=true;
    }
}

const showAsideMenu=() => {
    let menu=document.getElementById('side_menu')
    menu.style.transition="0.5s ease-in-out"
    menu.style.display="flex"
}

const hideAsideMenu=() => {
    let menu=document.getElementById('side_menu')
    menu.style.transition="0.5s ease-in-out"
    menu.style.display="none"
}

const search_input_1=document.getElementById('search_input_1');
const search_input_2=document.getElementById('search_input_2');
const headerSearch=document.getElementById('header_search');

// Listen for the Enter keypress event
headerSearch.addEventListener('keypress', async (e) => {
    if (e.key==='Enter') { // Check if Enter key is pressed
        const query=headerSearch.value.trim(); // Get the search query
        if (query) {
            try {
                window.open(`/?search=${encodeURIComponent(query)}`, '_self');
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    }
});

// Listen for the Enter keypress event
search_input_1.addEventListener('keypress', async (e) => {
    if (e.key==='Enter') { // Check if Enter key is pressed
        const query=search_input_1.value.trim(); // Get the search query
        if (query) {
            try {
                window.open(`/?search=${encodeURIComponent(query)}`, '_self');
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
    }
});

const search_btn_1=document.getElementById('search_btn_1');
const search_btn_2=document.getElementById('search_btn_2');

search_btn_1.addEventListener('click', async () => {
    const query=search_input_1.value.trim(); // Get the search query
    if (query) {
        try {
            window.open(`/?search=${encodeURIComponent(query)}`, '_self');
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
});

search_btn_2.addEventListener('click', async () => {
    const query=search_input_2.value.trim(); // Get the search query
    if (query) {
        try {
            window.open(`/?search=${encodeURIComponent(query)}`, '_self');
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }
});


const name = document.getElementById("user_name");
const email = document.getElementById("user_email");
const message = document.getElementById("user_message");

const saveMessage = async (e) => {
    e.preventDefault();
    
    const data = {
        name: name.value,
        email: email.value,
        message: message.value
    };
    const response = await fetch("/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    alert(result.msg);
    name.value = "";
    email.value = "";
    message.value = "";
};

function handleImageError(img) {
    img.onerror = null; // Prevent infinite loop
    img.src = '/images/loader.gif'; // Adjusted path
  }


