document.addEventListener('DOMContentLoaded', (event) => {
  function addCopyButtons(clipboard) {
    document.querySelectorAll('pre > code').forEach((codeBlock) => {
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.type = 'button';
      button.innerText = 'Copy';

      button.addEventListener('click', () => {
        clipboard.writeText(codeBlock.innerText).then(() => {
          button.blur();
          button.innerText = 'Copied!';
          setTimeout(() => {
            button.innerText = 'Copy';
          }, 2000);
        }, (error) => {
          button.innerText = 'Error';
        });
      });

      const pre = codeBlock.parentNode;
      if (pre.parentNode.classList.contains('highlight')) {
        pre.parentNode.insertBefore(button, pre);
      } else {
        pre.insertBefore(button, codeBlock);
      }
    });
  }

  if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard);
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.8.6/clipboard-polyfill.min.js';
    script.integrity = 'sha256-5t9indP+8HLoqUuq/Xj7AeolRTk7zlb213Fj7TudNxM=';
    script.crossOrigin = 'anonymous';
    script.onload = () => addCopyButtons(clipboard);
    document.body.appendChild(script);
  }
});