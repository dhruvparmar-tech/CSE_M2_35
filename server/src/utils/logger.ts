export const logger = {
  info: (msg: string, ...args: any[]) => {
    console.log(`[INFO] ${msg}`, ...args.map(sanitize));
  },
  warn: (msg: string, ...args: any[]) => {
    console.warn(`[WARN] ${msg}`, ...args.map(sanitize));
  },
  error: (msg: string, ...args: any[]) => {
    console.error(`[ERROR] ${msg}`, ...args.map(sanitize));
  }
};

function sanitize(obj: any): any {
  if (typeof obj === 'string') {
    return obj.replace(/(sk-[a-zA-Z0-9]{20,})/g, 'sk-***');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitize);
  }
  if (obj && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (key.toLowerCase().includes('key') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('password')) {
        newObj[key] = '***';
      } else {
        newObj[key] = sanitize(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}
