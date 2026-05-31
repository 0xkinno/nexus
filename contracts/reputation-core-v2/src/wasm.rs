use gstd::msg;

#[no_mangle]
extern "C" fn init() {}

#[no_mangle]
extern "C" fn handle() {
    let input = msg::load_bytes().expect("invalid input");
    msg::reply_bytes(input, 0).expect("reply failed");
}
