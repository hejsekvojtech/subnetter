import { Container, Stack, Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import InputGroup from "./components/InputGroup";
import Loading from "./components/Loading";
import OutputGroup from "./components/OutputGroup";
import { validIPCheck } from "./utils/IPUtils";

export default function Subnetter() {
    const [validInput, setValidInput] = useState<boolean | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [netmask, setNetmask] = useState<number | null>(null);
    const [inputAddress, setinputAddress] = useState<string>("192.168.1.69");
    const [inputNetmask, setinputNetmask] = useState<number>(24);

    function handleAddressChange(address: string) {
        const cleanedInput: string = address
            .replace(/[^0-9.]+/g, "")
            .replace(/\.+/g, ".");
        setinputAddress(cleanedInput);
        setValidInput(validIPCheck(cleanedInput));
    }

    function handleNetmaskChange(netmask: number) {
        setinputNetmask(netmask);
    }

    function finalizeInput(): void {
        setAddress(inputAddress);
        setNetmask(inputNetmask);
    }

    useEffect(() => {
        if (validIPCheck(inputAddress)) {
            setValidInput(true);
            finalizeInput();
        }
    }, []);

    if (!address || !netmask) {
        return <Loading />;
    }

    return (
        <Container maxWidth="md" className="py-4">
            <Stack gap={4}>
                <Typography variant="h5" component="h1" gutterBottom>
                    IPv4 Subnet Calculator
                </Typography>

                <InputGroup
                    address={inputAddress}
                    netmask={inputNetmask}
                    validInput={validInput}
                    onAddressChange={handleAddressChange}
                    onNetmaskChange={handleNetmaskChange}
                />
                <div className="flex justify-center">
                    <Button
                        className="py-4 px-5 rounded-full"
                        disabled={!validInput}
                        onClick={finalizeInput}
                        variant="contained"
                    >
                        Calculate
                    </Button>
                </div>
                <OutputGroup address={address} netmask={netmask} />
            </Stack>
        </Container>
    );
}
