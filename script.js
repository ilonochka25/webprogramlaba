document.addEventListener("DOMContentLoaded", () => {
  const systemInfo = {
    platform: navigator.platform,
    browser: navigator.userAgent,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
  };

  localStorage.setItem('systemInfo', JSON.stringify(systemInfo));

  const systemList = document.getElementById('system-info');
  const savedInfo = JSON.parse(localStorage.getItem('systemInfo'));

  for (let key in savedInfo) {
    const li = document.createElement('li');
    li.textContent = `${key}: ${savedInfo[key]}`;
    systemList.appendChild(li);
  }

  const loadBtn = document.getElementById('load-comments');
  const commentsSection = document.getElementById('comments-section');
  const commentsList = document.getElementById('comments-list');

  let commentsLoaded = false;
  let commentsVisible = false;

  if (loadBtn && commentsSection && commentsList) {
    loadBtn.addEventListener('click', () => {
      if (!commentsLoaded) {
        fetch('https://jsonplaceholder.typicode.com/posts/7/comments')
          .then(res => res.json())
          .then(comments => {
            commentsList.innerHTML = '';
            comments.forEach(comment => {
              const li = document.createElement('li');
              li.innerHTML = `
                <strong>${comment.name}</strong> (${comment.email}):<br>
                ${comment.body}
              `;
              commentsList.appendChild(li);
            });
            commentsLoaded = true;
            commentsVisible = true;
            commentsSection.classList.remove('hidden');
            loadBtn.textContent = 'Сховати коментарі';
          });
      } else {
        commentsSection.classList.toggle('hidden');
        commentsVisible = !commentsSection.classList.contains('hidden');
        loadBtn.textContent = commentsVisible ? 'Сховати коментарі' : 'Показати коментарі';
      }
    });
  }


  const modal = document.getElementById('modal');
  const closeModal = document.querySelector('.close');

  if (modal) {
    modal.classList.add('hidden');
    setTimeout(() => {
      modal.classList.remove('hidden');
    }, 60000);

    closeModal?.addEventListener('click', () => {
      modal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  const themeBtn = document.getElementById('theme-switch');

  function applyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    if (themeBtn) {
      themeBtn.textContent = theme === 'dark' ? '☀️ Світла тема' : '🌙 Темна тема';
    }
  }

  const saved = localStorage.getItem('theme');
  const autoTheme = new Date().getHours() >= 7 && new Date().getHours() < 21 ? 'light' : 'dark';
  applyTheme(saved || autoTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
      applyTheme(newTheme);

      // тряска
      document.body.classList.add("shake");
      setTimeout(() => document.body.classList.remove("shake"), 400);
    });
  }
});
