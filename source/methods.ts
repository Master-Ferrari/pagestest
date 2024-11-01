import CanvasManager, { Mode } from "./imageProcessor.js";
const canvasManager = CanvasManager.init();

import jsonToBlueprint from "./blueprintEncoder.js";
import { DropdownOption } from "./dropdown.js";
import FactorioItems from "./factorioItems.js";
import ImageMethod from "./imageMethod.js";
import tight3to4Method from "./tight3to4method.js";

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


export type blueprintGetter = (json: any) => void;

export abstract class Method {
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

export default function getMethods(optionsContainer: HTMLElement, blueprintGetter: blueprintGetter): MethodsManager {
    const methods = new MethodsManager;
    methods.add([
        new ImageMethod(optionsContainer, blueprintGetter),
        new tight3to4Method(optionsContainer, blueprintGetter)
    ]);
    return methods;
}