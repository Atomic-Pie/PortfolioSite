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
    const scrollContainers = document.querySelectorAll('.scroll-container');

    scrollContainers.forEach(container => {
        const row = container.querySelector('.row');
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

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navigation = document.querySelector('.navigation');
    
    hamburger.addEventListener('click', () => {
        navigation.classList.toggle('active');
    });
});

function openFocusedView(element, title = '', imageSrc = '', description = '') {
    // Extract elements and set content as before
    const imageElement = !imageSrc && element ? element.querySelector('img') : null;
    const titleElement = !title && element ? element.querySelector('.item-title') : null;
    const descriptionElement = element.querySelector('.item-description');

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

    // Define final size and scale, then call animateFocusedView
    const finalWidth = window.innerWidth * 0.8; // Max width, but will be limited to 50% in CSS
    const finalHeight = window.innerHeight * 0.965; // Based on final styles
    const initialScale = 0.1; // Starting scale
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
        focusedContent.style.transition = 'all 0.5s ease-in-out';
        focusedContent.style.width = ''; // Set to final width
        focusedContent.style.height = ''; // Set to final height
        focusedContent.style.top = finalTop; // Center vertically based on final styles
        focusedContent.style.left = finalLeft; // Center horizontally
        focusedContent.style.opacity = '1';

    }, 10); // Short delay to ensure the initial state is rendered first
}

function closeFocusedView() {
    const backdrop = document.querySelector('.focused-backdrop');
    backdrop.style.display = 'none'; // Hide the backdrop
    const focusedContent = document.querySelector('.focused-content');
    focusedContent.style.transition = 'none'; // Remove transition to reset without animation
}


let clickStartedInside = false;

function setupFocusedModal() {
    const focusedBackdrop = document.querySelector('.focused-backdrop');
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

document.addEventListener('DOMContentLoaded', (event) => {
    setupFocusedModal();
});