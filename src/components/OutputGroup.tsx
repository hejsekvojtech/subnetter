import { Grid, TextField } from "@mui/material";
import { Input } from "../types/AddressTypes";
import {
    binaryIPAnding,
    binaryIPToDecimal,
    calculateSubnetsInClass,
    calculateSubnetsMask,
    decimalIPToBinary,
    getBroadcastIP,
    getClass,
    getIPWildcard,
    netmaskToBinaryIP,
} from "../utils/IPUtils";

function OutputGroup({ address, netmask }: Input) {
    const addressBin: string = decimalIPToBinary(address);
    const netmaskBin: string = netmaskToBinaryIP(netmask);
    const networkAddressBin: string = binaryIPAnding(addressBin, netmaskBin);

    const networkAddress: string = binaryIPToDecimal(networkAddressBin);
    const broadcastAddress: string = getBroadcastIP(addressBin, netmask);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                    disabled
                    id="ip-binary"
                    label="IP Address (binary)"
                    variant="outlined"
                    value={addressBin}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    disabled
                    id="mask-binary"
                    label="Subnet Mask (binary)"
                    variant="outlined"
                    value={netmaskBin}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    disabled
                    id="network-address"
                    label="Network Address"
                    variant="outlined"
                    value={networkAddress}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    disabled
                    id="address-wildcard"
                    label="Address Wildcard"
                    value={getIPWildcard(networkAddress, broadcastAddress)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    disabled
                    id="broadcast-address"
                    label="Broadcast Address"
                    variant="outlined"
                    value={broadcastAddress}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    disabled
                    id="ip-class"
                    label="IP Class"
                    variant="outlined"
                    value={getClass(address)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    disabled
                    id="network-class"
                    label="Network Class"
                    variant="outlined"
                    value={getClass(networkAddress)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    disabled
                    id="subnet-mask-class"
                    label="Subnet Mask Class"
                    variant="outlined"
                    value={getClass(binaryIPToDecimal(netmaskBin))}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    disabled
                    id="subnets-all"
                    label="Subnets (all classes)"
                    variant="outlined"
                    value={Math.pow(2, netmask).toLocaleString()}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    disabled
                    id="subnets-class"
                    label={`Subnets (class ${getClass(networkAddress)})`}
                    variant="outlined"
                    value={calculateSubnetsInClass(
                        networkAddress,
                        netmask
                    ).toLocaleString()}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    disabled
                    id="subnets-netmask"
                    label={`Subnets (octet ${Math.ceil(netmask / 8)})`}
                    variant="outlined"
                    value={calculateSubnetsMask(netmask).toLocaleString()}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    disabled
                    id="hosts-subnet"
                    label="Maximum hosts"
                    variant="outlined"
                    value={(Math.pow(2, 32 - netmask) - 2).toLocaleString()}
                    fullWidth
                />
            </Grid>
        </Grid>
    );
}

export default OutputGroup;
