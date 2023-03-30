import { isEnvLocalDev } from './sendtry';

const consoleLog = (command, data) => {
  if (isEnvLocalDev()) {
    console.log(command, data);
  }
};
export default consoleLog;
