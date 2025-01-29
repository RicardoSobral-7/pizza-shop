import { Link, LinkProps, useLocation } from "react-router";

type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps) {
  // hook que retorna o pathname
  const { pathname } = useLocation()

  return <Link
  // usamos os data-algo como atributo do html
    data-current={pathname === props.to}
    // estilizamos caso seja true o valor que passamos
    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground" {...props}
  />
}