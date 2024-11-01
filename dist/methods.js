import CanvasManager from "./imageProcessor.js";
const canvasManager = CanvasManager.init();
import jsonToBlueprint from "./blueprintEncoder.js";
import ImageMethod from "./imageMethod.js";
import tight3to4Method from "./tight3to4method.js";
class MethodsManager {
    constructor() {
        this.methods = [];
    }
    add(methods) {
        methods.forEach((method) => {
            this.methods.push(method);
        });
    }
    getList(mode) {
        return this.methods.map((method) => {
            return {
                name: method.name,
                value: method.value,
                isActive: method.supportedModes.includes(mode)
            };
        });
    }
    getById(id) {
        return this.methods[id];
    }
}
export class Method {
    constructor(optionsContainer, blueprintGetter) {
        this.optionsContainer = optionsContainer;
        this.blueprintGetter = blueprintGetter;
    }
    exportJson(json) {
        this.blueprintGetter(jsonToBlueprint(json));
    }
}
export default function getMethods(optionsContainer, blueprintGetter) {
    const methods = new MethodsManager;
    methods.add([
        new ImageMethod(optionsContainer, blueprintGetter),
        new tight3to4Method(optionsContainer, blueprintGetter)
    ]);
    return methods;
}
//# sourceMappingURL=methods.js.map