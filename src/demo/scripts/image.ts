import ElFinderPicker, { type ElFinderFile } from '../../index';

const ELFINDER_URL = '/demo/elfinder.html';

function displayImageInfo(file: ElFinderFile) {
  const resultElement = document.getElementById('result');
  if (!resultElement) return;

  const isImage = file.mime && file.mime.startsWith('image/');

  if (isImage) {
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
      <img src="${file.url}" alt="${file.name}" class="preview-image" />
    `;
  } else {
    resultElement.className = 'result-box has-content error';
    resultElement.innerHTML = `
      <p style="color: #dc3545; margin-bottom: 1rem;">
        ⚠️ Selected file is not an image. Please select an image file.
      </p>
      <div class="file-info">
        <div class="file-info-row">
          <span class="file-info-label">Selected:</span>
          <span class="file-info-value">${file.name} (${file.mime})</span>
        </div>
      </div>
    `;
  }
}

const button = document.getElementById('selectImageBtn');
if (button) {
  button.addEventListener('click', () => {
    const picker = new ElFinderPicker({
      url: ELFINDER_URL
    });

    picker.open((file) => {
      console.log('Image selected:', file);
      displayImageInfo(file);
    });
  });
}

console.log('Image demo loaded');
