'use client'

import { useState, useMemo } from 'react'
import { PageShell, PageContent, PageHeader, PageToolbar, Stack, Cluster, BodyText, MetaText } from '@/lib/layout'
import { SideNavigation } from '@/components/ui/side-navigation'
import type { SideNavGroup, SideNavUser } from '@/components/ui/side-navigation'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import type { TableColumn } from '@/components/ui/table'
import { Pagination } from '@/components/ui/pagination'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { DropdownField } from '@/components/ui/dropdown-field'
import {
  WarehouseOutline,
  AnalyticsOutline,
} from '@/components/ui/icons'
import { countryOptions } from '@/data/countries'
import { semantic, typography, spacing, borderWidth, radius } from '@/lib/tokens'

// ─── Nav ──────────────────────────────────────────────────────────────────────

const navGroups: SideNavGroup[] = [
  {
    id: 'main',
    items: [
      { id: 'scorecard', label: 'Supplier Scorecard', icon: <AnalyticsOutline />, href: '/tools/supplier-scorecard' },
      { id: 'suppliers', label: 'All Suppliers',      icon: <WarehouseOutline />, href: '/tools/supplier-scorecard' },
    ],
  },
]

const navUser: SideNavUser = {
  name:  'Alex Müller',
  role:  'Supply Planner',
  email: 'alex.muller@hellofresh.com',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type SupplierStatus = 'Approved' | 'At Risk' | 'Suspended'

interface Supplier {
  id:           string
  name:         string
  country:      string
  overall:      number
  quality:      number
  delivery:     number
  price:        number
  status:       SupplierStatus
  lastReviewed: string
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const SUPPLIERS: Supplier[] = [
  { id: 'SUP-001', name: 'Freshfields AG',         country: 'DE', overall: 91, quality: 94, delivery: 90, price: 89, status: 'Approved',  lastReviewed: '2026-06-12' },
  { id: 'SUP-002', name: 'Nordic Harvest AB',       country: 'SE', overall: 85, quality: 88, delivery: 82, price: 85, status: 'Approved',  lastReviewed: '2026-06-08' },
  { id: 'SUP-003', name: 'Greenfield Farms Ltd',    country: 'GB', overall: 78, quality: 80, delivery: 74, price: 80, status: 'Approved',  lastReviewed: '2026-05-30' },
  { id: 'SUP-004', name: 'Alpenfresh GmbH',         country: 'AT', overall: 72, quality: 70, delivery: 75, price: 71, status: 'Approved',  lastReviewed: '2026-05-25' },
  { id: 'SUP-005', name: 'Provençal Délices SAS',   country: 'FR', overall: 65, quality: 63, delivery: 68, price: 64, status: 'At Risk',   lastReviewed: '2026-06-01' },
  { id: 'SUP-006', name: 'Benelux Produce BV',      country: 'NL', overall: 88, quality: 90, delivery: 87, price: 87, status: 'Approved',  lastReviewed: '2026-06-10' },
  { id: 'SUP-007', name: 'Iberian Organics SL',     country: 'ES', overall: 59, quality: 55, delivery: 62, price: 60, status: 'At Risk',   lastReviewed: '2026-05-20' },
  { id: 'SUP-008', name: 'Helvetia Fresh SA',       country: 'CH', overall: 93, quality: 95, delivery: 93, price: 91, status: 'Approved',  lastReviewed: '2026-06-15' },
  { id: 'SUP-009', name: 'Scandinavian Roots AS',   country: 'NO', overall: 82, quality: 84, delivery: 80, price: 82, status: 'Approved',  lastReviewed: '2026-06-04' },
  { id: 'SUP-010', name: 'Tuscan Harvest SRL',      country: 'IT', overall: 74, quality: 76, delivery: 71, price: 75, status: 'Approved',  lastReviewed: '2026-05-28' },
  { id: 'SUP-011', name: 'Dansk Grønt ApS',         country: 'DK', overall: 44, quality: 40, delivery: 48, price: 44, status: 'Suspended', lastReviewed: '2026-04-10' },
  { id: 'SUP-012', name: 'Brussels Bio SPRL',       country: 'BE', overall: 80, quality: 82, delivery: 79, price: 79, status: 'Approved',  lastReviewed: '2026-06-06' },
  { id: 'SUP-013', name: 'Rheinland Frisch GmbH',   country: 'DE', overall: 69, quality: 67, delivery: 70, price: 70, status: 'At Risk',   lastReviewed: '2026-05-15' },
  { id: 'SUP-014', name: 'Pacific Greens NZ Ltd',   country: 'NZ', overall: 86, quality: 87, delivery: 86, price: 85, status: 'Approved',  lastReviewed: '2026-06-09' },
  { id: 'SUP-015', name: 'US Farmworks Inc',         country: 'US', overall: 77, quality: 79, delivery: 75, price: 77, status: 'Approved',  lastReviewed: '2026-05-31' },
  { id: 'SUP-016', name: 'Bavarian Meadows GmbH',   country: 'DE', overall: 90, quality: 92, delivery: 90, price: 88, status: 'Approved',  lastReviewed: '2026-06-13' },
  { id: 'SUP-017', name: 'Loire Valley Frais SARL', country: 'FR', overall: 63, quality: 60, delivery: 65, price: 64, status: 'At Risk',   lastReviewed: '2026-05-18' },
  { id: 'SUP-018', name: 'Andalucía Verde SL',       country: 'ES', overall: 55, quality: 52, delivery: 57, price: 56, status: 'Suspended', lastReviewed: '2026-04-22' },
]

// ─── KPI tile ─────────────────────────────────────────────────────────────────

function KpiTile({
  label, count, color, borderColor, bg,
}: {
  label: string
  count: number
  color: string
  borderColor: string
  bg: string
}) {
  return (
    <div style={{
      flex:          1,
      minWidth:      0,
      padding:       spacing[500],
      background:    bg,
      border:        `${borderWidth.thin} solid ${borderColor}`,
      borderRadius:  radius.md,
      display:       'flex',
      flexDirection: 'column',
      gap:           spacing[100],
    }}>
      <div style={{
        ...typography.scale['headline/h4'],
        fontVariantNumeric: 'tabular-nums',
        color,
        lineHeight: 1,
      }}>
        {count}
      </div>
      <MetaText emphasis="secondary">{label}</MetaText>
    </div>
  )
}

// ─── Score cell ───────────────────────────────────────────────────────────────

function ScoreCell({ score }: { score: number }) {
  const color =
    score >= 80 ? semantic.foreground.positive.default.light
    : score >= 60 ? semantic.foreground.warning.default.light
    : semantic.foreground.negative.default.light

  return (
    <span style={{
      ...typography.scale['body/lg/black'],
      color,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {score}
    </span>
  )
}

// ─── Sub-score cell ───────────────────────────────────────────────────────────

function SubScoreCell({ score }: { score: number }) {
  const color =
    score >= 80 ? semantic.foreground.positive.default.light
    : score >= 60 ? semantic.foreground.warning.default.light
    : semantic.foreground.negative.default.light

  return (
    <span style={{
      ...typography.scale['body/caption/regular'],
      color,
      fontVariantNumeric: 'tabular-nums',
    }}>
      {score}
    </span>
  )
}

// ─── Status indicator map ─────────────────────────────────────────────────────

const STATUS_INDICATOR: Record<SupplierStatus, 'success' | 'warning' | 'error'> = {
  Approved:  'success',
  'At Risk': 'warning',
  Suspended: 'error',
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const columns: TableColumn[] = [
  {
    key:      'name',
    label:    'Supplier',
    sortable: true,
    minWidth: 200,
    render: (value, row) => (
      <Stack gap={50}>
        <BodyText density="compact" weight="semi" as="span">
          {value as string}
        </BodyText>
        <MetaText emphasis="tertiary">{row.id as string}</MetaText>
      </Stack>
    ),
  },
  {
    key:      'country',
    label:    'Country',
    sortable: true,
    width:    90,
    render: (value) => (
      <MetaText emphasis="secondary">{value as string}</MetaText>
    ),
  },
  {
    key:      'overall',
    label:    'Overall',
    sortable: true,
    width:    90,
    align:    'right',
    render: (value) => <ScoreCell score={value as number} />,
  },
  {
    key:      'quality',
    label:    'Quality',
    sortable: true,
    width:    80,
    align:    'right',
    render: (value) => <SubScoreCell score={value as number} />,
  },
  {
    key:      'delivery',
    label:    'Delivery',
    sortable: true,
    width:    80,
    align:    'right',
    render: (value) => <SubScoreCell score={value as number} />,
  },
  {
    key:      'price',
    label:    'Price',
    sortable: true,
    width:    80,
    align:    'right',
    render: (value) => <SubScoreCell score={value as number} />,
  },
  {
    key:   'status',
    label: 'Status',
    width: 130,
    render: (value) => (
      <StatusIndicator
        status={STATUS_INDICATOR[value as SupplierStatus]}
        label={value as string}
      />
    ),
  },
  {
    key:      'lastReviewed',
    label:    'Last Reviewed',
    sortable: true,
    width:    130,
    render: (value) => (
      <MetaText emphasis="tertiary" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value as string}
      </MetaText>
    ),
  },
]

// ─── Status filter options ────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'all',       label: 'All statuses' },
  { value: 'Approved',  label: 'Approved'     },
  { value: 'At Risk',   label: 'At Risk'      },
  { value: 'Suspended', label: 'Suspended'    },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SupplierScorecardPage() {
  const [activeNav,    setActiveNav]    = useState('scorecard')
  const [market,       setMarket]       = useState(countryOptions[0].value)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortKey,      setSortKey]      = useState('overall')
  const [sortDir,      setSortDir]      = useState<'asc' | 'desc' | null>('desc')
  const [page,         setPage]         = useState(1)
  const [rowsPerPage,  setRowsPerPage]  = useState(10)
  const [searchQuery,  setSearchQuery]  = useState('')

  const filtered = useMemo(() => {
    let rows = SUPPLIERS.filter(s => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
      }
      return true
    })

    if (sortKey && sortDir) {
      rows = [...rows].sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[sortKey]
        const bv = (b as unknown as Record<string, unknown>)[sortKey]
        if (typeof av === 'number' && typeof bv === 'number') {
          return sortDir === 'asc' ? av - bv : bv - av
        }
        return sortDir === 'asc'
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av))
      })
    }

    return rows
  }, [statusFilter, searchQuery, sortKey, sortDir])

  const pageData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  const approved  = SUPPLIERS.filter(s => s.status === 'Approved').length
  const atRisk    = SUPPLIERS.filter(s => s.status === 'At Risk').length
  const suspended = SUPPLIERS.filter(s => s.status === 'Suspended').length
  const avgScore  = Math.round(SUPPLIERS.reduce((acc, s) => acc + s.overall, 0) / SUPPLIERS.length)

  return (
    <PageShell
      sidebar={
        <SideNavigation
          groups={navGroups}
          activeId={activeNav}
          onItemClick={id => setActiveNav(id)}
          user={navUser}
          theme="dark"
        />
      }
      header={
        <Header
          title="Supplier Scorecard"
          countryDropdown={{
            value:    market,
            options:  countryOptions,
            onChange: v => setMarket(v as string),
          }}
        />
      }
    >
      <PageToolbar>
        <div style={{ width: 160 }}>
          <DropdownField
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={v => { setStatusFilter(v as string); setPage(1) }}
            size="sm"
          />
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="fill" color="positive" size="md">
          Export report
        </Button>
      </PageToolbar>

      <PageContent>
        <PageHeader
          title="All Suppliers"
          subtitle="Quality, delivery, and price scores across your active supplier base."
        />

        <div style={{ display: 'flex', gap: spacing[400] }}>
          <KpiTile
            label="Avg. overall score"
            count={avgScore}
            color={semantic.foreground.default.primary.light}
            borderColor={semantic.border.default.light}
            bg={semantic.background.raised.default.light}
          />
          <KpiTile
            label="Approved"
            count={approved}
            color={semantic.foreground.positive.default.light}
            borderColor={semantic.border.positive.light}
            bg={semantic.background.positive.defaultSubtle.light}
          />
          <KpiTile
            label="At risk"
            count={atRisk}
            color={semantic.foreground.warning.default.light}
            borderColor={semantic.border.warning.light}
            bg={semantic.background.warning.defaultSubtle.light}
          />
          <KpiTile
            label="Suspended"
            count={suspended}
            color={semantic.foreground.negative.default.light}
            borderColor={semantic.border.negative.light}
            bg={semantic.background.negative.defaultSubtle.light}
          />
        </div>

        <Stack gap={400}>
          <Table
            columns={columns}
            data={pageData as unknown as Record<string, unknown>[]}
            title="Suppliers"
            showCount
            searchable
            searchPlaceholder="Search suppliers…"
            onSearch={q => { setSearchQuery(q); setPage(1) }}
            size="compact"
            sortKey={sortKey}
            sortDirection={sortDir}
            onSort={(key, dir) => { setSortKey(key); setSortDir(dir); setPage(1) }}
            rowKey="id"
          />

          <Pagination
            totalItems={filtered.length}
            currentPage={page}
            totalPages={Math.max(1, Math.ceil(filtered.length / rowsPerPage))}
            pageSize={rowsPerPage}
            pageSizeOptions={[10, 25, 50]}
            onPageChange={setPage}
            onPageSizeChange={(v: number) => { setRowsPerPage(v); setPage(1) }}
            showRowsPerPage
            showRangeText
          />
        </Stack>
      </PageContent>
    </PageShell>
  )
}
