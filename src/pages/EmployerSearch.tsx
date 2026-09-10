import { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import { Header } from '@/components/employer/Header';
import { SearchFilters } from '@/components/employer/SearchFilters';
import { WorkerSearchResults } from '@/components/employer/WorkerSearchResults';
import { TopCompanies } from '@/components/employer/TopCompanies';
import { Footer } from '@/components/employer/Footer';
import { WorkerDetailModal } from '@/components/employer/WorkerDetailModal';
import { mockWorkers } from '@/data/mockWorkers';
import { SearchFilters as FilterType, Worker, DISTRICTS, LANGUAGES, EXPERIENCE_LEVELS, WORK_TYPES } from '@/types/worker';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const ITEMS_PER_PAGE = 6;

const EmployerSearch = () => {
  const [filters, setFilters] = useState<FilterType>({
    searchQuery: '',
    gender: 'all',
    ageMin: 18,
    ageMax: 60,
    districts: [],
    salaryMin: 0,
    salaryMax: 100000,
    experience: [],
    languages: [],
    hasInsurance: 'all',
    workerType: 'all',
    workTypes: [],
    availableOnly: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter workers
  const filteredWorkers = useMemo(() => {
    let result = [...mockWorkers];

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.firstName.toLowerCase().includes(query) ||
          w.lastName.toLowerCase().includes(query) ||
          w.companyName?.toLowerCase().includes(query)
      );
    }

    // Gender
    if (filters.gender !== 'all') {
      result = result.filter((w) => w.gender === filters.gender);
    }

    // Age range
    result = result.filter((w) => w.age >= filters.ageMin && w.age <= filters.ageMax);

    // Districts
    if (filters.districts.length > 0) {
      result = result.filter((w) => filters.districts.includes(w.district));
    }

    // Salary range
    result = result.filter(
      (w) => w.salaryMin <= filters.salaryMax && w.salaryMax >= filters.salaryMin
    );

    // Experience
    if (filters.experience.length > 0) {
      result = result.filter((w) => filters.experience.includes(w.experience));
    }

    // Languages
    if (filters.languages.length > 0) {
      result = result.filter((w) =>
        filters.languages.some((lang) => w.languages.includes(lang))
      );
    }

    // Insurance
    if (filters.hasInsurance === 'yes') {
      result = result.filter((w) => w.hasInsurance);
    } else if (filters.hasInsurance === 'no') {
      result = result.filter((w) => !w.hasInsurance);
    }

    // Worker type
    if (filters.workerType !== 'all') {
      result = result.filter((w) => w.type === filters.workerType);
    }

    // Work types
    if (filters.workTypes.length > 0) {
      result = result.filter((w) =>
        filters.workTypes.some((type) => w.workTypes.includes(type as any))
      );
    }

    // Available only
    if (filters.availableOnly) {
      result = result.filter((w) => w.isAvailable);
    }

    // Sorting
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'salary-low':
        result.sort((a, b) => a.salaryMin - b.salaryMin);
        break;
      case 'salary-high':
        result.sort((a, b) => b.salaryMax - a.salaryMax);
        break;
      case 'experience':
        const expOrder = ['expert', 'intermediate', 'fresher', 'no-experience'];
        result.sort((a, b) => expOrder.indexOf(a.experience) - expOrder.indexOf(b.experience));
        break;
      default:
        result.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
    }

    return result;
  }, [filters, sortBy]);

  // Paginated workers
  const paginatedWorkers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWorkers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWorkers, currentPage]);

  // Worker counts for filters
  const workerCounts = useMemo(() => {
    return {
      districts: DISTRICTS.reduce((acc, d) => {
        acc[d] = mockWorkers.filter((w) => w.district === d).length;
        return acc;
      }, {} as Record<string, number>),
      experience: EXPERIENCE_LEVELS.reduce((acc, e) => {
        acc[e.value] = mockWorkers.filter((w) => w.experience === e.value).length;
        return acc;
      }, {} as Record<string, number>),
      languages: LANGUAGES.reduce((acc, l) => {
        acc[l] = mockWorkers.filter((w) => w.languages.includes(l)).length;
        return acc;
      }, {} as Record<string, number>),
      workTypes: WORK_TYPES.reduce((acc, t) => {
        acc[t.value] = mockWorkers.filter((w) => w.workTypes.includes(t.value as any)).length;
        return acc;
      }, {} as Record<string, number>),
    };
  }, []);

  const handleViewDetails = (worker: Worker) => {
    setSelectedWorker(worker);
    setIsModalOpen(true);
  };

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const filterSidebar = (
    <SearchFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      workerCounts={workerCounts}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 pb-12 pt-24">
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hover:text-primary cursor-pointer transition-colors">Home</span>
                <span>/</span>
                <span className="text-foreground font-medium">Search Workers</span>
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Find Your Perfect
                <span className="mt-1 block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Domestic Worker
                </span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground md:text-xl">
                Browse through verified workers and find the right match for your household needs
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="rounded-xl border border-border/50 bg-card/80 px-5 py-4 shadow-sm backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary">{mockWorkers.length}+</p>
                <p className="text-sm text-muted-foreground">Verified Workers</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/80 px-5 py-4 shadow-sm backdrop-blur-sm">
                <p className="text-2xl font-bold text-primary">10+</p>
                <p className="text-sm text-muted-foreground">Districts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-[280px] shrink-0 lg:block">
            {filterSidebar}
          </aside>

          {/* Mobile Filter Button */}
          <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 lg:hidden">
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button className="gap-2 shadow-lg">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto p-4">
                <SheetHeader>
                  <SheetTitle>Filter Workers</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {filterSidebar}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <WorkerSearchResults
            workers={paginatedWorkers}
            totalCount={filteredWorkers.length}
            currentPage={currentPage}
            pageSize={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>
      </main>

      {/* Top Companies */}
      <TopCompanies />

      {/* Footer */}
      <Footer />

      {/* Worker Detail Modal */}
      <WorkerDetailModal
        worker={selectedWorker}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default EmployerSearch;
