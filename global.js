console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Navigation menu

let pages = [
  { url: '', title: 'Home' },
  { url: 'meta/', title: 'Meta' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/chouiie', title: 'GitHub' },
];

// The folder global.js lives in is the site root, both on Live Server and on GitHub Pages
const BASE_PATH = new URL('./', import.meta.url).pathname;

let nav = document.createElement('nav');
document.body.prepend(nav);

let brand = document.createElement('a');
brand.className = 'brand';
brand.href = BASE_PATH;
brand.innerHTML = `<img src="${BASE_PATH}images/logo.png?v=3" alt=""><span>Chau Nguyen</span>`;
nav.append(brand);

let favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = `${BASE_PATH}images/favicon.png?v=3`;
document.head.append(favicon);

for (let p of pages) {
  let url = p.url;
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = p.title;

  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname,
  );
  if (a.host !== location.host) {
    a.target = '_blank';
  }

  nav.append(a);
}

// Bottom dock of quick links, on every page

let dockLinks = [
  { url: 'projects/', label: 'works', icon: '📁' },
  { url: 'https://drive.google.com/file/d/1oIZCvXnO-fspuchmxtbr2vuaV_4rJ6xf/view?usp=sharing', label: 'resume', icon: '💼' },
  { url: 'profile/', label: 'profile', icon: `<img src="${BASE_PATH}images/profile-2.jpg" alt="">` },
];

let dock = document.createElement('div');
dock.className = 'dock';
dock.setAttribute('role', 'navigation');
dock.setAttribute('aria-label', 'Quick links');

for (let d of dockLinks) {
  let a = document.createElement('a');
  a.href = d.url.startsWith('http') ? d.url : BASE_PATH + d.url;
  a.innerHTML = `<span class="icon">${d.icon}</span><span class="dock-label">${d.label}</span>`;
  a.classList.toggle('current', a.pathname === location.pathname);
  if (a.host !== location.host) {
    a.target = '_blank';
  }
  dock.append(a);
}

document.body.append(dock);

// Dark mode switch

let osTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'Dark' : 'Light';

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic (${osTheme})</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`,
);

let select = document.querySelector('.color-scheme select');

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
  select.value = colorScheme;
}

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

select.addEventListener('input', function (event) {
  setColorScheme(event.target.value);
  localStorage.colorScheme = event.target.value;
});

// Contact form: build the mailto URL ourselves so spaces become %20, not +

let form = document.querySelector('form');

form?.addEventListener('submit', function (event) {
  event.preventDefault();

  let data = new FormData(form);
  let params = [];
  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  location.href = `${form.action}?${params.join('&')}`;
});
// ===== Lab 4: data loading and rendering =====



export async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!(containerElement instanceof Element)) {
    console.error('renderProjects: invalid container element');
    return;
  }
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) headingLevel = 'h2';

  containerElement.innerHTML = '';

  if (!Array.isArray(projects) || projects.length === 0) {
    containerElement.innerHTML = '<p>No projects to show yet.</p>';
    return;
  }

  for (const project of projects) {
    // File-style label from the first few title words, e.g. "ocean-pulse.txt"
    const fileName =
      (project.title ?? 'untitled')
        .split(':')[0]
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(Boolean)
        .slice(0, 3)
        .join('-') + '.txt';

    const image = project.image?.startsWith('http') ? project.image : BASE_PATH + (project.image ?? '');

    const article = document.createElement('article');
    article.className = 'file-card';
    article.innerHTML = `
      <img class="project-image" src="${image}" alt="">
      <div>
        <p class="file-name"><img src="${BASE_PATH}images/glass-star.png" alt="">${fileName}${project.tag ? `<span class="project-tag">${project.tag}</span>` : ''}<span class="project-year">${project.year ?? ''}</span></p>
        <${headingLevel}>${project.title ?? 'Untitled'}</${headingLevel}>
        <p>${project.description ?? ''}</p>
        ${project.url ? `<a class="project-link" href="${project.url}" target="_blank">${project.linkLabel ?? 'view on GitHub'} ↗</a>` : ''}
      </div>
    `;
    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}
