import ElFinderPicker, { type ElFinderFile } from '../../index';

const ELFINDER_URL = '/demo/elfinder.html';

// Create picker instance ONCE (reusable)
const reusablePicker = new ElFinderPicker({
  url: ELFINDER_URL
});

let selectionCount = 0;
const selections: ElFinderFile[] = [];

function displayReusableResult(file: ElFinderFile) {
  const resultElement = document.getElementById('result');
  if (!resultElement) return;

  resultElement.className = 'result-box has-content';
  resultElement.innerHTML = `
    <div style="background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
      <h3 style="margin: 0 0 0.5rem 0; color: #1976d2;">
        Selection count: ${selectionCount}
      </h3>
      <p style="margin: 0; color: #1565c0; font-size: 0.9rem;">
        The same picker instance is being reused for each selection
      </p>
    </div>
    <div class="file-info">
      <h4 style="margin-bottom: 0.75rem; color: #444;">Latest Selection:</h4>
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
    ${selectionCount > 1 ? `
      <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid #e0e0e0;">
        <h4 style="margin-bottom: 0.5rem; color: #666; font-size: 0.9rem;">Previous Selections:</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${selections.slice(0, -1).reverse().slice(0, 3).map((s, i) => `
            <li style="padding: 0.25rem 0; color: #888; font-size: 0.85rem;">
              ${selections.length - i - 1}. ${s.name}
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
  `;
}

const button = document.getElementById('reusablePickerBtn');
if (button) {
  button.addEventListener('click', () => {
    // Reuse the SAME picker instance
    reusablePicker.open((file) => {
      selectionCount++;
      selections.push(file);

      console.log(`Selection #${selectionCount}:`, file);
      console.log('Total selections:', selectionCount);
      console.log('All selections:', selections);

      displayReusableResult(file);
    });
  });
}

console.log('Reusable picker demo loaded');
console.log('Picker instance created once and will be reused for all selections');
