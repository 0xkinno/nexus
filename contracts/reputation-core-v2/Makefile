.PHONY: toolchain build clean deploy

# Gear 1.10: pinned nightly + wasm32v1-none (not generic nightly / wasm32-gear).
toolchain:
	rustup toolchain install nightly-2025-10-20 --target wasm32v1-none

build: toolchain
	cargo build --release
	@find target/wasm32-gear -name '*.opt.wasm' 2>/dev/null || \
	 find target/wasm32v1-none -name '*.wasm' 2>/dev/null

clean:
	cargo clean

deploy: build
	vara-wallet program upload $$(find target/wasm32-gear -name '*.opt.wasm' | head -1) \
	  --account default --network mainnet --value 2000000000000
