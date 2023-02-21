import { SetMetadata } from "@nestjs/common";
import { Role } from "src/auth/dto";

export const Roles = (...roles:Role[]) => SetMetadata("roles", roles)