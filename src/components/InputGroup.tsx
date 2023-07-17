import {
    FormControl,
    Grid,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent } from "react";
import { Input } from "../types/AddressTypes";
import { binaryIPToDecimal, netmaskToBinaryIP } from "../utils/IPUtils";

interface Props extends Input {
    onAddressChange: (address: string) => void;
    onNetmaskChange: (netmask: number) => void;
    validInput: boolean | null;
}

function InputGroup({
    address,
    netmask,
    validInput,
    onAddressChange,
    onNetmaskChange,
}: Props) {
    function addressInputChange(e: ChangeEvent<HTMLInputElement>) {
        onAddressChange(e.target.value);
    }

    function netmaskInputChange(e: SelectChangeEvent<number>) {
        onNetmaskChange(e.target.value as number);
    }

    return (
        <FormControl fullWidth>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        error={!validInput}
                        id="outlined-basic"
                        label="IP Address"
                        variant="outlined"
                        value={address}
                        onChange={addressInputChange}
                        helperText={!validInput && "Invalid IP address"}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="network-mask-label">
                            Network Mask
                        </InputLabel>
                        <Select
                            labelId="network-mask"
                            id="network-mask-select"
                            value={netmask}
                            label="Network Mask"
                            onChange={netmaskInputChange}
                            fullWidth
                        >
                            {[...Array(32)].map((e, i) => {
                                const netmask = 32 - i;
                                return (
                                    <MenuItem key={netmask} value={netmask}>
                                        {`/${netmask} - ${binaryIPToDecimal(
                                            netmaskToBinaryIP(netmask)
                                        )}`}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </FormControl>
    );
}

export default InputGroup;
