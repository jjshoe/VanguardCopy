(function() {
  const TARGET_ID = "vanguard-copy";

  function handleFoundTextarea(textarea) {
    console.log("Vanguard Copy textarea detected:", textarea);

    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  const existing = document.getElementById('vanguard-copy');
  if (existing && existing.tagName === "TEXTAREA") {
    handleFoundTextarea(existing);
    return; 
  }

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {

        // Case 1: Node itself is the textarea
        if (node.nodeType === 1 && node.id === TARGET_ID && node.tagName === "TEXTAREA") {
          observer.disconnect();
          handleFoundTextarea(node);
          return;
        }

        // Case 2: Node contains the textarea somewhere inside
        if (node.nodeType === 1) {
          const inner = node.querySelector && node.querySelector(`textarea#${TARGET_ID}`);
          if (inner) {
            observer.disconnect();
            handleFoundTextarea(inner);
            return;
          }
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
