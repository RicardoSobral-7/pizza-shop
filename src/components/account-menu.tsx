
import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { getProfile } from "@/api/get-profile";
import { signOut } from "@/api/sign-out";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Building, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { StoreProfileDialog } from "./store-profile-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function AccountMenu() {
  const navigate = useNavigate()

  // query key serve para identificar uma requisição na aplicação, sendo assim sempre que tiver a mesma key, ela usa o cache
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Infinity
  })

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagedRestaurant,
    staleTime: Infinity
  })

  const { mutateAsync: signOutFn, isPending: IsSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // ele subtitui a rota ao inves de mandar pra uma rota, evitando que o usuário click em voltar e volte pro dashboard sem nada
      navigate('/sign-in', { replace: true })
    }
  })

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* o select none   vai impossibilitar do usuário dar 2 clicks e selecionar o texto do botão*/}
          <Button variant="outline" className="flex items-center gap-2 select-none">
            {isLoadingManagedRestaurant ? <Skeleton className="h-4 w-40" /> : managedRestaurant?.name}
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>

        {/* esse align end indica que o conteudo vai abrir alinhado com o final do botão */}
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ?
              (
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ) : (
                <>
                  <span>{profile?.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {profile?.email}
                  </span>
                </>
              )
            }
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Building className="mr-2 w-4 h-4" />
              <span>Perfil da loja</span>
            </DropdownMenuItem>
          </DialogTrigger>
          {/* o dark: faz com que no modo dark ele tenha determinados estilos especificos */}
          <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400" disabled={IsSigningOut}>
            <button className="w-full" onClick={() => signOutFn}>
              <LogOut className="mr-2 w-4 h-4" />
              <span>Sair</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <StoreProfileDialog />
    </Dialog>
  )
}