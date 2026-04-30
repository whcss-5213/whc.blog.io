import fg from 'fast-glob';
const dirs = await fg('**/', {cwd:'./docs', onlyDirectories: true });
console.log(dirs)
