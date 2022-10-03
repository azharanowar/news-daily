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
        newNavItem.innerHTML = `<a class="nav-link" id="category${newsCategory.category_id}" onclick="getAllNewsByCategoryId('${newsCategory.category_id}', '${newsCategory.category_name}')">${newsCategory.category_name}</a>`;
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

// Change active nav item...
document.getElementById("mainMenuUl").addEventListener('click', (event) => {
    const activeCategory = document.querySelector('#mainMenuUl .active');
    const newActiveCategory = event.target;
    if (newActiveCategory.classList.contains('nav-link') && activeCategory !== event.target) {
        activeCategory.classList.remove('active');
        newActiveCategory.classList.add('active');
    }
});


const displayAllNews = (allNewsData, categoryName) => {
    const newsCards = document.getElementById("newsCards");
    allNewsData.forEach(newsData => {
        // console.log(newsData);

        const newsThumbnailURL = newsData.thumbnail_url;
        const newsTitle = newsData.title;
        let shortDescriptionLineBreak = 150;
        for (i = 150; i <= 165; i++ ) {
            if (newsData.details.slice(i, i+1) === ' ') {
                shortDescriptionLineBreak = i;
                break;
            }
        }
        const newsShortDescription = `${newsData.details.slice(0, shortDescriptionLineBreak)}<br><br>${newsData.details.slice(shortDescriptionLineBreak, 400)}...`;
        // console.log(newsShortDescription)

        const newNewsCard = document.createElement('div');
        newNewsCard.classList.add('col');
        newNewsCard.innerHTML = 
            `<div class="card h-100 shadow-sm p-3">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center">
                        <a href="#"><img src="${newsThumbnailURL}" id="newsThumbnail" class="img-fluid" alt="News Image"></a>
                    </div>
                    <div class="col-md-9 text-center text-md-start">
                        <div class="card-body">
                            <a href="#"><h5 class="card-title" id="newsTitle">${newsTitle}</h5></a>
                            <p class="card-text text-muted" id="newsShortDescription">${newsShortDescription}</p>
                            <div class="row justify-content-between align-items-center">
                                <div class="col-md-3 col-6">
                                    <div class="row align-items-center">
                                        <div class="col-4">
                                            <img class="img-fluid rounded-circle" id="authorImage" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHw%3D&w=1000&q=80">
                                        </div>
                                        <div class="col-8">
                                            <h6 class="fw-normal mb-0" id="authorName">Jane Cooper</h6>
                                            <p class="text-muted mb-0" id="publishedDate"><small>Jan 10, 2022</small></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6">
                                    <div class="d-flex justify-content-center align-items-center">
                                        <i class="fa-solid fa-eye text-muted"></i>
                                        <p class="mb-0 ms-2 text-muted" id="newsTotalViews">343 Views</p>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6">
                                    <div class="d-flex justify-content-center align-items-center" title="News Rating">
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star text-muted"></i>
                                        <i class="fa-solid fa-star-half-stroke text-muted"></i>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6 text-center">
                                    <div class="d-flex justify-content-center align-items-center">
                                        <a class="learn-more-anchor">
                                            <span class="text-muted me-2">Learn More</span>
                                            <i class="fa-solid fa-arrow-right fs-5 text-primary"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        newsCards.appendChild(newNewsCard);
    });

    dataNotFoundMessageSection(false);
    const newsFoundMessage = `${allNewsData.length} Items found for category of ${categoryName}.`;
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