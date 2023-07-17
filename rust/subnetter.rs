use std::env;
use std::net::Ipv4Addr;

fn calculate_subnets_in_class(network_address: Ipv4Addr, netmask: u32) -> u32 {
    let fixed_bits: u32 = get_fixed_bits(network_address);

    if netmask < fixed_bits || fixed_bits < 8 {
        return 0;
    }
    return 2u32.pow(netmask - fixed_bits);
}

fn calculate_subnets_mask(netmask: u32) -> u32 {
    if netmask < 8 {
        return 0;
    }
    return 2u32.pow(netmask - (netmask / 8) * 8);
}

fn get_class(address: Ipv4Addr) -> char {
    let first_octet: u8 = address.octets()[0];

    if first_octet >= 1 && first_octet <= 127 {
        return 'A';
    } else if first_octet >= 128 && first_octet <= 191 {
        return 'B';
    } else if first_octet >= 192 && first_octet <= 223 {
        return 'C';
    } else if first_octet >= 224 && first_octet <= 239 {
        return 'D';
    } else {
        return 'E';
    }
}

fn get_fixed_bits(address: Ipv4Addr) -> u32 {
    match get_class(address) {
        'A' => 8,
        'B' => 16,
        'C' => 24,
        'D' => 32,
        _ => 0,
    }
}

fn print_usage() {
    println!("Usage: subnetter <IP_ADDRESS> <NETMASK>");
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 3 || args[1] == "--help" || args[1] == "-h" {
        print_usage();
        return;
    }

    let input_address = &args[1];
    let input_netmask = &args[2];

    let address: Ipv4Addr = match input_address.parse() {
        Ok(address) => address,
        Err(_) => {
            println!("Invalid IP address");
            print_usage();
            return;
        }
    };

    let netmask: u32 = match input_netmask.parse() {
        Ok(netmask) if netmask <= 32 => netmask,
        _ => {
            println!("Invalid netmask CIDR");
            print_usage();
            return;
        }
    };

    let network_address: Ipv4Addr = {
        let ip_bits: u32 = u32::from(address);
        let netmask: u32 = !0 << (32 - netmask);
        Ipv4Addr::from(ip_bits & netmask)
    };

    let broadcast_address: Ipv4Addr = {
        let ip_bits: u32 = u32::from(address);
        let netmask: u32 = !0 << (32 - netmask);
        Ipv4Addr::from(ip_bits | !netmask)
    };

    let network_wildcard: Ipv4Addr = {
        let netmask: u32 = !0 << (32 - netmask);
        Ipv4Addr::from(!netmask)
    };

    let ip_binary: String = address
        .octets()
        .iter()
        .map(|&octet| format!("{:08b}", octet))
        .collect::<Vec<String>>()
        .join(".");

    let netmask_ipv4: Ipv4Addr = {
        let netmask: u32 = !0 << (32 - netmask);
        Ipv4Addr::from(netmask)
    };

    let netmask_binary: String = netmask_ipv4
        .octets()
        .iter()
        .map(|&octet| format!("{:08b}", octet))
        .collect::<Vec<String>>()
        .join(".");

    println!("===== Ipv4 Subnet Calculator =====");
    println!();
    println!("== Input ==");
    println!("IP Address: {}", address);
    println!("Netmask: /{} - {}", netmask, netmask_ipv4);
    println!();
    println!("== Input in Binary");
    println!("IP Address (Binary): {}", ip_binary);
    println!("Netmask (Binary): {}", netmask_binary);
    println!();
    println!("== Network Range ==");
    println!("Network Address: {}", network_address);
    println!("Wildcard: {}", network_wildcard);
    println!("Broadcast Address: {}", broadcast_address);
    println!();
    println!("== Classes ==");
    println!("IP Address Class: {}", get_class(address));
    println!("Network Address Class: {}", get_class(network_address));
    println!();
    println!("== Subnets and Hosts ==");
    println!("Subnets (all classes): {}", 2u32.pow(netmask));
    println!(
        "Subnets (class {}): {}",
        get_class(network_address),
        calculate_subnets_in_class(network_address, netmask)
    );
    println!(
        "Subnets (octet {}): {}",
        (netmask + 7) / 8,
        calculate_subnets_mask(netmask)
    );
    println!("Maximum Hosts: {}", 2u32.pow(32 - netmask) - 2);
}
