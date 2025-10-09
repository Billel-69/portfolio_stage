document.getElementById('iaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = document.getElementById('question').value;
  const docId = document.getElementById('document').value;
  const responseEl = document.getElementById('response');
  responseEl.textContent = 'Chargement...';
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, docId })
    });
    const data = await res.json();
    responseEl.textContent = data.answer || data.error || 'Pas de réponse';
  } catch (err) {
    responseEl.textContent = 'Erreur: ' + err.message;
  }
});
