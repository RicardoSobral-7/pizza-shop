
import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* o select none   vai impossibilitar do usuário dar 2 clicks e selecionar o texto do botão*/}
        <Button variant="outline" className="flex items-center gap-2 select-none">
          Pizza Shop
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>

      {/* esse align end indica que o conteudo vai abrir alinhado com o final do botão */}
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col">
          <span>Ricardo Sobral</span>
          <span className="text-xs font-normal text-muted-foreground">
            riki.sobral@gmail.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Building className="mr-2 w-4 h-4" />
          <span>Perfil da loja</span>
        </DropdownMenuItem>
        {/* o dark: faz com que no modo dark ele tenha determinados estilos especificos */}
        <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
          <LogOut className="mr-2 w-4 h-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}