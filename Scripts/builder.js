import { dataStore } from './dataStore.js';

document.addEventListener('DOMContentLoaded', () => {

    // Function to create a DOM element from a section item
    function createSectionItem(item) {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'row-item-wrapper';
    
        const rowItem = document.createElement('div');
        rowItem.className = 'row-item';
        rowItem.setAttribute('onclick', "openFocusedView(this)");
        rowItem.setAttribute('data-year', item.year);
        rowItem.setAttribute('data-episode-count', item.episodes ? item.episodes.length : 0); // Store episode count
    
        // Store episodes data as JSON string in dataset
        if (item.episodes && item.episodes.length > 0) {
            rowItem.dataset.episodes = JSON.stringify(item.episodes);
        }
    
        const img = document.createElement('img');
        img.src = item.imageSrc;
        img.alt = item.title;
    
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
    
        const title = document.createElement('div');
        title.className = 'item-title';
        title.textContent = item.title;
    
        const description = document.createElement('p');
        description.className = 'item-description hidden';
        description.textContent = item.description;
    
        // Logic to handle genres and descriptors
        const genres = item.genres ? item.genres.join(', ') : '';
        const descriptors = item.descriptors ? item.descriptors.join(', ') : '';
    
        const genresElement = document.createElement('p');
        genresElement.className = 'item-genres';
        genresElement.innerHTML = `<span class="genres">Genres:</span> ${genres}`;
    
        const descriptorsElement = document.createElement('p');
        descriptorsElement.className = 'item-descriptors';
        descriptorsElement.innerHTML = `<span class="descriptors">This show is:</span> ${descriptors}`;
    
        overlay.appendChild(title);
        rowItem.appendChild(img);
        rowItem.appendChild(overlay);
        rowItem.appendChild(description);
    
        // Append genres and descriptors if they exist
        if (genres) {
            rowItem.appendChild(genresElement);
        }
        if (descriptors) {
            rowItem.appendChild(descriptorsElement);
        }
    
        itemWrapper.appendChild(rowItem);
    
        return itemWrapper;
    }
    
    

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    // Function to create a DOM element from a section
    function createSection(section) {
        const sectionElement = document.createElement('section');
        sectionElement.className = 'content-row';
        sectionElement.id = section.id;
    
        const title = document.createElement('h2');
        title.className = 'row-title';
        title.textContent = section.title;
    
        const scrollContainer = document.createElement('div');
        scrollContainer.className = 'scroll-container';
    
        // Add left arrow for the scroll functionality
        const leftArrow = document.createElement('div');
        leftArrow.className = 'scroll-arrow left';
        leftArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        // Add right arrow for the scroll functionality
        const rightArrow = document.createElement('div');
        rightArrow.className = 'scroll-arrow right';
        rightArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
        const scrollContent = document.createElement('div');
        scrollContent.className = 'scroll-content';
    
        const row = document.createElement('div');
        row.className = 'row';
    
        section.items.forEach(item => {
            row.appendChild(createSectionItem(item));
        });
    
        scrollContent.appendChild(row);
    
        // Append arrows and the scrollable content to the scroll container
        scrollContainer.appendChild(leftArrow);
        scrollContainer.appendChild(scrollContent);
        scrollContainer.appendChild(rightArrow);
        sectionElement.appendChild(title);
        sectionElement.appendChild(scrollContainer);
    
        return sectionElement;
        
    }

    function createNavButtons(sections) {
        const navContainer = document.querySelector('.navigation');
        navContainer.innerHTML = ''; // Clear any existing buttons
    
        // Manually add the "Home" and "New & Popular" buttons first
        const predefinedButtons = [
            { id: 'home', title: 'Home' },
            { id: 'new_popular', title: 'New & Popular' }
        ];
    
        predefinedButtons.forEach(section => {
            const navButton = document.createElement('a');
            navButton.className = 'nav-link';
            navButton.textContent = section.title;
            navButton.setAttribute('onclick', `scrollToSection('${section.id}')`);
            navContainer.appendChild(navButton);
        });
    
        // Dynamically add the rest of the sections
        sections.forEach(section => {
            const navButton = document.createElement('a');
            navButton.className = 'nav-link';
            navButton.textContent = section.title;
            navButton.setAttribute('onclick', `scrollToSection('${section.id}')`);
            navContainer.appendChild(navButton);
        });
    }
    

    // Function to render all sections
    function renderSections(sections) {
        const sectionsDiv = document.getElementById('sections');
        const newPopularItems = []; // Array to hold items marked as 'new_popular'
    
        sections.forEach(section => {
            // Check each item to see if it should also be included in the 'New & Popular' section
            section.items.forEach(item => {
                if (item.new_popular === "True") {
                    newPopularItems.push(item);
                }
            });
    
            // Append the section normally
            sectionsDiv.appendChild(createSection(section));
        });
    
        // Now create and append the 'New & Popular' section if there are any new_popular items
        if (newPopularItems.length > 0) {
            shuffleArray(newPopularItems);
    
            const newPopularSection = {
                id: 'new_popular',
                type: 'content-row',
                title: 'New & Popular',
                items: newPopularItems
            };
    
            // Insert the 'New & Popular' section at the beginning of the sections div
            sectionsDiv.insertBefore(createSection(newPopularSection), sectionsDiv.firstChild);
        }
    
        // Create navigation buttons dynamically based on section titles
        createNavButtons(sections);
    }
    

// Use dataStore to fetch and render sections
(async () => {
    try {
        const data = await dataStore.fetchData(); // Fetch data asynchronously

        // Extract Hero section
        const heroSection = data.Hero[0]; 
        //console.log(heroSection);

        // Update the "More Info" button in the HTML to use hero data
        document.querySelector('.featured-buttons .button').onclick = () => {
            openFocusedView(
                document.querySelector('.featured-buttons .button'), // No specific element is passed
                heroSection.title, // Title of the Hero
                heroSection.imageSrc, // Hero image
                heroSection.description, // Hero description
                heroSection.year || 'Unknown', // Year of the Hero item
                heroSection.episodes ? heroSection.episodes.length : 0, // Number of episodes if available
                heroSection.genres ? heroSection.genres.join(', ') : '', // Convert genres array to string
                heroSection.descriptors ? heroSection.descriptors.join(', ') : '', // Convert descriptors array to string
                heroSection.episodes // Pass episodes array
            );
        };

        // Render other sections
        renderSections(data.sections); 

        // Dispatch the event after everything is done
        document.dispatchEvent(new CustomEvent('onBuilderLoad', {})); 
    } catch (error) {
        console.error('Error fetching section data:', error);
    }
})();
});