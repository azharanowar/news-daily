const loadAllCategories = async() => {
    const response = await fetch('https://openapi.programming-hero.com/api/news/categories');
    const data = await response.json();
    if (data.status) {
        displayAllCategories(data.data);
    } else {
        // Error data not found...
        dataNotFoundMessageSection(true);
        websitePreloader(false);
    }
}

const displayAllCategories = categoriesData => {
    const newsCategories = categoriesData.news_category;
    const mainMenuUl = document.getElementById("mainMenuUl");
    newsCategories.forEach(newsCategory => {
        const newNavItem = document.createElement('li');
        newNavItem.classList.add('nav-item');
        newNavItem.innerHTML = `<a class="nav-link" onclick="getAllNewsByCategoryId('${newsCategory.category_id}', '${newsCategory.category_name}')">${newsCategory.category_name}</a>`;
        mainMenuUl.appendChild(newNavItem);
    })
}

loadAllCategories();


const getAllNewsByCategoryId = async(categoryId, categoryName = '') => {
    websitePreloader(true);

    const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`);
    const data = await response.json();
    if (data.status) {
        displayAllNews(data.data, categoryName);
    } else {
        // Error data not found...
        newsDataFoundMessage(false);
        dataNotFoundMessageSection(true);
        websitePreloader(false);
    }

}

const displayAllNews = (allNewsData, categoryName) => {
    console.log(allNewsData);

    const newsFoundMessage = `${allNewsData.length} Items found for category of ${categoryName}.`;
    dataNotFoundMessageSection(false);
    newsDataFoundMessage(true, newsFoundMessage);
    websitePreloader(false);
}


const websitePreloader = isActive => {
    const preloaderSection = document.getElementById("preloaderSection");
    if (isActive) {
        preloaderSection.style.display = "block";
    } else {
        preloaderSection.style.display = "none";
    }
}

const dataNotFoundMessageSection = noDataFound => {
    const noDataFoundSection = document.getElementById("noDataFoundSection");
    if (noDataFound) {
        noDataFoundSection.style.display = "block";
    } else {
        noDataFoundSection.style.display = "none";
    }
}
const newsDataFoundMessage = (displaySection, message = '') => {
    const newsFoundMessageSection = document.getElementById("newsFoundMessageSection");
    if (displaySection) {
        newsFoundMessageSection.style.display = "block";
        document.getElementById("newsFoundMessage").innerText = message;
    } else {
        newsFoundMessageSection.style.display = "none";
    }
}