var watchIsOpen = false

function openWatchView(episodeElement) {
    //closeFocusedView()
    watchIsOpen = true
    // Navigate up to a common ancestor if needed or directly access a sibling/parent element that holds the main title
    const mainInfoContainer = episodeElement.closest('.focused-content'); // Adjust selector as needed based on actual structure

    // Extract main title from the common container
    const mainTitle = mainInfoContainer.querySelector('#focusedTitle').textContent;
    const season = mainInfoContainer.querySelector('.focused-seasons').textContent; // Extracting season assuming it's stored here

    // Extracting episode-specific information
    const imageSrc = episodeElement.querySelector('img').src;
    const episodeTitle = episodeElement.querySelector('.episode-title').textContent;
    const description = episodeElement.querySelector('.episode-description').textContent;
    const episodeNumber = episodeElement.querySelector('.episode-number').textContent.trim();

    // Updating the watchView element with extracted data
    document.querySelector('.watchImage').src = imageSrc;
    document.querySelector('.watchImage').alt = `Thumbnail for ${episodeTitle}`;
    document.querySelector('.watchTitle').textContent = mainTitle;
    document.querySelector('.watchEpisodeTitle').textContent = `Episode ${episodeNumber.replace('.', '')}: ${episodeTitle}`;
    document.querySelector('.watchDescription').textContent = description;
    document.querySelector('.season').textContent = season;

    // Making the watchView visible
    document.querySelector('.watchView').style.display = '';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close function for watchView, assuming you might need one
function closeWatchView() {
    watchIsOpen = false
    document.querySelector('.watchView').style.display = 'none';
    document.body.style.overflow = ''; // Re-enable scrolling
}
