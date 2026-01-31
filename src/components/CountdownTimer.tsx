interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  timeLeft: TimeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl sm:text-6xl md:text-7xl font-bold tabular-nums text-[#2B9402]">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-base sm:text-lg text-[#2B9402]/90 mt-3 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ timeLeft }: CountdownTimerProps) {
  return (
    <div className="flex gap-6 sm:gap-8 md:gap-10 justify-center items-start">
      <TimeBlock value={timeLeft.days} label="Dias" />
      <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#2B9402] self-start mt-0">:</span>
      <TimeBlock value={timeLeft.hours} label="Horas" />
      <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#2B9402] self-start mt-0">:</span>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <span className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#2B9402] self-start mt-0">:</span>
      <TimeBlock value={timeLeft.seconds} label="Seg" />
    </div>
  );
}
