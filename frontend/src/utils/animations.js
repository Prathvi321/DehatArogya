import anime from 'animejs';

/**
 * Staggers the entrance of a list of elements with smooth spring easing.
 * @param {string|Element[]|NodeList} targets - CSS selector or elements array
 * @param {object} options - Optional overrides (delay, translateY, duration)
 */
export const staggerFadeIn = (targets, options = {}) => {
  if (!targets) return;
  try {
    anime.remove(targets);
    anime({
      targets,
      opacity: [0, 1],
      translateY: [options.translateY !== undefined ? options.translateY : 18, 0],
      scale: [0.98, 1],
      delay: anime.stagger(options.stagger || 60, { start: options.startDelay || 40 }),
      duration: options.duration || 650,
      easing: 'easeOutCubic',
      ...options,
    });
  } catch (err) {
    console.warn('Anime staggerFadeIn error:', err);
  }
};

/**
 * Smoothly animates a numeric value from 0 (or start) to endVal.
 * @param {Element} element - DOM element to update innerText
 * @param {number} endVal - The target number
 * @param {number} duration - Animation duration in ms
 */
export const animateCounter = (element, endVal, duration = 800) => {
  if (!element) return;
  const obj = { val: 0 };
  try {
    anime.remove(obj);
    anime({
      targets: obj,
      val: endVal || 0,
      round: 1,
      easing: 'easeOutExpo',
      duration,
      update: () => {
        element.innerText = Math.round(obj.val).toLocaleString();
      },
    });
  } catch (err) {
    element.innerText = endVal;
  }
};

/**
 * Animates a dynamic multi-bar audio waveform when recording voice symptoms.
 * @param {Element|string} container - Container with child bar elements
 * @param {boolean} isRecording - Whether audio recording is active
 * @returns {object|null} anime instance or null
 */
export const animateWaveform = (container, isRecording) => {
  if (!container) return null;
  const bars = typeof container === 'string' 
    ? document.querySelectorAll(container) 
    : container.querySelectorAll('.wave-bar');

  if (!bars.length) return null;
  anime.remove(bars);

  if (!isRecording) {
    anime({
      targets: bars,
      scaleY: 0.25,
      opacity: 0.4,
      duration: 300,
      easing: 'easeOutQuad',
    });
    return null;
  }

  return anime({
    targets: bars,
    scaleY: [
      { value: () => anime.random(0.3, 1.4), duration: 180 },
      { value: () => anime.random(0.2, 0.9), duration: 160 },
      { value: () => anime.random(0.4, 1.8), duration: 220 },
      { value: () => anime.random(0.25, 0.7), duration: 170 },
    ],
    opacity: [0.7, 1],
    delay: anime.stagger(40),
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine',
  });
};

/**
 * Sweeps a progress bar or gauge dial from 0% to the target percentage.
 * @param {Element} barElement - The indicator element
 * @param {number} targetPercent - Value between 0 and 100
 * @param {number} duration - Animation duration in ms
 */
export const animateRiskGauge = (barElement, targetPercent, duration = 900) => {
  if (!barElement) return;
  try {
    anime.remove(barElement);
    anime({
      targets: barElement,
      width: [`0%`, `${Math.min(100, Math.max(5, targetPercent))}%`],
      duration,
      easing: 'cubicBezier(0.25, 1, 0.5, 1)',
    });
  } catch (err) {
    barElement.style.width = `${targetPercent}%`;
  }
};

/**
 * Micro-bounce tap reaction for interactive chips and buttons.
 * @param {Element} element - Clicked DOM element
 */
export const bounceTap = (element) => {
  if (!element) return;
  try {
    anime({
      targets: element,
      scale: [
        { value: 0.93, duration: 90, easing: 'easeOutQuad' },
        { value: 1.04, duration: 140, easing: 'easeOutBack(2)' },
        { value: 1, duration: 120, easing: 'easeOutQuad' },
      ],
    });
  } catch (err) {
    // Fallback gracefully
  }
};

/**
 * Spring-loaded entrance animation for modals.
 * @param {Element} modalCard - Modal content container
 */
export const modalPop = (modalCard) => {
  if (!modalCard) return;
  try {
    anime.remove(modalCard);
    anime({
      targets: modalCard,
      scale: [0.85, 1],
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 450,
      easing: 'spring(1, 80, 12, 0)',
    });
  } catch (err) {
    // Fallback
  }
};

/**
 * Pulse ring animation for live status pings.
 * @param {Element|string} target - Ring element
 */
export const pulseBeacon = (target) => {
  if (!target) return;
  try {
    anime({
      targets: target,
      scale: [1, 1.8],
      opacity: [0.8, 0],
      loop: true,
      duration: 1600,
      easing: 'easeOutExpo',
    });
  } catch (err) {
    // Fallback
  }
};
