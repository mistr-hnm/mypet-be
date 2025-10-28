import { Routes } from "@nestjs/core";
import { UserModule } from "./app/users/user.module";
import { FileModule } from "./app/file/file.module";
import { PermissionModule } from "./app/permission/permission.module";
import { PetModule } from "./app/pet/pet.module";
import { PetAdoptionModule } from "./app/petadoption/petadoption.module";

export const routes : Routes = [
    {
        path : 'users',
        module : UserModule
    },
    {
        path : 'permissions',
        module : PermissionModule
    },
    {
        path : 'files',
        module : FileModule
    },
    {
        path : 'pets',
        module : PetModule
    },
    {
        path : 'petadoptions',
        module : PetAdoptionModule
    },
    
]