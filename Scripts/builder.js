document.addEventListener('DOMContentLoaded', () => {

    // Define a custom event named 'myEvent'
    const myEvent = new CustomEvent('myEvent', {
        detail: {
            message: 'Your custom message here',
            time: new Date(), // You can pass any data you want
        },
        bubbles: true, // Whether the event should bubble up through the DOM
        cancelable: true // Whether the event is cancelable
    });

    // Function to create a DOM element from a section item
    function createSectionItem(item) {
        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'row-item-wrapper';

        const rowItem = document.createElement('div');
        rowItem.className = 'row-item';
        rowItem.setAttribute('onclick', "openFocusedView(this)");

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

        overlay.appendChild(title);
        rowItem.appendChild(img);
        rowItem.appendChild(overlay);
        rowItem.appendChild(description);
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
            // Shuffle the new_popular items for random order
            shuffleArray(newPopularItems);

            const newPopularSection = {
                id: 'new_popular', // Assuming 'new_popular' is the ID for the New & Popular section
                type: 'content-row',
                title: 'New & Popular',
                items: newPopularItems
            };

            // Insert the 'New & Popular' section at the beginning of the sections div
            sectionsDiv.insertBefore(createSection(newPopularSection), sectionsDiv.firstChild);
        }
    }

    // Fetch section data from sections.json and start rendering sections
    fetch('sections.json')
        .then(response => response.json())
        .then(data => {
            renderSections(data.sections);
            document.dispatchEvent( new CustomEvent('myEvent', {})); // Call after sections are rendered
        })
        .catch(error => console.error('Error fetching section data:', error));
});