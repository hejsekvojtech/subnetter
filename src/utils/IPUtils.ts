import { octetToBinary, octetToDecimal } from "./MathUtils";

function isBinary(ipAddress: string): boolean {
    const binaryRegex = /^([01]{8}\.){3}[01]{8}$/;

    if (binaryRegex.test(ipAddress)) {
        return true;
    }
    return false;
}

export function decimalIPToBinary(address: string): string {
    if (isBinary(address)) {
        return address;
    }

    const octets = address.split(".").map(Number);
    let res: string[] = new Array(4);

    octets.map((octet, index) => {
        res[index] = octetToBinary(octet);
    });

    return res.join(".");
}

export function binaryIPToDecimal(address: string): string {
    const octets = address.split(".");
    let res: string[] = new Array();

    octets.map((octet, index) => {
        res[index] = octetToDecimal(octet).toString();
    });

    return res.join(".");
}

export function netmaskToBinaryIP(netmask: number): string {
    let maskIP: string[] = new Array(32).fill("0");

    for (let i = 0; i < netmask; i++) {
        maskIP[i] = "1";
    }

    return (
        maskIP.slice(0, 8).join("") +
        "." +
        maskIP.slice(8, 16).join("") +
        "." +
        maskIP.slice(16, 24).join("") +
        "." +
        maskIP.slice(24, 32).join("")
    );
}

export function binaryIPAnding(bin1: string, bin2: string): string {
    if (!isBinary(bin1) || !isBinary(bin2)) {
        throw new Error("Input addresses are not in binary format");
    }

    let ret = "";

    for (let i = 0; i < bin1.length; i++) {
        if (bin1[i] === bin2[i]) {
            ret += bin1[i];
        } else {
            ret += "0";
        }
    }
    return ret;
}

export function validIPCheck(address: string): boolean {
    if (isBinary(address)) {
        address = binaryIPToDecimal(address);
    }

    const octets = address
        .replace(/^\.+|\.+$/g, "")
        .split(".")
        .map(Number);

    if (octets.length != 4) {
        return false;
    }

    if (octets[0] < 1) {
        return false;
    }

    for (const octet of octets) {
        if (octet < 0 || octet > 255 || isNaN(octet)) {
            return false;
        }
    }

    return true;
}

export function getClass(address: string): string {
    if (isBinary(address)) {
        address = binaryIPToDecimal(address);
    }

    const firstOctet: number = Number(address.split(".").at(0));

    if (firstOctet >= 1 && firstOctet <= 127) {
        return "A";
    } else if (firstOctet >= 128 && firstOctet <= 191) {
        return "B";
    } else if (firstOctet >= 192 && firstOctet <= 223) {
        return "C";
    } else if (firstOctet >= 224 && firstOctet <= 239) {
        return "D";
    } else {
        return "E";
    }
}

export function getFixedBits(address: string): number {
    const netClass: string = getClass(address);

    if (netClass == "A") {
        return 8;
    } else if (netClass == "B") {
        return 16;
    } else if (netClass == "C") {
        return 24;
    } else if (netClass == "D") {
        return 32;
    }
    return 0;
}

export function getBroadcastIP(addressBin: string, fixedBits: number): string {
    if (fixedBits < 0 || fixedBits > 32) {
        throw new Error(`Range start: ${fixedBits} is out of IP length`);
    }
    if (!isBinary(addressBin)) {
        addressBin = decimalIPToBinary(addressBin);
    }

    const broadcastIPBinary: string =
        addressBin.split(".").join("").substring(0, fixedBits) +
        "1".repeat(32 - fixedBits);

    return binaryIPToDecimal(convertBinaryToIP(broadcastIPBinary));
}

function convertBinaryToIP(binary: string): string {
    const octets: string[] = [];

    for (let i = 0; i < binary.length; i += 8) {
        octets.push(binary.substring(i, i + 8));
    }

    return octets.join(".");
}

export function getIPWildcard(
    networkAddress: string,
    broadcastAddress: string
): string {
    const networkOctets: number[] = networkAddress.split(".").map(Number);
    const broadcastOctets: number[] = broadcastAddress.split(".").map(Number);

    if (networkOctets.length != broadcastOctets.length) {
        throw new Error("Sizes of addresses are mismatched");
    }

    const wildcard: string[] = new Array(4);

    networkOctets.map((octet, index) => {
        wildcard[index] = (broadcastOctets[index] - octet).toString();
    });

    return wildcard.join(".");
}

export function calculateSubnetsMask(netmask: number) {
    if (netmask < 8) {
        return 0;
    }
    return Math.pow(2, netmask - Math.floor(netmask / 8) * 8);
}

export function calculateSubnetsInClass(
    networkAddress: string,
    netmask: number
): number {
    const fixedBits: number = getFixedBits(networkAddress);

    if (netmask < fixedBits || fixedBits < 8) {
        return 0;
    }
    return Math.pow(2, netmask - fixedBits);
}
