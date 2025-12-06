import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, user as UserIcon, Lock, ChevronDown } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AdminHeader = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/admin/login");
    };

    return (
        <header className="bg-background border-b border-border h-16 flex items-center justify-between px-4 lg:px-8">
            {/* Left side (Mobile Toggle or Title if needed) */}
            <div className="flex items-center gap-4">
                <span className="lg:hidden text-lg font-bold">Cidadão 360</span>
            </div>

            {/* Right side (User Profile) */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                        <div className="flex flex-col items-end hidden md:flex">
                            <span className="text-sm font-medium text-foreground">{user.name || "Usuário"}</span>
                            <span className="text-xs text-muted-foreground capitalize">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                        </div>
                        <Avatar className="w-8 h-8 border border-border">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=0D8ABC&color=fff`} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to="/admin/alterar-senha" className="cursor-pointer w-full flex items-center">
                                <Lock className="w-4 h-4 mr-2" />
                                Alterar Senha
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer focus:text-destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sair
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default AdminHeader;
