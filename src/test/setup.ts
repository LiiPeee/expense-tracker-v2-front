import "@testing-library/jest-dom";
import i18n from "@/i18n";

// Force a deterministic locale so assertions on Portuguese copy stay stable
// regardless of the jsdom navigator language.
i18n.changeLanguage("pt-BR");

// jsdom não implementa estas APIs de DOM que o Radix UI (Select, Dropdown, etc.)
// usa ao abrir/posicionar overlays. Sem elas, abrir um Select lança
// "scrollIntoView is not a function" e as opções nunca são renderizadas.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn(() => false);
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn();
}
