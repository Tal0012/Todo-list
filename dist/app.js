import CommandProcessor from './modules/command-processor.js';
import log from '@ajar/marker';
const init = () => {
    log.v('hhh');
    const commandProccessor = new CommandProcessor();
    commandProccessor.argvProccessor();
};
init();
