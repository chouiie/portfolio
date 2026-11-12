import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Pet-the-cat toy
const cat = document.querySelector('.cat');
const catSays = document.querySelector('.cat-says');
const catCount = document.querySelector('.cat-count');
const catBox = document.querySelector('.cat-box');

const catLines = ['mrrp!', 'purrrr…', 'more pls', 'meow :3', 'ok one more', '♡ ♡ ♡'];
let pets = 0;
let napTimer;

cat?.addEventListener('click', (event) => {
  pets++;
  catCount.textContent = pets;
  cat.textContent = pets % 5 === 0 ? '😻' : '😸';
  catSays.textContent =
    pets === 10 ? 'best friends now 🐾' : catLines[Math.floor(Math.random() * catLines.length)];

  cat.classList.remove('purr');
  void cat.offsetWidth;
  cat.classList.add('purr');

  const box = catBox.getBoundingClientRect();
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = '♡';
  heart.style.left = `${(event.clientX || box.left + 60) - box.left}px`;
  heart.style.top = `${(event.clientY || box.top + 40) - box.top - 20}px`;
  catBox.append(heart);
  heart.addEventListener('animationend', () => heart.remove());

  // Falls asleep if you stop petting
  clearTimeout(napTimer);
  napTimer = setTimeout(() => {
    cat.textContent = '😴';
    catSays.textContent = 'z z z…';
  }, 4000);
});

// Step 2: latest 3 projects
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');

// Step 3: GitHub stats
const githubData = await fetchGitHubData('chouiie');
const profileStats = document.querySelector('#profile-stats');

if (profileStats && githubData) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}
