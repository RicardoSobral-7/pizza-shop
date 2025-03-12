import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Helmet } from "react-helmet-async"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { Link, useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { registerRestaurant } from "@/api/register-restaurant"

const signUpForm = z.object({
  email: z.string().email(),
  managerName: z.string(),
  phone: z.string(),
  restaurantName: z.string()
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  // sempre que precisar redirecionar o usuário por meio de um click/botão, algo que não seja uma ancora
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<SignUpForm>()

  const { mutateAsync: registerRestaurantFn } = useMutation({ mutationFn: registerRestaurant })

  async function handleSignUp(data: SignUpForm) {
    try {
      await registerRestaurantFn({
        email: data.email,
        managerName: data.managerName,
        phone: data.phone,
        restaurantName: data.restaurantName
      })

      // a baixo enviamos na url um search params para pegar lá na tela de sign-in
      toast.success('Restaurante cadastrado com sucesso!', {
        action: {
          label: 'Login',
          onClick: () => navigate(`/sign-in?email=${data.email}`)
        }
      })

    } catch (error) {
      toast.error('Erro ao cadastrar resturante.')
    }
  }

  return (
    <>
      <Helmet title="Cadatro" />
      <div className="p-8">
        <Button variant="ghost" asChild>
          <Link
            to="/sign-in"
            className="absolute right-8 top-8"
          >
            Fazer login
          </Link>
        </Button>
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e comece suas vendas!
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>

            <div className="space-y-2">
              <Label htmlFor="restaurantName">
                Nome do estabelecimento
              </Label>
              <Input id="restaurantName" type="text"  {...register('restaurantName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">
                Seu nome
              </Label>
              <Input id="managerName" type="text"  {...register('managerName')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tel">
                Seu celular
              </Label>
              <Input id="tel" type="tel"  {...register('phone')} />
            </div>

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
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar você concorda com nossos <a className=" underline underline-offset-4 ">termos de serviços</a>{" "}e{" "}<a className=" underline underline-offset ">politicas de privacidade</a>.
            </p>
          </form>

        </div>
      </div>
    </>
  )
}