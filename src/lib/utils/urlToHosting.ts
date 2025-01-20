const hostingReg = /https:\/\/([\w.]+)\/.*/;
export const urlToHosting = (url: string) => hostingReg.exec(url)?.at(1);
