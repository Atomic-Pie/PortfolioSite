let clickStartedInside = false;

function openFocusedView(element, title = '', imageSrc = '', description = '') {
    const imageElement = !imageSrc && element ? element.querySelector('img') : null;
    const titleElement = !title && element ? element.querySelector('.item-title') : null;
    const descriptionElement = element.querySelector('.item-description');
    const episodesElement = element.querySelector('.item-episodes'); // Grab episodes container if present

    if (!title && titleElement) {
        title = titleElement.textContent;
    }

    if (!imageSrc && imageElement) {
        imageSrc = imageElement.src;
    }

    if (!description && descriptionElement) {
        description = descriptionElement.textContent;
    }

    document.getElementById('focusedTitle').textContent = title;
    document.getElementById('focusedImage').src = imageSrc;
    document.getElementById('focusedImage').alt = title;
    document.getElementById('focusedDescription').textContent = description;
    document.getElementById('focusedItem').classList.remove('focused-item-hidden');
    document.body.style.overflow = 'hidden';

    const backdrop = document.querySelector('.focused-backdrop');
    backdrop.style.display = 'flex'; // Show the backdrop

    // Clear existing episodes
    const focusedEpisodes = document.getElementById('focusedEpisodes');
    focusedEpisodes.innerHTML = '';

    // Create and display episodes if they exist
    if (episodesElement) {

        // Add a heading to the episodes section
        const episodesHeading = document.createElement('h2');
        episodesHeading.textContent = 'Episodes';
        focusedEpisodes.appendChild(episodesHeading);

        Array.from(episodesElement.children).forEach((episode, index) => {
            // Create the episode container with flex display
            const episodeContainer = document.createElement('div');
            episodeContainer.className = 'episode';
            episodeContainer.style.display = 'flex'; // Added display flex here

            // Add the episode number
            const episodeNumber = document.createElement('div');
            episodeNumber.className = 'episode-number';
            episodeNumber.textContent = `${index + 1}.`; // Adjust index to start from 1
            episodeContainer.appendChild(episodeNumber);

            // Create and append the image element
            const episodeImg = document.createElement('img');
            episodeImg.src = episode.querySelector('img').src;
            episodeImg.alt = `Thumbnail for episode ${index + 1}`;
            episodeContainer.appendChild(episodeImg);

            // Create and append the text container
            const episodeTextContainer = document.createElement('div');
            episodeTextContainer.className = 'episode-text-container';

            const episodeTitle = document.createElement('div');
            episodeTitle.className = 'episode-title';
            episodeTitle.textContent = episode.querySelector('.episode-title').textContent;
            episodeTextContainer.appendChild(episodeTitle);

            const episodeDescription = document.createElement('p');
            episodeDescription.className = 'episode-description';
            episodeDescription.textContent = episode.querySelector('.episode-description').textContent;
            episodeTextContainer.appendChild(episodeDescription);

            episodeContainer.appendChild(episodeTextContainer);

            focusedEpisodes.appendChild(episodeContainer);
        });
    }

    // Animate the view
    const finalWidth = window.innerWidth * 0.8;
    const finalHeight = window.innerHeight * 0.965;
    const initialScale = 0.1;
    animateFocusedView(element, finalWidth, finalHeight, initialScale);
}

function animateFocusedView(element, finalWidth, finalHeight, initialScale) {
    const focusedContent = document.querySelector('.focused-content');
    const rect = element.getBoundingClientRect(); // Get clicked element's dimensions and position

    // Calculate center position for the final state
    const finalTop = '3.5vh';
    const finalLeft = '25%'; // Since final width is 50% of the viewport

    // Set initial state mimicking 'scale(0.1)' using size and position
    focusedContent.style.width = `${finalWidth * initialScale}px`;
    focusedContent.style.height = `${finalHeight * initialScale}px`;
    focusedContent.style.top = `${rect.top + (rect.height / 2) - (finalHeight * initialScale / 2)}px`;
    focusedContent.style.left = `${rect.left + (rect.width / 2) - (finalWidth * initialScale / 2)}px`;
    focusedContent.style.opacity = '0'; // Start invisible for a fade-in effect

    setTimeout(() => {
        // Apply the final styles with transition for smooth animation
        focusedContent.style.transition = 'all 0.4s ease-in-out';
        focusedContent.style.width = ''; // Set to final width
        focusedContent.style.height = ''; // Set to final height
        focusedContent.style.top = finalTop; // Center vertically based on final styles
        focusedContent.style.left = finalLeft; // Center horizontally
        focusedContent.style.opacity = '1';

    }, 10); // Short delay to ensure the initial state is rendered first
}

function closeFocusedView() {
    const backdrop = document.querySelector('.focused-backdrop');
    const focusedContent = document.querySelector('.focused-content');
    backdrop.style.display = 'none'; // Hide the backdrop
    focusedContent.style.transition = 'none'; // Remove transition to reset without animation
    document.body.style.overflow = ''; 
}

function setupFocusedModal() {
    const focusedContent = document.querySelector('.focused-content');

    // Check if mousedown started inside focused content
    focusedContent.addEventListener('mousedown', () => {
        clickStartedInside = true;
    });

    // This prevents the modal from closing when clicking inside the content
    focusedContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Reset flag after mouseup occurs anywhere in the document
    document.addEventListener('mouseup', (event) => {
        if (!clickStartedInside && !focusedContent.contains(event.target)) {
            closeFocusedView();
        }
        clickStartedInside = false; // Reset for the next action
    });
}