document.addEventListener("DOMContentLoaded", function handleDomReady() {
  // Smooth scroll is handled by CSS scroll-behavior. Add active link highlight on scroll.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navLinks
    .map(function getTarget(link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function updateActiveLink() {
    var scrollY = window.scrollY;
    var currentSectionId = sections.reduce(function findCurrent(activeId, section) {
      var rect = section.getBoundingClientRect();
      var top = rect.top + window.scrollY - 120; // offset for sticky header
      if (scrollY >= top) {
        return section.id || activeId;
      }
      return activeId;
    }, sections[0] ? sections[0].id : null);

    navLinks.forEach(function toggleActive(link) {
      var href = link.getAttribute('href');
      var isActive = currentSectionId && href === ('#' + currentSectionId);
      link.style.color = isActive ? '#ffffff' : '';
      link.style.backgroundColor = isActive ? 'rgba(96,165,250,0.18)' : '';
    });
  }

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink);

  // Contact form validation
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function handleSubmit(event) {
      event.preventDefault();

      // Helper to get controls
      var nameInput = form.querySelector('input[name="name"]');
      var emailInput = form.querySelector('input[name="email"]');
      var messageInput = form.querySelector('textarea[name="message"]');

      // Clear previous errors
      [nameInput, emailInput, messageInput].forEach(function clear(el) {
        if (!el) return;
        var next = el.nextElementSibling;
        if (next && next.classList && next.classList.contains('error-text')) {
          next.remove();
        }
        el.classList.remove('has-error');
      });

      var hasError = false;

      function showError(inputEl, message) {
        if (!inputEl) return;
        hasError = true;
        inputEl.classList.add('has-error');
        var error = document.createElement('div');
        error.className = 'error-text';
        error.textContent = message;
        inputEl.parentNode.insertBefore(error, inputEl.nextSibling);
      }

      // Required validations
      if (!nameInput || nameInput.value.trim() === '') {
        showError(nameInput, 'Please enter your name.');
      }

      if (!emailInput || emailInput.value.trim() === '') {
        showError(emailInput, 'Please enter your email.');
      } else {
        var emailValue = emailInput.value.trim();
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(emailValue)) {
          showError(emailInput, 'Please enter a valid email address.');
        }
      }

      if (!messageInput || messageInput.value.trim() === '') {
        showError(messageInput, 'Please enter a message.');
      }

      if (hasError) {
        return; // stop on validation errors
      }

      alert('Thank you for your message!');
      form.reset();
    });
  }

  // Typing animation in hero subheading
  var typedTarget = document.getElementById('typed-text');
  if (typedTarget) {
    var phrases = [
      'Cloud and Edge AI',
      'Telecom and Networking',
      'Embedded, IoT and Applications'
    ];

    var typingSpeedMs = 70;      // per character
    var deletingSpeedMs = 45;    // per character
    var holdAfterTypeMs = 1000;  // pause after typing a phrase
    var holdAfterDeleteMs = 450; // pause after deleting

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;

    function typeLoop() {
      var current = phrases[phraseIndex];

      if (!isDeleting) {
        // typing forward
        charIndex = Math.min(charIndex + 1, current.length);
        typedTarget.textContent = current.slice(0, charIndex);

        if (charIndex === current.length) {
          // finished a phrase
          setTimeout(function () { isDeleting = true; typeLoop(); }, holdAfterTypeMs);
        } else {
          setTimeout(typeLoop, typingSpeedMs);
        }
      } else {
        // deleting backward
        charIndex = Math.max(charIndex - 1, 0);
        typedTarget.textContent = current.slice(0, charIndex);

        if (charIndex === 0) {
          // move to next phrase
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeLoop, holdAfterDeleteMs);
        } else {
          setTimeout(typeLoop, deletingSpeedMs);
        }
      }
    }

    typeLoop();
  }
});
