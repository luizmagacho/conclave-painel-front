import Cookies from "js-cookie";
import Link from "next/link";
import { Card } from "primereact/card";

type Shortcut = {
  href: string;
  label: string;
  description: string;
  icon: string;
  /** Hidden for Assistente (same rule as menu). */
  adminOnly?: boolean;
};

const SHORTCUTS: Shortcut[] = [
  {
    href: "/material",
    label: "Material",
    description: "Catálogo e cadastros de material.",
    icon: "pi pi-box",
  },
  {
    href: "/obras",
    label: "Obras",
    description: "Obras, custos e ferramentas por obra.",
    icon: "pi pi-book",
  },
  {
    href: "/fornecedores",
    label: "Fornecedores",
    description: "Lista e cadastro de fornecedores.",
    icon: "pi pi-truck",
  },
  {
    href: "/pedidos",
    label: "Pedidos",
    description: "Pedidos de compra e acompanhamento.",
    icon: "pi pi-shopping-cart",
  },
  {
    href: "/ferramentas",
    label: "Ferramentas",
    description: "Centro de custo e ferramentas.",
    icon: "pi pi-wrench",
  },
  {
    href: "/compras",
    label: "Compras",
    description: "Compras e lançamentos.",
    icon: "pi pi-shopping-bag",
  },
  {
    href: "/notas",
    label: "Notas",
    description: "Notas e documentos.",
    icon: "pi pi-wallet",
  },
  {
    href: "/custos/contas-a-pagar",
    label: "Contas a pagar",
    description: "Custos e contas a pagar.",
    icon: "pi pi-money-bill",
    adminOnly: true,
  },
];

export default function HomeWelcome(): JSX.Element {
  const userType = Cookies.get("portal.role") || "";
  const items = SHORTCUTS.filter(
    (s) => !s.adminOnly || userType !== "Assistente"
  );

  return (
    <section className="app-page-section app-page-section--roomy">
      <div>
        <h1 className="app-page-title">Início</h1>
        <p className="app-page-lead">
          Atalhos para as áreas mais usadas do portal. Use o menu à esquerda
          para navegar com mais detalhe.
        </p>
      </div>

      <div className="grid">
        {items.map((s) => (
          <div key={s.href} className="col-12 sm:col-6 lg:col-4">
            <Link href={s.href} className="no-underline text-color">
              <Card
                title={s.label}
                className="app-home-tile surface-card border-round shadow-1 h-full cursor-pointer"
              >
                <div className="flex align-items-start gap-3">
                  <span
                    className={`${s.icon} text-2xl text-primary flex-shrink-0`}
                    aria-hidden
                  />
                  <p className="app-page-lead m-0 line-height-3">{s.description}</p>
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
