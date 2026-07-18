import { MagnifyingGlassIcon, CaretDownIcon } from '@phosphor-icons/react'

const levels = ['ALL LEVELS', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']
const sorts = ['NEWEST', 'RATING']

function LevelFilters({ level, setLevel }) {
  return levels.map((l) => (
    <button
      key={l}
      type="button"
      onClick={() => setLevel(l)}
      className={[
        'h-10 rounded-full border px-4 text-[10px] font-bold tracking-[1px] transition',
        level === l
          ? 'border-sf-primary bg-sf-primary text-sf-on-primary'
          : 'border-sf-divider text-sf-secondary-text hover:text-sf-text',
      ].join(' ')}
    >
      {l}
    </button>
  ))
}

function SearchInput({ value, onChange }) {
  return (
    <label className="flex h-10 w-80 items-center gap-2 rounded border border-sf-divider px-3 max-md:w-full">
      <MagnifyingGlassIcon size={18} className="text-sf-secondary-text" />
      <input
        className="w-full bg-transparent py-3 font-sans text-sf-text outline-none placeholder:text-[#888]"
        placeholder="Search courses..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

function SortSelect({ value, onChange }) {
  return (
    <label className="relative ml-auto">
      <select
        className="h-10 appearance-none rounded border border-sf-divider bg-transparent pl-3 pr-8 text-[10px] font-bold tracking-[1px] text-sf-text outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {sorts.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <CaretDownIcon size={12} weight="bold" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-sf-secondary-text" />
    </label>
  )
}

export default function CourseFilters({ level, setLevel, search, setSearch, sort, setSort }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <LevelFilters level={level} setLevel={setLevel} />
      <SearchInput value={search} onChange={setSearch} />
      <SortSelect value={sort} onChange={setSort} />
    </div>
  )
}
