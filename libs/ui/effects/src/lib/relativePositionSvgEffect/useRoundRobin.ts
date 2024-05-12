export default function useRoundRobin<T>(arr: T[], emptyFiller: T) {
  let i = 0;

  return {
    next: () => {
      return arr.length === 0 ? emptyFiller : arr[i++ % arr.length];
    },
  };
}
