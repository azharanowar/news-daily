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


// Change active categories nav item...
document.getElementById("mainMenuUl").addEventListener('click', (event) => {
    const activeCategory = document.querySelector('#mainMenuUl .active');
    const newActiveCategory = event.target;
    if (newActiveCategory.classList.contains('nav-link') && activeCategory !== event.target) {
        activeCategory.classList.remove('active');
        newActiveCategory.classList.add('active');

        // If home page active function calling;
        homePageContent();
    }
});


const getAllNewsByCategoryId = async(categoryId, categoryName = '', sortBy = 'default', newsFilterOption = '') => {
    websitePreloader(true);

    // News sort related work...
    document.getElementById("categoryIdField").value = categoryId;
    document.getElementById("categoryNameField").value = categoryName;
    document.getElementById("newsSortByOptions").value = sortBy;
    
    document.getElementById("newsCards").innerHTML = '';
    const response = await fetch(`https://openapi.programming-hero.com/api/news/category/${categoryId}`);
    const data = await response.json();
    if (data.status) {
        let allNewsData = data.data;
        
        if (sortBy === 'most-viewed') {
            allNewsData.sort((a,b) => b?.total_view - a?.total_view);
        } else if (sortBy === 'most-recent') {
            allNewsData.sort((a,b) => {
                let aPublicationDate = new Date(a.author.published_date);
                let bPublicationDate = new Date(b.author.published_date);
                return bPublicationDate - aPublicationDate;
            });
        }

        if (newsFilterOption === 'todays-pick') {
            allNewsData = allNewsData.filter(news => news.others_info.is_todays_pick);
        } else if (newsFilterOption === 'trending') {
            allNewsData = allNewsData.filter(news => news.others_info.is_trending);
        }

        if (allNewsData.length !== 0) {
            displayAllNews(allNewsData, categoryName);
            const newsFoundMessage = `${allNewsData.length} News found by the category of ${categoryName}.`;
            newsDataFoundMessage(true, newsFoundMessage);
        } else {
            // Error data not found...
            newsDataFoundMessage(false);
            dataNotFoundMessageSection(true);
            websitePreloader(false);
        }
    } else {
        // Error data not found...
        newsDataFoundMessage(false);
        dataNotFoundMessageSection(true);
        websitePreloader(false);
    }

}

const displayAllNews = (allNewsData, categoryName) => {
    const newsCards = document.getElementById("newsCards");
    allNewsData.forEach(newsData => {
        // console.log(newsData);

        const newsThumbnailURL = newsData.thumbnail_url;
        const newsTitle = newsData.title;
        const newsId = newsData._id;

        // News short description...
        const newsShortDescription = getNewsShortDescription(newsData.details);

        // News author information...
        const newsAuthorThumbnailURL = newsData.author.img;
        const newsAuthorName = newsData.author.name ? newsData.author.name : "No Data Available";

        // News publication date...
        const newsPublicationDate = getPublicationDate(newsData.author.published_date);

        

        const newsTotalViews = newsData.total_view ? newsData.total_view : "0";

        // News rating...
        const newsRatingBadge = newsData.rating.badge;

        // Here now no review number providing as argument because in this API all review number is same (4.5)...
        // const newsRatingStars = getNewsRatingStars(newsData.rating.number);
        const newsRatingStars = getNewsRatingStars();

        const newNewsCard = document.createElement('div');
        newNewsCard.classList.add('col');
        newNewsCard.innerHTML = 
            `<div class="card h-100 shadow-sm py-3 px-0 px-md-3">
                <div class="row align-items-center">
                    <div class="col-md-3 text-center">
                        <a href="#" onclick="getNewsDetailedInformationById('${newsId}')" data-bs-toggle="modal" data-bs-target="#newsDetailedInformationModal"><img src="${newsThumbnailURL}" id="newsThumbnail" class="img-fluid" alt="${newsTitle} Image"></a>
                    </div>
                    <div class="col-md-9 text-center text-md-start">
                        <div class="card-body">
                            <a href="#" onclick="getNewsDetailedInformationById('${newsId}')" data-bs-toggle="modal" data-bs-target="#newsDetailedInformationModal"><h5 class="card-title text-start" id="newsTitle">${newsTitle}</h5></a>
                            <p class="card-text text-muted text-start" id="newsShortDescription">${newsShortDescription}</p>
                            <div class="row justify-content-between align-items-center">
                                <div class="col-md-3 col-6 mb-2 mb-md-0">
                                    <div class="row align-items-center text-start">
                                        <div class="col-3 col-md-4">
                                            <img class="img-fluid rounded-circle" id="authorImage" src="${newsAuthorThumbnailURL}" alt="Author ${newsAuthorName} Image">
                                        </div>
                                        <div class="col-9 col-md-8">
                                            <h6 class="fw-normal mb-0 text-capitalize" id="authorName">${newsAuthorName}</h6>
                                            <p class="text-muted mb-0" id="publishedDate"><small>${newsPublicationDate}</small></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6 mb-2 mb-md-0">
                                    <div class="d-flex justify-content-end justify-content-md-center align-items-center">
                                        <i class="fa-solid fa-eye text-muted"></i>
                                        <p class="mb-0 ms-2 text-muted" id="newsTotalViews">${newsTotalViews} Views</p>
                                    </div>
                                </div>
                                <div class="col-md-3 col-6">
                                    <div class="d-flex justify-content-start justify-content-md-center align-items-center" title="News Rating: ${newsRatingBadge}">
                                        ${newsRatingStars}
                                    </div>
                                </div>
                                <div class="col-md-3 col-6 text-center">
                                    <div class="d-flex justify-content-end justify-content-md-center align-items-center">
                                        <a class="learn-more-anchor" onclick="getNewsDetailedInformationById('${newsId}')" data-bs-toggle="modal" data-bs-target="#newsDetailedInformationModal">
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
    websitePreloader(false);
}

const getNewsDetailedInformationById = async(newsId) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/news/${newsId}`);
    const data = await response.json();

    if (data.status) {
        displayNewsDetailedInformation(data.data[0]);
    } else {
        dataNotFoundMessageSection(true);
    }
}

const displayNewsDetailedInformation = newsDetailedData => {

    const newsTitle = newsDetailedData.title;
    const newsThumbnailURL = newsDetailedData.image_url;
    const newsFullDescription = newsDetailedData.details;
    const newsCategoryId = newsDetailedData.category_id;

    // News author information...
    const newsAuthorName = newsDetailedData.author.name ? newsDetailedData.author.name : "No Data Available";
    const newsAuthorThumbnailURL = newsDetailedData.author.img;

    // News publication date...
    const newsPublicationDate = getPublicationDate(newsDetailedData.author.published_date);

    const newsTotalViews = newsDetailedData.total_view ? newsDetailedData.total_view : "No Views";

    // News rating...
    const newsRatingBadge = newsDetailedData.rating.badge;

    // Here now no review number providing as argument because in this API all review number is same (4.5)...
    // const newsRatingStars = getNewsRatingStars(newsDetailedData.rating.number);
    const newsRatingStars = getNewsRatingStars();


    document.getElementById("newsDetailedModalTitle").innerText = newsTitle;
    document.getElementById("newsDetailedModalFullDescription").innerText = newsFullDescription;
    document.getElementById("newsDetailedModalThumbnailImg").src = newsThumbnailURL;
    
    document.getElementById("newsDetailedModalAuthorName").innerText = newsAuthorName;
    document.getElementById("newsDetailedModalAuthorThumbnail").src = newsAuthorThumbnailURL;

    document.getElementById("newsDetailedModalPublicationDate").innerText = newsPublicationDate;

    document.getElementById("newsDetailedModalRatings").innerHTML = `${newsRatingStars} (${newsRatingBadge})`;
    document.getElementById("newsDetailedModalTotalViews").innerText = newsTotalViews;
}


document.getElementById("newsSortByOptions").addEventListener('change', (event) => {
    const categoryId = document.getElementById("categoryIdField").value;
    const categoryName = document.getElementById("categoryNameField").value;
    const sortByValue = event.target.value;
    if (categoryId) {
        getAllNewsByCategoryId(categoryId, categoryName, sortByValue);
    }
});


document.getElementById("newsFilterBtnSection").addEventListener('click', (event) => {
    const activeFilterBtn = document.querySelector("#newsFilterBtnSection .news-today-btn-active");
    if(event.target.classList.contains('news-filter-btn')) {
        if(event.target !== activeFilterBtn) {
            activeFilterBtn.classList.remove('news-today-btn-active');
            event.target.classList.add('news-today-btn-active');

            const categoryId = document.getElementById("categoryIdField").value;
            const categoryName = document.getElementById("categoryNameField").value;
            const sortByValue = document.getElementById("newsSortByOptions").value;
            getAllNewsByCategoryId(categoryId, categoryName, sortByValue, event.target.value);
        }
    };
});



// Common website...

const getPublicationDate = (providedDate) => {
    const newsPublicationDate = new Date(providedDate);
    const yyyy = newsPublicationDate.getFullYear();
    let mm = newsPublicationDate.getMonth() + 1; // Months start at 0!
    let dd = newsPublicationDate.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedPublicationDate = dd + '/' + mm + '/' + yyyy;
    return formattedPublicationDate;
}

const getNewsShortDescription = description => {
    let shortDescriptionLineBreak = 150;
    for (i = 150; i <= 165; i++ ) {
        if (description.slice(i, i+1) === ' ') {
            shortDescriptionLineBreak = i;
            break;
        }
    }
    const newsShortDescription = `${description.slice(0, shortDescriptionLineBreak)}<br><br>${description.slice(shortDescriptionLineBreak, 400)}...`;
    return newsShortDescription;
}

const getNewsRatingStars = (rating = Math.floor(Math.random() * (5.00 -3.00 + 3.7)) + 1.5) => {
    // Now taking random rating because in API all rating is 4.5...

    // Make rating with in rating range(0-5)...
    rating < 0 ? rating = 0 : rating;
    rating > 5 ? rating = 5 : rating;

    let ratingStar = '';
    if ( rating >= 0 && rating <= 5 ) {
        const fullStarRating = Math.floor(rating);
        const halfStarRating = rating - fullStarRating ? 1 : 0;
        const restStar = 5 - (fullStarRating + halfStarRating);
        if (fullStarRating) {
            for (i = 1; i <= fullStarRating; i++) {
                ratingStar += '<i class="fa-solid fa-star text-muted"></i>\n';
            }
        }
        if (halfStarRating){
            ratingStar += '<i class="fa-solid fa-star-half-stroke text-muted"></i>\n';
        }
        for (i=1; i <= restStar; i++) {
            ratingStar += '<i class="fa-regular fa-star text-muted"></i>\n';
        }
        return ratingStar;
    }
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
    const newsSortingSection = document.getElementById("newsSortingSection");
    if (displaySection) {
        newsFoundMessageSection.style.display = "flex";
        newsSortingSection.style.display = "flex";
        document.getElementById("newsFoundMessage").innerText = message;
    } else {
        newsFoundMessageSection.style.display = "none";
        newsSortingSection.style.display = "none";
    }
}

document.getElementById("newsFoundMessageSectionHide").addEventListener('click', () => {
    document.getElementById("newsFoundMessageSection").style.display = "none";
});




// Home page content showing...

const getSliderContent = async() => {
    const response = await fetch('https://openapi.programming-hero.com/api/news/category/04');
    const data = await response.json();
    
    if (data.status === true) {
        displaySliderContent(data.data);
    }
}

const displaySliderContent = (newsDataItems) => {
    const sliderIndicators = document.getElementById("sliderIndicators");
    for (i = 0; i < newsDataItems.length; i++) {
        const newSliderIndicator = document.createElement('button');
        newSliderIndicator.setAttribute('type', 'button');
        newSliderIndicator.setAttribute('data-bs-target', '#homePageHeroSectionSlider');
        newSliderIndicator.setAttribute('data-bs-slide-to', i);
        newSliderIndicator.setAttribute('aria-label', 'Slide ' + i);
        if (i === 0) {
            newSliderIndicator.setAttribute('class', 'active');
        }

        sliderIndicators.appendChild(newSliderIndicator);
    }
}

const homePageContent = () => {
    const isHomePageNavMenuActive = document.getElementById("homePageNavLink").classList.contains('active');
    if (isHomePageNavMenuActive) {

        document.getElementById("categoryNewsSection").style.display = "none";
        document.getElementById("homePageSection").style.display = "block";

        getSliderContent();

    } else {
        document.getElementById("categoryNewsSection").style.display = "block";
        document.getElementById("homePageSection").style.display = "none";
    }
}


homePageContent();