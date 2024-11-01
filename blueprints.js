import CanvasManager from "./imageProcessor.js";
const canvasManager = CanvasManager.init();
import jsonToBlueprint from "./blueprintEncoder.js";
document.getElementById('makePhotoBlueprint')?.addEventListener('click', function () {
    const currentFrame = parseInt(document.getElementById('frameInput').value, 10);
    let frameData = canvasManager.getFrameBitmap(currentFrame);
    let lamps = [];
    for (let i = 0; i < frameData.bitmap.length; i++) {
        const x = (i % frameData.width) + 0.5;
        const y = Math.floor(i / frameData.width) + 0.5;
        const [r, g, b] = frameData.bitmap[i];
        lamps.push(simpleLamp(i + 1, x, y, r, g, b));
    }
    let outputData = blueprintTitle(lamps);
    const textOutput = document.getElementById('textOutput');
    console.log("lamps", lamps);
    textOutput.value = jsonToBlueprint(JSON.stringify(outputData));
});
document.getElementById('makeVideoBlueprint')?.addEventListener('click', function () {
    let framesData = canvasManager.getGifBitmap();
    const textOutput = document.getElementById('textOutput');
    textOutput.value = JSON.stringify(framesData);
});
document.getElementById('copyButton')?.addEventListener('click', async function () {
    const textOutput = document.getElementById('textOutput');
    await navigator.clipboard.writeText(textOutput.value);
});
// Blueprints
function blueprintTitle(entities) {
    return {
        blueprint: {
            icons: [
                {
                    signal: {
                        name: "small-lamp"
                    },
                    index: 1
                }
            ],
            entities: entities,
            item: "blueprint",
            version: 562949954076673
        }
    };
}
function simpleLamp(index, x, y, r, g, b) {
    return {
        entity_number: index,
        name: "small-lamp",
        position: {
            x: x,
            y: y
        },
        color: {
            r: r / 255,
            g: g / 255,
            b: b / 255,
            a: 1
        },
        always_on: true
    };
}
//# sourceMappingURL=blueprints.js.map