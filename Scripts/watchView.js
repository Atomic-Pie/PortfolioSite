var watchIsOpen = false

function openWatchView(episodeElement) {
    if (watchIsOpen) {
        closeWatchView(); // Optionally close any already open watch view.
    }

    watchIsOpen = true;

    // Navigate up to a common ancestor if needed or directly access a sibling/parent element that holds the main title
    const mainInfoContainer = episodeElement.closest('.focused-content');

    // Extract main title from the common container
    const mainTitle = mainInfoContainer.querySelector('#focusedTitle').textContent;
    const season = mainInfoContainer.querySelector('.focused-seasons').textContent; // Extracting season assuming it's stored here

    // Extracting episode-specific information
    const imageSrc = episodeElement.querySelector('img').src;
    const episodeTitle = episodeElement.querySelector('.episode-title').textContent;
    const description = episodeElement.querySelector('.episode-description').textContent;
    const episodeNumber = episodeElement.querySelector('.episode-number').textContent.trim();

    // Update the watchView element with extracted data
    const watchView = document.querySelector('.watchView');
    watchView.querySelector('.watchImage').src = imageSrc;
    watchView.querySelector('.watchImage').alt = `Thumbnail for ${episodeTitle}`;
    watchView.querySelector('.watchTitle').textContent = mainTitle;
    watchView.querySelector('.watchEpisodeTitle').textContent = `Episode ${episodeNumber.replace('.', '')}: ${episodeTitle}`;
    watchView.querySelector('.watchDescription').textContent = description;
    watchView.querySelector('.season').textContent = season;

    // Prepare the watchView for the animation
    watchView.style.display = 'block'; // Ensure the element is set to be visible, not 'none'
    watchView.style.opacity = '0'; // Start from transparent
    watchView.style.transition = 'opacity 0.4s ease-in-out'; // Set the transition for the fade-in effect

    // Start the fade-in animation slightly after the element is visible
    setTimeout(() => {
        watchView.style.opacity = '1'; // Fade in to fully visible
    }, 10); // Short delay to ensure the initial state is rendered first

    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}


// Close function for watchView, assuming you might need one
function closeWatchView() {
    const watchView = document.querySelector('.watchView');

    // Set up the transition for opacity fade out
    watchView.style.transition = 'opacity 0.4s ease-in-out';
    watchView.style.opacity = '0'; // Start fade out

    // Wait for the transition to finish before hiding the element
    setTimeout(() => {
        watchIsOpen = false;
        watchView.style.display = 'none'; // Hide the watchView
        watchView.style.opacity = '1'; // Reset opacity to fully visible for next time it opens
        watchView.style.transition = 'none'; // Remove transition to reset without animation
    }, 400); // Match the timeout to the duration of the transition
}
