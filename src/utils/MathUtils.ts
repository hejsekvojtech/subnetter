export function octetToBinary(octet: number): string {
  let ret = "";
  let remainder: number;

  while (octet > 0) {
    remainder = octet % 2;
    octet = Math.floor(octet / 2);
    ret = remainder.toString() + ret;
  }

  while (ret.length < 8) {
    ret = "0" + ret;
  }

  return ret;
}

export function octetToDecimal(octet: string): number {
  let ret = 0;
  let pos = octet.length - 1;

  for (let i = 0; i < octet.length; i++) {
    if (parseInt(octet[i]) === 1) {
      ret += Math.pow(2, pos);
    }
    pos--;
  }
  return ret;
}
