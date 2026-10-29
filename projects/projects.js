import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

const title = document.querySelector('.projects-title');
if (title && projects) {
  title.textContent = `${projects.length} Projects`;
}

let query = '';
let selectedYear = null;

let colors = d3.scaleOrdinal(d3.schemeTableau10);
let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value((d) => d.value).sort(null);

function matchesQuery(project) {
  let values = Object.values(project).join('\n').toLowerCase();
  return values.includes(query.toLowerCase());
}

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  let data = rolledData
    .map(([year, count]) => ({ value: count, label: year }))
    .sort((a, b) => b.label.localeCompare(a.label));

  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));
  let selectedIndex = data.findIndex((d) => d.label === selectedYear);

  let svg = d3.select('#projects-pie-plot');
  let legend = d3.select('.legend');
  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  arcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(data[i].label))
      .attr('class', i === selectedIndex ? 'selected' : null)
      .on('click', () => {
        selectedYear = selectedIndex === i ? null : data[i].label;
        applyFilters();
      });
  });

  data.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(d.label)}`)
      .attr('class', i === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedYear = selectedIndex === i ? null : d.label;
        applyFilters();
      });
  });
}

function applyFilters() {
  let searchedProjects = projects.filter(matchesQuery);

  if (!searchedProjects.some((p) => p.year === selectedYear)) {
    selectedYear = null;
  }

  let visibleProjects =
    selectedYear === null
      ? searchedProjects
      : searchedProjects.filter((p) => p.year === selectedYear);

  renderPieChart(searchedProjects);
  renderProjects(visibleProjects, projectsContainer, 'h2');
}

applyFilters();

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  applyFilters();
});
