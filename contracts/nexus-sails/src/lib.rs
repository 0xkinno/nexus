#![no_std]
use sails_rs::prelude::*;

pub struct NexusService(());

impl NexusService {
    pub fn new() -> Self { Self(()) }
}

#[service]
impl NexusService {
    #[export]
    pub fn ping(&mut self) -> String {
        "NEXUS pong".into()
    }
}

pub struct NexusProgram;

#[program]
impl NexusProgram {
    pub fn new() -> Self { Self }
    pub fn nexus(&self) -> NexusService { NexusService::new() }
}
