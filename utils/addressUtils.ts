import truncateMiddle from 'truncate-middle';

export function truncateAddress(address: string) {
  return truncateMiddle(address, 6, 6, '...');
}
