import FactorioItems from "./factorioItems";
import CanvasManager from "./imageProcessor";
import { Method } from "./methods";
const canvasManager = CanvasManager.init();
export default class tight3to4Method extends Method {
    constructor(optionsContainer, blueprintGetter) {
        super(optionsContainer, blueprintGetter);
        this.name = "tight3to4";
        this.value = "tight video display";
        this.supportedModes = ["gif"];
    }
    init() {
        const methodContainer = document.createElement('div');
        methodContainer.style.display = 'flex';
        methodContainer.style.height = '100%';
        methodContainer.style.flexDirection = 'column';
        methodContainer.style.justifyContent = 'flex-end';
        const button = document.createElement('div');
        button.classList.add('control-margin-top-2', 'custom-button');
        button.textContent = "generate blueprint!";
        methodContainer.appendChild(button);
        button.addEventListener('click', () => {
            this.exportJson(this.makeJson());
        });
        while (this.optionsContainer.firstChild) {
            this.optionsContainer.removeChild(this.optionsContainer.firstChild);
        }
        this.optionsContainer.appendChild(methodContainer);
    }
    makeJson() {
        const currentFrame = parseInt(document.getElementById('frameInput').value, 10);
        let frameData = canvasManager.getFrameBitmap(currentFrame);
        let lamps = [];
        for (let i = 0; i < frameData.bitmap.length; i++) {
            const x = (i % frameData.width) + 0.5;
            const y = Math.floor(i / frameData.width) + 0.5;
            const [r, g, b] = frameData.bitmap[i];
            lamps.push(FactorioItems.simpleLamp(i + 1, x, y, r, g, b));
        }
        let outputData = FactorioItems.blueprintTitle(lamps);
        const json = JSON.stringify(outputData);
        return json;
    }
}
//# sourceMappingURL=tight3to4method.js.map