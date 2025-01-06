export default {
  containsAll: (src: any[], target: any[]) =>
    target.every((v) => src.includes(v)),
  containsAny: (src: any[], target: any[]) =>
    target.some((v) => src.includes(v)),
};
