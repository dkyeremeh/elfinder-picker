import ElFinderPicker, { type ElFinderFile } from '../../index';

const ELFINDER_URL = '/demo/elfinder.html';

interface CustomMetadata {
  type: string;
  context: string;
  timestamp: string;
  userAgent: string;
  screenResolution: string;
}

function displayCustomResult(file: ElFinderFile, metadata: CustomMetadata) {
  const resultElement = document.getElementById('result');
  if (!resultElement) return;

  resultElement.className = 'result-box has-content';
  resultElement.innerHTML = `
    <div class="file-info">
      <h3 style="margin-bottom: 0.75rem; color: #444;">File Information</h3>
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

      <h3 style="margin: 1.25rem 0 0.75rem; color: #444;">Metadata</h3>
      <div class="file-info-row">
        <span class="file-info-label">Type:</span>
        <span class="file-info-value">${metadata.type}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">Context:</span>
        <span class="file-info-value">${metadata.context}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">Timestamp:</span>
        <span class="file-info-value">${metadata.timestamp}</span>
      </div>
      <div class="file-info-row">
        <span class="file-info-label">User Agent:</span>
        <span class="file-info-value" style="font-size: 0.85em;">${metadata.userAgent}</span>
      </div>
    </div>
    <p style="margin-top: 1.25rem; padding: 0.75rem; background: #e8f5e9; color: #2e7d32; border-radius: 6px; font-size: 0.9rem;">
      ✓ Check the browser console for detailed logs
    </p>
  `;
}

const button = document.getElementById('customPickerBtn');
if (button) {
  button.addEventListener('click', () => {
    const picker = new ElFinderPicker({
      url: ELFINDER_URL
    });

    // Custom metadata
    const metadata: CustomMetadata = {
      type: 'file',
      context: 'demo-custom-config',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    };

    picker.open((file) => {
      console.group('🔧 Custom Configuration Demo');
      console.log('File Object:', file);
      console.log('Custom Metadata:', metadata);
      console.log('File Name:', file.name);
      console.log('File MIME:', file.mime);
      console.log('File URL:', file.url);
      console.log('Timestamp:', metadata.timestamp);
      console.groupEnd();

      displayCustomResult(file, metadata);
    });
  });
}

console.log('Custom configuration demo loaded');
