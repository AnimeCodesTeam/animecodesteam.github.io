const TRANSLATIONS = {
  es: {
    title: 'anime.codes — Próximamente',
    badge: 'Sitio provisional',
    nav: {
      links: 'Enlaces',
      contact: 'Contacto'
    },
    hero: {
      title: 'Estamos preparando <span>anime.codes</span>',
      text: 'Una landing temporal mientras terminamos algo más grande. Por ahora puedes seguirnos, ver el proyecto y unirte a la comunidad.'
    },
    contact: {
      title: 'Contacto rápido',
      text: 'Mientras la web completa llega, tus usuarios pueden encontrarte fácilmente en X, GitHub y Discord.'
    },
    footer: {
      tagline: 'Ubicado en el universo de anime.codes.',
      rights: 'Todos los derechos reservados.',
      byline: 'En desarrollo con <span class="footer-heart" aria-hidden="true">💚</span> por <a class="footer-link" href="https://happyuky7.com/" target="_blank" rel="noopener noreferrer">Happyuky7</a> <span class="footer-credit-muted">— proyecto para la comunidad.</span>'
    },
    phrases: [
      'Construyendo para devs y fans del anime.',
      'Landing temporal: lo grande viene pronto.',
      'Síguenos en X, GitHub y Discord.'
    ],
    discordReplaceAlert: 'Añade aquí tu invitación real de Discord en index.html.'
  },
  en: {
    title: 'anime.codes — Coming soon',
    badge: 'Temporary site',
    nav: {
      links: 'Links',
      contact: 'Contact'
    },
    hero: {
      title: 'We’re building <span>anime.codes</span>',
      text: 'A temporary landing page while we finish something bigger. For now you can follow us, check the project, and join the community.'
    },
    contact: {
      title: 'Quick contact',
      text: 'While the full site is on the way, people can still find you easily on X, GitHub, and Discord.'
    },
    footer: {
      tagline: 'Located in the anime.codes universe.',
      rights: 'All rights reserved.',
      byline: 'In development with <span class="footer-heart" aria-hidden="true">💚</span> by <a class="footer-link" href="https://happyuky7.com/" target="_blank" rel="noopener noreferrer">Happyuky7</a> <span class="footer-credit-muted">— a community project.</span>'
    },
    phrases: [
      'Building for devs and anime fans.',
      'Temporary landing: the full version is coming.',
      'Follow us on X, GitHub, and Discord.'
    ],
    discordReplaceAlert: 'Add your real Discord invite link in index.html.'
  }
};

const rotatingText = document.getElementById('rotating-text');
const year = document.getElementById('year');
const discordBtn = document.getElementById('discord-btn');
const langButtons = Array.from(document.querySelectorAll('.lang-btn[data-lang]'));

let currentPhrase = 0;
let rotateTimer = null;

function getSavedLang() {
  try {
    return localStorage.getItem('ac_lang');
  } catch {
    return null;
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem('ac_lang', lang);
  } catch {
    // Ignore storage errors (private mode, blocked storage, etc.)
  }
}

function getInitialLang() {
  const saved = getSavedLang();
  if (saved && TRANSLATIONS[saved]) return saved;

  const browserLang = (navigator.language || 'es').toLowerCase();
  return browserLang.startsWith('es') ? 'es' : 'en';
}

function setPressedLangButton(lang) {
  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function applyTranslations(lang) {
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  document.title = dict.title;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), dict);
    if (typeof value === 'string') el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), dict);
    if (typeof value === 'string') el.innerHTML = value;
  });
}

function startRotatingText(lang) {
  if (!rotatingText) return;
  const dict = TRANSLATIONS[lang];
  if (!dict) return;

  if (rotateTimer) {
    clearInterval(rotateTimer);
    rotateTimer = null;
  }

  currentPhrase = 0;
  rotatingText.style.opacity = '1';
  rotatingText.textContent = dict.phrases[currentPhrase];

  rotateTimer = setInterval(() => {
    currentPhrase = (currentPhrase + 1) % dict.phrases.length;
    rotatingText.style.opacity = '0';

    setTimeout(() => {
      rotatingText.textContent = dict.phrases[currentPhrase];
      rotatingText.style.opacity = '1';
    }, 180);
  }, 2600);
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  saveLang(lang);
  setPressedLangButton(lang);
  applyTranslations(lang);
  startRotatingText(lang);
}

if (year) {
  year.textContent = new Date().getFullYear();
}

langButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setLanguage(button.dataset.lang);
  });
});

const initialLang = getInitialLang();
setLanguage(initialLang);

if (discordBtn && discordBtn.href.includes('REEMPLAZAR')) {
  discordBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const lang = getSavedLang() || getInitialLang();
    alert(TRANSLATIONS[lang]?.discordReplaceAlert ?? TRANSLATIONS.es.discordReplaceAlert);
  });
}
