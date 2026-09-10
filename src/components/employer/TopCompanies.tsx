import { Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description: string;
  workerCount: number;
  logo?: string;
}

const companies: Company[] = [
  {
    id: '1',
    name: 'Kigali Domestic Services',
    description: 'Professional home staff with over 10 years of trusted service in Kigali.',
    workerCount: 45,
  },
  {
    id: '2',
    name: 'Trust Maid Agency',
    description: 'Verified and trained domestic workers available throughout Rwanda.',
    workerCount: 32,
  },
  {
    id: '3',
    name: 'Elite Home Staff',
    description: 'Premium household management and staffing solutions for families.',
    workerCount: 28,
  },
  {
    id: '4',
    name: 'Rwanda Home Care',
    description: 'Reliable and affordable home assistance services nationwide.',
    workerCount: 21,
  },
];

export const TopCompanies = () => {
  return (
    <section className="border-t border-border bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">Top Companies</h2>
          <p className="mt-2 text-muted-foreground">
            Partner with Rwanda's most trusted domestic worker agencies
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company, index) => (
            <div
              key={company.id}
              className="group rounded-lg border border-border bg-card p-6 text-center shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/30 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Logo */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                <Building2 className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>

              {/* Name */}
              <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                {company.name}
              </h3>

              {/* Description */}
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {company.description}
              </p>

              {/* Worker Count */}
              <p className="mt-4 text-sm font-medium text-primary">
                {company.workerCount} workers available
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
