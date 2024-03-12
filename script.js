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
    // Extract elements only if necessary
    const imageElement = !imageSrc && element ? element.querySelector('img') : null;
    const titleElement = !title && element ? element.querySelector('.item-title') : null;
    // For description, you might need a similar approach depending on where it's coming from
    
    // Update each property only if it was not provided and is available from the element
    if (!title && titleElement) {
        title = titleElement.textContent;
    }

    if (!imageSrc && imageElement) {
        imageSrc = imageElement.src;
    }

    // Update the description if necessary
    // Note: Update this logic according to how your descriptions are structured.
    if (!description) {
        // Assuming you might have a .item-description class or similar for descriptions
        const descriptionElement = element ? element.querySelector('.item-description') : null;
        description = descriptionElement ? descriptionElement.textContent : 'Default description';
    }

    // Set the content of the focused view
    document.getElementById('focusedTitle').textContent = title;
    document.getElementById('focusedImage').src = imageSrc;
    document.getElementById('focusedImage').alt = title;
    document.getElementById('focusedDescription').textContent = description;
    document.getElementById('focusedItem').classList.remove('focused-item-hidden');
}


function closeFocusedView() {
    document.getElementById('focusedItem').classList.add('focused-item-hidden');
}
