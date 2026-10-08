export const BUILDAUTOMATON_CHROME = `<style>
:host{all:initial}
[hidden]{display:none!important}
#tab{position:fixed;right:24px;bottom:24px;z-index:2147483647;width:56px;height:56px;border:0;border-radius:999px;background:#09090b;color:#fff;cursor:pointer;font:600 22px/56px system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.28)}
#frame{position:fixed;right:24px;bottom:96px;z-index:2147483646;width:min(26rem,calc(100vw - 2rem));height:min(40rem,calc(100vh - 8rem));border:0;border-radius:16px;background:#09090b;box-shadow:0 16px 48px rgba(0,0,0,.35)}
</style>
<button id="tab" type="button" aria-expanded="false" aria-controls="frame" aria-label="BuildAutomaton">+</button>
<iframe id="frame" title="BuildAutomaton" hidden></iframe>`;
