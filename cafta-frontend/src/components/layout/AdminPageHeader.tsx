import { LuArrowLeft } from "react-icons/lu";
import Link from "next/link";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  backHref?: string;
}

export default function AdminPageHeader({
  title,
  description,
  children,
  showBackButton = false,
  backHref = "/admin",
}: AdminPageHeaderProps) {
  return (
    <header className="bg-cafta-primary/50 border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link
                href={backHref}
                className="flex items-center justify-center text-white/60 hover:text-white transition-colors p-2 -ml-2 rounded-md hover:bg-white/5"
                aria-label="Voltar para a página anterior"
              >
                <LuArrowLeft className="w-6 h-6" />
              </Link>
            )}

            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-white/60">{description}</p>
              )}
            </div>
          </div>

          {children && <div>{children}</div>}
        </div>
      </div>
    </header>
  );
}
