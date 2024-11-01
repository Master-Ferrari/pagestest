import CanvasManager, { Mode } from "./imageProcessor.js";
const canvasManager = CanvasManager.init();

import jsonToBlueprint from "./blueprintEncoder.js";
import { DropdownOption } from "./dropdown.js";
import FactorioItems from "./factorioItems.js";

class MethodsManager {
    private methods: Method[] = [];

    add(methods: Method[]) {
        methods.forEach((method) => {
            this.methods.push(method);
        })
    }

    getList(mode: Mode): DropdownOption[] {
        return this.methods.map((method) => {
            return {
                name: method.name,
                value: method.value,
                isActive: method.supportedModes.includes(mode)
            }
        })
    }

    getById(id: number): Method | null {
        return this.methods[id];
    }
}


type blueprintGetter = (json: any) => void;

abstract class Method {
    abstract readonly name: string;
    abstract readonly value: string;
    readonly optionsContainer: HTMLElement;
    abstract readonly supportedModes: Mode[];
    readonly blueprintGetter: blueprintGetter;

    constructor(optionsContainer: HTMLElement, blueprintGetter: blueprintGetter) {
        this.optionsContainer = optionsContainer;
        this.blueprintGetter = blueprintGetter;
    }

    abstract init(): void;
    protected exportJson(json: string) {
        this.blueprintGetter(jsonToBlueprint(json));
    }
}


class ImageMethod extends Method {
    readonly name = "image";
    readonly value = "one frame image";
    readonly supportedModes: Mode[] = ["png", "gif"];

    constructor(optionsContainer: HTMLElement, blueprintGetter: blueprintGetter) {
        super(optionsContainer, blueprintGetter);
    }

    init(): void {
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

    makeJson(): string {
        const currentFrame = parseInt((document.getElementById('frameInput') as HTMLInputElement).value, 10);
        let frameData = canvasManager.getFrameBitmap(currentFrame);
        let lamps: any[] = [];
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

export default function getMethods(optionsContainer: HTMLElement, blueprintGetter: blueprintGetter): MethodsManager {
    const methods = new MethodsManager;
    methods.add([
        new ImageMethod(optionsContainer, blueprintGetter),
    ]);
    return methods;
}