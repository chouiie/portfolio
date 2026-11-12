import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const title = document.querySelector('.projects-title');
if (title && projects) {
  title.textContent = `${projects.length} Projects`;
}

let query = '';

function matchesQuery(project) {
  let values = Object.values(project).join('\n').toLowerCase();
  return values.includes(query.toLowerCase());
}

function applyFilters() {
  renderProjects(projects.filter(matchesQuery), projectsContainer, 'h2');
}

applyFilters();

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  applyFilters();
});
