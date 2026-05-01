import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  ChevronRight,
  TrendingUp,
  Building2,
  Lock,
  Plane,
  Building,
  Wifi,
  Ship,
  Droplet,
  Users,
  DollarSign,
  FileText
} from 'lucide-react';
import Navbar from '../Assets /Navbar';
import Footer from '../Assets /Footer';
import { BarChart, Bar, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { date: 'Jan 2026', value: 140000 },
  { date: 'Feb 2026', value: 160000 },
  { date: 'Mar 2026', value: 145000 },
  { date: 'Apr 2026', value: 180000 },
  { date: 'May 2026', value: 165000 },
  { date: 'Jun 2026', value: 190000 },
  { date: 'Jul 2026', value: 248930 },
];

const FUND_OPTIONS = [
  { id: 'conservative', label: 'Conservative', rate: 0.08 },
  { id: 'balanced',     label: 'Balanced',     rate: 0.10 },
  { id: 'growth',       label: 'Growth',        rate: 0.12 },
] as const;

function calcGratuity(monthlySalary: number, totalMonths: number): number {
  if (totalMonths < 12) return 0;
  const years = totalMonths / 12;
  const dailyRate = monthlySalary / 30;
  if (years <= 5) return dailyRate * 21 * years;
  return dailyRate * 21 * 5 + dailyRate * 30 * (years - 5);
}

function calcInvestedEOSB(monthlySalary: number, totalMonths: number, annualRate: number): number {
  if (totalMonths < 1) return 0;
  const r = annualRate / 12;
  const phase1 = Math.min(totalMonths, 60);
  const pmt1 = (monthlySalary / 30 * 21) / 12;
  let fv = r > 0 ? pmt1 * (Math.pow(1 + r, phase1) - 1) / r : pmt1 * phase1;
  if (totalMonths > 60) {
    const phase2 = totalMonths - 60;
    fv = fv * Math.pow(1 + r, phase2);
    const pmt2 = (monthlySalary / 30 * 30) / 12;
    fv += r > 0 ? pmt2 * (Math.pow(1 + r, phase2) - 1) / r : pmt2 * phase2;
  }
  return fv;
}

const Button = ({
  children,
  variant = 'primary',
  className = "",
  icon = false,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  icon?: boolean;
  [key: string]: any;
}) => {
  const baseStyle = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-all duration-200 text-sm";
  const variants = {
    primary: "bg-vestora-forest text-white hover:bg-vestora-forest/90 shadow-vestora-sm hover:shadow-vestora dark:bg-vestora-growth dark:text-vestora-charcoal dark:hover:bg-vestora-growth/90",
    secondary: "bg-vestora-sage/20 text-vestora-forest hover:bg-vestora-sage/30 dark:bg-vestora-sage/20 dark:text-vestora-neutral dark:hover:bg-vestora-sage/30",
    outline: "border border-vestora-sage/40 text-vestora-charcoal hover:border-vestora-forest hover:text-vestora-forest dark:border-vestora-sage/40 dark:text-vestora-neutral dark:hover:border-vestora-growth dark:hover:text-vestora-growth",
    ghost: "text-vestora-sage hover:text-vestora-forest hover:bg-vestora-sage/10 dark:text-vestora-sage dark:hover:text-vestora-growth dark:hover:bg-vestora-sage/20"
  };
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <ArrowRight className="w-4 h-4" />}
    </motion.button>
  );
};

const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-vestora-forest/20 dark:bg-vestora-growth/20"
        style={{
          width: Math.random() * 10 + 5 + 'px',
          height: Math.random() * 10 + 5 + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
        }}
        animate={{
          y: [0, Math.random() * -100 - 50, 0],
          x: [0, Math.random() * 50 - 25, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, Math.random() + 0.5, 1],
        }}
        transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </div>
);

const RippleBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center opacity-30 dark:opacity-20 z-0">
    {[1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-vestora-sage/40 dark:border-vestora-growth/40"
        initial={{ width: 0, height: 0, opacity: 0.8 }}
        animate={{ width: "150vw", height: "150vw", opacity: 0 }}
        transition={{ duration: 12, repeat: Infinity, delay: i * 3, ease: "linear" }}
      />
    ))}
  </div>
);

const AbstractGradient = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen z-0">
    <motion.div
      animate={{ scale: [1, 1.2, 1], x: [0, 100, 0], y: [0, -50, 0], rotate: [0, 90, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tr from-vestora-growth/30 to-transparent blur-[100px]"
    />
    <motion.div
      animate={{ scale: [1, 1.5, 1], x: [0, -100, 0], y: [0, 100, 0], rotate: [0, -90, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-gradient-to-bl from-vestora-sage/20 to-transparent blur-[120px]"
    />
  </div>
);

const FadeIn = ({ children, delay = 0, className = "", immediate = false, ...props }: { children: React.ReactNode, delay?: number, className?: string, immediate?: boolean, [key: string]: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    {...(immediate ? { animate: { opacity: 1, y: 0 } } : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" } })}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

const EOSCalculator = () => {
  const [mode, setMode] = useState<'employee' | 'employer'>('employee');
  const [empSalary, setEmpSalary] = useState(15000);
  const [empYears, setEmpYears] = useState(4);
  const [empMonths, setEmpMonths] = useState(0);
  const [selectedFund, setSelectedFund] = useState<'conservative' | 'balanced' | 'growth'>('balanced');
  const [empBasis, setEmpBasis] = useState<'avg' | 'total'>('avg');
  const [avgSalary, setAvgSalary] = useState(15000);
  const [numEmployees, setNumEmployees] = useState(150);
  const [totalSalaryBill, setTotalSalaryBill] = useState(2250000);
  const [avgTenure, setAvgTenure] = useState(4);

  const totalMonths = empYears * 12 + empMonths;
  const fund = FUND_OPTIONS.find(f => f.id === selectedFund)!;
  const gratuity = calcGratuity(empSalary, totalMonths);
  const invested = calcInvestedEOSB(empSalary, totalMonths, fund.rate);
  const gain = invested - gratuity;

  const chartYears = Math.min(Math.max(empYears + (empMonths > 0 ? 1 : 0), 3), 15);
  const empChartData = Array.from({ length: chartYears }, (_, i) => ({
    year: `Yr ${i + 1}`,
    accrual: Math.round(calcGratuity(empSalary, (i + 1) * 12)),
    invested: Math.round(calcInvestedEOSB(empSalary, (i + 1) * 12, fund.rate)),
  }));

  const effTotal = empBasis === 'avg' ? avgSalary * numEmployees : totalSalaryBill;
  const mthlyRate = (avgTenure <= 5 ? 21 : 30) / 360;
  const mthlyLiability = effTotal * mthlyRate;
  const annualLiability = mthlyLiability * 12;

  const employerChartData = Array.from({ length: 5 }, (_, i) => {
    const n = (i + 1) * 12;
    const fv = (r: number) =>
      r > 0 ? mthlyLiability * (Math.pow(1 + r / 12, n) - 1) / (r / 12) : mthlyLiability * n;
    return {
      year: `Yr ${i + 1}`,
      conservative: Math.round(fv(0.08)),
      balanced:     Math.round(fv(0.10)),
      growth:       Math.round(fv(0.12)),
    };
  });

  const fmt = (v: number) => `${Math.round(v).toLocaleString()} AED`;
  const sliderClass = "w-full h-2 rounded-full appearance-none cursor-pointer accent-vestora-forest dark:accent-vestora-growth bg-vestora-sage/20";
  const labelBadge = "text-sm font-bold text-vestora-forest dark:text-vestora-growth bg-vestora-sage/10 px-3 py-1 rounded-full";
  const inputCard = "bg-vestora-white dark:bg-[#0B120E] rounded-2xl border border-vestora-sage/20 p-8";
  const resultCard = "bg-vestora-white dark:bg-[#0B120E] rounded-2xl border border-vestora-sage/20 p-8 shadow-vestora dark:shadow-none";
  const metricPrimary = "bg-vestora-forest/5 dark:bg-vestora-growth/5 rounded-xl p-4 border border-vestora-forest/20 dark:border-vestora-growth/20";
  const metricSecondary = "bg-vestora-neutral dark:bg-[#15201A] rounded-xl p-4 border border-vestora-sage/10";
  const chartTooltipStyle = { backgroundColor: '#15201A', border: '1px solid rgba(162,179,165,0.2)', borderRadius: '8px', color: '#F9F9F9', fontSize: '11px' };

  return (
    <section className="py-16 md:py-32 bg-vestora-neutral dark:bg-[#15201A] transition-colors duration-300 relative overflow-hidden" id="calculator">
      <FloatingParticles />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vestora-sage/15 text-vestora-forest dark:text-vestora-growth text-xs font-semibold tracking-wide uppercase mb-6 border border-vestora-sage/20">
              EOS Liability Calculator
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight mb-4">
              See What You're Owed — or What You Owe.
            </h2>
            <p className="text-lg text-vestora-charcoal/70 dark:text-vestora-neutral/70 max-w-2xl mx-auto">
              Calculate end-of-service benefits using the UAE Labour Law formula. Free, instant, no signup required.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-vestora-sage/30 bg-vestora-white dark:bg-[#0B120E] p-1 gap-1">
            {(['employee', 'employer'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  mode === m
                    ? 'bg-vestora-forest text-white shadow-sm dark:bg-vestora-growth dark:text-vestora-charcoal'
                    : 'text-vestora-charcoal/70 dark:text-vestora-neutral/70 hover:text-vestora-forest dark:hover:text-vestora-growth'
                }`}
              >
                {m === 'employee' ? 'Employee' : 'Employer / HR'}
              </button>
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {mode === 'employee' ? (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className={inputCard}>
                  <h3 className="text-lg font-bold text-vestora-charcoal dark:text-vestora-neutral mb-8">Your Details</h3>
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80">Monthly Basic Salary</label>
                        <span className={labelBadge}>{empSalary.toLocaleString()} AED</span>
                      </div>
                      <input type="range" min={3000} max={50000} step={500} value={empSalary}
                        onChange={e => setEmpSalary(Number(e.target.value))} className={sliderClass} />
                      <div className="flex justify-between text-xs text-vestora-sage mt-1.5"><span>AED 3,000</span><span>AED 50,000</span></div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80 mb-3">Length of Service</label>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-vestora-sage">Years</span>
                            <span className="text-xs font-bold text-vestora-forest dark:text-vestora-growth">{empYears} yrs</span>
                          </div>
                          <input type="range" min={0} max={20} step={1} value={empYears}
                            onChange={e => setEmpYears(Number(e.target.value))} className={sliderClass} />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-vestora-sage">Months</span>
                            <span className="text-xs font-bold text-vestora-forest dark:text-vestora-growth">{empMonths} mo</span>
                          </div>
                          <input type="range" min={0} max={11} step={1} value={empMonths}
                            onChange={e => setEmpMonths(Number(e.target.value))} className={sliderClass} />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80 mb-3">Compare Fund Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {FUND_OPTIONS.map(f => (
                          <button key={f.id} onClick={() => setSelectedFund(f.id)}
                            className={`py-3 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 text-center leading-tight ${
                              selectedFund === f.id
                                ? 'bg-vestora-forest text-white border-vestora-forest dark:bg-vestora-growth dark:text-vestora-charcoal dark:border-vestora-growth'
                                : 'border-vestora-sage/30 text-vestora-charcoal/70 dark:text-vestora-neutral/70 hover:border-vestora-forest dark:hover:border-vestora-growth'
                            }`}
                          >
                            {f.label}<br />
                            <span className="text-[10px] opacity-70">{(f.rate * 100).toFixed(0)}% p.a.</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {totalMonths < 12 ? (
                  <div className={`${inputCard} flex items-center justify-center min-h-64`}>
                    <p className="text-center text-vestora-sage text-sm max-w-xs">
                      Minimum 1 year of service is required for EOSB entitlement under UAE Labour Law.
                    </p>
                  </div>
                ) : (
                  <motion.div
                    key={`${empSalary}-${totalMonths}-${selectedFund}`}
                    initial={{ opacity: 0.6, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className={resultCard}
                  >
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className={metricSecondary}>
                        <p className="text-xs text-vestora-sage mb-1 font-medium">Without Investment</p>
                        <p className="text-lg font-bold text-vestora-charcoal dark:text-vestora-neutral">{fmt(gratuity)}</p>
                        <p className="text-xs text-vestora-sage/60 mt-1">Lump sum at end of service</p>
                      </div>
                      <div className={metricPrimary}>
                        <p className="text-xs text-vestora-sage mb-1 font-medium">With {fund.label} Fund</p>
                        <p className="text-lg font-bold text-vestora-forest dark:text-vestora-growth">{fmt(invested)}</p>
                        <p className="text-xs text-vestora-growth/80 mt-1 font-medium">+{fmt(gain)} gain</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-vestora-sage uppercase tracking-wider mb-3">Accrual vs. Invested (year by year)</p>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={empChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                          <Tooltip
                            contentStyle={chartTooltipStyle}
                            labelStyle={{ color: '#A2B3A5' }}
                            formatter={(value: any, name: string) => [
                              `${Number(value).toLocaleString()} AED`,
                              name === 'accrual' ? 'Without Investment' : `With ${fund.label} Fund`,
                            ]}
                          />
                          <Bar dataKey="accrual"  fill="#A2B3A5" fillOpacity={0.5} radius={[3, 3, 0, 0]} />
                          <Bar dataKey="invested" fill="#56A861" fillOpacity={0.85} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-4 mt-2 mb-4">
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-vestora-sage/50" /><span className="text-[10px] text-vestora-sage">Without Investment</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-vestora-growth" /><span className="text-[10px] text-vestora-sage">With {fund.label} Fund</span></div>
                    </div>
                    <p className="text-xs text-vestora-sage/50 mb-5">Based on UAE Labour Law Decree-Law No. 33 of 2021. For illustrative purposes only.</p>
                    <Button variant="primary" icon className="w-full justify-center"
                      onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}>
                      Get Your Full Breakdown
                    </Button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className={inputCard}>
                  <h3 className="text-lg font-bold text-vestora-charcoal dark:text-vestora-neutral mb-8">Company Details</h3>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80 mb-3">Calculate by</label>
                      <div className="grid grid-cols-2 gap-3">
                        {([['avg', 'Avg. Salary / Employee'], ['total', 'Total Monthly Salary Bill']] as const).map(([val, lbl]) => (
                          <button key={val} onClick={() => setEmpBasis(val)}
                            className={`py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                              empBasis === val
                                ? 'bg-vestora-forest text-white border-vestora-forest dark:bg-vestora-growth dark:text-vestora-charcoal dark:border-vestora-growth'
                                : 'border-vestora-sage/30 text-vestora-charcoal/70 dark:text-vestora-neutral/70 hover:border-vestora-forest dark:hover:border-vestora-growth'
                            }`}
                          >{lbl}</button>
                        ))}
                      </div>
                    </div>
                    <AnimatePresence mode="wait">
                      {empBasis === 'avg' ? (
                        <motion.div key="avg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80">Avg. Basic Salary / Employee</label>
                              <span className={labelBadge}>{avgSalary.toLocaleString()} AED</span>
                            </div>
                            <input type="range" min={5000} max={100000} step={1000} value={avgSalary}
                              onChange={e => setAvgSalary(Number(e.target.value))} className={sliderClass} />
                            <div className="flex justify-between text-xs text-vestora-sage mt-1.5"><span>AED 5,000</span><span>AED 100,000</span></div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <label className="text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80">Number of Employees</label>
                              <span className={labelBadge}>{numEmployees.toLocaleString()}</span>
                            </div>
                            <input type="range" min={10} max={5000} step={10} value={numEmployees}
                              onChange={e => setNumEmployees(Number(e.target.value))} className={sliderClass} />
                            <div className="flex justify-between text-xs text-vestora-sage mt-1.5"><span>10</span><span>5,000</span></div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div key="total" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <label className="block text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80 mb-3">Total Monthly Salary Bill (AED)</label>
                          <input
                            type="number" min={0} step={10000} value={totalSalaryBill}
                            onChange={e => setTotalSalaryBill(Math.max(0, Number(e.target.value)))}
                            className="w-full px-4 py-3 rounded-xl border border-vestora-sage/30 bg-vestora-neutral dark:bg-[#15201A] text-vestora-charcoal dark:text-vestora-neutral focus:outline-none focus:border-vestora-forest dark:focus:border-vestora-growth font-medium"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-semibold text-vestora-charcoal/80 dark:text-vestora-neutral/80">Average Employee Tenure</label>
                        <span className={labelBadge}>{avgTenure} yrs</span>
                      </div>
                      <input type="range" min={1} max={15} step={1} value={avgTenure}
                        onChange={e => setAvgTenure(Number(e.target.value))} className={sliderClass} />
                      <div className="flex justify-between text-xs text-vestora-sage mt-1.5"><span>1 year</span><span>15 years</span></div>
                    </div>
                  </div>
                </div>

                <motion.div
                  key={`${empBasis}-${avgSalary}-${numEmployees}-${totalSalaryBill}-${avgTenure}`}
                  initial={{ opacity: 0.6, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={resultCard}
                >
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`${metricPrimary} col-span-2 sm:col-span-1`}>
                      <p className="text-xs text-vestora-sage mb-1 font-medium">Monthly EOS Liability</p>
                      <p className="text-2xl font-bold text-vestora-forest dark:text-vestora-growth">{fmt(mthlyLiability)}</p>
                    </div>
                    <div className={`${metricSecondary} col-span-2 sm:col-span-1`}>
                      <p className="text-xs text-vestora-sage mb-1 font-medium">Annual EOS Liability</p>
                      <p className="text-2xl font-bold text-vestora-charcoal dark:text-vestora-neutral">{fmt(annualLiability)}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-vestora-sage uppercase tracking-wider mb-3">5-Year Projection (if invested in fund)</p>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={employerChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <Tooltip
                          contentStyle={chartTooltipStyle}
                          labelStyle={{ color: '#A2B3A5' }}
                          formatter={(value: any, name: string) => [
                            `${Number(value).toLocaleString()} AED`,
                            name === 'conservative' ? 'Conservative (8%)' : name === 'balanced' ? 'Balanced (10%)' : 'Growth (12%)',
                          ]}
                        />
                        <Bar dataKey="conservative" fill="#A2B3A5" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="balanced"     fill="#56A861" fillOpacity={0.75} radius={[3, 3, 0, 0]} />
                        <Bar dataKey="growth"       fill="#2D6B34" fillOpacity={0.9}  radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 mb-4">
                    {[['#A2B3A5', 'Conservative 8%'], ['#56A861', 'Balanced 10%'], ['#2D6B34', 'Growth 12%']].map(([color, label]) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="text-[10px] text-vestora-sage">{label}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-vestora-sage/50 mb-5">Based on UAE Labour Law Decree-Law No. 33 of 2021. For illustrative purposes only.</p>
                  <Button variant="primary" icon className="w-full justify-center"
                    onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })}>
                    See Fund Options
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const yText = useTransform(scrollY, [0, 1000], [0, 100]);
  const yImage = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 overflow-hidden">
      <FloatingParticles />
      <motion.div style={{ y: y1 }} className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-vestora-sage/10 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4"></motion.div>
      <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-vestora-growth/10 rounded-full blur-3xl opacity-30 -translate-x-1/3 translate-y-1/4"></motion.div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <motion.div style={{ y: yText }} className="max-w-2xl">
          <FadeIn immediate>
            <motion.div whileHover={{ scale: 1.05, x: 5 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vestora-sage/15 text-vestora-forest text-xs font-semibold tracking-wide uppercase mb-6 border border-vestora-sage/20 cursor-default transition-colors hover:bg-vestora-sage/25">
              <span className="w-2 h-2 rounded-full bg-vestora-growth animate-pulse"></span>
              UAE EOS Investment Platform
            </motion.div>
          </FadeIn>
          <FadeIn delay={0.1} immediate>
            <motion.h1 whileHover={{ scale: 1.02, x: 5 }} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-vestora-charcoal dark:text-vestora-neutral leading-[1.1] mb-6 origin-left cursor-default transition-colors">
              Compare EOS <br/>
              Investment <span className="text-vestora-forest dark:text-vestora-growth">Funds.</span> <br/>
              Choose the Right One.
            </motion.h1>
          </FadeIn>
          <FadeIn delay={0.2} immediate>
            <motion.p whileHover={{ scale: 1.02, x: 5 }} className="text-base sm:text-lg text-vestora-charcoal/70 dark:text-vestora-neutral/70 mb-10 leading-relaxed max-w-xl origin-left cursor-default transition-colors">
              UAE Cabinet Resolution 96/2023 requires companies to invest employee end-of-service benefits in regulated funds. Vestora lets you calculate your liability, compare all SCA-approved funds side by side, and connect with fund managers - in one place.
            </motion.p>
          </FadeIn>
          <FadeIn delay={0.3} immediate className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" icon className="py-3 px-6 md:py-4 md:px-8 text-sm md:text-base" whileHover={{ scale: 1.05, x: 5 }} onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>Calculate Your EOS Liability - Free</Button>
            <Button variant="outline" className="py-3 px-6 md:py-4 md:px-8 text-sm md:text-base bg-white/50 dark:bg-[#15201A]/50 backdrop-blur-sm" whileHover={{ scale: 1.05, x: 5 }} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>See How It Works</Button>
          </FadeIn>
        </motion.div>

        <FadeIn delay={0.4} immediate className="relative lg:h-[600px] flex items-center justify-center">
          <motion.div style={{ y: yImage }} className="relative w-full max-w-lg">
            <motion.div whileHover={{ scale: 1.02, y: -5 }} className="bg-vestora-white dark:bg-[#15201A] rounded-2xl shadow-vestora dark:shadow-none border border-vestora-sage/20 p-8 relative z-20 transition-colors duration-300">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-xs font-semibold text-vestora-sage uppercase tracking-wider mb-1">Current EOS Balance</p>
                  <h3 className="text-4xl font-bold text-vestora-forest dark:text-vestora-neutral">248,930 <span className="text-xl text-vestora-sage font-medium">AED</span></h3>
                </div>
                <div className="bg-vestora-growth/10 text-vestora-growth px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +18.4%
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 w-full bg-gradient-to-t from-vestora-forest/10 dark:from-vestora-growth/10 to-transparent rounded-lg border-b-2 border-vestora-forest dark:border-vestora-growth relative flex items-end overflow-hidden pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <Tooltip
                        cursor={{ fill: 'rgba(86, 168, 97, 0.1)' }}
                        contentStyle={{ backgroundColor: '#15201A', border: '1px solid rgba(162, 179, 165, 0.2)', borderRadius: '8px', color: '#F9F9F9', fontSize: '12px' }}
                        itemStyle={{ color: '#56A861', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${Number(value).toLocaleString()} AED`, 'Balance']}
                        labelStyle={{ color: '#A2B3A5', marginBottom: '4px' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#56A861" fillOpacity={0.4} activeBar={{ fillOpacity: 0.8 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4">
                  <div className="bg-vestora-neutral dark:bg-[#0B120E] p-2 sm:p-4 rounded-xl border border-vestora-sage/10 dark:border-vestora-sage/20">
                    <p className="text-[10px] sm:text-xs text-vestora-sage mb-1">Real Estate</p>
                    <p className="font-bold text-vestora-charcoal dark:text-vestora-neutral text-sm sm:text-lg">64%</p>
                  </div>
                  <div className="bg-vestora-neutral dark:bg-[#0B120E] p-2 sm:p-4 rounded-xl border border-vestora-sage/10 dark:border-vestora-sage/20">
                    <p className="text-[10px] sm:text-xs text-vestora-sage mb-1">Equities</p>
                    <p className="font-bold text-vestora-charcoal dark:text-vestora-neutral text-sm sm:text-lg">22%</p>
                  </div>
                  <div className="bg-vestora-neutral dark:bg-[#0B120E] p-2 sm:p-4 rounded-xl border border-vestora-sage/10 dark:border-vestora-sage/20">
                    <p className="text-[10px] sm:text-xs text-vestora-sage mb-1">Cash</p>
                    <p className="font-bold text-vestora-charcoal dark:text-vestora-neutral text-sm sm:text-lg">14%</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              className="absolute -right-4 md:-right-12 -top-8 md:-top-12 bg-vestora-white dark:bg-[#15201A] p-3 md:p-4 rounded-xl shadow-vestora dark:shadow-none border border-vestora-sage/20 z-30 flex items-center gap-3 md:gap-4 transition-colors duration-300 cursor-pointer"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px 0px rgba(86, 168, 97, 0)", "0px 0px 12px 2px rgba(86, 168, 97, 0.3)", "0px 0px 0px 0px rgba(86, 168, 97, 0)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-vestora-forest/10 dark:bg-vestora-growth/10 flex items-center justify-center text-vestora-forest dark:text-vestora-growth shrink-0"
              >
                <motion.div animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
              </motion.div>
              <div>
                <p className="text-[10px] md:text-xs text-vestora-sage font-medium">Compliance Status</p>
                <p className="text-xs md:text-sm font-bold text-vestora-charcoal dark:text-vestora-neutral">Verified & Secure</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0], x: [0, -3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              whileHover={{ scale: 1.05, zIndex: 40 }}
              className="absolute -left-4 md:-left-8 -bottom-4 md:-bottom-8 bg-vestora-white dark:bg-[#15201A] p-3 md:p-4 rounded-xl shadow-vestora dark:shadow-none border border-vestora-sage/20 z-30 transition-colors duration-300 cursor-pointer"
            >
              <p className="text-[10px] md:text-xs text-vestora-sage font-medium mb-1">Corporate Trust</p>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-vestora-growth shadow-[0_0_8px_rgba(86,168,97,0.6)]"
                ></motion.div>
                <p className="text-xs md:text-sm font-bold text-vestora-charcoal dark:text-vestora-neutral">Enterprise Grade</p>
              </div>
            </motion.div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
};

const TrustBar = () => {
  return (
    <section className="py-10 border-y border-vestora-sage/20 bg-vestora-white/50 dark:bg-[#0B120E]/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-sm font-semibold text-vestora-sage dark:text-vestora-sage/80 uppercase tracking-widest mb-8">
          Built for compliance with UAE Cabinet Resolution 96/2023
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          <div className="text-center">
            <p className="text-2xl font-bold text-vestora-charcoal dark:text-vestora-neutral">50-5,000+</p>
            <p className="text-xs text-vestora-sage mt-1">Employee Companies</p>
          </div>
          <div className="w-px h-8 bg-vestora-sage/30 hidden md:block"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-vestora-charcoal dark:text-vestora-neutral">4+</p>
            <p className="text-xs text-vestora-sage mt-1">SCA-Approved Fund Providers</p>
          </div>
          <div className="w-px h-8 bg-vestora-sage/30 hidden md:block"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-vestora-charcoal dark:text-vestora-neutral">AED 80B+</p>
            <p className="text-xs text-vestora-sage mt-1">Addressable EOS Liability</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const UrgencyBanner = () => (
  <section className="bg-vestora-forest py-4">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-3 text-center">
      <Zap className="w-5 h-5 text-vestora-growth shrink-0" />
      <p className="text-vestora-white text-sm">
        <strong>UAE Cabinet Resolution 96/2023:</strong> Mandatory EOS investment is expected in 2026. Companies need to choose a regulated fund.{' '}
        <a href="#cta" className="underline text-vestora-growth hover:text-white ml-1">Get ahead of the deadline</a>
      </p>
    </div>
  </section>
);

// NEW: HR & Talent section
const HRTalentSection = () => (
  <section className="py-16 md:py-24 bg-vestora-white dark:bg-[#0B120E] transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vestora-sage/15 text-vestora-forest dark:text-vestora-growth text-xs font-semibold tracking-wide uppercase mb-6 border border-vestora-sage/20">
            <Users className="w-3.5 h-3.5" />
            For HR & Talent
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight mb-6 leading-tight">
            The money was always your employees'. Now it can grow.
          </h2>
          <p className="text-lg text-vestora-charcoal/70 dark:text-vestora-neutral/70 leading-relaxed mb-8">
            Stop handing employees a flat payout at the end of their time with you. With Vestora, every dirham of their EOSB is invested and growing from day one — no extra budget, no added complexity on your end.
          </p>
          <Button variant="primary" icon onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
            See the Difference
          </Button>
        </FadeIn>

        <FadeIn delay={0.2}>
          <motion.div
            whileHover={{ y: -6, scale: 1.02 }}
            className="bg-vestora-forest rounded-2xl p-10 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-vestora-growth/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <p className="text-vestora-sage text-sm font-semibold uppercase tracking-widest mb-4">Average return uplift vs. flat accrual</p>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-7xl font-bold text-vestora-growth leading-none">+22%</span>
              </div>
              <div className="w-full h-px bg-white/10 mb-6" />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-vestora-growth animate-pulse" />
                <span className="text-sm font-bold tracking-wide text-white">SAME COST. BETTER STORY.</span>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  </section>
);

// MODIFIED: ValueProposition with new heading and card order
const ValuePropositionV2 = () => {
  const pillars = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fund Comparison Engine",
      desc: "Compare all SCA-approved investment funds side by side: performance, fees, risk profile, Sharia compliance, and minimum investment. Up to 5 funds at once."
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Direct Fund Manager Access",
      desc: "Submit inquiries and book meetings with regulated fund managers directly through the platform. No middlemen. No back-and-forth emails."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "EOS Liability Calculator",
      desc: "Upload your employee CSV. Get your total EOS liability in 60 seconds, broken down by tenure, with 5-year growth projections using the UAE Labour Law formula."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Compliance-Ready Reporting",
      desc: "Stay aligned with Cabinet Resolution 96/2023. Track liabilities, monitor fund performance, and generate reports your finance team needs."
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-vestora-white dark:bg-[#0B120E] transition-colors duration-300 relative overflow-hidden" id="product">
      <FloatingParticles />
      <RippleBackground />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16 md:mb-24">
          <FadeIn className="flex-1">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight">
              Everything you need to make the right allocation
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} className="flex-1">
            <p className="text-lg md:text-xl text-black dark:text-gray-300 leading-relaxed">
              From calculating your liability to choosing the right fund, Vestora gives your HR and finance team a single platform to handle end-of-service benefits.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <motion.div
                whileHover={{ y: -8, scale: 1.01 }}
                className="p-8 rounded-2xl border border-vestora-sage/20 bg-vestora-neutral dark:bg-[#15201A] hover:shadow-vestora-sm dark:hover:shadow-none dark:hover:border-vestora-sage/40 transition-all h-full cursor-pointer"
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    className="w-12 h-12 rounded-xl bg-vestora-forest/10 dark:bg-vestora-growth/10 text-vestora-forest dark:text-vestora-growth flex items-center justify-center shrink-0"
                  >
                    {pillar.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-vestora-charcoal dark:text-vestora-neutral mb-2">{pillar.title}</h3>
                    <p className="text-vestora-charcoal/70 dark:text-vestora-neutral/70 leading-relaxed text-sm">{pillar.desc}</p>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// NEW: Finance Teams section
const FinanceTeamsSection = () => {
  const cards = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: "Balance Sheet",
      desc: "EOS liabilities move from accrued expenses to defined contribution. Cleaner, compliant, and easier to compare year on year."
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Cash Flow",
      desc: "Monthly contributions replace end-of-service lump sums. More predictable cashflow, easier to model."
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Fiduciary",
      desc: "Fund selection documented, SCA-regulated, with a full audit trail your legal team can rely on."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-vestora-neutral dark:bg-[#15201A] transition-colors duration-300 relative overflow-hidden">
      <FloatingParticles />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vestora-sage/15 text-vestora-forest dark:text-vestora-growth text-xs font-semibold tracking-wide uppercase mb-6 border border-vestora-sage/20">
            <Building2 className="w-3.5 h-3.5" />
            For Finance Teams
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight mb-6 max-w-2xl">
            What actually changes on your books.
          </h2>
          <p className="text-lg text-vestora-charcoal/70 dark:text-vestora-neutral/70 leading-relaxed max-w-3xl mb-14">
            Vestora handles the full accounting translation — moving EOS liabilities from an accrual on your balance sheet to a managed fund obligation. Your auditors will have everything they need from day one.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <FadeIn key={idx} delay={idx * 0.12}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-vestora-white dark:bg-[#0B120E] rounded-2xl p-8 border border-vestora-sage/20 hover:shadow-vestora-sm dark:hover:shadow-none dark:hover:border-vestora-sage/40 transition-all h-full cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-vestora-forest/10 dark:bg-vestora-growth/10 text-vestora-forest dark:text-vestora-growth flex items-center justify-center mb-5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-vestora-charcoal dark:text-vestora-neutral mb-3">{card.title}</h3>
                <p className="text-sm text-vestora-charcoal/70 dark:text-vestora-neutral/70 leading-relaxed">{card.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: "1",
      title: "Calculate",
      desc: "Upload your employee CSV. Get your total EOS liability in 60 seconds, broken down by tenure, with 5-year growth projections."
    },
    {
      num: "2",
      title: "Compare",
      desc: "See all SCA-approved investment funds side by side: performance, fees, risk profile, Sharia compliance, and minimum investment."
    },
    {
      num: "3",
      title: "Connect",
      desc: "Submit inquiries and book meetings with regulated fund managers directly through the platform. No middlemen, no runaround."
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-vestora-neutral dark:bg-[#15201A] transition-colors duration-300 relative overflow-hidden" id="how-it-works">
      <FloatingParticles />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vestora-sage/15 text-vestora-forest dark:text-vestora-growth text-xs font-semibold tracking-wide uppercase mb-6 border border-vestora-sage/20">
              How It Works
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight">
              Three steps. Full clarity.
            </h2>
          </FadeIn>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <FadeIn key={idx} delay={idx * 0.15}>
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                className="p-8 rounded-2xl border border-vestora-sage/20 bg-vestora-white dark:bg-[#0B120E] hover:shadow-vestora-sm dark:hover:shadow-none dark:hover:border-vestora-sage/40 transition-all h-full text-center cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-vestora-forest/10 dark:bg-vestora-growth/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-vestora-forest dark:text-vestora-growth">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold text-vestora-charcoal dark:text-vestora-neutral mb-3">{step.title}</h3>
                <p className="text-vestora-charcoal/70 dark:text-vestora-neutral/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const PlatformShowcase = () => (
  <section className="py-16 md:py-32 bg-vestora-forest text-vestora-white overflow-hidden relative" id="platform">
    <FloatingParticles />
    <AbstractGradient />
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8CA095 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-vestora-neutral text-xs font-semibold tracking-wide uppercase mb-6 border border-white/20">
              See Your EOS Data Clearly
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Know Exactly Where Your EOS Liabilities Stand.
            </h2>
            <p className="text-lg text-vestora-sage mb-8 leading-relaxed">
              Upload your employee data and instantly see your total liability, growth projections, and fund allocation options - all in real-time dashboards your finance team will actually use.
            </p>
            <ul className="space-y-4 mb-10">
              {['Track your total EOS liability as it changes month to month', 'Generate compliance-ready reports in one click', 'See how different fund allocations would grow your EOS pool'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-vestora-neutral">
                  <div className="w-6 h-6 rounded-full bg-vestora-growth/20 flex items-center justify-center text-vestora-growth">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="bg-white text-vestora-forest hover:bg-vestora-neutral">
              See the Dashboard in Action
            </Button>
          </FadeIn>
        </div>
        <FadeIn delay={0.2} className="relative">
          <div className="bg-[#15201A] rounded-2xl shadow-2xl border border-white/10 p-6">
            <h4 className="text-sm font-semibold text-vestora-sage uppercase tracking-wider mb-6 border-b border-white/10 pb-4">Sample: 150-Employee Company Fund Comparison</h4>
            <div className="space-y-4">
              {[
                { name: 'Conservative Fund', aum: '4.2M AED', alloc: 'Diversified', perf: '+8.3%' },
                { name: 'Growth Fund', aum: '4.2M AED', alloc: 'Equities', perf: '+12.1%' },
                { name: 'Sharia-Compliant Fund', aum: '4.2M AED', alloc: 'Sharia', perf: '+9.7%' },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02, x: 5, backgroundColor: "rgba(255,255,255,0.1)" }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center p-3 md:p-4 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5"
                >
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-sm font-medium text-white">{row.name}</p>
                  </div>
                  <div className="col-span-1 text-xs md:text-sm text-vestora-sage">{row.aum}</div>
                  <div className="col-span-1 text-xs md:text-sm text-vestora-sage hidden md:block">{row.alloc}</div>
                  <div className="col-span-1 text-xs md:text-sm font-medium text-vestora-growth text-right">{row.perf}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const SecuritySection = () => (
  <section className="py-16 md:py-32 bg-vestora-neutral dark:bg-[#15201A] transition-colors duration-300 relative overflow-hidden" id="security">
    <FloatingParticles />
    <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
      <FadeIn>
        <div className="w-16 h-16 rounded-2xl bg-vestora-forest/10 dark:bg-vestora-growth/10 text-vestora-forest dark:text-vestora-growth flex items-center justify-center mx-auto mb-8">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight mb-6 max-w-2xl mx-auto">
          Your EOS Data, Protected.
        </h2>
        <p className="text-lg text-vestora-charcoal/70 dark:text-vestora-neutral/70 max-w-2xl mx-auto mb-12">
          Vestora is built for regulated financial data. Every employee record, liability calculation, and fund interaction is encrypted and access-controlled.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto text-left">
          {[
            { title: "Enterprise-Grade Security", desc: "Industry-standard security practices audited for reliability and availability." },
            { title: "AES-256 Encryption", desc: "Your data is encrypted at rest and in transit. No exceptions." },
            { title: "Role-Based Access", desc: "HR sees what HR needs. Finance sees what finance needs. No data leaks between roles." }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, x: 5 }}
              className="border-l-2 border-vestora-forest dark:border-vestora-growth pl-6 py-2 cursor-pointer"
            >
              <h4 className="font-bold text-vestora-charcoal dark:text-vestora-neutral mb-2">{item.title}</h4>
              <p className="text-sm text-vestora-charcoal/70 dark:text-vestora-neutral/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-16 md:py-32 bg-vestora-white dark:bg-[#0B120E] border-t border-vestora-sage/20 transition-colors duration-300 relative overflow-hidden" id="cta">
    <FloatingParticles />
    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
      <FadeIn>
        <h2 className="text-3xl md:text-6xl font-bold text-vestora-charcoal dark:text-vestora-neutral tracking-tight mb-6 md:mb-8">
          Mandatory EOS Investment Is Coming. Are You Ready?
        </h2>
        <p className="text-xl text-vestora-charcoal/70 dark:text-vestora-neutral/70 mb-10">
          UAE Cabinet Resolution 96/2023 is changing how companies handle end-of-service benefits. Get ahead of the deadline - calculate your liability and compare funds today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="primary" icon className="py-4 px-8 text-lg" onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>Calculate Your EOS Liability - Free</Button>
          <Button variant="outline" className="py-4 px-8 text-lg">Book a Demo</Button>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default function LandingV2() {
  return (
    <div className="min-h-screen bg-vestora-neutral dark:bg-[#0B120E] font-sans selection:bg-vestora-growth/30 text-vestora-charcoal dark:text-vestora-neutral transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <UrgencyBanner />
        <TrustBar />
        <EOSCalculator />
        <HRTalentSection />
        <ValuePropositionV2 />
        <FinanceTeamsSection />
        <HowItWorks />
        <PlatformShowcase />
        <SecuritySection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
