// Pet-the-cat toy
const cat = document.querySelector('.pet-cat');
const catSays = document.querySelector('.cat-says');

const catLines = ['mrrp!', 'purrrr…', 'more pls', 'meow :3', 'ok one more', '♡ ♡ ♡'];
let pets = 0;
let napTimer;

cat?.addEventListener('click', (event) => {
  pets++;
  catSays.textContent =
    pets === 10
      ? 'best friends now 🐾'
      : `${catLines[Math.floor(Math.random() * catLines.length)]} (${pets})`;

  cat.classList.remove('sleepy', 'squish');
  cat.classList.add('happy');
  void cat.offsetWidth;
  cat.classList.add('squish');

  const box = cat.getBoundingClientRect();
  const heart = document.createElement('span');
  heart.className = 'heart';
  heart.textContent = '♡';
  heart.style.left = `${event.clientX || box.left + box.width / 2}px`;
  heart.style.top = `${(event.clientY || box.top + box.height / 3) - 20}px`;
  document.body.append(heart);
  heart.addEventListener('animationend', () => heart.remove());

  // Falls asleep if you stop petting
  clearTimeout(napTimer);
  napTimer = setTimeout(() => {
    cat.classList.remove('happy');
    cat.classList.add('sleepy');
    catSays.textContent = 'z z z…';
  }, 4000);
});

const updatedDate = document.querySelector('.updated-date');
if (updatedDate) {
  updatedDate.textContent = new Date(document.lastModified).toLocaleDateString('en-US', {
    month: '2-digit',
    year: '2-digit',
  });
}
