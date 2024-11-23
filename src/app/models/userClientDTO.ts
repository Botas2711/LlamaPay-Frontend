import { Client } from "./client";
import { User } from "./user";

export interface UserClientDTO{
    userDTO : User,
    clientDTO: Client
}