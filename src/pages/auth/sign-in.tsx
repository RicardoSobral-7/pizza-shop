import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Helmet } from "react-helmet-async"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Link, useSearchParams } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { signIn } from "@/api/sign-in"

const signInForm = z.object({
  email: z.string().email()
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  // é um hook tipo useState que pegamos e setamos search params na url,  podendo pegar todos search params ou apenas um especifico como está ali em baixo
  const [searchParams] = useSearchParams()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignInForm>({
    defaultValues: {
      email: searchParams.get('email') ?? ''
    }
  })

  // o mutation Fn é a função que será disparada mara fazer a mutação, mutação é toda ação que não seja listagem/retorno, todo post, put e delete é mutação, todo get é uma 'query' a gora que dessestruturamos o mutateAsync, vamos usa-la para desperar o signIn, agora todos os parametros da função signIn pegamos pelo authenticate que é a renomeação do mutateAsync
  const { mutateAsync: authenicate } = useMutation({ mutationFn: signIn })

  async function handleSignIn(data: SignInForm) {
    try {
      await authenicate({ email: data.email })

      toast.success('Enviamos um link de autenticação para seu e-mail.', {
        action: {
          label: 'Reenviar',
          onClick: () => handleSignIn(data)
        }
      })

    } catch (error) {
      toast.error('Credenciais inválidas.')
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <Button variant="ghost" asChild>
          <Link
            to="/sign-up"
            className="absolute right-8 top-8"
          >
            Novo estabelecimento
          </Link>
        </Button>
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar painel</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe  suas vendas pelo painel do parceiro!
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">
                Seu email
              </Label>
              <Input id="email" type="email"  {...register('email')} />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              Acessar painel
            </Button>
          </form>

        </div>
      </div>
    </>
  )
}