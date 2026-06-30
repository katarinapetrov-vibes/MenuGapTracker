'use client'

import { useState } from 'react'
import {
  PageShell, PageContent, PageHeader, PageToolbar,
  Stack, Cluster, Section, Surface, KpiRow,
  BodyText, MetaText, DataTable,
} from '@/lib/layout'

import { SideNavigation } from '@/components/ui/side-navigation'
import type { SideNavGroup, SideNavUser } from '@/components/ui/side-navigation'
import { Header } from '@/components/ui/header'
import { Button } from '@/components/ui/button'
import { KPIData } from '@/components/ui/kpi-data'
import { HorizontalBarChart } from '@/components/ui/horizontal-bar-chart'
import { SideSheet } from '@/components/ui/side-sheet'
import { Tabs } from '@/components/ui/tabs'
import { DropdownField } from '@/components/ui/dropdown-field'
import { InputField } from '@/components/ui/input-field'
import { StatusIndicator } from '@/components/ui/status-indicator'
import {
  HomeOutline, AnalyticsOutline,
  TrendingUpOutline, TrendingDownOutline, TrendingFlatOutline,
  RecipeCardOutline,
} from '@/components/ui/icons'
import { countryOptions } from '@/data/countries'
import { semantic } from '@/lib/tokens'

// ─── Nav ──────────────────────────────────────────────────────────────────────

const navGroups: SideNavGroup[] = [
  {
    id: 'main',
    items: [
      { id: 'overview',    label: 'Overview',    icon: <HomeOutline />,     href: '/tools/menu-gap-tracker' },
      { id: 'performance', label: 'Performance', icon: <AnalyticsOutline />, href: '/tools/menu-gap-tracker/performance' },
      { id: 'briefs',      label: 'Briefs',      icon: <RecipeCardOutline />, href: '/tools/menu-gap-tracker/briefs' },
    ],
  },
]

const navUser: SideNavUser = {
  name:  'Katarina Petrov',
  role:  'Menu Planner',
  email: 'katarina.petrov@hellofresh.com',
}

// ─── Week options ─────────────────────────────────────────────────────────────

const WEEK_OPTIONS = [
  { label: 'W27 – 30 Jun 2026',  value: 'w27' },
  { label: 'W28 – 7 Jul 2026',   value: 'w28' },
  { label: 'W29 – 14 Jul 2026',  value: 'w29' },
  { label: 'W30 – 21 Jul 2026',  value: 'w30' },
  { label: 'W31 – 28 Jul 2026',  value: 'w31' },
]

const MARKET_OPTIONS = [
  { label: 'All markets',     value: 'all' },
  { label: 'DE – Germany',    value: 'de' },
  { label: 'US – United States', value: 'us' },
  { label: 'AU – Australia',  value: 'au' },
  { label: 'GB – United Kingdom', value: 'gb' },
]

// ─── Mock data ────────────────────────────────────────────────────────────────

const ATTRIBUTE_TABS = [
  { id: 'protein',  label: 'Main Protein' },
  { id: 'dietary',  label: 'Dietary' },
  { id: 'group',    label: 'Recipe Group' },
  { id: 'segment',  label: 'Customer Segment' },
]

const CHART_DATA: Record<string, { labels: string[]; performance: number[]; coverage: number[] }> = {
  protein: {
    labels:      ['Chicken',   'Beef',  'Pork',   'Fish',  'Shrimp', 'Lamb',  'Turkey', 'Veggie'],
    performance: [88,           72,      65,       81,      58,       44,      37,       76],
    coverage:    [32,           24,      18,       14,      8,        4,       3,        20],
  },
  dietary: {
    labels:      ['Classic',   'Veggie', 'Calorie Smart', 'Family', 'Quick & Easy', 'Pescatarian'],
    performance: [84,           79,       68,              72,       91,             55],
    coverage:    [38,           22,       15,              14,       12,             9],
  },
  group: {
    labels:      ['Pasta',    'Stir Fry', 'Roast', 'Soup',  'Salad', 'Burger', 'Curry', 'Tacos'],
    performance: [86,          74,         70,      62,      68,      55,       82,      77],
    coverage:    [18,          16,         14,      12,      10,      9,        9,       7],
  },
  segment: {
    labels:      ['Family',    'Young Couple', 'Single', 'Health Focused', 'Adventurous'],
    performance: [82,           76,             68,       85,               61],
    coverage:    [28,           24,             19,       18,               11],
  },
}

const TRENDING_ROWS = [
  { attribute: 'Quick & Easy',     category: 'Dietary',          rating4w: 91, delta: +8,  coverage: 12, gap: 'Under-served' },
  { attribute: 'Chicken',          category: 'Protein',          rating4w: 88, delta: +3,  coverage: 32, gap: 'Balanced' },
  { attribute: 'Curry',            category: 'Recipe Group',     rating4w: 82, delta: +11, coverage: 9,  gap: 'Under-served' },
  { attribute: 'Health Focused',   category: 'Segment',          rating4w: 85, delta: +6,  coverage: 18, gap: 'Balanced' },
  { attribute: 'Fish',             category: 'Protein',          rating4w: 81, delta: +5,  coverage: 14, gap: 'Under-served' },
  { attribute: 'Classic',          category: 'Dietary',          rating4w: 84, delta: -2,  coverage: 38, gap: 'Over-served' },
  { attribute: 'Pasta',            category: 'Recipe Group',     rating4w: 86, delta: -1,  coverage: 18, gap: 'Balanced' },
  { attribute: 'Lamb',             category: 'Protein',          rating4w: 44, delta: -12, coverage: 4,  gap: 'Niche' },
  { attribute: 'Burger',           category: 'Recipe Group',     rating4w: 55, delta: -7,  coverage: 9,  gap: 'Declining' },
  { attribute: 'Pescatarian',      category: 'Dietary',          rating4w: 55, delta: +4,  coverage: 9,  gap: 'Under-served' },
  { attribute: 'Adventurous',      category: 'Segment',          rating4w: 61, delta: -3,  coverage: 11, gap: 'Niche' },
  { attribute: 'Shrimp',           category: 'Protein',          rating4w: 58, delta: +2,  coverage: 8,  gap: 'Under-served' },
]

const GAP_STATUS: Record<string, { status: 'success' | 'warning' | 'error' | 'info'; label: string }> = {
  'Under-served': { status: 'warning', label: 'Under-served' },
  'Balanced':     { status: 'success', label: 'Balanced'     },
  'Over-served':  { status: 'info',    label: 'Over-served'  },
  'Niche':        { status: 'error',   label: 'Niche'        },
  'Declining':    { status: 'error',   label: 'Declining'    },
}

// ─── Brief form options ───────────────────────────────────────────────────────

const PROTEIN_OPTIONS = [
  { label: 'Chicken',  value: 'chicken' },
  { label: 'Beef',     value: 'beef' },
  { label: 'Pork',     value: 'pork' },
  { label: 'Fish',     value: 'fish' },
  { label: 'Shrimp',   value: 'shrimp' },
  { label: 'Lamb',     value: 'lamb' },
  { label: 'Turkey',   value: 'turkey' },
  { label: 'Veggie',   value: 'veggie' },
]

const DIETARY_OPTIONS = [
  { label: 'Classic',        value: 'classic' },
  { label: 'Veggie',         value: 'veggie' },
  { label: 'Calorie Smart',  value: 'calorie-smart' },
  { label: 'Family',         value: 'family' },
  { label: 'Quick & Easy',   value: 'quick-easy' },
  { label: 'Pescatarian',    value: 'pescatarian' },
]

const GROUP_OPTIONS = [
  { label: 'Pasta',     value: 'pasta' },
  { label: 'Stir Fry',  value: 'stir-fry' },
  { label: 'Roast',     value: 'roast' },
  { label: 'Soup',      value: 'soup' },
  { label: 'Salad',     value: 'salad' },
  { label: 'Burger',    value: 'burger' },
  { label: 'Curry',     value: 'curry' },
  { label: 'Tacos',     value: 'tacos' },
]

const SEGMENT_OPTIONS = [
  { label: 'Family',          value: 'family' },
  { label: 'Young Couple',    value: 'young-couple' },
  { label: 'Single',          value: 'single' },
  { label: 'Health Focused',  value: 'health-focused' },
  { label: 'Adventurous',     value: 'adventurous' },
]

// ─── Delta cell helper ─────────────────────────────────────────────────────────

function DeltaCell({ delta }: { delta: number }) {
  const isUp   = delta > 0
  const isFlat = delta === 0
  const color  = isUp ? semantic.foreground.positive.default.light
                      : isFlat ? semantic.foreground.default.secondary.light
                               : semantic.foreground.negative.default.light
  const Icon = isUp ? TrendingUpOutline : isFlat ? TrendingFlatOutline : TrendingDownOutline
  const sign = isUp ? '+' : ''
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color, fontVariantNumeric: 'tabular-nums' }}>
      <Icon size={16} />
      {sign}{delta}
    </span>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function MenuGapTrackerPage() {
  const [activeNav,    setActiveNav]    = useState('overview')
  const [activeWeek,   setActiveWeek]   = useState('w28')
  const [activeMarket, setActiveMarket] = useState('all')
  const [activeTab,    setActiveTab]    = useState('protein')
  const [briefOpen,    setBriefOpen]    = useState(false)

  // Brief form state
  const [briefTitle,    setBriefTitle]    = useState('')
  const [briefProtein,  setBriefProtein]  = useState('')
  const [briefDietary,  setBriefDietary]  = useState('')
  const [briefGroup,    setBriefGroup]    = useState('')
  const [briefSegment,  setBriefSegment]  = useState('')
  const [briefWeek,     setBriefWeek]     = useState('')

  const chartEntry   = CHART_DATA[activeTab]
  const perfColor    = 'rgba(6, 122, 70, 0.6)'
  const coverColor   = 'rgba(210, 248, 149, 0.7)'

  const underServedCount = TRENDING_ROWS.filter(r => r.gap === 'Under-served').length
  const topPerformer     = [...TRENDING_ROWS].sort((a, b) => b.delta - a.delta)[0]
  const avgRating        = Math.round(TRENDING_ROWS.reduce((s, r) => s + r.rating4w, 0) / TRENDING_ROWS.length)

  return (
    <PageShell
      sidebar={
        <SideNavigation
          groups={navGroups}
          activeId={activeNav}
          onItemClick={(id) => setActiveNav(id)}
          user={navUser}
          theme="dark"
        />
      }
      header={
        <Header
          title="Menu Gap Tracker"
          countryDropdown={{
            value:   countryOptions[0].value,
            options: countryOptions,
            onChange: () => {},
          }}
        />
      }
    >
      {/* ── Sticky week + market selector ─────────────────────────────────── */}
      <PageToolbar>
        <div style={{ minWidth: 200 }}>
          <DropdownField
            label=""
            placeholder="Select week"
            options={WEEK_OPTIONS}
            value={activeWeek}
            onChange={(v) => setActiveWeek(v as string)}
            size="sm"
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <DropdownField
            label=""
            placeholder="Market"
            options={MARKET_OPTIONS}
            value={activeMarket}
            onChange={(v) => setActiveMarket(v as string)}
            size="sm"
          />
        </div>
        <div style={{ flex: 1 }} />
        <MetaText emphasis="tertiary">
          Data up to {WEEK_OPTIONS.find(w => w.value === activeWeek)?.label ?? '—'}
        </MetaText>
      </PageToolbar>

      <PageContent>
        <PageHeader
          title="Gap Analysis"
          subtitle="Recipe attribute performance and coverage gaps for the selected week"
          primary={
            <Button variant="fill" color="positive" size="md" onClick={() => setBriefOpen(true)}>
              Create recipe brief
            </Button>
          }
        />

        {/* ── KPI row ────────────────────────────────────────────────────── */}
        <KpiRow>
          <Surface tier="card" padding={500} style={{ height: '100%' }}>
            <Stack gap={100}>
              <KPIData
                size="large"
                label="Under-served attributes"
                value={
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: semantic.foreground.warning.default.light, fontSize: 28, fontWeight: 600 }}>
                    {underServedCount}
                  </span>
                }
                labelPosition="top"
              />
              <MetaText emphasis="tertiary">Attributes with high ratings but low coverage</MetaText>
            </Stack>
          </Surface>

          <Surface tier="card" padding={500} style={{ height: '100%' }}>
            <Stack gap={100}>
              <KPIData
                size="large"
                label="Avg 4-week rating"
                value={
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: semantic.foreground.positive.default.light, fontSize: 28, fontWeight: 600 }}>
                    {avgRating}%
                  </span>
                }
                labelPosition="top"
              />
              <MetaText emphasis="tertiary">Across all tracked attributes</MetaText>
            </Stack>
          </Surface>

          <Surface tier="card" padding={500} style={{ height: '100%' }}>
            <Stack gap={100}>
              <KPIData
                size="large"
                label="Fastest rising"
                value={
                  <span style={{ color: semantic.foreground.positive.default.light, fontSize: 18, fontWeight: 600 }}>
                    {topPerformer.attribute}
                  </span>
                }
                labelPosition="top"
              />
              <Cluster gap={100} align="center">
                <TrendingUpOutline size={16} />
                <MetaText emphasis="positive">+{topPerformer.delta} pts vs prev 4w</MetaText>
              </Cluster>
            </Stack>
          </Surface>

          <Surface tier="card" padding={500} style={{ height: '100%' }}>
            <Stack gap={100}>
              <KPIData
                size="large"
                label="Coverage gap alerts"
                value={
                  <span style={{ fontVariantNumeric: 'tabular-nums', color: semantic.foreground.negative.default.light, fontSize: 28, fontWeight: 600 }}>
                    {TRENDING_ROWS.filter(r => r.gap === 'Declining' || r.gap === 'Niche').length}
                  </span>
                }
                labelPosition="top"
              />
              <MetaText emphasis="tertiary">Declining or niche attributes needing review</MetaText>
            </Stack>
          </Surface>
        </KpiRow>

        {/* ── Coverage charts ─────────────────────────────────────────────── */}
        <Section
          title="Attribute coverage & performance"
          description="4-week average customer rating vs. recipe coverage share by attribute type"
        >
          <Tabs
            tabs={ATTRIBUTE_TABS}
            value={activeTab}
            onChange={setActiveTab}
            size="md"
          />
          <HorizontalBarChart
            datasets={[
              {
                label: 'Avg rating (%)',
                data:  chartEntry.performance,
                color: perfColor,
              },
              {
                label: 'Coverage share (%)',
                data:  chartEntry.coverage,
                color: coverColor,
              },
            ]}
            labels={chartEntry.labels}
            xMin={0}
            xMax={100}
            height={chartEntry.labels.length * 40}
            showLegend
          />
        </Section>

        {/* ── Trending table ───────────────────────────────────────────────── */}
        <Section
          title="Attribute performance tracker"
          description="Ranked by 4-week trend — attributes to prioritise when planning new recipes"
        >
          <DataTable density="compact">
            <thead>
              <tr>
                <th>Attribute</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>4w avg rating</th>
                <th style={{ textAlign: 'right' }}>Trend (pts)</th>
                <th style={{ textAlign: 'right' }}>Coverage %</th>
                <th>Gap status</th>
              </tr>
            </thead>
            <tbody>
              {TRENDING_ROWS.map((row) => {
                const gapInfo = GAP_STATUS[row.gap]
                return (
                  <tr key={row.attribute}>
                    <td>
                      <BodyText density="compact" weight="semi" as="span">{row.attribute}</BodyText>
                    </td>
                    <td>
                      <MetaText emphasis="secondary">{row.category}</MetaText>
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      <BodyText density="compact" as="span">{row.rating4w}%</BodyText>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <DeltaCell delta={row.delta} />
                    </td>
                    <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                      <BodyText density="compact" as="span">{row.coverage}%</BodyText>
                    </td>
                    <td>
                      <StatusIndicator
                        status={gapInfo.status}
                        label={gapInfo.label}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </DataTable>
        </Section>
      </PageContent>

      {/* ── Create recipe brief side sheet ─────────────────────────────────── */}
      {briefOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', justifyContent: 'flex-end',
        }}>
          {/* scrim */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }}
            onClick={() => setBriefOpen(false)}
          />
          <div style={{ position: 'relative', height: '100%', width: 440, flexShrink: 0 }}>
            <SideSheet
              open
              title="Create recipe brief"
              subtitle="Fill in the key attributes so chefs can develop the right recipe for this gap."
              showCloseButton
              showActions
              primaryAction={{
                label: 'Submit brief',
                onClick: () => setBriefOpen(false),
              }}
              secondaryAction={{
                label: 'Cancel',
                onClick: () => setBriefOpen(false),
              }}
              onClose={() => setBriefOpen(false)}
            >
              <Stack gap={400}>
                <InputField
                  label="Working title"
                  placeholder="e.g. Quick chicken curry"
                  value={briefTitle}
                  onChange={setBriefTitle}
                  required
                />
                <DropdownField
                  label="Main protein"
                  placeholder="Select protein"
                  options={PROTEIN_OPTIONS}
                  value={briefProtein}
                  onChange={(v) => setBriefProtein(v as string)}
                />
                <DropdownField
                  label="Dietary type"
                  placeholder="Select dietary"
                  options={DIETARY_OPTIONS}
                  value={briefDietary}
                  onChange={(v) => setBriefDietary(v as string)}
                />
                <DropdownField
                  label="Recipe group"
                  placeholder="Select group"
                  options={GROUP_OPTIONS}
                  value={briefGroup}
                  onChange={(v) => setBriefGroup(v as string)}
                />
                <DropdownField
                  label="Target customer segment"
                  placeholder="Select segment"
                  options={SEGMENT_OPTIONS}
                  value={briefSegment}
                  onChange={(v) => setBriefSegment(v as string)}
                />
                <DropdownField
                  label="Target week"
                  placeholder="Select target week"
                  options={WEEK_OPTIONS}
                  value={briefWeek}
                  onChange={(v) => setBriefWeek(v as string)}
                />
              </Stack>
            </SideSheet>
          </div>
        </div>
      )}
    </PageShell>
  )
}
