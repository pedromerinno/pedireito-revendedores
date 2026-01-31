const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

interface LaunchDateBannerProps {
  date: Date;
}

function BannerContent({ day, month }: { day: string; month: string }) {
  return (
    <div className="flex items-center shrink-0 whitespace-nowrap px-14 sm:px-20 md:px-28 lg:px-36">
      <span className="text-secondary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">{day} {month}</span>
      <span className="text-secondary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight ml-28 sm:ml-40 md:ml-56 lg:ml-72">ÁS 9H</span>
    </div>
  );
}

export function LaunchDateBanner({ date }: LaunchDateBannerProps) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = MESES[date.getMonth()];

  return (
    <section className="bg-primary py-14 sm:py-16 md:py-20 overflow-hidden" aria-label="Data de abertura do carrinho">
      <div className="flex w-max" style={{ animation: "marquee 25s linear infinite" }}>
        <BannerContent day={day} month={month} />
        <BannerContent day={day} month={month} />
        <BannerContent day={day} month={month} />
      </div>
    </section>
  );
}
