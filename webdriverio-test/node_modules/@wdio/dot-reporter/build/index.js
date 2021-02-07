"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const reporter_1 = __importDefault(require("@wdio/reporter"));
class DotReporter extends reporter_1.default {
    constructor(options) {
        super(Object.assign({ stdout: true }, options));
    }
    onTestSkip() {
        this.write(chalk_1.default.cyanBright('.'));
    }
    onTestPass() {
        this.write(chalk_1.default.greenBright('.'));
    }
    onTestFail() {
        this.write(chalk_1.default.redBright('F'));
    }
}
exports.default = DotReporter;
