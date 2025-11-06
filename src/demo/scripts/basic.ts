import ElFinderPicker, { type ElFinderFile } from '../../index';

const ELFINDER_URL = '/demo/elfinder.html';

function displayFileInfo(file: ElFinderFile) {
  const resultElement = document.getElementById('result');
  if (!resultElement) return;

  resultElement.className = 'result-box has-content';
  resultElement.innerHTML = `
    <div class="file-info">
      <div class="file-info-row">
        <span class="file-info-label">Name:</span>
        <span class="file-info-value">${file.name}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">MIME Type:</span>
        <span class="file-info-value">${file.mime}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">URL:</span>
        <span class="file-info-value">${file.url}</span>
      </div>
    </div>
  `;
}

// Setup button click handler
const button = document.getElementById('openPickerBtn');
if (button) {
  button.addEventListener('click', () => {
    const picker = new ElFinderPicker({
      url: ELFINDER_URL
    });

    picker.open((file) => {
      console.log('File selected:', file);
      displayFileInfo(file);
    });
  });
}

console.log('Basic demo loaded');
