import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchFilters as FilterType, DISTRICTS, LANGUAGES, EXPERIENCE_LEVELS, WORK_TYPES } from '@/types/worker';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  workerCounts: {
    districts: Record<string, number>;
    experience: Record<string, number>;
    languages: Record<string, number>;
    workTypes: Record<string, number>;
  };
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection = ({ title, children, defaultOpen = true }: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
};

export const SearchFilters = ({ filters, onFiltersChange, workerCounts }: SearchFiltersProps) => {
  const [showAllDistricts, setShowAllDistricts] = useState(false);
  const [showAllLanguages, setShowAllLanguages] = useState(false);

  const updateFilter = <K extends keyof FilterType>(key: K, value: FilterType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'districts' | 'experience' | 'languages' | 'workTypes', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFiltersChange({
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
  };

  const hasActiveFilters = 
    filters.searchQuery ||
    filters.gender !== 'all' ||
    filters.ageMin > 18 ||
    filters.ageMax < 60 ||
    filters.districts.length > 0 ||
    filters.salaryMin > 0 ||
    filters.salaryMax < 100000 ||
    filters.experience.length > 0 ||
    filters.languages.length > 0 ||
    filters.hasInsurance !== 'all' ||
    filters.workerType !== 'all' ||
    filters.workTypes.length > 0 ||
    filters.availableOnly;

  const visibleDistricts = showAllDistricts ? DISTRICTS : DISTRICTS.slice(0, 5);
  const visibleLanguages = showAllLanguages ? LANGUAGES : LANGUAGES.slice(0, 3);

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-card">
      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          className="pl-10"
        />
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="mb-4 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      <div className="space-y-4">
        {/* Gender */}
        <FilterSection title="Gender">
          <Select value={filters.gender} onValueChange={(v) => updateFilter('gender', v as FilterType['gender'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Location */}
        <FilterSection title="Location (District)">
          <div className="space-y-2">
            {visibleDistricts.map((district) => (
              <label
                key={district}
                className="flex cursor-pointer items-center justify-between text-sm hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.districts.includes(district)}
                    onCheckedChange={() => toggleArrayFilter('districts', district)}
                  />
                  <span>{district}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {workerCounts.districts[district] || 0}
                </span>
              </label>
            ))}
          </div>
          {DISTRICTS.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllDistricts(!showAllDistricts)}
              className="mt-2 w-full text-primary hover:text-primary"
            >
              {showAllDistricts ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </FilterSection>

        {/* Worker Type */}
        <FilterSection title="Worker Type">
          <Select value={filters.workerType} onValueChange={(v) => updateFilter('workerType', v as FilterType['workerType'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="company">Company Registered</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Work Type */}
        <FilterSection title="Work Type">
          <div className="space-y-2">
            {WORK_TYPES.map((type) => (
              <label
                key={type.value}
                className="flex cursor-pointer items-center justify-between text-sm hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.workTypes.includes(type.value)}
                    onCheckedChange={() => toggleArrayFilter('workTypes', type.value)}
                  />
                  <span>{type.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {workerCounts.workTypes[type.value] || 0}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Experience Level */}
        <FilterSection title="Experience Level">
          <div className="space-y-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <label
                key={level.value}
                className="flex cursor-pointer items-center justify-between text-sm hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.experience.includes(level.value)}
                    onCheckedChange={() => toggleArrayFilter('experience', level.value)}
                  />
                  <span>{level.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {workerCounts.experience[level.value] || 0}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Age Range */}
        <FilterSection title="Age Range">
          <div className="space-y-4 pt-2">
            <Slider
              value={[filters.ageMin, filters.ageMax]}
              min={18}
              max={60}
              step={1}
              onValueChange={([min, max]) => {
                updateFilter('ageMin', min);
                updateFilter('ageMax', max);
              }}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Age: {filters.ageMin} - {filters.ageMax}</span>
            </div>
          </div>
        </FilterSection>

        {/* Salary Range */}
        <FilterSection title="Salary Range (RWF)">
          <div className="space-y-4 pt-2">
            <Slider
              value={[filters.salaryMin, filters.salaryMax]}
              min={0}
              max={100000}
              step={5000}
              onValueChange={([min, max]) => {
                updateFilter('salaryMin', min);
                updateFilter('salaryMax', max);
              }}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {filters.salaryMin.toLocaleString()} - {filters.salaryMax.toLocaleString()} RWF
              </span>
              <Button size="sm" variant="secondary" className="h-7 text-xs">
                Apply
              </Button>
            </div>
          </div>
        </FilterSection>

        {/* Languages */}
        <FilterSection title="Languages">
          <div className="space-y-2">
            {visibleLanguages.map((lang) => (
              <label
                key={lang}
                className="flex cursor-pointer items-center justify-between text-sm hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={filters.languages.includes(lang)}
                    onCheckedChange={() => toggleArrayFilter('languages', lang)}
                  />
                  <span>{lang}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {workerCounts.languages[lang] || 0}
                </span>
              </label>
            ))}
          </div>
          {LANGUAGES.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllLanguages(!showAllLanguages)}
              className="mt-2 w-full text-primary hover:text-primary"
            >
              {showAllLanguages ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </FilterSection>

        {/* Insurance */}
        <FilterSection title="Insurance Status">
          <Select value={filters.hasInsurance} onValueChange={(v) => updateFilter('hasInsurance', v as FilterType['hasInsurance'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workers</SelectItem>
              <SelectItem value="yes">Has Insurance</SelectItem>
              <SelectItem value="no">No Insurance</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>

        {/* Available Only */}
        <div className="pt-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
            <Checkbox
              checked={filters.availableOnly}
              onCheckedChange={(checked) => updateFilter('availableOnly', checked === true)}
            />
            <span>Available Workers Only</span>
          </label>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="mt-6 overflow-hidden rounded-lg gradient-primary p-4 text-primary-foreground">
        <h3 className="text-lg font-bold">Need Help?</h3>
        <p className="mt-1 text-sm opacity-90">Contact us to find the perfect worker for your home.</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="mt-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
        >
          Get Assistance
        </Button>
      </div>
    </div>
  );
};
