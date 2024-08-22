let lastScrollY = window.scrollY;
let lastTime = Date.now();

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    const timeDifference = currentTime - lastTime;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY);
    const speed = scrollDifference / timeDifference;

    
    if (speed > 0.1) { 
        if (lastScrollY < currentScrollY) {
            document.querySelector('.navbar').style.top = '-100px'; // Hide
        } else {
            document.querySelector('.navbar').style.top = '0'; // Show
        }
    }

    lastScrollY = currentScrollY;
    lastTime = currentTime;
});

document.addEventListener('DOMContentLoaded', () => {
    setupFocusedModal();
});

document.addEventListener('onBuilderLoad', () => {
    const scrollContainers = document.querySelectorAll('.scroll-container');

    scrollContainers.forEach(container => {
        const row = container.querySelector('.row');
        if (!row || row.children.length === 0) {
            return; // Skip this container as it is empty or does not exist
        }
        const leftArrow = container.querySelector('.scroll-arrow.left');
        const rightArrow = container.querySelector('.scroll-arrow.right');
        let isLongPress = false;
        const scrollStep = 300; // Distance for single jump
        const LongPressIndicator = 200; // Time until long press is considered
        const LongPressSpeed = 7.5; // speed of Long Press scroll 
        let animationFrameId; // For cancelling the requestAnimationFrame

        function smoothScroll(start, end) {
            let startTime;
            const maxDuration = 350; // Adjust duration of the animation here, in milliseconds

            function scroll(timestamp) {
                startTime = startTime || timestamp;
                const runtime = timestamp - startTime;
                const progress = Math.min(runtime / maxDuration, 1);
                const value = start + (end - start) * progress;

                row.scrollLeft = value;

                if (runtime < maxDuration) {
                    animationFrameId = requestAnimationFrame(scroll);
                }
            }

            cancelAnimationFrame(animationFrameId); // Cancel any ongoing animations
            requestAnimationFrame(scroll);
        }

        function startContinuousScroll(direction) {
            isLongPress = true;
            let currentScrollPosition = row.scrollLeft;
            const increment = direction * LongPressSpeed; // Speed of continuous scroll, adjust as needed

            function continuousScroll() {
                if (isLongPress) {
                    currentScrollPosition += increment;
                    row.scrollLeft = currentScrollPosition;
                    requestAnimationFrame(continuousScroll);
                }
            }

            continuousScroll();
        }

        function setupArrowListeners(arrow, direction) {
            arrow.addEventListener('mousedown', () => {
                isLongPress = false; // Reset flag for detecting long press
                setTimeout(() => {
                    if (!isLongPress) { // If after the timeout we haven't flagged it as a long press
                        smoothScroll(row.scrollLeft, row.scrollLeft + direction * scrollStep);
                    }
                }, LongPressIndicator);

                pressTimer = setTimeout(() => {
                    isLongPress = true;
                    startContinuousScroll(direction);
                }, LongPressIndicator);
            });

            arrow.addEventListener('mouseup', () => {
                clearTimeout(pressTimer);
                isLongPress = false;
                cancelAnimationFrame(animationFrameId); // Cancel any ongoing animations when mouse up
            });

            arrow.addEventListener('mouseleave', () => {
                clearTimeout(pressTimer);
                isLongPress = false;
                cancelAnimationFrame(animationFrameId); // Cancel any ongoing animations when mouse leaves
            });
        }

        setupArrowListeners(leftArrow, -1);
        setupArrowListeners(rightArrow, 1);
    });
});

function scrollToSection(sectionId) {
    const searchInput = document.getElementById('search');
    searchInput.value = ''
    fuzzySearch('')
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, '#' + sectionId);  // Update the URL hash
    }
}

let debounceTimeout;

function fuzzySearch() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const searchInput = document.getElementById('search');
        const searchText = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.row-item');
        const searchResultsContainer = document.getElementById('search-results');
        const searchResultsContent = searchResultsContainer.querySelector('.scroll-content');
        const searchTermDisplay = document.getElementById('search-term');
        const featuredSection = document.querySelector('.featured-section');
        const newPopularSection = document.getElementById('new_popular');  // Getting the New & Popular section
        const otherSections = document.querySelectorAll('.content-row:not(#search-results, #new_popular)');

        // Clear previous results in the search results container
        searchResultsContent.innerHTML = '';

        let resultsFound = false;
        const foundItems = new Set();  // To track items and avoid duplicates

        items.forEach(item => {
            if (item.closest('#new_popular, #search-results')) {
                return; // Skip this iteration
            }

            const title = item.querySelector('.item-title').textContent.toLowerCase();
            const description = item.querySelector('.item-description').textContent.toLowerCase();
//            const genres = item.querySelector('.item-description').textContent.toLowerCase();
//            const descriptors = item.querySelector('.item-description').textContent.toLowerCase();
            let itemMatch = title.includes(searchText) || description.includes(searchText);

            // Searching within episodes
            const episodes = item.querySelectorAll('.episode');
            episodes.forEach(episode => {
                const episodeTitle = episode.querySelector('.episode-title').textContent.toLowerCase();
                const episodeDescription = episode.querySelector('.episode-description').textContent.toLowerCase();
                if (episodeTitle.includes(searchText) || episodeDescription.includes(searchText)) {
                    itemMatch = true; // Mark the main item for display if an episode matches
                }
            });

            if (itemMatch) {
                const itemKey = title + description; // Unique key for the main item
                if (!foundItems.has(itemKey)) {
                    foundItems.add(itemKey);
                    const clonedItem = item.cloneNode(true);
                    clonedItem.style.display = '';
                    searchResultsContent.appendChild(clonedItem);
                    resultsFound = true;
                }
            }
        });

        if (searchText.trim() !== '') {
            featuredSection.style.display = 'none';
            newPopularSection.style.display = 'none';
            otherSections.forEach(section => section.style.display = 'none');
            searchResultsContainer.style.display = '';
            searchTermDisplay.textContent = `"${searchInput.value}"`;
        } else {
            featuredSection.style.display = '';
            newPopularSection.style.display = '';
            otherSections.forEach(section => section.style.display = '');
            searchResultsContainer.style.display = 'none';
        }

        if (!resultsFound && searchText.trim() !== '') {
            searchResultsContent.innerHTML = `<p>Sorry, we searched everywhere but we did not find any movie or TV show with that title or description.</p>`;
        }
    }, 200); // 300ms debounce delay
}