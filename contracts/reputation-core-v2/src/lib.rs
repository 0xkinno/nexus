#![no_std]
use gstd::{msg, prelude::*};

#[no_mangle]
extern "C" fn init() {
    msg::reply_bytes(b"ok", 0).unwrap();
}

#[no_mangle]
extern "C" fn handle() {
    msg::reply_bytes(b"ok", 0).unwrap();
}
