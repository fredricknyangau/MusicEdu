// Display response messages on the page
function displayMessage(selector, message, isError = false) {
  const messageElement = document.querySelector(selector);
  if (messageElement) {
    messageElement.textContent = message;
    messageElement.style.color = isError ? 'red' : 'green';
  }
}
  
// Hamburger menu toggle for mobile
function handleHamburgerMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navLinks.classList.toggle('active');
    });
  }
}
  
// Button interaction on the home page
function handleExploreButton() {
  const exploreButton = document.querySelector('.btn');
  if (exploreButton) {
    exploreButton.addEventListener("click", function () {
      alert("Let's explore some instruments!");
    });
  }
}