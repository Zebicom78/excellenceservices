/* ==========================================================================
   BEST CLEANING - MAIN VANILLA JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Initialize AOS Animation Library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  /* ------------------------------------------------------------------------
     1. STICKY HEADER & BACK-TO-TOP BUTTON
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.main-header');
  const backToTopBtn = document.querySelector('.float-back-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     2. ANNOUNCEMENT BAR CLOSE
     ------------------------------------------------------------------------ */
  const announcementClose = document.querySelector('.announcement-close');
  const announcementBar = document.querySelector('.announcement-bar');

  if (announcementClose && announcementBar) {
    if (sessionStorage.getItem('announcement_closed') === 'true') {
      announcementBar.style.display = 'none';
    }

    announcementClose.addEventListener('click', () => {
      announcementBar.style.display = 'none';
      sessionStorage.setItem('announcement_closed', 'true');
    });
  }

  /* ------------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
     ------------------------------------------------------------------------ */
  const mobileToggleBtn = document.querySelector('.mobile-toggle-btn');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileDrawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileDrawerClose = document.querySelector('.mobile-drawer-close');

  function openMobileDrawer() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.add('active');
      mobileDrawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileDrawer() {
    if (mobileDrawer && mobileDrawerOverlay) {
      mobileDrawer.classList.remove('active');
      mobileDrawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileDrawer);
  if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  /* ------------------------------------------------------------------------
     4. SEARCH MODAL POPUP
     ------------------------------------------------------------------------ */
  const searchTriggers = document.querySelectorAll('.search-trigger-btn');
  const searchModal = document.querySelector('.search-modal');
  const searchInput = document.querySelector('.search-input');
  const searchResultsList = document.querySelector('.search-results-list');

  const servicesData = [
    { name: 'Home Deep Cleaning', desc: 'Complete sanitization & top-to-bottom deep cleaning for residences', url: 'services.html#home' },
    { name: 'Office Deep Cleaning', desc: 'Sanitized workstations, pantries, floors & corporate workspace cleaning', url: 'services.html#office' },
    { name: 'Commercial Deep Cleaning', desc: 'Heavy-duty deep cleaning for retail spaces, showrooms & commercial facilities', url: 'services.html#commercial' },
    { name: 'Carpet Shampoo Wash', desc: 'Deep steam extraction shampoo wash & stain removal', url: 'services.html#carpet' }
  ];

  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        renderSearchResults('');
      }
    }
  }

  function closeSearchModal() {
    if (searchModal) {
      searchModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearchModal));

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }

  function renderSearchResults(query) {
    if (!searchResultsList) return;

    const filtered = servicesData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted);">No services matching "${query}"</div>`;
      return;
    }

    searchResultsList.innerHTML = filtered.map(item => `
      <a href="${item.url}" class="search-result-item">
        <i class="fa-solid fa-sparkles"></i>
        <div>
          <div style="font-weight: 700; color: var(--secondary);">${item.name}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">${item.desc}</div>
        </div>
      </a>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
  }

  /* ------------------------------------------------------------------------
     5. ANIMATED COUNTERS
     ------------------------------------------------------------------------ */
  const counterElements = document.querySelectorAll('.counter-num, .hero-stat-num');

  const observerOptions = { threshold: 0.5 };
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.getAttribute('data-target') || el.innerText.replace(/[^0-9.]/g, ''));
        const suffix = el.getAttribute('data-suffix') || (el.innerText.includes('K') ? 'K+' : el.innerText.includes('★') ? '★' : '+');
        
        if (!isNaN(targetVal)) {
          animateValue(el, 0, targetVal, 1500, suffix);
        }
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => counterObserver.observe(el));

  function animateValue(obj, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentVal = Math.floor(progress * (end - start) + start);
      
      if (end % 1 !== 0) {
        obj.innerHTML = (progress * (end - start) + start).toFixed(1) + suffix;
      } else {
        obj.innerHTML = currentVal.toLocaleString() + suffix;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     6. CLEANING COST ESTIMATOR CALCULATOR
     ------------------------------------------------------------------------ */
  const sqftSlider = document.getElementById('calc-sqft-slider');
  const sqftValDisplay = document.getElementById('calc-sqft-val');
  const roomBtns = document.querySelectorAll('.calc-room-btn');
  const freqBtns = document.querySelectorAll('.calc-freq-btn');
  const totalPriceDisplay = document.getElementById('calc-total-price');

  let currentSqft = 1500;
  let currentRoomsMultiplier = 1.0;
  let currentFreqDiscount = 1.0;

  function calculateEstimate() {
    if (!totalPriceDisplay) return;
    
    // Base rate: $0.10 per sq ft
    let basePrice = currentSqft * 0.10;
    
    // Minimum base price $80
    if (basePrice < 80) basePrice = 80;

    let total = basePrice * currentRoomsMultiplier * currentFreqDiscount;
    totalPriceDisplay.innerText = '$' + Math.round(total);
  }

  if (sqftSlider) {
    sqftSlider.addEventListener('input', (e) => {
      currentSqft = parseInt(e.target.value);
      if (sqftValDisplay) sqftValDisplay.innerText = currentSqft + ' sq ft';
      calculateEstimate();
    });
  }

  roomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      roomBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRoomsMultiplier = parseFloat(btn.getAttribute('data-multiplier') || '1.0');
      calculateEstimate();
    });
  });

  freqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      freqBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFreqDiscount = parseFloat(btn.getAttribute('data-discount') || '1.0');
      calculateEstimate();
    });
  });

  calculateEstimate();

  /* ------------------------------------------------------------------------
     7. BOOKING WIZARD MODAL
     ------------------------------------------------------------------------ */
  const bookingModal = document.querySelector('.booking-modal');
  const bookingTriggers = document.querySelectorAll('.book-now-trigger, .btn-book-service');
  const bookingCloseBtn = document.querySelector('.booking-close');
  const wizardSteps = document.querySelectorAll('.wizard-form-step');
  const stepNodes = document.querySelectorAll('.wizard-step-node');
  const nextStepBtn = document.querySelector('.wizard-next-btn');
  const prevStepBtn = document.querySelector('.wizard-prev-btn');
  const bookingForm = document.getElementById('booking-wizard-form');

  let currentStep = 0;

  function openBookingModal(serviceName = 'Home Deep Cleaning') {
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const serviceSelect = document.getElementById('booking-service-select');
      if (serviceSelect) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      showStep(0);
    }
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  bookingTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceAttr = btn.getAttribute('data-service') || 'Home Deep Cleaning';
      openBookingModal(serviceAttr);
    });
  });

  if (bookingCloseBtn) bookingCloseBtn.addEventListener('click', closeBookingModal);
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  function showStep(index) {
    wizardSteps.forEach((step, idx) => {
      step.classList.toggle('active', idx === index);
    });

    stepNodes.forEach((node, idx) => {
      node.classList.remove('active', 'done');
      if (idx === index) {
        node.classList.add('active');
      } else if (idx < index) {
        node.classList.add('done');
      }
    });

    currentStep = index;

    if (prevStepBtn) prevStepBtn.style.display = index === 0 ? 'none' : 'inline-flex';

    if (nextStepBtn) {
      if (index === wizardSteps.length - 1) {
        nextStepBtn.innerHTML = '<i class="fa-brands fa-whatsapp" style="font-size: 1.1rem; margin-right: 6px;"></i> Confirm & Send via WhatsApp';
        nextStepBtn.style.backgroundColor = '#25D366';
        nextStepBtn.style.borderColor = '#25D366';
        nextStepBtn.style.color = '#FFFFFF';
      } else {
        nextStepBtn.innerHTML = 'Next Step <i class="fa-solid fa-chevron-right" style="margin-left: 6px;"></i>';
        nextStepBtn.style.backgroundColor = '';
        nextStepBtn.style.borderColor = '';
        nextStepBtn.style.color = '';
      }
    }
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      // Validate current step required inputs
      const currentStepEl = wizardSteps[currentStep];
      const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#EF4444';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      if (currentStep < wizardSteps.length - 1) {
        showStep(currentStep + 1);
        if (currentStep === wizardSteps.length - 1) {
          populateBookingSummary();
        }
      } else {
        // Complete Booking & Redirect to WhatsApp
        const refNum = 'EDC-' + Math.floor(100000 + Math.random() * 900000);

        const serviceVal = document.getElementById('booking-service-select')?.value || 'Home Deep Cleaning';
        const sqftVal = document.getElementById('booking-sqft')?.value || '1500';
        const dateVal = document.getElementById('booking-date')?.value || 'As scheduled';
        const timeVal = document.getElementById('booking-time')?.value || 'Morning Slot (8:00 AM - 12:00 PM)';
        const nameVal = document.getElementById('booking-name')?.value || 'Customer';
        const phoneVal = document.getElementById('booking-phone')?.value || 'Not provided';
        const emailVal = document.getElementById('booking-email')?.value || 'Not provided';
        const addressVal = document.getElementById('booking-address')?.value || 'Not provided';
        const notesVal = document.getElementById('booking-notes')?.value || '';

        let waMsg = `✨ *EXCELLENCE DEEP CLEANING SERVICES* ✨\n`;
        waMsg += `*NEW BOOKING REQUEST*\n\n`;
        waMsg += `📋 *Booking Ref:* ${refNum}\n\n`;
        waMsg += `👤 *Customer Name:* ${nameVal}\n`;
        waMsg += `📞 *Phone:* ${phoneVal}\n`;
        waMsg += `✉️ *Email:* ${emailVal}\n`;
        waMsg += `📍 *Address:* ${addressVal}\n\n`;
        waMsg += `🧰 *Service:* ${serviceVal}\n`;
        waMsg += `📐 *Property Size:* ${sqftVal} sq ft\n`;
        waMsg += `📅 *Preferred Date:* ${dateVal}\n`;
        waMsg += `⏰ *Time Slot:* ${timeVal}\n`;
        if (notesVal) {
          waMsg += `📝 *Special Notes:* ${notesVal}\n`;
        }
        waMsg += `\n💳 *Payment Option:* Pay After Service Completion\n\n`;
        waMsg += `Please confirm my cleaning booking slot. Thank you!`;

        const waTargetPhone = "919769234977";
        const waUrl = `https://wa.me/${waTargetPhone}?text=${encodeURIComponent(waMsg)}`;

        showToast(`Booking Submitted! Redirecting to WhatsApp...`, 'success');

        setTimeout(() => {
          window.open(waUrl, '_blank');
          closeBookingModal();
          if (bookingForm) bookingForm.reset();
          showStep(0);
        }, 800);
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
      }
    });
  }

  function populateBookingSummary() {
    const serviceVal = document.getElementById('booking-service-select')?.value || 'Home Deep Cleaning';
    const sqftVal = document.getElementById('booking-sqft')?.value || '1500';
    const dateVal = document.getElementById('booking-date')?.value || 'As scheduled';
    const timeVal = document.getElementById('booking-time')?.value || 'Morning Slot (8:00 AM - 12:00 PM)';
    const nameVal = document.getElementById('booking-name')?.value || 'Customer';
    const phoneVal = document.getElementById('booking-phone')?.value || 'Not provided';
    const emailVal = document.getElementById('booking-email')?.value || 'Not provided';
    const addressVal = document.getElementById('booking-address')?.value || 'Not provided';
    const notesVal = document.getElementById('booking-notes')?.value || '';
    const summaryBox = document.getElementById('booking-summary-box');

    if (summaryBox) {
      summaryBox.innerHTML = `
        <div style="background: #F8FAFC; padding: 20px; border-radius: var(--radius-md); border: 1px solid #E2E8F0;">
          <h4 style="color: var(--secondary); margin-bottom: 12px; font-weight: 700; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px;">
            <i class="fa-solid fa-clipboard-check" style="color: var(--primary);"></i> Booking Details Review
          </h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem; color: var(--text-dark);">
            <p><strong><i class="fa-solid fa-broom" style="color: var(--primary);"></i> Service:</strong> ${serviceVal}</p>
            <p><strong><i class="fa-solid fa-ruler-combined" style="color: var(--primary);"></i> Area:</strong> ${sqftVal} sq ft</p>
            <p><strong><i class="fa-solid fa-calendar-day" style="color: var(--primary);"></i> Date:</strong> ${dateVal}</p>
            <p><strong><i class="fa-solid fa-clock" style="color: var(--primary);"></i> Slot:</strong> ${timeVal}</p>
            <p><strong><i class="fa-solid fa-user" style="color: var(--primary);"></i> Name:</strong> ${nameVal}</p>
            <p><strong><i class="fa-solid fa-phone" style="color: var(--primary);"></i> Phone:</strong> ${phoneVal}</p>
          </div>
          <p style="font-size: 0.9rem; margin-top: 10px;"><strong><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> Address:</strong> ${addressVal}</p>
          ${notesVal ? `<p style="font-size: 0.9rem; margin-top: 6px;"><strong><i class="fa-solid fa-comment-dots" style="color: var(--primary);"></i> Notes:</strong> ${notesVal}</p>` : ''}
          <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #CBD5E1; color: var(--primary); font-weight: 700; font-size: 0.85rem;">
            <i class="fa-solid fa-shield-check"></i> Pay After Service Completed • 100% Satisfaction Guarantee
          </div>
        </div>
      `;
    }
  }

  /* ------------------------------------------------------------------------
     8. TESTIMONIAL SLIDER
     ------------------------------------------------------------------------ */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const prevSlideBtn = document.querySelector('.slider-btn.prev');
  const nextSlideBtn = document.querySelector('.slider-btn.next');
  const dotsContainer = document.querySelector('.slider-dots');

  let currentSlide = 0;
  let autoSlideTimer = null;

  if (testimonialSlides.length > 0) {
    // Create dots
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      testimonialSlides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      testimonialSlides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
      });

      const dots = document.querySelectorAll('.slider-dots .dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
      });

      currentSlide = index;
    }

    function nextSlide() {
      const nextIdx = (currentSlide + 1) % testimonialSlides.length;
      goToSlide(nextIdx);
    }

    function prevSlide() {
      const prevIdx = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
      goToSlide(prevIdx);
    }

    if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);
    if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);

    autoSlideTimer = setInterval(nextSlide, 5000);

    const sliderWrap = document.querySelector('.testimonial-carousel-wrap');
    if (sliderWrap) {
      sliderWrap.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
      sliderWrap.addEventListener('mouseleave', () => {
        autoSlideTimer = setInterval(nextSlide, 5000);
      });
    }
  }

  /* ------------------------------------------------------------------------
     9. VIDEO LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  const playVideoBtn = document.querySelector('.play-btn');
  const videoModal = document.querySelector('.video-modal');
  const videoCloseBtn = document.querySelector('.video-close-btn');
  const videoFrame = document.getElementById('lightbox-video-frame');

  if (playVideoBtn && videoModal) {
    playVideoBtn.addEventListener('click', () => {
      videoModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (videoFrame) {
        videoFrame.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
      }
    });
  }

  function closeVideoModal() {
    if (videoModal) {
      videoModal.classList.remove('active');
      document.body.style.overflow = '';
      if (videoFrame) {
        videoFrame.src = "";
      }
    }
  }

  if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  /* ------------------------------------------------------------------------
     10. FAQ ACCORDION TOGGLE
     ------------------------------------------------------------------------ */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  /* ------------------------------------------------------------------------
     11. SERVICES FILTER TABS
     ------------------------------------------------------------------------ */
  const serviceTabBtns = document.querySelectorAll('.services-filter-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');

  serviceTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ------------------------------------------------------------------------
     12. PRICING BILLING TOGGLE
     ------------------------------------------------------------------------ */
  const billingToggle = document.querySelector('.toggle-switch');
  const priceNums = document.querySelectorAll('.plan-price-num');
  const pricePeriods = document.querySelectorAll('.plan-period');

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      billingToggle.classList.toggle('active');
      const isMonthly = billingToggle.classList.contains('active');

      priceNums.forEach(num => {
        const monthly = num.getAttribute('data-monthly');
        const annual = num.getAttribute('data-annual');
        num.innerText = isMonthly ? '$' + monthly : '$' + annual;
      });

      pricePeriods.forEach(p => {
        p.innerText = isMonthly ? '/ month' : '/ one-time visit';
      });
    });
  }

  /* ------------------------------------------------------------------------
     13. CONTACT FORM VALIDATION & TOAST NOTIFICATION
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector('#contact-name');
      const emailInput = contactForm.querySelector('#contact-email');
      const phoneInput = contactForm.querySelector('#contact-phone');
      const serviceInput = contactForm.querySelector('#contact-service');
      const messageInput = contactForm.querySelector('#contact-message');

      if (!nameInput?.value.trim() || !phoneInput?.value.trim()) {
        showToast('Please fill in your name and phone number.', 'error');
        return;
      }

      const nameVal = nameInput.value.trim();
      const emailVal = emailInput ? emailInput.value.trim() : 'N/A';
      const phoneVal = phoneInput.value.trim();
      const serviceVal = serviceInput ? serviceInput.value : 'General Inquiry';
      const messageVal = messageInput ? messageInput.value.trim() : 'N/A';

      let contactMsg = `👋 *EXCELLENCE DEEP CLEANING - NEW INQUIRY*\n\n`;
      contactMsg += `👤 *Name:* ${nameVal}\n`;
      contactMsg += `📞 *Phone:* ${phoneVal}\n`;
      contactMsg += `✉️ *Email:* ${emailVal}\n`;
      contactMsg += `🧰 *Service:* ${serviceVal}\n`;
      contactMsg += `💬 *Message:* ${messageVal}\n\n`;
      contactMsg += `Sent via website contact form.`;

      const waTargetPhone = "919769234977";
      const waUrl = `https://wa.me/${waTargetPhone}?text=${encodeURIComponent(contactMsg)}`;

      showToast('Redirecting to WhatsApp to send your inquiry...', 'success');

      setTimeout(() => {
        window.open(waUrl, '_blank');
        contactForm.reset();
      }, 800);
    });
  }

  function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    toast.style.background = type === 'error' ? '#EF4444' : '#10B981';
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> ${message}`;
    toast.classList.add('active');

    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  }

  // Keyboard Accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileDrawer();
      closeSearchModal();
      closeBookingModal();
      closeVideoModal();
    }
  });

});
