/* Piccoli aiuti per creare e trovare elementi */

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string | null, text?: string | null): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error("Elemento #" + id + " mancante");
  return node as T;
}

// link che si apre in una nuova scheda
function extLink(text: string, href: string, title: string): HTMLAnchorElement {
  const a = el("a", null, text);
  a.href = href;
  a.title = title;
  a.target = "_blank";
  a.rel = "noopener";
  return a;
}
