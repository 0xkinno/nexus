#![no_std]
use gstd::{msg, prelude::*};

#[no_mangle]
extern "C" fn init() {}

#[no_mangle]
extern "C" fn handle() {
    let input: String = msg::load().expect("invalid input");
    msg::reply(format!("NEXUS OK: {}", input), 0).expect("reply failed");
}
