import WDIOReporter, { WDIOReporterOptions } from '@wdio/reporter';
export default class DotReporter extends WDIOReporter {
    constructor(options: Partial<WDIOReporterOptions>);
    onTestSkip(): void;
    onTestPass(): void;
    onTestFail(): void;
}
//# sourceMappingURL=index.d.ts.map