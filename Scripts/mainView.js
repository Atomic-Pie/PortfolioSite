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