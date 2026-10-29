import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

// Step 1.6: project count
const title = document.querySelector('.projects-title');
if (title && projects) {
  title.textContent = `${projects.length} Projects`;
}

// ===== Lab 5: pie chart + filtering =====

let query = '';
// Track the selected year (not just its index), because the slice order
// changes whenever the search changes which years are in the pie
let selectedYear = null;

// Color by year so each year keeps its color as the pie is filtered
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

// Extra credit (Step 5.4): both the search bar and the pie go through this one
// function, so each filter is always applied on top of the other.
function applyFilters() {
  // The pie shows the search results, so every year matching the query stays clickable
  let searchedProjects = projects.filter(matchesQuery);

  // Drop the selection if the search removed that year from the pie
  if (!searchedProjects.some((p) => p.year === selectedYear)) {
    selectedYear = null;
  }

  // The project list uses the search AND the selected year
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
