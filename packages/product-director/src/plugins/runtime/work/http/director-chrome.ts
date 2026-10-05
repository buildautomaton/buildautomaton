export const DIRECTOR_CHROME = `<style>
:host{all:initial}
[hidden]{display:none!important}
#tab{position:fixed;bottom:0;z-index:2147483647;height:36px;padding:0 18px;border:0;border-radius:10px 10px 0 0;background:#111;color:#fff;cursor:pointer;font:600 13px/36px system-ui,sans-serif;box-shadow:0 -6px 20px rgba(0,0,0,.28)}
#resize{position:fixed;top:0;bottom:0;z-index:2147483647;width:10px;margin-right:-4px;cursor:col-resize;touch-action:none}
#frame{position:fixed;top:0;right:0;z-index:2147483646;height:100%;border:0;background:#09090b;box-shadow:-12px 0 40px rgba(0,0,0,.25)}
</style>
<button id="tab" type="button" aria-expanded="false" aria-controls="frame">Director</button>
<div id="resize" hidden role="separator" aria-orientation="vertical" aria-label="Resize sidebar"></div>
<iframe id="frame" title="Product director" hidden></iframe>`;
